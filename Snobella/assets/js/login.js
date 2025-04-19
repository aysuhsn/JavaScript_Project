document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (username === "" || password === "") {
        Toastify({
            text: "Username ve sifre mutleqdir!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#f44336"
        }).showToast();
        return;
    }

    let currentUser = users.find(user => 
        (user.username === username || user.email === username) && user.password === password
    );

    if (currentUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
        localStorage.setItem("isLoggedIn", "true");
        Toastify({
            text: "Giris ugurludur!",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#4caf50"
        }).showToast();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } else {
        Toastify({
            text: "Yanlis username ve ya sifre!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#f44336"
        }).showToast();
    }
});