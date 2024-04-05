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
                                                //ВОЙТИ
document.querySelector("#signinbtn").addEventListener("click", function() {
    let username = document.querySelector("#username1").value;
    let password = document.querySelector("#password1").value;
    
    let data = {
        username: username,
        password: password
    };

    fetch('/check_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('login', 'true');
            window.location.href = "/html/index.html";
        } else {
            displayErrorMessage("Неверное имя пользователя или пароль");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
                                                                        //ГЕН КОДА + ОБРАБОТЧИК
document.querySelector("#Forgotpass").addEventListener("click", function() {
    let forgotUsername = document.querySelector("#username1").value;

    if (!forgotUsername) {
        displayErrorMessage("Пожалуйста, введите имя пользователя.");
        return;
    }

    let verificationCode = Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("ForgotCode", verificationCode);

    sendForgotCode(forgotUsername, verificationCode);
});
                                                            //ФУНКИЯ ПО СМЕНЕ
function sendForgotCode(username, code) {
    let data = {
        username: username,
        ForgotCode: code
    };

    fetch('/send_forgot_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.querySelector('#modal-content').classList.add('show');
            displaySuccessfullyMessage("Код верификации успешно отправлен на вашу почту.");
        } else {
            displayErrorMessage("Не удалось отправить код.");
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}
                                                                    //ОКНА
document.querySelector("#cancelChangePassword").addEventListener("click", function() {
    document.querySelector("#modal-content").classList.remove("show");
});

document.querySelector("#cancelChangePassword1").addEventListener("click", function() {
    document.querySelector(".npass").classList.remove("show");
});

document.querySelector("#confirmChangePassword").addEventListener("click", function() {
    let enteredCode = document.querySelector("#changePasswordCode").value;
    let storedCode = localStorage.getItem("ForgotCode");

    if (enteredCode === storedCode) {
        document.querySelector("#modal-content").classList.remove("show");
        document.querySelector(".npass").classList.add("show");
    } else {
        displayErrorMessage("Неверный код");
    }
});
                            //СМЕНА ПАСА
document.querySelector("#confirmChangePassword1").addEventListener("click", function() {
    let newPassword = document.querySelector("#newpassword").value;
    let confirmPassword = document.querySelector("#confnewpassword").value;
    let username = document.querySelector("#username1").value;

    if (newPassword === confirmPassword) {
        fetch('/update_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                new_password: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displaySuccessfullyMessage("Пароль успешно изменен");
                document.querySelector(".npass").classList.remove("show");
            } else {
                displayErrorMessage("Ошибка при изменении пароля: " + data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            displayErrorMessage("Произошла ошибка при обновлении пароля");
        });
    } else {
        displayErrorMessage("Пароли не совпадают");
    }
});
