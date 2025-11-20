// Script to handle "login or logout" text on the button in the navbar
const token = localStorage.getItem("token");
const loginButton = document.querySelector("nav button a");

if (token) {
  loginButton.textContent = "Logout";

  loginButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });

} else {
  loginButton.textContent = "Login";
  loginButton.href = "login.html";
}