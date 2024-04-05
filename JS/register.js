// НАЗАД
let backButton = document.querySelector("#back");

backButton.addEventListener("click", function() {
    window.location.href = "/html/index.html";
});

// ОШИБКА
function displayErrorMessage(message) {
    let errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(function() {
        errorMessage.style.display = 'none';
    }, 5000);
}

// УСПЕШНО
function displaySuccessfullyMessage(message) {
    let SuccessfullyMessage = document.querySelector('#successfully-message');
    SuccessfullyMessage.textContent = message;
    SuccessfullyMessage.style.display = 'block';

    setTimeout(function() {
        SuccessfullyMessage.style.display = 'none';
    }, 5000); 
}

// Проверки + let
let passwordInput = document.querySelector("#password1");
let repeatPasswordInput = document.querySelector("#repeatpassword1");
let usernameInput = document.querySelector("#username1");
let emailInput = document.querySelector("#email1");
let codeInput = document.querySelector("#codeinput");
let signupButton = document.querySelector("#signupbtn");
let sendCodeButton = document.querySelector("#Sendcode");
let interval;

if (localStorage.getItem('Timer')) {
    startTimer();
}

function startTimer() {
    sendCodeButton.disabled = true;

    let remainingTime = localStorage.getItem('Timer') || 120;
    remainingTime = parseInt(remainingTime);

    localStorage.setItem('Timer', remainingTime);

    interval = setInterval(() => { 
        remainingTime--;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        sendCodeButton.textContent = `Осталось :(${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;

        if (remainingTime <= 0) {
            clearInterval(interval);
            sendCodeButton.disabled = false;
            sendCodeButton.textContent = 'Отправить код';
            setTimeout(() => {
                localStorage.removeItem('Timer');
            }, 1000);
        }

        localStorage.setItem('Timer', remainingTime);
    }, 1000);
}

function validateForm() {
    let passwordValue = passwordInput.value.trim();
    let repeatPasswordValue = repeatPasswordInput.value.trim();
    let usernameValue = usernameInput.value.trim();
    let emailValue = emailInput.value.trim();

    if (!usernameValue || !emailValue || !passwordValue || !repeatPasswordValue) {
        displayErrorMessage("Заполните все поля");
        return false;
    }

    if (passwordValue.length < 8) {
        displayErrorMessage("Пароль должен содержать не менее 8 символов");
        return false;
    }

    if (passwordValue !== repeatPasswordValue) {
        displayErrorMessage("Пароли не совпадают");
        return false;
    }

    return true;
}
        // ОТПРАВКА КОДА
sendCodeButton.addEventListener("click", function () {
    if (!sendCodeButton.disabled) {
        let emailValue = emailInput.value.trim();
        let usernameValue = usernameInput.value.trim();

        fetch('/check_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailValue
            })
        })
            .then(response => response.json())
            .then(emailData => {
                if (emailData.exists) {
                    displayErrorMessage("Пользователь с таким адресом электронной почты уже существует");
                    setTimeout(() => {
                        localStorage.removeItem('Timer');
                    }, 1000);
                } else {
                    fetch('/check_username', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: usernameValue
                        })
                    })
                        .then(response => response.json())
                        .then(usernameData => {
                            if (usernameData.exists) {
                                displayErrorMessage("Пользователь с таким именем уже существует");
                            } else {
                                let verificationCode = Math.floor(100000 + Math.random() * 900000);

                                localStorage.setItem("verifCode", verificationCode);
                                fetch('/send_email', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email: emailValue,
                                        code: verificationCode
                                    })
                                })
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Не стабильное подключение');
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        if (data.success) {
                                            codeInput.classList.add('show');
                                            displaySuccessfullyMessage("Код успешно отправлен");
                                            startTimer();
                                        } else {
                                            displayErrorMessage("Вы не ввели почту");
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                        displayErrorMessage('Ошибка в отправке кода');
                                    });
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            displayErrorMessage('Ошибка при проверке имени пользователя');
                        });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayErrorMessage('Ошибка при проверке адреса электронной почты');
            });
    }
});


// ОБРАТОЧИК КНОПКИ
signupButton.addEventListener("click", function () {
    if (validateForm()) {
        let storedVerificationCode = localStorage.getItem("verifCode");
        let codeValue = codeInput.value.trim();
        if (!storedVerificationCode || storedVerificationCode !== codeValue) {
            displayErrorMessage("Неправильный код верификации");
            return;
        }

        let usernameValue = usernameInput.value.trim();
        let emailValue = emailInput.value.trim();

        // Регистрация пользователя
        fetch('/register_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameValue,
                email: emailValue,
                password: passwordInput.value.trim()
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при регистрации');
                }
                clearInterval(interval);
                localStorage.removeItem('Timer');
                displaySuccessfullyMessage("Вы успешно зарегистрированы");
                localStorage.setItem("login", "true");
                localStorage.removeItem("verifCode");
                window.location.href = "/html/index.html";
            })
            .catch(error => {
                console.error('Error:', error);
                displayErrorMessage('Ошибка при регистрации');
            });
    }
});
