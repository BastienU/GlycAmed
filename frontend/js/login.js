import { ApiService } from "../../services/api.js";
import { Store } from "../../services/store.js";

const form = document.querySelector(".login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!email || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  try {
    const data = await ApiService.post("/auth/login", { email, password });

    // Utiliser le store au lieu de localStorage
    Store.login(data.token, data.user);
    window.location.href = "index.html";

    console.log("Utilisateur connecté :", data.user);
  } catch (err) {
    console.error(err);
    alert(err.message || "Connexion impossible");
  }
});