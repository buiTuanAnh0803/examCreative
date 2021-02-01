beforeLoadingPage()
var examIdArr = [
    "exam_1",
    "exam_1",
    "exam_1",
    "exam_1",
    "exam_1",
    "exam_1"
]
// change exam display properties here, this is the exam list default to display on the homepage
displayExamStored(2, 3, examIdArr)

// ================================================================================

/* Check the user login info before loading page */
function beforeLoadingPage() {
    let userStatusPage = JSON.parse(localStorage.getItem("userStatus"))
    let accessCount = sessionStorage.getItem("accessCount")
    if (accessCount) {
        importUserInfo(userStatusPage.id)
    } else {
        sessionStorage.setItem("accessCount", 0)
        if (userStatusPage) {
            if (userStatusPage.autoLogin) {
                importUserInfo(userStatusPage.id)
            }
        }
    }
}

/* Set the the user login count before unloading page */
window.onbeforeunload = function beforeUnloadingPage() {
    let accessCount = Number(sessionStorage.getItem("accessCount"))
    accessCount++
    sessionStorage.setItem("accessCount", accessCount)
}

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

/**
 * Import the user info into the page content
 * @param {String} userId the user id string store in the database
 */
function importUserInfo(userId) {
    $.ajax({
        url: "https://6010ce9a91905e0017be395b.mockapi.io/account/" + userId,
        method: "GET",
        beforeSend: function () {
            loadingSpin(true)
        },
        success: function (data) {
            let userInfo = data
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
    }).done(() => {
        loadingSpin(false)
    })
}

function manualLogin() {
    if ($("#emailErr").css("display") != "none") {
        toggleError("email")
    }
    if ($("#passwordErr").css("display") != "none") {
        toggleError("password")
    }
    let emailInput = $("#loginEmail").val()
    let passwordInput = $("#loginPassword").val()
    login(emailInput, passwordInput)
    let checkLogin = JSON.parse(sessionStorage.getItem("loginStatus"))
    let userStatus = JSON.parse(localStorage.getItem("userStatus"))
    if (checkLogin.status == true) {
        //  login successfully
        importUserInfo(userStatus.id)
    } else {
        if (!checkLogin.isEmailExisted) {
            if ($("emailErr").css("display") == "none") {
                toggleError("email")
            }
        } else {
            if (!checkLogin.isPasswordMatched) {
                if ($("passwordErr").css("display") != "none") {
                    toggleError("password")
                }
            }
        }
    }
}

function login(email, password) {
    $.ajax({
        url: "https://6010ce9a91905e0017be395b.mockapi.io/account?email=" + email,
        method: "GET",
        beforeSend: function () {
            loadingSpin(true)
        },
        async: false,
        success: function (data) {
            let loginStatus = {
                status: false,
                isEmailExisted: false,
                isPasswordMatched: false,
                isAutoLogin: false
            }
            let userStatus = {
                id: "",
                autoLogin: false
            }
            if (data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if (element.email == email) {
                        loginStatus.isEmailExisted = true
                        if (element.password == password) {
                            loginStatus.isPasswordMatched = true
                            loginStatus.status = true
                            userStatus.id = data[i].id
                            break
                        }
                    }
                }
            }
            if (document.getElementById("autoLogin").checked) {
                loginStatus.isAutoLogin = true
                userStatus.autoLogin = true
            } else {
                userStatus.autoLogin = false
            }
            if (loginStatus.status) {
                localStorage.setItem("userStatus", JSON.stringify(userStatus))
            }
            sessionStorage.setItem("loginStatus", JSON.stringify(loginStatus))
        }
    }).done(() => {
        loadingSpin(false)
    })
}

/**
 * Hide or display the error text base on the typeInput and display property; if displayed, toggle hide otherwise toggle display
 * @param {String} typeInput the error text type
 * - "email": the error text below the email input
 * - "password": the error text below the password input
 */
function toggleError(typeInput) {
    let queryInput = "#" + typeInput + "Err"
    if ($(queryInput) != undefined || $(queryInput) != null) {
        $(queryInput).toggleClass("d-none")
    }
}

/**
 * Hide the error text base on the typeInput
 * @param {String} typeInput the error text type
 * - "email": the error text below the email input
 * - "password": the error text below the password input
 */
function removeErr(typeInput) {
    let queryInput = "#" + typeInput + "Err"
    if ($(queryInput) != undefined || $(queryInput) != null) {
        $(queryInput).addClass("d-none")
    }
}

/**
 * Logout from the current user, acctually is clear browser storage
 */
function logout() {
    localStorage.removeItem("userStatus")
    sessionStorage.removeItem("loginStatus")
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

//  ==============================================================================================================================

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