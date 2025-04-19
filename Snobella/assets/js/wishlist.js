document.addEventListener("DOMContentLoaded", async () => {
    let products = (await axios("http://localhost:3000/products")).data;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    let container = document.querySelector(".cards");

    let filtered = products.filter(product => favorites.includes(product.id.toString()));

    if (filtered.length === 0) {
      container.innerHTML = "<p>Heç bir favori məhsul yoxdur.</p>";
      return;
    }

    filtered.forEach(product => {
      let card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
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
  });