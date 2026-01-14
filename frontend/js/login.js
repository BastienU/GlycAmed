import { ApiService } from "../../services/api.js";
import { Store } from "../../services/store.js";

const form = document.querySelector(".login-form");
const submitBtn = form.querySelector("button[type='submit']");
const errorBox = document.querySelector(".form-error");

let formState = "idle"; // 'idle' | 'loading' | 'error' | 'success'

// UI State management
function setFormState(state, message = "") {
  formState = state;

  switch (state) {
    case "idle":
      submitBtn.disabled = false;
      submitBtn.textContent = "Connexion";
      errorBox.textContent = "";
      errorBox.style.display = "none";
      break;

    case "loading":
      submitBtn.disabled = true;
      submitBtn.textContent = "Connexion...";
      errorBox.style.display = "none";
      break;

    case "error":
      submitBtn.disabled = false;
      submitBtn.textContent = "Connexion";
      errorBox.textContent = message;
      errorBox.style.display = "block";
      break;

    case "success":
      submitBtn.disabled = true;
      submitBtn.textContent = "Connecté ✔";
      break;
  }
}

// Form validation
function validateForm({ email, password }) {
  const errors = {};

  if (!email) errors.email = "Email requis";
  if (!password) errors.password = "Mot de passe requis";

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

  // Submit button
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: form.email.value.trim(),
    password: form.password.value.trim(),
  };

  const validation = validateForm(data);

  if (!validation.valid) {
    setFormState("error", Object.values(validation.errors)[0]);
    return;
  }

  setFormState("loading");

  try {
    const response = await ApiService.post("/auth/login", data);

    Store.login(response.token, response.user);

    // Identifier l'utilisateur dans Sentry (si disponible)
    if (typeof window.Sentry !== 'undefined') {
      window.Sentry.setUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.firstName || response.user.email,
      });
    }

    setFormState("success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);

  } catch (err) {
    setFormState("error", err.message || "Connexion impossible");
  }
});