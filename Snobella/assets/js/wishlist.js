function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let count = cartItems.reduce((total, item) => total + item.quantity, 0);
    let cartCountSpan = document.querySelector(".cart-count");
    if (cartCountSpan) {
      cartCountSpan.textContent = count;
    }
  }

document.addEventListener("DOMContentLoaded", async () => {
    updateCartCount();
    let products = (await axios("http://localhost:3001/products")).data;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    let container = document.querySelector(".cards");

    let filtered = products.filter(product => favorites.includes(product.id.toString()));

    if (filtered.length === 0) {
        let msg = document.createElement("p");
        msg.style.marginLeft = "20px";
        msg.textContent = "There is no favorite product.";
        container.appendChild(msg);
    }

    filtered.forEach(product => {
        let card = document.createElement("div");
        card.classList.add("card");

        let closeIcon = document.createElement("i");
        closeIcon.className = "fa-solid fa-xmark heart-icon";
        closeIcon.setAttribute("data-id", product.id);
        closeIcon.title = "Remove from favorites";
        card.appendChild(closeIcon);

        let bagsDiv = document.createElement("div");
        bagsDiv.className = "bags";

        let img = document.createElement("img");
        img.className = "bag";
        img.src = product.image;
        img.alt = "";
        bagsDiv.appendChild(img);
        card.appendChild(bagsDiv);

        let starImg = document.createElement("img");
        starImg.className = "star";
        starImg.src = product.star;
        card.appendChild(starImg);

        let title = document.createElement("h5");
        title.textContent = product.title.slice(0, 80) + "...";
        card.appendChild(title);

        let priceDiv = document.createElement("div");
        priceDiv.className = "price";

        let price = document.createElement("p");
        price.textContent = `$${product.price}.00`;

        let desc = document.createElement("span");
        desc.textContent = product.description;

        priceDiv.append(price, desc);
        card.appendChild(priceDiv);

        let btn = document.createElement("button");
        btn.className = "add-to-cart";
        btn.id = product.id;
        btn.textContent = "Add to Cart";
        card.appendChild(btn);

        container.appendChild(card);
    });

    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("heart-icon")) {
            let id = e.target.getAttribute("data-id");
            favorites = favorites.filter(favId => favId !== id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            e.target.closest(".card").remove();
        }

        if (e.target.classList.contains("add-to-cart")) {
            let id = e.target.id;
            let productToAdd = products.find(p => p.id.toString() === id);

            let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            let existing = cartItems.find(item => item.id === productToAdd.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cartItems.push({
                    id: productToAdd.id,
                    name: productToAdd.name,
                    price: parseFloat(productToAdd.price),
                    image: productToAdd.image,
                    quantity: 1
                });
            }
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            alert("Product added to cart!");
            updateCartCount();
        }
    });

    let clearAllBtn = document.querySelector("#clear-all");
    if (favorites.length === 0) {
        clearAllBtn.style.display = "none";
    } else {
        clearAllBtn.style.display = "block";
    }

    clearAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all favorites?")) {
            favorites = [];
            localStorage.setItem("favorites", JSON.stringify(favorites));
            container.innerHTML = "";

            let msg = document.createElement("p");
            msg.style.marginLeft = "20px";
            msg.textContent = "There is no favorite product.";
            container.appendChild(msg);

            clearAllBtn.style.display = "none";
        }
    });
});