$(document).ready(function () {
    if (sessionStorage.getItem("loggedIn") && sessionStorage.getItem("loggedIn") === "true") {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/api/v1.0/user/user-details",
            headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
            data: { signInId: sessionStorage.getItem("userId") },
            success: function (response) {
                if (response) {
                    document.getElementById("userid").innerText = response.email;
                    let role = response.role;
                    if (role === "ADMIN") {
                        $("#adminButton").show();
                        $("#bookingHistory").show();
                        $("#userButton").hide();
                    } else {
                        $("#adminButton").hide();
                        $("#bookingHistory").hide();
                        $("#userButton").hide();
                    }
                    $("#signInCol").hide();
                    $("#userCol").show();
                } else {
                    sessionStorage.removeItem("loggedIn");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("userId");
                    $("#signInCol").show();
                    $("#userCol").hide();
                }
            },
            error: function (error) {
                sessionStorage.removeItem("loggedIn");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userId");
                $("#signInCol").show();
                $("#userCol").hide();
            }
        });
    } else {
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        $("#signInCol").show();
        $("#userCol").hide();
    }
});

document.getElementById("loginButton").onclick = function () {
    $('#main').load("./page/login.html");
}

document.getElementById("adminButton").onclick = function () {
    $('#main').load("./page/admin.html");
    $("#adminButton").hide();
    $("#bookingHistory").hide();
    $("#userButton").show();
}

document.getElementById("userButton").onclick = function () {
    $('#main').load("./page/user.html");
    $("#adminButton").show();
    $("#bookingHistory").show();
    $("#userButton").hide();
}

document.getElementById("bookingHistory").onclick = function () {
    $('#main').load("./page/booking-history.html");
    $("#adminButton").show();
    $("#bookingHistory").show();
    $("#userButton").hide();
}

document.getElementById("logoutButton").onclick = function () {
    sessionStorage.clear();
    $('#header').load('#header');
    $('#main').load("./page/user.html");
}