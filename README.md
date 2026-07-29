# Pomodoro

Application web de concentration au style soft / dreamcore.  
Définis ton rythme, prépare-toi, puis lance une session Pomodoro avec citations, to-do et ambiances sonores.

## Aperçu

1. **Bienvenue** — à la première visite, une popup demande ton prénom  
2. **Réglages** — choisis la durée d’étude et de pause, puis lance  
3. **Compte à rebours** — 5 secondes pour te préparer  
4. **Session** — timer minimaliste, citations motivantes, panneaux To-do et Sons

Le prénom et les tâches sont mémorisés localement dans le navigateur.

## Fonctionnalités

- Chronomètre Pomodoro (étude / pause) avec presets et durées personnalisées  
- Accueil personnalisé : « Bienvenue [prénom] »  
- Citations motivantes en défilement de cartes (rotation auto ou au clic)  
- Liste de tâches (ajout, cocher, supprimer — persistée en local)  
- Sons de nature générés en Web Audio : pluie, vagues, vent, forêt  
- Interface légère : panneaux To-do / Sons en coins, fond bleu doux animé  

## Stack

| Techno | Rôle |
|--------|------|
| [React 19](https://react.dev) | UI |
| [TypeScript](https://www.typescriptlang.org) | Typage |
| [Vite](https://vite.dev) | Build & dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Styles |
| [Motion](https://motion.dev) | Animations |
| [Lucide](https://lucide.dev) | Icônes |

## Prérequis

- [Node.js](https://nodejs.org) 18+  
- npm (fourni avec Node)

## Installation

```bash
git clone https://github.com/Diatoustar/pomodoro.git
cd pomodoro
npm install
```

## Lancer le projet

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Déploiement (GitHub Pages)

Le site est prévu pour : [https://diatoustar.github.io/pomodoro/](https://diatoustar.github.io/pomodoro/)

1. Dans le dépôt GitHub : **Settings → Pages → Source = GitHub Actions**
2. Pousse sur `main` (ou lance le workflow manuellement)
3. Attends que l’action **Deploy to GitHub Pages** soit verte

Le `base` Vite est `/pomodoro/` (nom du dépôt). Sans ça, les JS/CSS ne se chargent pas → page blanche.

### Autres scripts

| Commande | Description |
|----------|-------------|
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualise le build |
| `npm run lint` | Vérifie TypeScript (`tsc --noEmit`) |
| `npm run clean` | Supprime le dossier `dist` |

## Structure

```
src/
├── components/     # Écrans, timer, cartes, panneaux
├── data/           # Citations & catalogue de sons
├── hooks/          # Pomodoro, audio, todos, prénom…
├── lib/            # Utilitaires
├── App.tsx         # Orchestration des phases
├── index.css       # Thème & variables CSS
└── main.tsx        # Point d’entrée
```

## Astuces

- Clique sur une citation pour passer à la suivante.  
- Escape ferme le panneau To-do ou Sons ouvert.  
- Pour revoir la popup du prénom :  
  `localStorage.removeItem('nuage-pomodoro-username')` puis rafraîchis la page.
