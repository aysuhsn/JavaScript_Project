document.addEventListener("DOMContentLoaded", () => {
    let urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get("id");

    let allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    let product = allProducts.find((p) => p.id == productId);
  
    if (!product) {
      document.body.innerHTML = "<h2 style='text-align:center;'>Product not found</h2>";
      return;
    }
  
    let container = document.querySelector(".product-container"); 
    let title = document.querySelector(".product-title");
    let price = document.querySelector(".product-price");
    let description = document.querySelector(".product-description");
    let mainImg = document.querySelector(".main-image");
    let thumbnails = document.querySelector(".thumbnails");
    let addToCartBtn = document.getElementById("add-to-cart");
    let addToFavBtn = document.getElementById("add-to-favorites");
  
    title.textContent = product.title;
    price.textContent = `$${parseFloat(product.price).toFixed(2)}`;
    description.textContent = product.description;
    mainImg.src = product.image;
  
    let images = [product.image, ...(product.images || [])];
    thumbnails.innerHTML = "";
    images.forEach((img, index) => {
      let thumb = document.createElement("img");
      thumb.src = img;
      if (index === 0) thumb.classList.add("active");
      thumb.addEventListener("click", () => {
        document.querySelectorAll(".thumbnails img").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        mainImg.src = img;
      });
      thumbnails.appendChild(thumb);
    });
  
    addToFavBtn.addEventListener("click", () => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
      if (!favorites.includes(product.id.toString())) {
        favorites.push(product.id.toString());
        Toastify({
          text: "Removed from favorites!",
          duration: 1000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      } else {
        favorites = favorites.filter((id) => id != product.id);
        Toastify({
          text: "Removed from favorites!",
          duration: 1000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #f44336, #e57373)",
          },
        }).showToast();
      }
  
      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  
    addToCartBtn.addEventListener("click", () => {
      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  
      let existing = cartItems.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
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
        text: "Səbətə əlavə olundu!",
        duration: 1000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
  
      updateCartCount();
    });
  
    function updateCartCount() {
      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      let count = cartItems.reduce((total, item) => total + item.quantity, 0);
      let cartCountSpan = document.querySelector(".cart-count");
      if (cartCountSpan) {
        cartCountSpan.textContent = count;
      }
    }
  
    updateCartCount();
  
  });

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
      backgroundColor: "#f44336",
    }).showToast();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
} else {
  dropdownButton.textContent = "Sign Up";

  dropdownMenu.innerHTML = `
    <li><a class="dropdown-item" href="register.html">Register</a></li>
    <li><a class="dropdown-item" href="login.html">Login</a></li>
  `;
}