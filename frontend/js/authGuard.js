(function () {
    import("../../services/store.js").then(({ Store }) => {
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
            if (!Store.isUserAuthenticated()) {
                window.location.href = "login.html";
            }
        }
    });
})();
