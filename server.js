const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const QUESTIONS = require('./questions');

const PORT = process.env.PORT || 3000;
const QUESTION_TIME = 30000; // 30 secondes par question

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/host', (req, res) => res.sendFile(path.join(__dirname, 'public', 'host.html')));

const round2 = n => Math.round(n * 100) / 100;
const MAX_SCORE = round2(QUESTIONS.reduce((s, q) => s + q.points, 0));

// Une seule partie à la fois, en mémoire.
let game = null;

function createGame(hostKey, socketId) {
  if (game) {
    clearTimeout(game.timer);
    for (const p of game.players.values()) {
      if (p.socketId) io.to(p.socketId).emit('state', { phase: 'closed' });
    }
  }
  game = {
    pin: String(Math.floor(100000 + Math.random() * 900000)),
    hostKey,
    hostSocket: socketId,
    phase: 'lobby', // lobby | question | reveal | leaderboard | end
    index: -1,
    players: new Map(), // id -> joueur
    startedAt: 0,
    endsAt: 0,
    timer: null
  };
}

// Score proportionnel : (bonnes cochées - mauvaises cochées) / nb bonnes, plancher à 0.
function scoreAnswer(q, choice) {
  const good = choice.filter(i => q.correct.includes(i)).length;
  const bad = choice.length - good;
  const ratio = Math.max(0, (good - bad) / q.correct.length);
  return { ratio, points: round2(ratio * q.points) };
}

// Classement : score décroissant, puis temps de réponse cumulé croissant.
function ranking() {
  return [...game.players.values()]
    .sort((a, b) => b.score - a.score || a.time - b.time)
    .map((p, i) => ({ id: p.id, name: p.name, score: round2(p.score), rank: i + 1 }));
}

function publicQuestion(q) {
  return { text: q.text, context: q.context || null, options: q.options, multi: q.multi, points: q.points };
}

function baseView() {
  const q = QUESTIONS[game.index];
  const v = {
    phase: game.phase,
    pin: game.pin,
    index: game.index,
    total: QUESTIONS.length,
    maxScore: MAX_SCORE,
    duration: QUESTION_TIME
  };
  if (q && game.phase !== 'end') {
    v.question = publicQuestion(q);
    v.remaining = game.phase === 'question' ? Math.max(0, game.endsAt - Date.now()) : 0;
    if (game.phase !== 'question') v.correct = q.correct;
  }
  return v;
}

function hostView() {
  const v = baseView();
  const players = [...game.players.values()];
  v.players = players.map(p => ({ name: p.name, connected: !!p.socketId }));
  const q = QUESTIONS[game.index];
  if (q) {
    v.answered = players.filter(p => p.answer).length;
    if (game.phase === 'reveal') {
      v.counts = q.options.map((_, i) => players.filter(p => p.answer && p.answer.choice.includes(i)).length);
    }
  }
  if (game.phase === 'leaderboard' || game.phase === 'end') v.ranking = ranking();
  return v;
}

function playerView(p) {
  const v = baseView();
  const r = ranking();
  const me = r.find(x => x.id === p.id);
  Object.assign(v, { name: p.name, score: round2(p.score), rank: me.rank, totalPlayers: r.length });
  if (game.phase === 'question') v.hasAnswered = !!p.answer;
  if (game.phase === 'reveal' || game.phase === 'leaderboard') {
    v.myChoice = p.answer ? p.answer.choice : [];
    v.ratio = p.answer ? p.answer.ratio : 0;
    v.gained = p.answer ? p.answer.points : 0;
  }
  if (game.phase === 'end') v.podium = r.slice(0, 3);
  return v;
}

function emitHost() {
  if (game && game.hostSocket) io.to(game.hostSocket).emit('state', hostView());
}
function emitPlayer(p) {
  if (p.socketId) io.to(p.socketId).emit('state', playerView(p));
}
function emitAll() {
  emitHost();
  for (const p of game.players.values()) emitPlayer(p);
}

function startQuestion(i) {
  game.index = i;
  game.phase = 'question';
  for (const p of game.players.values()) p.answer = null;
  game.startedAt = Date.now();
  game.endsAt = game.startedAt + QUESTION_TIME;
  clearTimeout(game.timer);
  game.timer = setTimeout(endQuestion, QUESTION_TIME + 300);
  emitAll();
}

