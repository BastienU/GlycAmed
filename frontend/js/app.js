import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://d3911ab0fd05ea560a37d0adb676eb7e@o4510710205972480.ingest.de.sentry.io/4510710209904720',
  environment: window.location.hostname === 'localhost' ? 'development' : 'production',
});

// Gestion globale des erreurs JS non gérées
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  Sentry.captureException(event.error);
  showErrorMessage('Une erreur est survenue. Veuillez rafraîchir la page.');
});


// Gestion globale des promesses rejetées non gérées
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
  Sentry.captureException(event.reason);
  showErrorMessage('Une erreur est survenue.');
});