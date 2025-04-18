document.addEventListener("DOMContentLoaded", async () => {
    let products = (await axios("http://localhost:3000/products")).data;
  
    function createUsercard() {
      let userCard = document.querySelector(".cards");
  
      products.forEach((product, index) => {
        let card = document.createElement("div");
        card.classList.add("card");
  
        // Kart içeriği
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
  