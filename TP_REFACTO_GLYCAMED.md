# 🏥 TP Jour 1 : GlycAmed Front - Production Ready

> **Prérequis** : Projet GlycAmed (frontend + backend) fonctionnel  
> **Objectif** : Améliorer votre front GlycAmed avec des patterns professionnels, des tests E2E et du monitoring

---

## 🎯 Philosophie du TP

Ce TP n'impose pas une structure unique. Vous allez **améliorer votre code existant** en appliquant des concepts professionnels. Les exemples fournis sont des **illustrations à adapter** à votre propre implémentation.

À la fin de chaque partie, vous noterez brièvement ce que vous avez modifié dans votre **Journal de bord**.

---

## 📋 Table des matières

- [Partie 0 : Setup](#partie-0--setup)
- [Partie 1 : Patterns & Architecture](#partie-1--patterns--architecture)
- [Partie 2 : Refactoring de vos composants](#partie-2--refactoring-de-vos-composants)
- [Partie 3 : Tests E2E avec Playwright](#partie-3--tests-e2e-avec-playwright)
- [Partie 4 : Monitoring avec Sentry](#partie-4--monitoring-avec-sentry)
- [Journal de bord (template)](#-journal-de-bord)

---

## 🔀 Deux parcours

| | 🅰️ Vanilla JS | 🅱️ React / Next.js |
|---|---------------|---------------------|
| **Patterns clés** | Modules ES6, Factory, Observer | Custom Hooks, Context, Compound Components |
| **État global** | Store maison avec événements | Context API ou Zustand |

> Les sections marquées 🔀 ont des approches différentes selon votre stack.

---

# Partie 0 : Setup

## 0.1 Vérifications

Avant de commencer, assurez-vous que :

```bash
# Backend fonctionnel
cd backend && npm run dev
# → http://localhost:3000 répond

# Frontend fonctionnel  
cd frontend && npm run dev  # ou npx serve .
# → Vous pouvez vous connecter et voir le dashboard
```

## 0.2 Nouvelle branche Git

```bash
git checkout -b feature/production-ready
```

## 0.3 Installations

```bash
# Playwright (tests E2E)
npm init playwright@latest

# Sentry (monitoring)
# 🅰️ Vanilla
npm install @sentry/browser

# 🅱️ React/Next.js
npx @sentry/wizard@latest -i nextjs
```

---

# Partie 1 : Patterns & Architecture

## 🎓 Concepts clés

### Pourquoi structurer son code ?

| Sans patterns | Avec patterns |
|---------------|---------------|
| Code spaghetti | Responsabilités claires |
| Difficile à tester | Facilement testable |
| Bugs difficiles à tracer | Debug simplifié |
| Duplication | Réutilisation |

---

## 🔀 1.1 Centraliser la configuration

### Le problème
Vous avez probablement des valeurs "magiques" éparpillées dans votre code :
- URL de l'API en dur
- Seuils de santé (50g sucre, 400mg caféine)
- Clés de localStorage

### L'objectif
Créer **un fichier de configuration central** que tout votre code utilise.

### 💡 Exemple d'approche

```javascript
// config/constants.js (ou .ts)
export const CONFIG = {
  API_URL: 'http://localhost:3000/api',
  
  HEALTH_LIMITS: {
    SUGAR_MAX: 50,      // grammes
    CAFFEINE_MAX: 400,  // mg
  },
  
  STORAGE_KEYS: {
    TOKEN: 'glycamed_token',
    USER: 'glycamed_user',
  },
};
```

### ✅ À faire

1. Identifiez toutes les valeurs en dur dans votre code
2. Créez un fichier de configuration
3. Remplacez les valeurs en dur par des imports

---

## 🔀 1.2 Centraliser les appels API

### Le problème
Les `fetch()` sont probablement dupliqués partout avec :
- L'URL de base répétée
- Le header Authorization répété
- La gestion d'erreur incohérente

### L'objectif
Créer **un service API unique** qui gère tout ça.

### 💡 Exemple d'approche — 🅰️ Vanilla

```javascript
// services/api.js
const ApiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('glycamed_token');
    
    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    
    return response.json();
  },
  
  get: (endpoint) => ApiService.request(endpoint),
  post: (endpoint, data) => ApiService.request(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  // ... put, delete
};
```

### 💡 Exemple d'approche — 🅱️ React

```typescript
// hooks/useApi.ts
function useApi<T>(asyncFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    setLoading(true);
    try {
      const result = await asyncFn();
      setData(result);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
```

### ✅ À faire

1. Créez un service ou hook API centralisé
2. Refactorez **au moins 3 appels API** existants pour l'utiliser
3. Assurez-vous que la gestion d'erreur est cohérente

---

## 🔀 1.3 Gérer l'état global

### Le problème
L'état de l'utilisateur connecté, les stats du jour, etc. sont peut-être :
- Passés en props à travers 5 niveaux de composants (prop drilling)
- Stockés dans des variables globales
- Re-fetchés plusieurs fois inutilement

### L'objectif
Avoir **une source de vérité unique** pour l'état partagé.

### 💡 Exemple d'approche — 🅰️ Vanilla (Pattern Observer)

```javascript
// store/store.js
const Store = {
  state: {
    user: null,
    todayStats: { sugar: 0, caffeine: 0 },
  },
  
  listeners: [],
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(fn => fn(this.state));
  },
  
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },
};

// Utilisation
Store.subscribe((state) => {
  updateDashboard(state.todayStats);
});
```

### 💡 Exemple d'approche — 🅱️ React (Context)

```tsx
// contexts/AuthContext.tsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = async (email, password) => { /* ... */ };
  const logout = () => { /* ... */ };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### ✅ À faire

1. Identifiez l'état qui est partagé entre plusieurs parties de votre app
2. Créez un store (Vanilla) ou un Context (React)
3. Migrez **au moins l'état d'authentification** vers cette solution

---

## 🔀 1.4 Créer des composants réutilisables

### Le problème
Vous avez probablement des éléments UI dupliqués :
- Les jauges sucre/caféine (même logique, données différentes)
- Les cartes de statistiques
- Les messages d'erreur/succès

### L'objectif
**Factoriser** ces éléments en composants/fonctions réutilisables.

### 💡 Exemple : La jauge de progression

Plutôt que d'avoir le HTML/CSS/JS de la jauge dupliqué pour sucre ET caféine, créez une fonction/composant qui prend des paramètres :

```javascript
// 🅰️ Vanilla
function createGauge({ container, label, value, max, unit }) {
  // Génère le HTML
  // Calcule le pourcentage
  // Applique la couleur selon le seuil
  // Retourne une fonction update(newValue)
}

// Utilisation
const sugarGauge = createGauge({ 
  container: '#sugar', 
  label: 'Sucre', 
  value: 35, 
  max: 50, 
  unit: 'g' 
});
```

```tsx
// 🅱️ React
function Gauge({ label, value, max, unit }) {
  const percentage = (value / max) * 100;
  const status = percentage > 80 ? 'danger' : percentage > 60 ? 'warning' : 'safe';
  
  return (
    <div className={`gauge gauge--${status}`}>
      {/* ... */}
    </div>
  );
}

// Utilisation
<Gauge label="Sucre" value={35} max={50} unit="g" />
```

### ✅ À faire

1. Identifiez **2-3 éléments UI** qui sont dupliqués ou pourraient l'être
2. Créez des composants/fonctions réutilisables
3. Remplacez le code dupliqué par vos nouveaux composants

---

## 📝 Journal — Partie 1

```markdown
## Partie 1 : Patterns & Architecture

### Ce que j'ai mis en place :
- [ ] Fichier de configuration central
- [ ] Service API centralisé  
- [ ] Gestion d'état global (Store/Context)
- [ ] Composants réutilisables

### Fichiers créés/modifiés :
- constants.js
- addConsumption.html
- historique.html
- index.html
- addConsumption.js
- getConsumption.js
- getHistorique.js
- getRanking.js
- login.js
- register.js
- report.js
- api.js
- store.js
- auth.js
- authGuard.js
- components.js
- login.html
- ranking.html
- register.html
- package-lock.json
- package.json
- playwright.config.ts
- example.spec.ts
- playwright.yml
- .gitignore

### Difficultés rencontrées :
- Beaucoup de code à refactoriser.
- Erreurs à cause des type="module" dans le html pour appeler les scripts.
- Import problématiques dans certaines situations.

### Temps passé : Toute la journée, soit environ 7h
```

---

# Partie 2 : Refactoring de vos composants

## 🎯 Objectif

Appliquer les patterns de la Partie 1 à vos pages principales :
- Page de connexion/inscription
- Dashboard
- (Bonus) Historique des consommations

---

## 2.1 Améliorer la page de connexion

### ✅ Checklist

- [ ] Utilise le service API centralisé
- [ ] Gère les états : loading, erreur, succès
- [ ] Stocke le token via le store/context (pas directement dans localStorage)
- [ ] Affiche des messages d'erreur clairs
- [ ] Redirige après connexion

### 💡 Points d'attention

**Gestion des états de formulaire** :

```javascript
// Mauvais ❌
submitBtn.disabled = true;
submitBtn.textContent = 'Chargement...';
// ... fetch ...
submitBtn.disabled = false;
submitBtn.textContent = 'Connexion';

// Mieux ✅
function setFormState(state) { // 'idle' | 'loading' | 'error' | 'success'
  // Centraliser la logique d'affichage
}
```

**Validation avant soumission** :

```javascript
function validateForm(data) {
  const errors = {};
  if (!data.email) errors.email = 'Email requis';
  if (!data.password) errors.password = 'Mot de passe requis';
  return { valid: Object.keys(errors).length === 0, errors };
}
```

---

## 2.2 Améliorer le Dashboard

### ✅ Checklist

- [ ] Les jauges utilisent le composant réutilisable
- [ ] Les données viennent du store/context (pas de fetch dans le composant directement)
- [ ] Rafraîchissement automatique (optionnel : toutes les 30s)
- [ ] État de chargement visible
- [ ] Gestion des erreurs (et possibilité de retry)

### 💡 Séparation des responsabilités

```
Dashboard
├── Logique (fetch data, calculs) → Service ou Custom Hook
├── État (stats, loading, error) → Store ou Context  
└── Affichage (jauges, cartes) → Composants UI
```

**Exemple de séparation — 🅱️ React** :

```tsx
// hooks/useDashboardStats.ts (logique)
function useDashboardStats() {
  const { data, loading, error, refetch } = useApiQuery('/stats/today');
  return { stats: data, loading, error, refetch };
}

// components/Dashboard.tsx (affichage)
function Dashboard() {
  const { stats, loading, error } = useDashboardStats();
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <Gauge value={stats.sugar} max={50} label="Sucre" />
      <Gauge value={stats.caffeine} max={400} label="Caféine" />
    </div>
  );
}
```

---

## 2.3 Gestion des erreurs globale

### Le problème

Quand une erreur JavaScript non gérée se produit, l'app peut crasher silencieusement ou afficher une page blanche.

### L'objectif

Capturer les erreurs et afficher un message user-friendly.

### 💡 Approche — 🅰️ Vanilla

```javascript
// Dans votre app.js principal
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  showErrorMessage('Une erreur est survenue. Veuillez rafraîchir la page.');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
  showErrorMessage('Une erreur est survenue.');
});
```

### 💡 Approche — 🅱️ React (Error Boundary)

```tsx
class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    console.error('Error caught:', error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Oups ! Une erreur est survenue.</div>;
    }
    return this.props.children;
  }
}

// Utilisation dans layout
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### ✅ À faire

1. Ajoutez une gestion d'erreur globale
2. Testez en provoquant volontairement une erreur

---

## 📝 Journal — Partie 2

```markdown
## Partie 2 : Refactoring des composants

### Pages améliorées :
- [x] Login/Register
- [x] Dashboard
- [x] Autre : Report & Pages générales

### Patterns appliqués :
  - Implémentation d'un Store centralisé (`store.js`) pour gérer l'état global
  - Système d'abonnement (`subscribe()`) pour réagir aux changements d'état
  - Gestion de l'authentification : `Store.login()` et `Store.logout()`
  - Gestion des statistiques quotidiennes : `Store.loadTodayStats()`

### Avant/Après notable :

**Avant :**
- Formulaire de connexion avec gestion d'état éparse (disabled/textContent du bouton éparpillés)
- Erreurs affichées de manière incohérente
- Jauges et charts dupliquées partout sans logique centralisée
- État global dispersé (localStorage, variables globales)
- Pas de séparation validation/affichage
- Gestion des erreurs manquante

**Après :**
- Formulaire avec états clairs via `setFormState()` (idle/loading/error/success)
- Messages d'erreur cohérents et user-friendly avec `showErrorMessage()`
- Composants réutilisables : `createGauge()`, `createChart()`, `showStateMessage()`
- Source de vérité unique via Store (authentication, stats, loading, errors)
- Validation dédiée avec `validateForm()` séparée de la logique UI
- Error handling global pour toute l'app (erreurs sync + promesses rejetées)
- Observer pattern : UI réactive aux changements du Store

### Temps passé : 3h
```

---

# Partie 3 : Tests E2E avec Playwright

## 🎓 Pourquoi des tests E2E ?

Les tests End-to-End simulent un vrai utilisateur :
- Ouvrir le navigateur
- Remplir des formulaires
- Cliquer sur des boutons
- Vérifier ce qui s'affiche

Ils attrapent des bugs que les tests unitaires ratent (intégration, CSS qui cache un bouton, etc.).

---

## 3.1 Configuration

Vérifiez votre `playwright.config.ts` :

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  
  use: {
    baseURL: 'http://localhost:3001', // Votre port frontend
    screenshot: 'only-on-failure',
  },
  
  // Lance votre serveur avant les tests
  webServer: {
    command: 'npm run dev', // Adapter à votre commande
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

> ⚠️ Adaptez les ports et commandes à votre setup !

---

## 3.2 Premier test : La page d'accueil

Créez `tests/e2e/home.spec.ts` :

```typescript
import { test, expect } from '@playwright/test';

test('la page d\'accueil affiche le titre', async ({ page }) => {
  await page.goto('/');
  
  // Adaptez selon votre implémentation
  await expect(page.locator('h1')).toContainText(/glycamed/i);
});
```

Lancez :

```bash
npx playwright test home.spec.ts --headed
```

---

## 3.3 Test du flow de connexion

C'est LE test le plus important : vérifier qu'un utilisateur peut se connecter.

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  
  test('connexion avec identifiants valides', async ({ page }) => {
    await page.goto('/login'); // Adapter l'URL
    
    // Remplir le formulaire - ADAPTER LES SÉLECTEURS À VOTRE CODE
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Soumettre
    await page.click('button[type="submit"]');
    
    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL(/dashboard/);
  });
  
  test('affiche une erreur avec mauvais mot de passe', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Vérifier qu'un message d'erreur apparaît
    // ADAPTER selon comment vous affichez les erreurs
    await expect(page.locator('.error, [role="alert"]')).toBeVisible();
  });
  
});
```

### 💡 Conseils pour les sélecteurs

Playwright cherche les éléments de plusieurs façons. Du plus robuste au moins robuste :

```typescript
// ✅ Très robuste - par rôle
page.getByRole('button', { name: 'Se connecter' })

