var userInfo = JSON.parse(localStorage.getItem("currentAccount"))
$("#userNameLeft").text(userInfo.userName)

// ================================================================================

function logout() {
    localStorage.removeItem("autoAccount")
    localStorage.removeItem("currentAccount")
}