# Guide complet des variables de thème personnalisées

## 📚 Table des matières
1. [Couleurs](#couleurs)
2. [Typographie](#typographie)
3. [Espacements et Rayons](#espacements-et-rayons)
4. [Ombres](#ombres)
5. [Animations](#animations)
6. [Classes utilitaires personnalisées](#classes-utilitaires)

---

## 🎨 Couleurs

### Variables de base (light/dark)

#### Background & Foreground
```css
--background     /* Couleur de fond principale de l'application */
--foreground     /* Couleur de texte principale */
```
**Usage :**
- `bg-background` : Fond de page, sections principales
- `text-foreground` : Texte de base, paragraphes

**Exemple :**
```jsx
<div className="bg-background text-foreground">
  Contenu principal
</div>
```

---

#### Card
```css
--card           /* Fond des cartes/conteneurs */
--card-foreground /* Texte dans les cartes */
```
**Usage :** Conteneurs de contenu, cartes de produits, panneaux
```jsx
<div className="bg-card text-card-foreground rounded-lg p-4">
  <h3>Titre de carte</h3>
  <p>Contenu de la carte</p>
</div>
```

---

#### Primary (Rose/Rouge)
```css
--primary        /* Couleur d'action principale */
--primary-foreground /* Texte sur fond primary */
```
**Usage :** Boutons principaux, liens importants, éléments d'appel à l'action
```jsx
<Button className="bg-primary text-primary-foreground">
  Action principale
</Button>
```

---

#### Secondary (Cyan/Bleu)
```css
--secondary      /* Couleur d'action secondaire */
--secondary-foreground /* Texte sur fond secondary */
```
**Usage :** Boutons secondaires, badges, éléments de navigation
```jsx
<Button variant="secondary" className="bg-secondary text-secondary-foreground">
  Action secondaire
</Button>

<h1 className="text-secondary">Titre important</h1>
```

---

#### Muted
```css
--muted          /* Fond désaturé/discret */
--muted-foreground /* Texte discret/secondaire */
```
**Usage :** Zones de texte désactivées, métadonnées, labels
```jsx
<div className="bg-muted p-4">
  <p className="text-muted-foreground">Texte secondaire ou metadata</p>
</div>
```

---

#### Accent (Orange)
```css
--accent         /* Couleur d'accentuation */
--accent-foreground /* Texte sur fond accent */
```
**Usage :** Éléments à mettre en évidence, notifications, badges spéciaux
```jsx
<span className="bg-accent text-accent-foreground px-2 py-1 rounded">
  Nouveau !
</span>
```

---

#### Destructive
```css
--destructive    /* Couleur pour actions destructives */
--destructive-foreground /* Texte sur fond destructive */
```
**Usage :** Boutons de suppression, alertes d'erreur, messages de danger
```jsx
<Button variant="destructive" className="bg-destructive text-destructive-foreground">
  Supprimer
</Button>

<Alert variant="destructive">
  Erreur critique !
</Alert>
```

---

#### Borders & Inputs
```css
--border         /* Couleur des bordures */
--input          /* Couleur des bordures d'input */
--ring           /* Couleur du focus ring */
```
**Usage :** Bordures, inputs, focus states
```jsx
<input className="border border-border focus:ring-ring" />
<div className="border border-border rounded-lg p-4">...</div>
```

---

#### Chart Colors
```css
--chart-1        /* Bleu */
--chart-2        /* Cyan */
--chart-3        /* Rose */
--chart-4        /* Orange */
--chart-5        /* Rouge */
```
**Usage :** Graphiques, visualisations de données
```jsx
<div className="bg-chart-1">Série 1</div>
<div className="bg-chart-2">Série 2</div>
```

---

## ✍️ Typographie

### Familles de polices

```css
--font-sans      /* Ubuntu - Police principale */
--font-serif     /* Cutive - Titres élégants */
--font-mono      /* Space Mono - Code */
--font-title     /* Flavors - Titres décoratifs */
--font-averia    /* Averia Gruesa Libre - Titres fun */
```

**Usage :**
```jsx
<h1 className="font-title text-5xl">Cadavre Exquis</h1>
<p className="font-sans">Texte normal</p>
<code className="font-mono">const x = 42;</code>
<h2 className="font-averia">Sous-titre ludique</h2>
```

### Tracking (espacement des lettres)

Tailwind génère automatiquement :
- `tracking-tighter` : -0.05em
- `tracking-tight` : -0.025em
- `tracking-normal` : 0.025em (par défaut sur body)
- `tracking-wide` : 0.05em
- `tracking-wider` : 0.075em
- `tracking-widest` : 0.125em

**Usage :**
```jsx
<h1 className="tracking-tight">Titre serré</h1>
<p className="tracking-wide">Texte aéré</p>
```

---

## 📏 Espacements et Rayons

### Border Radius

```css
--radius         /* 1.5rem - Rayon de base */
--radius-sm      /* calc(1.5rem - 4px) */
--radius-md      /* calc(1.5rem - 2px) */
--radius-lg      /* 1.5rem */
--radius-xl      /* calc(1.5rem + 4px) */
```

**Usage :** Utilisez les classes Tailwind standards
```jsx
<div className="rounded-sm">Coins légèrement arrondis</div>
<div className="rounded-md">Coins moyennement arrondis</div>
<div className="rounded-lg">Coins bien arrondis (défaut)</div>
<div className="rounded-xl">Coins très arrondis</div>
```

---

## 🌓 Ombres

### Hiérarchie des ombres

```css
--shadow-2xs     /* Ombre minimale */
--shadow-xs      /* Très subtile */
--shadow-sm      /* Petite */
--shadow         /* Standard */
--shadow-md      /* Moyenne */
--shadow-lg      /* Grande */
--shadow-xl      /* Très grande */
--shadow-2xl     /* Maximale */
```

**Utilisation avec Tailwind :**
```jsx
<div className="shadow-sm">Carte discrète</div>
<div className="shadow-md">Carte normale</div>
<div className="shadow-xl">Carte flottante</div>
<div className="shadow-2xl">Modal, popup</div>
```

**Toutes les ombres utilisent une teinte cyan cohérente : `hsl(196 83% 10%)`**

---

## 🎭 Animations

### Variables d'animation

```css
--animation-fade-in       /* fadeIn 0.3s ease-in-out */
--animation-slide-up      /* slideUp 0.3s ease-out */
--animation-pulse-slow    /* pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite */
```

**Usage direct (CSS custom) :**
```jsx
<div style={{ animation: 'var(--animation-fade-in)' }}>
  Apparition en fondu
</div>
```

**Ou avec classes Tailwind via @apply :**
```css
.fade-in {
  animation: var(--animation-fade-in);
}
```

---

## 🎨 Classes utilitaires personnalisées

### Glow Shadows (Effets néon)

#### `.glow-shadow` (Cyan)
**Usage :** Boutons ou éléments avec effet lumineux cyan
```jsx
<Button className="glow-shadow hover:bg-muted">
  Rejoindre une partie
</Button>
```

**États :**
- Normal : Lueur douce cyan
- Hover : Lueur intensifiée
- Active : Légère compression (scale 0.98)

---

#### `.red-glow-shadow` (Rose)
**Usage :** Boutons ou éléments avec effet lumineux rose/rouge
```jsx
<Button className="red-glow-shadow hover:bg-muted">
  Créer une partie
</Button>
```

**États :**
- Normal : Lueur douce rose
- Hover : Lueur intensifiée
- Active : Légère compression

---

#### `.glow-small`
**Usage :** Petite ombre lumineuse cyan pour accents
```jsx
<span className="glow-small px-3 py-1 rounded-full">
  Badge
</span>
```

---

### `.animate-pulse-shadow`
**Usage :** Animation de pulsation d'ombre (5s loop)
```jsx
<div className="animate-pulse-shadow bg-card p-6 rounded-lg">
  Élément qui attire l'attention
</div>
```

---

## 🧩 Exemples pratiques complets

### Carte de jeu
```jsx
<div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
  <h3 className="font-averia text-2xl text-secondary mb-2">
    Partie en cours
  </h3>
  <p className="text-muted-foreground mb-4">
    4/6 joueurs connectés
  </p>
  <Button className="bg-primary text-primary-foreground w-full">
    Rejoindre
  </Button>
</div>
```

### Modal d'alerte
```jsx
<div className="bg-destructive text-destructive-foreground rounded-xl shadow-2xl p-8">
  <h2 className="font-title text-4xl mb-4">Attention !</h2>
  <p className="text-lg">Cette action est irréversible.</p>
</div>
```

### Hero section
```jsx
<section className="bg-background text-foreground py-24">
  <h1 className="font-title text-8xl text-secondary animate-pulse-shadow">
    Cadavre Exquis
  </h1>
  <p className="font-averia text-4xl text-muted-foreground mt-4">
    Le jeu d'écriture collaborative
  </p>
  <div className="mt-8 flex gap-4">
    <Button className="red-glow-shadow bg-primary text-primary-foreground">
      Créer
    </Button>
    <Button className="glow-shadow bg-secondary text-secondary-foreground">
      Rejoindre
    </Button>
  </div>
</section>
```

---

## 📋 Récapitulatif par contexte

| Contexte | Variables recommandées |
|----------|------------------------|
| **Fond de page** | `bg-background` |
| **Texte principal** | `text-foreground` |
| **Conteneurs/Cartes** | `bg-card text-card-foreground` |
| **Boutons primaires** | `bg-primary text-primary-foreground` + `.red-glow-shadow` |
| **Boutons secondaires** | `bg-secondary text-secondary-foreground` + `.glow-shadow` |
| **Titres décoratifs** | `font-title text-secondary` |
| **Sous-titres ludiques** | `font-averia` |
| **Texte discret** | `text-muted-foreground` |
| **Zones désactivées** | `bg-muted` |
| **Badges/Nouveautés** | `bg-accent text-accent-foreground` |
| **Erreurs/Suppressions** | `bg-destructive text-destructive-foreground` |
| **Bordures** | `border-border` |
| **Focus** | `focus:ring-ring` |
| **Graphiques** | `bg-chart-1` à `bg-chart-5` |

---

## 💡 Bonnes pratiques

1. **Toujours respecter les paires foreground** : Si vous utilisez `bg-primary`, utilisez `text-primary-foreground`
2. **Mode sombre** : Toutes les variables s'adaptent automatiquement via `.dark`
3. **Cohérence des ombres** : Utilisez les variables `--shadow-*` plutôt que des valeurs custom
4. **Polices décoratives** : `font-title` et `font-averia` pour les titres uniquement
5. **Effets glow** : Réservés aux boutons d'action importants pour éviter la surcharge visuelle