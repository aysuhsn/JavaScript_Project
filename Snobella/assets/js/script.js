document.addEventListener("DOMContentLoaded", async () => {
  let products = (await axios("http://localhost:3001/products")).data;
  let userCard = document.querySelector(".cards");

  function createUsercard() {
    products.forEach((product, index) => {
      let card = document.createElement("div");
      card.classList.add("card");

      let heart = document.createElement("i");
      heart.className = "fa-regular fa-heart heart-icon";
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (favorites.includes(product.id)) {
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

      // Add to Cart button
      let addToCartBtn = document.createElement("button");
      addToCartBtn.className = "add-to-cart";
      addToCartBtn.id = product.id;
      addToCartBtn.textContent = "Add to Cart";
      card.appendChild(addToCartBtn);

      // Badge
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

      // Heart click
      heart.addEventListener("click", () => {
        heart.classList.toggle("fa-solid");
        heart.classList.toggle("fa-regular");
        heart.classList.toggle("active");

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (heart.classList.contains("active")) {
          favorites.push(product.id);
          Toastify({
            text: "Sevimlilərə əlavə edildi",
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
            text: "Sevimlilərdən silindi",
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
  }
});
