var userInfo = JSON.parse(localStorage.getItem("currentAccount"))
$("#userNameLeft").text(userInfo.userName)
$("#emailShow").text(userInfo.email)
$("#userNameShow").text(userInfo.userName)
$("#passwordShowInput").val(userInfo.password)

// ================================================================================

function showPassword() {
    var passwordAgain = document.getElementById("passwordShowInput");
    var toggle = document.getElementById("showPassword")
    if (passwordAgain.type === "password") {
        passwordAgain.type = "text";
        toggle.classList.add("showed")
    } else {
        passwordAgain.type = "password";
        toggle.classList.remove("showed")
    }
}

function logout() {
    localStorage.removeItem("autoAccount")
    localStorage.removeItem("currentAccount")
}