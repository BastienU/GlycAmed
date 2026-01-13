import { Store } from "../../services/store.js";

// Gérer l'authentification dans la navbar
const loginButton = document.querySelector("nav button a");

// S'abonner aux changements d'authentification
Store.subscribe((state) => {
  if (state.isAuthenticated) {
    loginButton.textContent = "Logout";
    loginButton.href = "#";
    
    // Supprimer les anciens listeners avant d'en ajouter un nouveau
    loginButton.onclick = null;
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      Store.logout();
      window.location.href = "login.html";
    });
  } else {
    loginButton.textContent = "Login";
    loginButton.href = "login.html";
    loginButton.onclick = null;
  }
});