function endQuestion() {
  if (!game || game.phase !== 'question') return;
  clearTimeout(game.timer);
  for (const p of game.players.values()) {
    if (!p.answer) p.time += QUESTION_TIME;
  }
  game.phase = 'reveal';
  emitAll();
}

function allAnswered() {
  const active = [...game.players.values()].filter(p => p.socketId);
  return active.length > 0 && active.every(p => p.answer);
}

const socketToPlayer = new Map();

io.on('connection', socket => {
  // ---- Animateur ----
  socket.on('host:hello', ({ hostKey } = {}) => {
    if (game && hostKey && game.hostKey === hostKey) {
      game.hostSocket = socket.id;
      emitHost();
    } else {
      socket.emit('state', { phase: 'none' });
    }
  });

  socket.on('host:create', ({ hostKey } = {}) => {
    if (!hostKey) return;
    createGame(hostKey, socket.id);
    emitHost();
  });

  socket.on('host:next', () => {
    if (!game || game.hostSocket !== socket.id) return;
    switch (game.phase) {
      case 'lobby': startQuestion(0); break;
      case 'question': endQuestion(); break;
      case 'reveal': game.phase = 'leaderboard'; emitAll(); break;
      case 'leaderboard':
        if (game.index + 1 < QUESTIONS.length) startQuestion(game.index + 1);
        else { game.phase = 'end'; emitAll(); }
        break;
    }
  });

  // ---- Joueurs ----
  socket.on('player:join', ({ pin, name, id } = {}, ack = () => {}) => {
    if (!game || String(pin).trim() !== game.pin) return ack({ ok: false, error: 'Code PIN invalide' });
    if (typeof id !== 'string' || id.length < 8) return ack({ ok: false, error: 'Identifiant invalide' });

    let p = game.players.get(id);
    if (!p) {
      if (game.phase === 'end') return ack({ ok: false, error: 'La partie est terminée' });
      const clean = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 20);
      if (!clean) return ack({ ok: false, error: 'Choisis un pseudo' });
      const taken = [...game.players.values()].some(x => x.name.toLowerCase() === clean.toLowerCase());
      if (taken) return ack({ ok: false, error: 'Ce pseudo est déjà pris' });
      p = { id, name: clean, score: 0, time: 0, answer: null, socketId: null };
      // Un joueur qui arrive en cours de partie compte le temps max sur les questions manquées.
      p.time = Math.max(0, game.index) * QUESTION_TIME;
      game.players.set(id, p);
    }
    if (p.socketId && p.socketId !== socket.id) socketToPlayer.delete(p.socketId);
    p.socketId = socket.id;
    socketToPlayer.set(socket.id, p.id);
    ack({ ok: true, name: p.name });
    emitPlayer(p);
    emitHost();
  });

  socket.on('player:answer', ({ choice } = {}) => {
    if (!game || game.phase !== 'question') return;
    const p = game.players.get(socketToPlayer.get(socket.id));
    if (!p || p.answer) return;
    const q = QUESTIONS[game.index];
    if (!Array.isArray(choice)) return;
    const picks = [...new Set(choice.map(Number))].filter(i => Number.isInteger(i) && i >= 0 && i < q.options.length);
    if (!picks.length || (!q.multi && picks.length !== 1)) return;
    if (Date.now() > game.endsAt + 500) return;

    const ms = Math.min(QUESTION_TIME, Date.now() - game.startedAt);
    const { ratio, points } = scoreAnswer(q, picks);
    p.answer = { choice: picks, ratio, points };
    p.score += points;
    p.time += ms;
    emitPlayer(p);
    emitHost();
    if (allAnswered()) endQuestion();
  });

  socket.on('disconnect', () => {
    if (!game) return;
    if (socket.id === game.hostSocket) { game.hostSocket = null; return; }
    const id = socketToPlayer.get(socket.id);
    socketToPlayer.delete(socket.id);
    const p = id && game.players.get(id);
    if (!p || p.socketId !== socket.id) return;
    // Dans le salon d'attente, un joueur déconnecté disparaît (il revient automatiquement s'il se reconnecte).
    if (game.phase === 'lobby') game.players.delete(id);
    else p.socketId = null;
    emitHost();
  });
});

server.listen(PORT, () => {
  console.log(`Quiz prêt : http://localhost:${PORT}  (animateur : /host)`);
});
