const SHAPES = ['▲', '◆', '●', '■', '★'];

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fmt(n) {
  return (Math.round(n * 100) / 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

function store(key, value) {
  try {
    if (value === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch (e) { return null; }
}

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Compte à rebours partagé : met à jour tous les éléments [data-timer], [data-ring] et [data-bar].
const Timer = {
  endsAt: 0,
  duration: 30000,
  set(remaining, duration) {
    this.endsAt = Date.now() + (remaining || 0);
    if (duration) this.duration = duration;
  },
  left() { return Math.max(0, this.endsAt - Date.now()); }
};

setInterval(() => {
  const rem = Timer.left();
  const secs = Math.ceil(rem / 1000);
  const ratio = rem / Timer.duration;
  const hurry = rem > 0 && secs <= 5;
  document.querySelectorAll('[data-timer]').forEach(el => { el.textContent = secs; });
  document.querySelectorAll('[data-ring]').forEach(el => {
    el.style.setProperty('--p', ratio);
    el.classList.toggle('hurry', hurry);
  });
  document.querySelectorAll('[data-bar]').forEach(el => {
    el.firstElementChild.style.width = (ratio * 100) + '%';
    el.classList.toggle('hurry', hurry);
  });
}, 100);
