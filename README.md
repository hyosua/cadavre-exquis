# Cadavre Exquis Online

Version en ligne et multijoueur du célèbre jeu littéraire **cadavre exquis**.  
Chaque joueur ajoute un mot ou une phrase (selon la structure définie) sans connaître entièrement le texte des autres, créant collectivement une œuvre imprévisible.

🚀 **Site déployé :** [cadavrexquis.fr](https://cadavrexquis.fr)

---

## ✨ Fonctionnalités

- 🎮 **Création et gestion de parties multijoueurs** : Rejoignez ou créez des lobbies privés.
- 🤖 **Joueurs IA Intelligents** : Possibilité d'ajouter des bots alimentés par **Google Gemini** pour compléter les joueurs manquants.
- 📝 **Modes de jeu flexibles** :
  - Structures classiques (Sujet + Verbe + Complément).
  - **Presets personnalisables** pour des parties uniques.
- 🔄 **Rotation automatique** : Gestion fluide des tours et échange des phrases entre les joueurs.
- 🗳️ **Système de vote** : Élisez la meilleure création à la fin de la partie.
- 🎨 **Interface moderne** : Design réactif et fluide avec **DaisyUI** et un mode sombre/clair.
- ⚡ **Temps réel** : Communication instantanée via **Socket.io**.

---

## 🛠 Stack Technique

### Client

- **Framework :** [Next.js 15](https://nextjs.org/) (App Router)
- **Langage :** TypeScript
- **UI & Styling :** [TailwindCSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/), [Shadcn/ui](https://ui.shadcn.com/)
- **Animations :** Framer Motion
- **État :** Zustand

### Serveur

- **Runtime :** Node.js / Express
- **Temps réel :** [Socket.io](https://socket.io/)
- **Base de données / Cache :** [Redis](https://redis.io/) (via Upstash)
- **Intelligence Artificielle :** Google Generative AI (Gemini)

---

## 📦 Installation

> 🐳 **Docker :** Une configuration Docker complète sera bientôt disponible pour faciliter le déploiement.

Pour lancer le projet localement :

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/cadavre-exquis.git
cd cadavre-exquis
```

### 2. Configurer les variables d'environnement

Créez les fichiers `.env` dans les dossiers `client` et `server` en vous basant sur les exemples fournis (`.env.example`).

**Note :** Vous aurez besoin d'une instance Redis (locale ou Upstash) et d'une clé API Google Gemini.

### 3. Installer et lancer

Le script `run.sh` permet de lancer les deux parties simultanément :

```bash
chmod +x run.sh
./run.sh
```

---

## 🎮 Utilisation

1. **Lobby** : Créez une partie ou rejoignez-en une existante via un code.
2. **Configuration** : Choisissez la structure de la phrase (ex: Sujet + Verbe + COD) et ajoutez des bots IA si nécessaire.
3. **Écriture** : Ajoutez un mot ou une phrase lorsque c'est votre tour.
4. **Rotation** : Les phrases tournent entre les joueurs.
5. **Résultats** : Votez pour la meilleure proposition et découvrez le texte final, fruit du hasard collectif.

---

## 👤 Auteur

Projet solo développé par **Hyosua**.

---

## 📄 Licence

Projet sous licence libre de droits.  
Utilisation, modification et redistribution autorisées librement.
