(function () {
    const protectedPages = [
        "/frontend/addConsumption.html",
        "/frontend/historique.html",
        "/frontend/ranking.html",
        "/frontend/report.html",
        "/frontend/statistics.html"
    ];

    const currentPath = window.location.pathname;

    const isProtected = protectedPages.some(page => currentPath.endsWith(page));

    if (isProtected) {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
        }
    }
})();
