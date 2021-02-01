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

function isRegisterInfoSuccess() {
    removeErrorText('passwordAgain')
    if (checkEmptyInput() == false) {   // check all input field is empty or not
        loadingSpin(false)
        return
    } else {
        if (!isEmailFormatCorrected()) {
            let emailHelp = document.getElementById("emailHelp")
            emailHelp.innerText = "Email này hiện không khả dụng!";
            emailHelp.classList.remove("d-none")
            emailHelp.classList.replace("text-muted", "text-danger")
            alert("Hãy nhập đúng format email.")
        } else {
            let checkEmail = $("#email").attr("email-exist-result")
            if (checkEmail == false || checkEmail == "false") {    // current email doesn't exist in localStage
                if (!checkPasswordAgain()) {    // the re-input password doesn't match with the origimal one
                    let passwordAgainHelp = document.getElementById("passwordAgainHelp")
                    passwordAgainHelp.classList.remove("d-none")
                    alert("Nhập mật khẩu lần hai không trùng khớp.")
                } else {
                    let email = document.getElementById("email");
                    let userName = document.getElementById("name");
                    let passwordRegister = document.getElementById("password");
                    let userInfoToTheMock = {
                        email: email.value,
                        userName: userName.value,
                        password: passwordRegister.value,
                    }
                    $.ajax({
                        url: "https://6010ce9a91905e0017be395b.mockapi.io/account",
                        method: "POST",
                        data: userInfoToTheMock
                    }).done((data) => {
                        if (document.getElementById("checkLoginAfterSuccessfullyRegister").checked) {
                            let userStatus = {
                                id: data.id,
                                autoLogin: true
                            }
                            localStorage.setItem("userStatus", JSON.stringify(userStatus))
                        }
                        alert("Đăng ký tài khoản thành công!")
                        window.location.assign("../../index.html")
                    })
                }
            } else {    // current email existd in localStage
                let emailHelp = document.getElementById("emailHelp")
                emailHelp.innerText = "Email này đã tồn tại, hãy sử dụng email khác!";
                emailHelp.classList.remove("d-none")
                emailHelp.classList.replace("text-muted", "text-danger")
                alert("Email này đã có người sử dụng.")
                $("#email").removeAttr("email-exist-result")
            }
        }
        loadingSpin(false)
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

function registerEmailToTheMock() {
    //  check the register email is existed or not then import result to #email
    let emailRegister = $("#email");
    $.ajax({
        url: "https://6010ce9a91905e0017be395b.mockapi.io/account/?email=" + emailRegister.val(),
        method: "GET",
        beforeSend: function () {
            loadingSpin(true)
        },
        success: function (data) {
            $("#email").attr("email-exist-result", false)
            if (data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if (element.email == emailRegister.val()) {
                        $("#email").attr("email-exist-result", true)
                        break
                    }
                }
            }
        }
    }).done(() => {
        //  check the register form is correct or error
        isRegisterInfoSuccess()
    })
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

/**
 * Display or hide the cover page spinner
 * @param {Boolean} status if status = true, display the spinner; otherwise status = false, hide the spinner
 */
function loadingSpin(status) {
    if (status) {
        $(".cover-loader").removeClass("d-none")
        $(".cover-loader").addClass("d-flex")
    } else {
        $(".cover-loader").removeClass("d-flex")
        $(".cover-loader").addClass("d-none")
    }
}