// ✅ Robuste - par label
page.getByLabel('Email')

// ✅ Robuste - par placeholder
page.getByPlaceholder('Entrez votre email')

// ⚠️ Moins robuste - par texte
page.getByText('Connexion')

// ⚠️ Fragile - par classe CSS (peut changer)
page.locator('.btn-primary')

// 💡 Alternative : ajouter data-testid dans votre HTML
page.getByTestId('login-button')
```

**Ajoutez des `data-testid` si vos sélecteurs sont trop fragiles :**

```html
<button data-testid="login-button">Connexion</button>
```

---

## 3.4 Test du Dashboard

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

// Helper pour se connecter
async function login(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);
}

test.describe('Dashboard', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
  });
  
  test('affiche les jauges de santé', async ({ page }) => {
    // Vérifier que les jauges/stats sont visibles
    // ADAPTER selon votre implémentation
    await expect(page.getByText(/sucre/i)).toBeVisible();
    await expect(page.getByText(/caféine/i)).toBeVisible();
  });
  
  test('affiche un statut de santé', async ({ page }) => {
    // Vérifier qu'un indicateur de statut est présent
    const status = page.locator('[data-testid="health-status"]')
      .or(page.getByText(/sous les limites|dépassée/i));
    
    await expect(status).toBeVisible();
  });
  
});
```

