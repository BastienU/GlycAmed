document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const needle = document.querySelector(".aiguille");

  let progress = 0;
  const loadingDuration = 1000; // 1 simulated seconds
  const step = 50; // update every 50ms
  const maxRotation = 200; // maximum needle rotation to the right

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
