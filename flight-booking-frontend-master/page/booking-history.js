$(function () {
    const email = sessionStorage.getItem("userId")
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/search-pnr-by-user",
        data: { "email": email },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (pnrDetails) {
            if (pnrDetails && pnrDetails.length > 0) {
                for (let i = 0; i < pnrDetails.length; i++) {
                    const pnrDetail = pnrDetails[i];
                    const html = getPnrFormattedHtml(pnrDetail);
                    $('#pnrs').append(html);
                }
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
})

getPnrFormattedHtml = (pnrDetail) => {
    return '<div class="row g-3 my-1" id="pnr-' + pnrDetail.pnrId + '">' +
        '<div class="col">' + pnrDetail.pnrNumber + '</div>' +
        '<div class="col">' + pnrDetail.totalPnrPrice + '</div>' +
        '<div class="col">' + (pnrDetail.confirmed ? "CONFIRMED" : "NOt CONFIRMED") + '</div>' +
        '<div class="col">' + (pnrDetail.active ? "ACTIVE" : "INACTIVE") + '</div>' +
        '<div class="col"><button type="click" class="btn btn-primary btn-sm" onclick=viewPnrDetails("' + pnrDetail.pnrNumber + '")>view details</button></div>' +
        '</div>';
}

viewPnrDetails = (pnrNumber) => {
    sessionStorage.setItem("pnr", pnrNumber);
    $('#main').load("./page/pnr-details.html");
}