// Toastify mesaj funksiyası
function showToast(message, color = "red") {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: color,
    }).showToast();
}

let form = document.querySelector("form");
let usernameInput = document.getElementById("username");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let confirmPasswordInput = document.getElementById("confirm-password");
let passwordStrengthText = document.getElementById("password-icon");
let togglePassword = document.getElementById("toggle-password");

let usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&]).{8,}$/;

passwordInput.addEventListener("input", () => {
    let isValid = passwordRegex.test(passwordInput.value);
    if (passwordInput.value.length === 0) {
        passwordStrengthText.textContent = "";
    } else if (isValid) {
        passwordStrengthText.textContent = "Strong";
        passwordStrengthText.style.color = "green";
    } else {
        passwordStrengthText.textContent = "Weak";
        passwordStrengthText.style.color = "red";
    }
});

togglePassword.addEventListener("click", () => {
    let type = passwordInput.getAttribute("type");
    if (type === "password") {
        passwordInput.setAttribute("type", "text");
        togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.setAttribute("type", "password");
        togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let username = usernameInput.value.trim();
    let email = emailInput.value.trim();
    let password = passwordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    if (!usernameRegex.test(username)) {
        showToast("Username 3-20 characters, only letters/numbers/_/-", "red");
        return;
    }

    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email", "red");
        return;
    }

    if (!passwordRegex.test(password)) {
        showToast("Password is weak. Minimum 8 characters, A-a-0-@", "red");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match.", "red");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    let userExists = users.some(u => u.username === username || u.email === email);
    if (userExists) {
        showToast("This username or email already exists.", "red");
        return;
    }

    let newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showToast("Registration completed successfully!", "green");
    form.reset();
    passwordStrengthText.textContent = "";
    togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    passwordInput.setAttribute("type", "password");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
});