---

## 3.5 Lancer et débugger

```bash
# Tous les tests
npx playwright test

# Un fichier
npx playwright test auth.spec.ts

# Mode visuel (voir le navigateur)
npx playwright test --headed

# Mode debug (pas à pas)
npx playwright test --debug

# UI interactive
npx playwright test --ui

# Voir le rapport après les tests
npx playwright show-report
```

---

## ✅ Objectifs Partie 3

- [ ] Au moins **3 tests qui passent**
- [ ] Test de connexion (flow complet)
- [ ] Test du dashboard (affichage des données)
- [ ] Savoir lancer les tests et lire le rapport

---

## 📝 Journal — Partie 3

```markdown
## Partie 3 : Tests E2E

### Tests créés :
- [ ] Test page d'accueil
- [ ] Test connexion valide
- [ ] Test connexion invalide
- [ ] Test dashboard

### Sélecteurs utilisés :
- getByRole : non
- getByTestId : non
- Autres : 
  - `page.locator('h1')` : pour le titre
  - `page.fill()` : pour remplir les inputs email/password
  - `page.click()` : pour soumettre le formulaire
  - `page.locator('.alert')` : pour les messages d'erreur
  - `page.getByText(/sucre/i)` : pour chercher du texte (insensible à la casse)
  - `page.locator('canvas')` : pour vérifier la présence des charts

### Nombre de tests : 5 / 5 qui passent ✅

### Problèmes rencontrés :
- Aucun problème majeur. Les sélecteurs simples (input[type], button[type], .alert) ont suffi.
- Chemins des pages adaptés au contexte `/frontend/...`

### Temps passé : 2h30min
```

