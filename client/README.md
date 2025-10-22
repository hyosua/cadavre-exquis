# Cadavre Exquis - Frontend Next.js

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Démarrage en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Build pour production

```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   ├── create/            # Page création de partie
│   ├── join/              # Page rejoindre une partie
│   └── game/              # Page de jeu
├── components/            # Composants React
│   ├── UI/               # Composants UI réutilisables
│   └── Game/             # Composants spécifiques au jeu
├── hooks/                # Custom hooks
├── services/             # Services (Socket.io)
├── store/                # State management (Zustand)
└── types/                # Types TypeScript
```

## Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Styles utilitaires
- **Socket.io Client** - Communication temps réel
- **Zustand** - State management léger

## Déploiement

### Vercel (recommandé)

1. Push le code sur GitHub
2. Importer le projet sur Vercel
3. Configurer la variable d'environnement `NEXT_PUBLIC_SOCKET_URL`
4. Déployer