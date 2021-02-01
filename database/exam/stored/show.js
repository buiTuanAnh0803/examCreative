let examId = "exam_1"
let examPath = examId + "/examInfo.json"

let submitStatus = false
// this var is used for clearInterval of timeCount()

if (localStorage.getItem("currentAccount") !== null) {
    pageAsAutoAccountLoggedIn("currentAccount")
}
$.getJSON(examPath, (data) => {
    loadExamDesc(data)
})

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
    $("#loginForm").replaceWith(
        `<div id="accountSettings" class="container mt-4">
            <div class="row justify-content-center">
                <img src="../../../../images/avatar-person.svg" alt="avatar" width="40%">
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
        <a class="nav-link position-absolute d-flex align-items-center" href="../../../index.html" style="bottom: 0;" onclick="logout()">
            <i class="fas fa-sign-out-alt mr-2"></i>
            Đăng xuất
        </a>`
    )
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

function logout() {
    localStorage.removeItem("autoAccount")
    localStorage.removeItem("currentAccount")
}

function loadExam() {
    $.getJSON(examPath, function (data) {
        loadExamBody(data)
        loadFeatureExamBody()
    })
}

/**
 * Used to load the exam description into #display
 * @param {Object} examInfo object data get from examInfo.json
 */
function loadExamDesc(examInfo) {
    let creatorInfo = JSON.parse(localStorage.getItem(examInfo.email))
    let minute = examInfo.testDuration.minute
    let second = examInfo.testDuration.second
    if (second > 60) {
        minute += second / 60
        second = second % 60
    }
    if (minute > 60) {
        hour += minute / 60
        minute = minute % 60
    }

    $("#display").html(
        `<div class="row" id="authorInfo">
            <div class="media" style="height: 50px;">
                <img src="../../../../images/avatar-person.svg" class="mr-3" alt="avatar" style="height: 100%;">
                <div class="media-body d-flex flex-column align-items-between justify-content-start"
                    style="height: 100%;">
                    <h5 id="examCreator" class="my-0">` + creatorInfo.userName + `</h5>
                    <p id="examDateRelease" class="my-0">` + examInfo.dateRelease + `</p>
                </div>
            </div>
        </div>
        <div class="row h1 py-3" id="examInfo">
            <img id="examThumbnail" src="` + examId + `/thumbnail.jpg" alt="thumbnail" class="col-4" width="100%">
            <p id="examTitle" class="col-8 d-flex align-items-center mb-0 h2">` + examInfo.title + `</p>
        </div>
        <div class="row" id="examDesc">
            <div class="description w-100">
                <div class="desviews float-left">` + examInfo.attendantAmount + ` lượt thi</div>
                <div class="additional">
                    <svg aria-hidden="true" data-prefix="fal" data-icon="calendar-edit" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor"
                            d="M400 64h-48V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H128V12c0-6.6-5.4-12-12-12h-8c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM48 96h352c8.8 0 16 7.2 16 16v48H32v-48c0-8.8 7.2-16 16-16zm352 384H48c-8.8 0-16-7.2-16-16V192h384v272c0 8.8-7.2 16-16 16zM255.7 269.7l34.6 34.6c2.1 2.1 2.1 5.4 0 7.4L159.1 442.9l-35.1 5c-6.9 1-12.9-4.9-11.9-11.9l5-35.1 131.2-131.2c2-2 5.4-2 7.4 0zm75.2 1.4l-19.2 19.2c-2.1 2.1-5.4 2.1-7.4 0l-34.6-34.6c-2.1-2.1-2.1-5.4 0-7.4l19.2-19.2c6.8-6.8 17.9-6.8 24.7 0l17.3 17.3c6.8 6.8 6.8 17.9 0 24.7z">
                        </path>
                    </svg>
                    ` + examInfo.attendantPurpose + `
                </div>
                <div class="additional">
                    <svg aria-hidden="true" data-prefix="fal" data-icon="clock" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-148.9 88.3l-81.2-59c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v146.3l70.5 51.3c5.4 3.9 6.5 11.4 2.6 16.8l-8.2 11.3c-3.9 5.3-11.4 6.5-16.8 2.6z">
                        </path>
                    </svg>
                    ` + minute + ` phút
                </div>
                <div class="additional">
                    <svg aria-hidden="true" data-prefix="fal" data-icon="calendar-check" role="img"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor"
                            d="M400 64h-48V12c0-6.627-5.373-12-12-12h-8c-6.627 0-12 5.373-12 12v52H128V12c0-6.627-5.373-12-12-12h-8c-6.627 0-12 5.373-12 12v52H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zM48 96h352c8.822 0 16 7.178 16 16v48H32v-48c0-8.822 7.178-16 16-16zm352 384H48c-8.822 0-16-7.178-16-16V192h384v272c0 8.822-7.178 16-16 16zm-66.467-194.937l-134.791 133.71c-4.7 4.663-12.288 4.642-16.963-.046l-67.358-67.552c-4.683-4.697-4.672-12.301.024-16.985l8.505-8.48c4.697-4.683 12.301-4.672 16.984.024l50.442 50.587 117.782-116.837c4.709-4.671 12.313-4.641 16.985.068l8.458 8.527c4.672 4.709 4.641 12.313-.068 16.984z">
                        </path>
                    </svg>
                    ` + examInfo.questionAmount + ` câu hỏi
                </div>
            </div>
        </div>
        <div class="row d-flex justify-content-center py-4">
            <button type="button" class="btn btn-danger" onclick="loadExam()">Bắt đầu làm bài</button>
        </div>`
    )
}

