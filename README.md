# Quiz Omnicanal — quiz en direct façon Kahoot

10 questions · 30 s par question · note sur 3 points · classement en temps réel.

## Lancer en local
```bash
npm install
npm start
```
- Écran animateur (vidéoprojecteur) : http://localhost:3000/host
- Participants (téléphone) : http://localhost:3000 — ou scanner le QR code affiché

## Déroulé
1. L'animateur ouvre `/host` et clique sur **Créer la partie** : un code PIN et un QR code s'affichent.
2. Les participants entrent le PIN et leur pseudo : leurs noms apparaissent en direct.
3. **Lancer le quiz** → question + chrono de 30 s. La question se termine quand tout le monde a répondu ou quand le temps est écoulé (ou avec « Arrêter le chrono »).
4. Écran 1 : correction et nombre de réponses par option → **Classement** → écran 2 : top 5 → question suivante.
5. À la fin : podium et classement complet.

## Barème (total 3 pts)
| Q | Pts | Q | Pts |
|---|-----|---|-----|
| 1 | 0,3  | 6  | 0,25 |
| 2 | 0,25 | 7  | 0,3  |
| 3 | 0,25 | 8  | 0,35 |
| 4 | 0,3  | 9  | 0,35 |
| 5 | 0,4  | 10 | 0,25 |

Questions à choix multiples : (bonnes cochées − mauvaises cochées) / nombre de bonnes réponses, jamais négatif.
À score égal, le plus rapide (temps de réponse cumulé) passe devant.
Questions, réponses et barème : `questions.js`.

## Déployer (exemple Render, gratuit)
1. Pousser ce dossier sur un dépôt GitHub.
2. Sur render.com → **New → Web Service** → choisir le dépôt.
3. Build command : `npm install` · Start command : `npm start`.
4. Ouvrir `https://<votre-app>.onrender.com/host`.

En offre gratuite, le service se met en veille : ouvrez la page une minute avant le cours.
Fonctionne aussi sur Railway, Fly.io, un VPS… (Node 18+, WebSockets requis).
Une seule partie à la fois, gardée en mémoire : redémarrer le serveur l'efface.
