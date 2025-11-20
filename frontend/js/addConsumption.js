const productInput = document.getElementById("product");
const datalist = document.getElementById("products-list");

productInput.addEventListener("input", async () => {
    const query = productInput.value.trim();

    if (query.length < 2) {
        datalist.innerHTML = "";
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:3000/api/products/search?name=${encodeURIComponent(query)}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("Erreur API produits");
            return;
        }

        const products = await response.json();

        datalist.innerHTML = ""; // reset suggestions

        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.product_name || product.name;
            datalist.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur fetch :", error);
    }
});