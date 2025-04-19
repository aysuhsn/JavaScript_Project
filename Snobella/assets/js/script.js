document.addEventListener("DOMContentLoaded", async () => {
  let products = (await axios("http://localhost:3000/products")).data;

  function createUsercard() {
    let userCard = document.querySelector(".cards");

    products.forEach((product, index) => {
      let card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="bags">
          <img class="bag" src="${product.image}" alt="">
        </div>
        <img class="star" src="${product.star}">
        <h5>${product.title.slice(0, 40)}...</h5>
        <div class="price">
          <p>$${product.price}.00</p>
          <span>${product.description}</span>
        </div>
        <button class="add-to-cart" id="${product.id}">Add to Cart</button>
      `;

      let heart = document.createElement("i");
      heart.className = "fa-regular fa-heart heart-icon";
      card.appendChild(heart);

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (favorites.includes(product.id)) {
        heart.classList.add("fa-solid", "active");
        heart.classList.remove("fa-regular");
      }

      heart.addEventListener("click", function () {
        heart.classList.toggle("fa-solid");
        heart.classList.toggle("fa-regular");
        heart.classList.toggle("active");

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        if (heart.classList.contains("active")) {
          favorites.push(product.id);
          localStorage.setItem("favorites", JSON.stringify(favorites));

          Toastify({
            text: "Added To Wishlist",
            duration: 1000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();

        } else {
          favorites = favorites.filter((itemId) => itemId != product.id);
          localStorage.setItem("favorites", JSON.stringify(favorites));

          Toastify({
            text: "Removed From Wishlist",
            duration: 1000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #e53935, #e35d5b)",
            },
          }).showToast();
        }
      });

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

      userCard.appendChild(card);
    });
  }

  createUsercard();
});