---

# Partie 4 : Monitoring avec Sentry

## 🎓 Pourquoi monitorer ?

En production, vous avez besoin de savoir :
- Quelles erreurs se produisent (et combien d'utilisateurs sont affectés)
- Les performances de l'app
- Le contexte quand ça plante (navigateur, actions précédentes...)

---

## 4.1 Créer un compte Sentry

1. Allez sur [sentry.io](https://sentry.io)
2. Créez un compte gratuit
3. Créez un projet :
   - 🅰️ Vanilla → "Browser JavaScript"
   - 🅱️ React/Next.js → "Next.js"
4. Récupérez votre **DSN** (une URL du type `https://xxx@yyy.ingest.sentry.io/zzz`)

---

## 4.2 Installation

### 🅰️ Vanilla

```bash
npm install @sentry/browser
```

Initialisez au début de votre app :

```javascript
// En haut de votre fichier principal (app.js, index.js, etc.)
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'VOTRE_DSN_ICI',
  environment: window.location.hostname === 'localhost' ? 'development' : 'production',
});
```

### 🅱️ React/Next.js

```bash
npx @sentry/wizard@latest -i nextjs
```

Le wizard configure tout automatiquement. Suivez les instructions.

---

## 4.3 Identifier l'utilisateur

Quand un utilisateur est connecté, dites-le à Sentry :

```javascript
// Après une connexion réussie
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.firstName,
});

// À la déconnexion
Sentry.setUser(null);
```

---

## 4.4 Connecter votre Error Boundary (React)

Si vous avez créé un Error Boundary dans la Partie 2, envoyez les erreurs à Sentry :

```tsx
componentDidCatch(error, errorInfo) {
  Sentry.captureException(error, {
    extra: { componentStack: errorInfo.componentStack },
  });
}
```

---

## 4.5 Tester que ça marche

Ajoutez temporairement un bouton de test :

```javascript
// Quelque part dans votre app
document.getElementById('test-error')?.addEventListener('click', () => {
  throw new Error('Test Sentry Error!');
});
```

```tsx
// React
<button onClick={() => { throw new Error('Test!'); }}>
  Test Sentry
</button>
```

1. Cliquez sur le bouton
2. Allez sur votre dashboard Sentry
3. L'erreur devrait apparaître dans les secondes qui suivent

**Supprimez le bouton de test après vérification !**

---

## ✅ Objectifs Partie 4

- [ ] Sentry initialisé
- [ ] L'utilisateur connecté est identifié
- [ ] Une erreur de test apparaît dans Sentry
- [ ] (Bonus) Error Boundary connecté à Sentry

---

## 📝 Journal — Partie 4

```markdown
## Partie 4 : Monitoring Sentry

### Implémentation :
- [ ] SDK installé
- [ ] DSN configuré
- [ ] Utilisateur identifié après login
- [ ] Error Boundary connecté (React)

### Erreur de test visible dans Sentry : oui / non

### Observations sur le dashboard Sentry :
- ...

### Temps passé : ___min
```

---

# 📓 Journal de bord

Copiez ce template et remplissez-le au fur et à mesure du TP.

```markdown
# Journal de bord - GlycAmed Production Ready

**Nom** : 
**Date** : 
**Stack** : Vanilla JS / React / Next.js

---

## Partie 1 : Patterns & Architecture

### Ce que j'ai mis en place :
- [ ] Configuration centralisée
- [ ] Service API
- [ ] Store/Context pour l'état global
- [ ] Composants réutilisables

### Fichiers créés :
1. 
2. 
3. 

### Fichiers modifiés :
1. 
2. 

### Difficultés :


### Temps passé : ___min

---

## Partie 2 : Refactoring

### Pages améliorées :
- [ ] Login
- [ ] Dashboard  
- [ ] Autre : 

### Principal changement :


### Temps passé : ___min

---

## Partie 3 : Tests E2E

### Tests créés :
1. 
2. 
3. 

### Nombre de tests qui passent : ___ / ___

### data-testid ajoutés :


### Temps passé : ___min

---

## Partie 4 : Sentry

### Implémenté :
- [ ] Initialisation
- [ ] Identification utilisateur
- [ ] Error Boundary (React)

### URL de votre projet Sentry :


### Temps passé : ___min

---

## Récap global

**Temps total** : ___h___min

**Ce que j'ai appris** :
1. 
2. 
3. 

**Ce qui reste à améliorer** :
1. 
2. 

**Questions pour le prof** :
1. 
2. 
```

---

# 🎉 Récap du TP

## Vous avez appris à :

| Concept | Ce que ça apporte |
|---------|-------------------|
| **Configuration centralisée** | Plus de valeurs magiques, maintenance facilitée |
| **Service API** | Code DRY, gestion d'erreur cohérente |
| **État global** | Source de vérité unique, pas de prop drilling |
| **Composants réutilisables** | Moins de duplication, UI cohérente |
| **Tests E2E** | Confiance lors des refactorings, documentation vivante |
| **Monitoring** | Visibilité sur les erreurs en prod |

## Commit final

```bash
git add .
git commit -m "feat: application production-ready avec tests et monitoring"
```

---

# 📚 Pour aller plus loin

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Sentry JavaScript Guide](https://docs.sentry.io/platforms/javascript/)
- [Patterns React](https://www.patterns.dev/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Bon courage ! 🚀**