/**
 * Used to load exam body into #examBody
 * @param {Object} examInfo object data get from examInfo.json
 */
function loadExamBody(examInfo) {
    let answeredPerRow = 10
    if (checkCurrentAccountBeforeStartTest() == false) {
        openNav()
        return
    }
    let htmlTextExamBody =
        `<div id="examBody">`
    for (let i = 1; i <= examInfo.questionAmount; i++) {
        htmlTextExamBody +=
            `<div class="question-item">
            <div class="question row" id="question_` + i + `">
                Câu hỏi
            </div>
            <div class="answer row">Trả lời</div>
            <div class="answer-list row">
                <div class="col-3 px-3">
                    <button class="btn btn-light w-100 answer-item" data-answer="a">A</button>
                </div>
                <div class="col-3 px-3">
                    <button class="btn btn-light w-100 answer-item" data-answer="b">B</button>
                </div>
                <div class="col-3 px-3">
                    <button class="btn btn-light w-100 answer-item" data-answer="c">C</button>
                </div>
                <div class="col-3 px-3">
                    <button class="btn btn-light w-100 answer-item" data-answer="d">D</button>
                </div>
            </div>
        </div>`
    }
    htmlTextExamBody += `</div>`
    htmlTextExamBody +=
        `<div class="fixed-bottom bg-light">
            <div class="row align-items-center time-block">
                <div class="col-4 d-flex flex-column align-items-center time">
                    <div class="clock-title pl-2">Thời gian còn lại</div>
                    <div class="clock_block pl-2">
                        <span class="clock_h">` + examInfo.testDuration.hour + `</span>
                        <span class="clock_text">:</span>
                        <span class="clock_m">` + examInfo.testDuration.minute + `</span>
                        <span class="clock_text">:</span>
                        <span class="clock_s">` + examInfo.testDuration.second + `</span>
                    </div>
                </div>
                <div class="col-8 answer-list-conclusion">
                    <div class="row">
                        <div class="answer-title col-12">Các câu đã làm</div>`

    let j = 1
    while (j <= examInfo.questionAmount) {
        htmlTextExamBody += `<div class="answered_block row col-12 d-flex justify-content-between">`
        for (let i = 1; i <= answeredPerRow; i++) {
            htmlTextExamBody += `<a href="#question_` + j + `" class="answered_item">` + j + `</a>`
            j++
        }
        htmlTextExamBody += `</div>`
    }

    htmlTextExamBody +=
        `</div>
                </div>
            </div>
            <div class="row py-2 submit-block">
                <div class="col-12 d-flex justify-content-center">
                    <button type="button" class="btn btn-warning" onclick="submitExam()">
                        Nộp bài
                    </button>
                </div>
            </div>
        </div>`
    $("#display").html(htmlTextExamBody)
    startCountTimer(examInfo)
    $("#sidenavBtn").attr("disabled", true)
}

function loadFeatureExamBody() {
    let qList = document.querySelectorAll(".question")
    let aList = document.querySelectorAll(".answer-list")
    let qStart = 0
    qList.forEach(element => {
        aList[qStart].setAttribute("answer-list-id", qStart + 1)
        element.innerHTML = `<img src="` + examId + `/question-images/q` + (qStart + 1) + `.jpeg" alt="q` + qStart + `" width="100%">`
        qStart++
    });
    $(".answer-item").click(function () {
        $(this).parent().siblings().children().removeClass("btn-primary")
        $(this).parent().siblings().children().addClass("btn-light")
        $(this).removeClass("btn-light")
        $(this).addClass("btn-primary")
        let answerListId = $(this).parent().parent().attr("answer-list-id")
        let chooseAnswer = $(this).attr("data-answer")
        $(this).parent().parent().attr("data-answer-choose", chooseAnswer)
        $(".answered_item").eq(Number(answerListId) - 1).css("background-color", "#167AF6")
        $(".answered_item").eq(Number(answerListId) - 1).css("color", "#FFFFFF")
    })
}

