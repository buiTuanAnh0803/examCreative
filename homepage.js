if (localStorage.getItem("autoAccount") !== null) {
    autoLogin()
} else if (localStorage.getItem("currentAccount") !== null) {
    pageAsAutoAccountLoggedIn("currentAccount")
}
var examIdArr = [ // change exam display properties here
    "exam_1",
    "exam_1",
    "exam_1",
    "exam_1",
    "exam_1",
    "exam_1"
]
displayExamStored(2, 3, examIdArr)

// ================================================================================

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

/* Change the HTML DOM as an account had been logged in */
function pageAsAutoAccountLoggedIn(keyLocalStorage) {
    let userInfo = JSON.parse(localStorage.getItem(keyLocalStorage))

    let userName = userInfo.userName
    $("#greetingText").text("Xin chào, ")
    $("#greetingText").css("font-family", "'Lobster', cursive")
    $("#greetingText").css("font-size", "30px")
    $("#usernameGreetingText").text(userName)
    $("#usernameGreetingText").css("font-size", "40px")
    $("#loginForm").replaceWith(
        `<div id="accountSettings" class="container mt-4">
            <div class="row justify-content-center">
                <img src="images/avatar-person.svg" alt="avatar" width="40%">
            </div>
            <div class="row justify-content-center py-4">
                <span class="text-light">` + userName + `</span>
            </div>
            <ul class="nav d-flex flex-column" style="margin-inline-start: 0;">
                <li class="nav-item">
                    <a class="nav-link bg-light rounded-top pl-2" href="account/manage/info/info.html">
                        <i class="fas fa-user-cog mr-2" style="width: 15px;"></i>
                        Thông tin tài khoản
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link bg-light pl-2" href="account/manage/course/courseManage.html">
                        <i class="fas fa-comments mr-2" style="width: 15px;"></i>
                        Quản lý khoá học
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link bg-light rounded-bottom pl-2" href="account/manage//exam/examManage.html">
                        <i class="fas fa-envelope-open-text mr-2" style="width: 15px;"></i>
                        Quản lý đề thi
                    </a>
                </li>
            </ul>
        </div>
        <a class="nav-link position-absolute d-flex align-items-center" href="index.html" style="bottom: 0;" onclick="logout()">
            <i class="fas fa-sign-out-alt mr-2"></i>
            Đăng xuất
        </a>`
    )
}

function autoLogin() {
    let autoAccount = localStorage.getItem("autoAccount")
    if (autoAccount != undefined && autoAccount != null) {
        pageAsAutoAccountLoggedIn("autoAccount")
    }
}

function manualLogin() {
    let emailInput = $("#loginEmail").val()
    let passwordInput = $("#loginPassword").val()
    let emailAlert = '<div id="emailErr" class="alert alert-danger" role="alert" style="font-size: 12px;">Email này không tồn tại!</div>'
    let passwordAlert = '<div id="passwordErr" class="alert alert-danger" role="alert" style="font-size: 12px;">Mật khẩu không đúng!</div>'

    let checkLogin = login(emailInput, passwordInput)
    if (checkLogin.status == true && checkLogin.isAutoLogin == false) {
        pageAsAutoAccountLoggedIn(emailInput)
    } else if (checkLogin.status == true && checkLogin.isAutoLogin == true) {
        autoLogin()
    } else {
        if (checkLogin.isEmailExisted == false) {
            $("#loginEmail").parent().append(emailAlert)
        } else {
            $("#loginPassword").parent().append(passwordAlert)
        }
    }
}

function login(email, password) {
    let loginStatus = {
        status: false,
        isEmailExisted: false,
        isPasswordMatched: false,
        isAutoLogin: false
    }
    let searchAccount = localStorage.getItem(email)
    if (searchAccount != undefined || searchAccount != null) {
        loginStatus.isEmailExisted = true
        let account = JSON.parse(searchAccount)
        if (password == account.password) {
            localStorage.setItem("currentAccount", searchAccount)
            loginStatus.isPasswordMatched = true
            loginStatus.status = true
            let autoLogin = $("#autoLogin:checked")
            if (autoLogin.length != 0) {
                localStorage.setItem("autoAccount", searchAccount)
            } else {
                localStorage.removeItem("autoAccount")
            }
        }
    } else {
        loginStatus.isPasswordMatched = undefined
    }
    return loginStatus
}

function removeErr(typeInput) {
    let queryInput = "#" + typeInput + "Err"
    if ($(queryInput) != undefined || $(queryInput) != null) {
        $(queryInput).remove()
    }
}

/**
 * Import HTML into .display-exam for display exam item list
 * @param {Number} row row amount to display
 * @param {Number} displayPerRow item amount on a row
 * @param {Array} examIdArr array of exam item to display
 */
function displayExamStored(row, displayPerRow, examIdArr) {
    let displayHolder = $(".display-exam")
    let examIdCount = 0
    for (let i = 0; i < row; i++) {
        let htmlText = `<div class="row bg-light template-list"></div>`
        displayHolder.append(htmlText)
        for (let j = 1; j <= displayPerRow; j++) {
            let examPath = "database/exam/stored/" + examIdArr[examIdCount]
            let examJSPath = examPath + "/examInfo.json"
            let examThumbnailPath = examPath + "/thumbnail.jpg"
            $.getJSON(examJSPath, function (data) {
                $(".display-exam").children().eq(i).append(
                    `<a href="database/exam/stored/display.html" class="col-4 py-3 template-item" exam-data-id="` + examIdArr[examIdCount] + `">
                        <img src="` + examThumbnailPath + `" alt="thumbnail" width="100%" class="mb-3">
                        <p class="template-title font-weight-bold">` + data.title + `</p>
                        <div class="row">
                            <div class="col-6">
                                <p class="template-muted text-muted">` + data.examType + `</p>
                            </div>
                            <div class="col-6 text-right text-muted template-muted">
                                ` + data.dateRelease + `
                            </div>
                        </div>
                    </a>`
                )
            })
            examIdCount++
        }
    }
}

/**
 * Import HTML into .display-exam for display exam item list
 * @param {Number} row row amount to display
 * @param {Number} displayPerRow item amount on a row
 * @param {Array} examIdArr array of exam item to display
 */
function displayCourseStored(row, displayPerRow, examIdArr) {
    let displayHolder = $(".display-course")
    let examIdCount = 0
    let htmlText = ""
    for (let i = 1; i <= row; i++) {
        htmlText += `<div class="row bg-light template-list">`
        for (let j = 1; j <= displayPerRow; j++) {
            let examPath = "database/exam/stored/" + examIdArr[examIdCount] + "/examInfo.json"
            $.getJSON(examPath, function (data) {
                htmlText +=
                `<a href="database/exam/stored/display.html" class="col-4 py-3 template-item" exam-data-id="` + examIdArr[examIdCount] + `">
                    <img src="database/exam/stored/` + examIdArr[examIdCount] + `/thumbnail.jpg" alt="thumbnail" width="100%" class="mb-3">
                    <p class="template-title font-weight-bold">` + data.title + `</p>
                    <div class="row">
                        <div class="col-6">
                            <p class="template-muted text-muted">` + data.examType + `</p>
                        </div>
                        <div class="col-6 text-right text-muted template-muted">
                            ` + data.dateRelease + `
                        </div>
                    </div>
                </a>`
            })
            examIdCount++
        }
        htmlText += `</div>`
    }
    displayHolder.html(htmlText)
}

function logout() {
    localStorage.removeItem("autoAccount")
    localStorage.removeItem("currentAccount")
}