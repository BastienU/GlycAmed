// Function to display alert messages
function showAlert(type, message, containerId = null) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  const parent = containerId 
    ? document.getElementById(containerId)
    : document.body;

  parent.prepend(alert);

  setTimeout(() => alert.remove(), 4000);
}