function checkCurrentAccountBeforeStartTest() {
    if (localStorage.getItem("currentAccount") == null) {
        return false
    } else return true
}

function startCountTimer() {
    $.getJSON(examPath, (data) => {
        let hour = data.testDuration.hour
        let minute = data.testDuration.minute
        let second = data.testDuration.second
        if (second > 60) {
            minute += second / 60
            second = second % 60
        }
        if (minute > 60) {
            hour += minute / 60
            minute = minute % 60
        }
        timeShow(hour, minute, second)
        let startCount = setInterval(() => {
            if (submitStatus) {    // this will stop the timeCount
                clearInterval(startCount)
            } else {
                timeCount(data.testDuration)
            }
        }, 1000);
    })
}

function timeCount() {
    let currentTimeDuration = {
        hour: Number($(".clock_h").text()),
        minute: Number($(".clock_m").text()),
        second: Number($(".clock_s").text())
    }
    let nextTimeDuration = {
        hour: 0,
        minute: 0,
        second: 0
    }
    if (currentTimeDuration.second < 1) {
        if (currentTimeDuration.minute < 1) {
            nextTimeDuration.hour = currentTimeDuration.hour - 1
            nextTimeDuration.minute = 59
            nextTimeDuration.second = 59
        } else {
            nextTimeDuration.hour = currentTimeDuration.hour
            nextTimeDuration.minute = currentTimeDuration.minute - 1
            nextTimeDuration.second = 59
        } 
    } else {
        nextTimeDuration.hour = currentTimeDuration.hour
        nextTimeDuration.minute = currentTimeDuration.minute
        nextTimeDuration.second = currentTimeDuration.second - 1
    }
    timeShow(nextTimeDuration.hour, nextTimeDuration.minute, nextTimeDuration.second)
}

/**
 * Convert data type from Numer to String 
 * (ex. 9 hour 30 minute 5 second = "09" hour "30" minute "05" second)
 * @param {Number} hour hour number to convert to string "0<hour>"
 * @param {Number} minute minute number to convert to string "0<minute>"
 * @param {Number} second second number to convert to string "0<second>"
 */
function timeShow(hour, minute, second) {
    let timeDuration = {
        hour: hour,
        minute: minute,
        second: second
    }
    if (hour < 10) {
        timeDuration.hour = "0" + hour.toString()
    } else {
        timeDuration.hour = hour.toString()
    }
    if (minute < 10) {
        timeDuration.minute = "0" + minute.toString()
    } else {
        timeDuration.minute = minute.toString()
    }
    if (second < 10) {
        timeDuration.second = "0" + second.toString()
    } else {
        timeDuration.second = second.toString()
    }
    $(".clock_h").text(timeDuration.hour)
    $(".clock_m").text(timeDuration.minute)
    $(".clock_s").text(timeDuration.second)
}

function submitExam() {
    if (confirm("Bạn có chắc chắn muốn nộp bài?")) {
        submitStatus = true
        scoreCalc()
    }
}

function scoreCalc() {
    $.getJSON(examPath, (data) => {
        let score = 0
        let chooseAnswerList = []
        document.querySelectorAll(".answer-list").forEach(element => {
            if(element.getAttribute("data-answer-choose")) {
                chooseAnswerList.push(element.getAttribute("data-answer-choose"))
            } else {
                chooseAnswerList.push("")
            }
        });

        let checkAnswerIndex = 0
        let answerList = data.answerList
        for (let i = 0; i < answerList.length; i++) {
            if (chooseAnswerList[i] == answerList[i]) {
                score++
                let correctAnswer = $(".answer-list").eq(checkAnswerIndex).find("button.answer-item[data-answer|=" + chooseAnswerList[i] + "]")
                correctAnswer.removeClass("btn-primary")
                correctAnswer.addClass("btn-success")
            } else {
                let correctAnswer = $(".answer-list").eq(checkAnswerIndex).find("button.answer-item[data-answer|=" + answerList[i] + "]")
                correctAnswer.removeClass("btn-light")
                correctAnswer.addClass("btn-danger")
            }
            checkAnswerIndex++
        }
        alert("Bài làm của bạn được " + score + " điểm!")
        $(".fixed-bottom").html(
            `<div class="row d-flex justify-content-center py-2">
                <button type="button" class="btn btn-dark" onclick="returnToExamDesc()">< Quay về</button>
            </div>`
        )
    })
}

function returnToExamDesc() {
    window.location.assign("display.html")
}