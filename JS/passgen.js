                                                                                                                                        // домой
let HomeButton = document.querySelector("#HOME");

HomeButton.addEventListener("click", function() {
    window.location.href = "/html/index.html";
});

                                                                                                                                        // шифр текста
let txtEncryptionButton = document.querySelector("#txt_encryption");

txtEncryptionButton.addEventListener("click", function() {
    window.location.href = "/html/txt_encryption.html";
});

                                                                                                                                            // login
let loginButton = document.querySelector("#SignUpLogIn");

loginButton.addEventListener("click", function() {
    window.location.href = "/html/login.html";
});

                                                                                                                                        // Обработчик "Сгенерировать пароль"
document.querySelector("#readybtn").addEventListener("click", generatePassword);

                                                                                                                                        // Кол-во символов в пароле
let passLengthSlider = document.querySelector("#passLength");

passLengthSlider.addEventListener("input", function() {
    let passLength = passLengthSlider.value;

    let passLengthDisplay = document.querySelector("#passLengthDisplay");
    passLengthDisplay.textContent = passLength;
});

                                                                                                                                    // генерация пароля
function generatePassword() {
                                                                                                                                    // длина пароля
    let passLength = document.querySelector("#passLength").value;
                                                                                                                                    // значения чекбоксов
    let Numbers = document.querySelector("#NCheckbox").checked;
    let Lowercase = document.querySelector("#LCheckbox").checked;
    let Uppercase = document.querySelector("#UCheckbox").checked;
    let Symbols = document.querySelector("#SCheckbox").checked;
                                                                                                                                    //проверка на выбор опции
    if (!Numbers && !Lowercase && !Uppercase && !Symbols) {
        displayErrorMessage("Выберите хотя бы одну опцию для генерации пароля");
        return;
    }
                                                                                                                                    //проверка на выбора длины
    if (passLength <= 0) {
        displayErrorMessage("Укажите длину пароля больше нуля");
        return;
    }

                                                                                                                                    // доступные символы
    let Values = "";
    if (Numbers) Values += "0123456789";
    if (Lowercase) Values += "abcdefghijklmnopqrstuvwxyz";
    if (Uppercase) Values += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (Symbols) Values += "!@#$%^&*()_+{}[]|\\:;'<>,.?/";

                                                                                                                                    // генерация пароль
    let readypass = "";
    for (let i = 0; i < passLength; i++) {
        readypass += getRandomChar(Values);
    }

    // вывод пароля
    let readyElement = document.querySelector("#ready");
    readyElement.textContent = readypass;
    readyElement.classList.add("show");
    let readyICO = document.querySelector("#ICO");
    readyICO.classList.add("show");
}

                                                                                                                                    // Взятие рандомного числа,Значения,Буквы и т.д
function getRandomChar(characters) {
    return characters.charAt(Math.floor(Math.random() * characters.length));
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