document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const needle = document.querySelector(".aiguille");

  let progress = 0;
  const loadingDuration = 2000; // 2 secondes simulées
  const step = 50; // mise à jour toutes les 50ms
  const maxRotation = 200; // rotation maximale de l'aiguille vers la droite

  const interval = setInterval(() => {
    progress += step;
    const ratio = progress / loadingDuration;
    const angle = -50 + ratio * maxRotation;

    needle.style.transform = `rotate(${angle}deg)`;

    if (progress >= loadingDuration) {
      clearInterval(interval);
      preloader.style.opacity = "0";
      setTimeout(() => preloader.style.display = "none", 500);
    }
  }, step);
});
