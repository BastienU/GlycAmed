import { ApiService } from "../../services/api.js";
import { Store } from "../../services/store.js";

const form = document.querySelector(".register-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const firstname = document.querySelector("#firstname").value.trim();
  const lastname = document.querySelector("#lastname").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  try {
    const data = await ApiService.post("/auth/register", {
      firstname,
      lastname,
      email,
      password,
    });

    // Utiliser le store au lieu de localStorage
    Store.login(data.token, data.user);
    window.location.href = "index.html";

    console.log("Utilisateur enregistré :", data.user);
  } catch (err) {
    console.error(err);
    alert(err.message || "Erreur lors de l'inscription");
  }
});