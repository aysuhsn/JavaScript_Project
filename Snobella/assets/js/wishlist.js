document.addEventListener("DOMContentLoaded", async () => {
    let products = (await axios("http://localhost:3000/products")).data;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.querySelector(".cards");

    let filtered = products.filter(product => favorites.includes(product.id.toString()));

    if (filtered.length === 0) {
        container.innerHTML = "<p style='margin-left:20px;'>Heç bir favori mehsul yoxdur.</p>";
    }

    filtered.forEach(product => {
        let card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <i class="fa-solid fa-xmark heart-icon" data-id="${product.id}" title="Remove from favorites"></i>
            <div class="bags">
                <img class="bag" src="${product.image}" alt="">
            </div>
            <img class="star" src="${product.star}">
            <h5>${product.title.slice(0, 80)}...</h5>
            <div class="price">
                <p>$${product.price}.00</p>
                <span>${product.description}</span>
            </div>
            <button class="add-to-cart" id="${product.id}">Add to Cart</button>
        `;

        container.appendChild(card);
    });

    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("heart-icon")) {
            const id = e.target.getAttribute("data-id");
            favorites = favorites.filter(favId => favId !== id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            e.target.closest(".card").remove();
        }

        if (e.target.classList.contains("add-to-cart")) {
            const id = e.target.id;
            const productToAdd = products.find(p => p.id.toString() === id);

            const existingItem = cart.find(item => item.id === productToAdd.id);
            if (existingItem) {
                existingItem.count = (existingItem.count || 1) + 1;
            } else {
                productToAdd.count = 1;
                cart.push(productToAdd);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Mehsul sebete elave olundu!");
        }
    });

    let clearAllBtn = document.querySelector("#clear-all");

    if (favorites.length === 0) {
        clearAllBtn.style.display = "none";
    } else {
        clearAllBtn.style.display = "block"; 
    }

    document.querySelector("#clear-all").addEventListener("click", () => {
        if (confirm("Butun favorileri silmek istediyinize eminsiniz?")) {
            favorites = [];
            localStorage.setItem("favorites", JSON.stringify(favorites));
            container.innerHTML = "<p style='margin-left:20px;'>Hec bir favori mehsul yoxdur.</p>";
            clearAllBtn.style.display = "none"; 
        }
    });
});