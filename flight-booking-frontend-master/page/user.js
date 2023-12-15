$(function () {
    console.log(sessionStorage.getItem("loginRedirect"))
    if (sessionStorage.getItem("loginRedirect") && sessionStorage.getItem("loginRedirect") === 'booking') {
        $('#booking').load("./page/booking.html");
    } else {
        $('#booking').load("./page/flight-search.html");
    }
})