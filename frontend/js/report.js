async function renderCharts() {
    // Appel à ton API pour récupérer les consommations du jour
    const response = await fetch("http://localhost:3000/api/consumption/all");
    const consumptions = await response.json();

    let totalSugar = 0, totalCaffeine = 0, totalCalories = 0;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    consumptions.forEach(c => {
        const consumedDate = new Date(c.consumedAt).toISOString().split("T")[0];
        if (consumedDate === today) {
            totalSugar += c.nutrients.sugar || 0;
            totalCaffeine += c.nutrients.caffeine || 0;
            totalCalories += c.nutrients.calories || 0;
        }
    });

    new Chart(document.getElementById('sugarChart'), {
        type: 'doughnut',
        data: {
            labels: ['Sucre consommé', 'Restant'],
            datasets: [{
                data: [totalSugar, Math.max(50 - totalSugar, 0)],
                backgroundColor: ['#FF6384', '#E0E0E0'],
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: `Sucre : ${totalSugar}g / 50g` }
            }
        }
    });

    new Chart(document.getElementById('caffeineChart'), {
        type: 'doughnut',
        data: {
            labels: ['Caféine consommée', 'Restant'],
            datasets: [{
                data: [totalCaffeine, Math.max(400 - totalCaffeine, 0)],
                backgroundColor: ['#36A2EB', '#E0E0E0'],
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: `Caféine : ${totalCaffeine}mg / 400mg` }
            }
        }
    });

    new Chart(document.getElementById('caloriesChart'), {
        type: 'doughnut',
        data: {
            labels: ['Calories consommées', 'Restant'],
            datasets: [{
                data: [totalCalories, Math.max(2000 - totalCalories, 0)],
                backgroundColor: ['#FFCE56', '#E0E0E0'],
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: `Calories : ${totalCalories} kcal / 2000 kcal` }
            }
        }
    });
}

renderCharts();