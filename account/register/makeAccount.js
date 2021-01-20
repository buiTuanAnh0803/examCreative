function showPassword1() {
    var password = document.getElementById("password");
    var toggle = document.getElementById("showPassword")
    if (password.type === "password") {
        password.type = "text";
        toggle.classList.add("showed")
    } else {
        password.type = "password";
        toggle.classList.remove("showed")
    }
}

function showPassword2() {
    var passwordAgain = document.getElementById("passwordAgain");
    var toggle = document.getElementById("showPasswordAgain")
    if (passwordAgain.type === "password") {
        passwordAgain.type = "text";
        toggle.classList.add("showed")
    } else {
        passwordAgain.type = "password";
        toggle.classList.remove("showed")
    }
}

function registerEmailToLocalStorage() {
    removeErrorText('passwordAgain')
    if (checkEmptyInput() == false) {   // check all input field is empty or not
        return
    } else {
        if (isEmailFormatCorrected() == false) {
            let emailHelp = document.getElementById("emailHelp")
            emailHelp.innerText = "Email này hiện không khả dụng!";
            emailHelp.classList.remove("d-none")
            emailHelp.classList.replace("text-muted", "text-danger")
            alert("Hãy nhập đúng format email.")
        } else {
            if (isEmailExisted() == false) {    // current email doesn't exist in localStage
                if (checkPasswordAgain() == false) {    // the re-input password doesn't match with the origimal one
                    let passwordAgainHelp = document.getElementById("passwordAgainHelp")
                    passwordAgainHelp.classList.remove("d-none")
                    alert("Nhập mật khẩu lần hai không trùng khớp.")
                } else {
                    let email = document.getElementById("email");
                    let userName = document.getElementById("name");
                    let passwordRegister = document.getElementById("password");
                    let userInfoToLocalStorage = {
                        email: email.value,
                        userName: userName.value,
                        password: passwordRegister.value,
                    }
                    localStorage.setItem(email.value, JSON.stringify(userInfoToLocalStorage))
                    if (document.getElementById("checkLoginAfterSuccessfullyRegister").checked) {
                        localStorage.setItem("currentAccount", JSON.stringify(userInfoToLocalStorage))
                        localStorage.setItem("autoAccount", JSON.stringify(userInfoToLocalStorage))
                    }
                    alert("Đăng ký tài khoản thành công!")
                    window.location.assign("../../index.html")
                }
            } else {    // current email existd in localStage
                let emailHelp = document.getElementById("emailHelp")
                emailHelp.innerText = "Email này đã tồn tại, hãy sử dụng email khác!";
                emailHelp.classList.remove("d-none")
                emailHelp.classList.replace("text-muted", "text-danger")
                alert("Email này đã có người sử dụng.")
            }
        }
    }
}

function checkEmptyInput() {
    let result = true
    let email = document.getElementById("email");
    let userName = document.getElementById("name");
    let password = document.getElementById("password");
    let emailHelp = document.getElementById("emailHelp");
    let userNameHelp = document.getElementById("nameHelp");
    let passwordHelp = document.getElementById("passwordHelp");
    if (email.value == "") {
        emailHelp.innerText = "Email không được để trống!";
        emailHelp.classList.remove("d-none")
        emailHelp.classList.replace("text-muted", "text-danger")
        result = false
    }
    if (userName.value == "") {
        userNameHelp.classList.remove("d-none")
        result = false
    }
    if (password.value == "") {
        passwordHelp.classList.remove("d-none")
        result = false
    }
    return result
}

function isEmailFormatCorrected() {
    let result = true
    let emailRegister = document.getElementById("email");
    if (emailRegister.value.match(/@[A-z]/) == undefined || emailRegister.value.match(/@[A-z]/) == null) {
        result = false
    }
    return result
}

function isEmailExisted() {
    let result = true
    let emailRegister = document.getElementById("email");
    let queryId = localStorage.getItem(emailRegister.value)
    if (queryId == undefined) {
        result = false
    }
    return result
}

function checkPasswordAgain() {
    let result = true
    let password1 = document.getElementById("password").value
    let password2 = document.getElementById("passwordAgain").value
    if (password1 !== password2) {
        result = false
    }
    return result
}

function removeErrorText(field) {
    let fieldHelp = document.getElementById(field + "Help")
    if (fieldHelp.classList.contains("text-danger")) {
        fieldHelp.classList.add("d-none")
    }
}