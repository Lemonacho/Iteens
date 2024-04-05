// шифр текста
let txtEncryptionButton = document.querySelector("#txt_encryption");

txtEncryptionButton.addEventListener("click", function() {
    window.location.href = "/html/txt_encryption.html";
});

// генерация пароля
let txtPasswordButton = document.querySelector("#pass_generation");

txtPasswordButton.addEventListener("click", function() {
    window.location.href = "/html/passgen.html";
});

// login
let loginButton = document.querySelector("#SignUpLogIn");

loginButton.addEventListener("click", function() {
    window.location.href = "/html/login.html";
});

// Проверка на логин
function checkLoginStatus() {
    let loginParam = localStorage.getItem("login");

    if (loginParam && loginParam === "true") {
        let signUpLogInButton = document.querySelector("#SignUpLogIn");
        signUpLogInButton.textContent = "Logout";

        signUpLogInButton.addEventListener("click", function() {
            localStorage.removeItem("login");
            window.location.reload();
        });
    }
}

checkLoginStatus();

