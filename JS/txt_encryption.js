                                                                                                                                        // домой
let HomeButton = document.querySelector("#HOME");

HomeButton.addEventListener("click", function() {
    window.location.href = "/html/index.html";
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

                                                                                                                                        //выполнения шифрования
let encryptText = () => {
    let selectedAlgorithm = document.querySelector('input[name="options"]:checked');
                                                                                                                                        //проверка на выбор типа шифрования
    if (!selectedAlgorithm) {
        displayErrorMessage("Выберите тип шифрования");
        return;
    }

    let InputTxt = document.querySelector("#txtinput").value.trim();
    let ReadyTxt;
    let Algorithm = selectedAlgorithm.value;
                                                                                                                                        //проверка на пустоту в input
    if (InputTxt === "") {
        displayErrorMessage("Введите текст для шифрования");
        return;
    }

    switch (Algorithm) {
        case "md5":
            ReadyTxt = CryptoJS.MD5(InputTxt).toString();
            break;
        case "sha1":
            ReadyTxt = CryptoJS.SHA1(InputTxt).toString();
            break;
        case "sha256":
            ReadyTxt = CryptoJS.SHA256(InputTxt).toString();
            break;
        case "sha512":
            ReadyTxt = CryptoJS.SHA512(InputTxt).toString();
            break;
        case "rc4":
            ReadyTxt = CryptoJS.RC4.encrypt(InputTxt, "secret key").toString();
            break;
        case "base64":
            ReadyTxt = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(InputTxt));
            break;
        default:
            break;
    }

    let readyElement = document.querySelector("#ready");
    readyElement.textContent = ReadyTxt;
    readyElement.classList.add("show");
    let readyICO = document.querySelector("#ICO");
    readyICO.classList.add("show");
}

                                                                                                                                            //копирования текста в буфер обмена
let copyToClipboard = () => {
    let readyText = document.querySelector("#ready").textContent;
    navigator.clipboard.writeText(readyText)
        .then(() => {
            displaySuccessfullyMessage("Текст скопирован в буфер обмена");
        })
        .catch(err => {
            displayErrorMessage("Ошибка при копировании");
            console.error('Ошибка при копировании: ', err);
        });
}

                                                                                                                                                //"Выполнить шифрование"
let readyBtn = document.querySelector("#readybtn");
readyBtn.addEventListener("click", encryptText);

                                                                                                                                                //"Скопировать"
let copyButton = document.querySelector(".ICO");
copyButton.addEventListener("click", copyToClipboard);

                                                                                                                                                //Сообщение об ошибке
function displayErrorMessage(message) {
    let errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  
    setTimeout(function() {
        errorMessage.style.display = 'none';
    }, 5000);
}

                                                                                                                                                //Сообщение об успешном выполнении
function displaySuccessfullyMessage(message) {
    let SuccessfullyMessage = document.querySelector('#successfully-message');
    SuccessfullyMessage.textContent = message;
    SuccessfullyMessage.style.display = 'block';

    setTimeout(function() {
        SuccessfullyMessage.style.display = 'none';
    }, 5000); 
}

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