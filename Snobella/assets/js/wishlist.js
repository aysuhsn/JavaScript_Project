document.addEventListener("DOMContentLoaded", async () => {
    let products = (await axios("http://localhost:3001/products")).data;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.querySelector(".cards");

    let filtered = products.filter(product => favorites.includes(product.id.toString()));

    if (filtered.length === 0) {
        let msg = document.createElement("p");
        msg.style.marginLeft = "20px";
        msg.textContent = "Hec bir favori mehsul yoxdur.";
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

    clearAllBtn.addEventListener("click", () => {
        if (confirm("Butun favorileri silmek istediyinize eminsiniz?")) {
            favorites = [];
            localStorage.setItem("favorites", JSON.stringify(favorites));
            container.innerHTML = ""; 

            let msg = document.createElement("p");
            msg.style.marginLeft = "20px";
            msg.textContent = "Hec bir favori mehsul yoxdur.";
            container.appendChild(msg);

            clearAllBtn.style.display = "none";
        }
    });

    let dropdownButton = document.querySelector(".dropdown-toggle span");
    let dropdownMenu = document.querySelector(".dropdown-menu");
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (isLoggedIn && loggedInUser) {
        dropdownButton.textContent = loggedInUser.username;

        dropdownMenu.innerHTML = "";
        let li = document.createElement("li");
        let logout = document.createElement("a");
        logout.className = "dropdown-item logout-btn";
        logout.href = "#";
        logout.textContent = "Logout";
        li.appendChild(logout);
        dropdownMenu.appendChild(li);

        logout.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            localStorage.setItem("isLoggedIn", "false");

            Toastify({
                text: "Cixis edildi!",
                duration: 2000,
                gravity: "top",
                position: "right",
                backgroundColor: "#f44336"
            }).showToast();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        });
    } else {
        dropdownButton.textContent = "Sign Up";
        dropdownMenu.innerHTML = "";

        let loginLi = document.createElement("li");
        let loginLink = document.createElement("a");
        loginLink.className = "dropdown-item";
        loginLink.href = "login.html";
        loginLink.textContent = "Login";
        loginLi.appendChild(loginLink);

        let signupLi = document.createElement("li");
        let signupLink = document.createElement("a");
        signupLink.className = "dropdown-item";
        signupLink.href = "signup.html";
        signupLink.textContent = "Sign Up";
        signupLi.appendChild(signupLink);

        dropdownMenu.append(loginLi, signupLi);
    }
});
