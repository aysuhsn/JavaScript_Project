function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartCountSpan = document.querySelector(".cart-count");
  if (cartCountSpan) {
    cartCountSpan.textContent = count;
  }
}


window.addToCart = function (productId) {
  let products = JSON.parse(localStorage.getItem("allProducts")) || [];

  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const existingItem = cartItems.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.title,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1,
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.removeItem("cartCleared");

  Toastify({
    text: "Added to cart!",
    duration: 1000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  updateCartCount();

};

document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();

  let products = (await axios("http://localhost:3001/products")).data;
  localStorage.setItem("allProducts", JSON.stringify(products));

  let userCard = document.querySelector(".cards");

  function createUsercard() {
    products.forEach((product, index) => {
      let card = document.createElement("div");
      card.classList.add("card");

      let heart = document.createElement("i");
      heart.className = "fa-regular fa-heart heart-icon";
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (favorites.includes(product.id.toString())) {
        heart.classList.add("fa-solid", "active");
        heart.classList.remove("fa-regular");
      }
      card.appendChild(heart);

      let bags = document.createElement("div");
      bags.className = "bags";
      let bagImg = document.createElement("img");
      bagImg.className = "bag";
      bagImg.src = product.image;
      bags.appendChild(bagImg);
      card.appendChild(bags);

      let starImg = document.createElement("img");
      starImg.className = "star";
      starImg.src = product.star;
      card.appendChild(starImg);

      let title = document.createElement("h5");
      title.textContent = product.title.slice(0, 40) + "...";
      card.appendChild(title);

      let priceDiv = document.createElement("div");
      priceDiv.className = "price";

      let priceP = document.createElement("p");
      priceP.textContent = `$${product.price}.00`;

      let desc = document.createElement("span");
      desc.textContent = product.description;

      priceDiv.append(priceP, desc);
      card.appendChild(priceDiv);

      let addToCartBtn = document.createElement("button");
      addToCartBtn.className = "add-to-cart";
      addToCartBtn.id = product.id;
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.addEventListener("click", function () {
        window.addToCart(product.id);
      });
      card.appendChild(addToCartBtn);

      let badge = document.createElement("div");
      badge.classList.add("badge");
      if (index === 0 || index === 3) {
        badge.textContent = "New";
        badge.classList.add("new");
        card.appendChild(badge);
      } else if (index === 1 || index === 4 || index === 5) {
        badge.textContent = "30 %";
        badge.classList.add("discount");
        card.appendChild(badge);
      }

      heart.addEventListener("click", () => {
        heart.classList.toggle("fa-solid");
        heart.classList.toggle("fa-regular");
        heart.classList.toggle("active");

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (heart.classList.contains("active")) {
          favorites.push(product.id.toString());

          Toastify({
            text: "Added to favorites",
            duration: 1000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        } else {
          favorites = favorites.filter((itemId) => itemId != product.id);
          Toastify({
            text: "Removed from favorites",
            duration: 1000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #e53935, #e35d5b)",
            },
          }).showToast();
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
      });

      userCard.appendChild(card);
    });
  }

  createUsercard();

  let dropdownButton = document.querySelector(".dropdown-toggle span");
  let dropdownMenu = document.querySelector(".dropdown-menu");
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (isLoggedIn && loggedInUser) {
    dropdownButton.textContent = loggedInUser.username;

    dropdownMenu.innerHTML = `
      <li><a class="dropdown-item logout-btn" href="#">Logout</a></li>
    `;

    document.querySelector(".logout-btn").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      localStorage.setItem("isLoggedIn", "false");

      Toastify({
        text: "The speech was made!",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "#f44336",
      }).showToast();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    });
  }
});
