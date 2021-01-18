if (localStorage.getItem("autoAccount") !== null) {
    autoLogin()
} else if (localStorage.getItem("currentAccount") !== null) {
    pageAsAutoAccountLoggedIn("currentAccount")
}
var examInfo = [ // change exam display properties here
    {
        "examId": "exam_1",
        "title": "Đề THPT số 16 - Phan Bội Châu - Lần 3",
        "examType": "Trắc nghiệm",
        "dateRelease": "27-6-2020",
    },
    {
        "examId": "exam_1",
        "title": "Đề THPT số 16 - Phan Bội Châu - Lần 3",
        "examType": "Trắc nghiệm",
        "dateRelease": "27-6-2020",
    },
    {
        "examId": "exam_1",
        "title": "Đề THPT số 16 - Phan Bội Châu - Lần 3",
        "examType": "Trắc nghiệm",
        "dateRelease": "27-6-2020",
    },
    {
        "examId": "exam_1",
        "title": "Đề THPT số 16 - Phan Bội Châu - Lần 3",
        "examType": "Trắc nghiệm",
        "dateRelease": "27-6-2020",
    },
    {
        "examId": "exam_1",
        "title": "Đề THPT số 16 - Phan Bội Châu - Lần 3",
        "examType": "Trắc nghiệm",
        "dateRelease": "27-6-2020",
    },
    {
        "examId": "exam_1",
        "title": "Đề THPT số 16 - Phan Bội Châu - Lần 3",
        "examType": "Trắc nghiệm",
        "dateRelease": "27-6-2020",
    }
]
displayExamStored(2, 3, examInfo)

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

function displayExamStored(row, displayPerRow, examIdArr) {
    var displayHolder = $(".display-exam")
    // display 3 exams per row
    var examIdCount = 0
    var htmlText = ""
    for (let i = 1; i <= row; i++) {
        htmlText += `<div class="row bg-light">`
        for (let j = 1; j <= displayPerRow; j++) {
            htmlText +=
                `<a href="database/exam/stored/` + examIdArr[examIdCount].examId + `/display.html" class="col-4 py-3 template-item" exam-data-id="` + examIdArr[examIdCount] + `">
                <img src="database/exam/stored/` + examIdArr[examIdCount].examId + `/thumbnail.jpg" alt="thumbnail" width="100%" class="mb-3">
                <p class="template-title font-weight-bold">` + examIdArr[examIdCount].title + `</p>
                <div class="row">
                    <div class="col-6">
                        <p class="template-muted text-muted">` + examIdArr[examIdCount].examType + `</p>
                    </div>
                    <div class="col-6 text-right text-muted template-muted">
                        ` + examIdArr[examIdCount].dateRelease + `
                    </div>
                </div>
            </a>`
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