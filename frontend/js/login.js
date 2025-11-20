const form = document.querySelector(".login-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Erreur de connexion");
      return;
    }

    localStorage.setItem("token", data.token); // store token
    window.location.href = "index.html";

    console.log("User logged in:", data.user);

  } catch (err) {
    console.error(err);
    alert("Connexion au serveur impossible");
  }
});
