let cartContainer = document.getElementById("cart-items");
let subtotalText = document.getElementById("subtotal");
let totalText = document.getElementById("total");
let confirmBtn = document.getElementById("confirmBtn");
let clearAllBtn = document.getElementById("clearAllBtn");

let cartItems = [];

function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let count = cartItems.reduce((total, item) => total + item.quantity, 0);
    let cartCountSpan = document.querySelector(".cart-count");
    if (cartCountSpan) {
      cartCountSpan.textContent = count;
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

function updateTotals() {
  let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  subtotalText.textContent = `US $${total.toFixed(2)}`;
  totalText.textContent = `US $${total.toFixed(2)}`;
}

function renderCart() {
  cartContainer.innerHTML = "";
  cartItems.forEach((item, index) => {
    let cartItem = document.createElement("div");
    cartItem.className = "cart-item d-flex border p-3 mb-3 align-items-start gap-3";

    let img = document.createElement("img");
    img.src = item.image;
    img.style.width = "120px";
    img.alt = "Product Image";

    let info = document.createElement("div");
    info.className = "item-info w-100";

    let top = document.createElement("div");
    top.className = "d-flex justify-content-between";
    top.innerHTML = `
      <h5>${item.name}</h5>
      <span class="fw-bold">US $${(item.price * item.quantity).toFixed(2)}</span>
    `;

    let sizeColor = document.createElement("p");
    sizeColor.className = "mb-1";
    sizeColor.textContent = `Size: XS   Color: Grey`;

    let delivery = document.createElement("p");
    delivery.className = "mb-1";
    delivery.textContent = `Delivery: 25-32 days`;

    let label = document.createElement("p");
    label.className = "mb-1";
    label.textContent = "Quantity";

    let select = document.createElement("div");
    select.className = "d-flex gap-2 align-items-center mb-2";

    let minus = document.createElement("button");
    minus.textContent = "-";
    minus.className = "btn btn-outline-secondary btn-sm";
    minus.onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.removeItem("cartCleared");
        renderCart();
        updateTotals();
        updateCartCount();
      }
    };

    let quantity = document.createElement("span");
    quantity.textContent = item.quantity;
    quantity.className = "px-2";

    let plus = document.createElement("button");
    plus.textContent = "+";
    plus.className = "btn btn-outline-secondary btn-sm";
    plus.onclick = () => {
      item.quantity++;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.removeItem("cartCleared"); 
      renderCart();
      updateCartCount();
      updateTotals();
    };

    select.append(minus, quantity, plus);

    let icons = document.createElement("div");
    icons.className = "icons d-flex align-items-center gap-3";
    icons.innerHTML = `
      <i class="fa-regular fa-heart"></i> <span>Favorite</span>
    `;

    let remove = document.createElement("span");
    remove.innerHTML = `<i class="fa-solid fa-trash"></i> Remove`;
    remove.style.cursor = "pointer";
    remove.onclick = () => {
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.removeItem("cartCleared"); 
      renderCart();
      updateTotals();
      updateCartCount
    };

    updateCartCount();
    icons.appendChild(remove);

    info.append(top, sizeColor, delivery, label, select, icons);
    cartItem.append(img, info);
    cartContainer.appendChild(cartItem);
  });
}

clearAllBtn.onclick = () => {
  cartItems = [];
  localStorage.removeItem("cartItems");
  localStorage.setItem("cartCleared", "true"); 
  renderCart();
  updateTotals();
  updateCartCount();
};

confirmBtn.onclick = () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty! Please add something delicious!");
  } else {
    console.log("Products:", cartItems);
  }
};

async function loadCart() {
  let isCleared = localStorage.getItem("cartCleared");
  let storedCart = localStorage.getItem("cartItems");

  if (isCleared) {
    cartItems = [];
  } else if (storedCart) {
    cartItems = JSON.parse(storedCart);
  } else {
    let products = (await axios("http://localhost:3001/products")).data;
    cartItems = products.map(product => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1
    }));
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  renderCart();
  updateTotals();
}

loadCart();
});