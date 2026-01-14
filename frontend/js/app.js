// Gestion globale des erreurs JS non gérées
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  showErrorMessage('Une erreur est survenue. Veuillez rafraîchir la page.');
});


// Gestion globale des promesses rejetées non gérées
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
  showErrorMessage('Une erreur est survenue.');
});