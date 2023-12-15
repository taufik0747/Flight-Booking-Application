$(function () {
    const pnrNumber = sessionStorage.getItem("pnr")
    sessionStorage.removeItem("pnr")
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/search-pnr",
        data: { "pnr": pnrNumber },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (pnrDetails) {
            $("#pnr").text(pnrDetails.pnrNumber);
            $("#totalPnrPrice").text(pnrDetails.totalPnrPrice + '/-');
            for (let i = 0; i < pnrDetails.bookings.length; i++) {
                const booking = pnrDetails.bookings[i];
                const roasterHtml = getPnrRoasterFormatterRow(booking);
                $("#roasterRows").append(roasterHtml);
                const tickets = booking.tickets;
                for (let j = 0; j < tickets.length; j++) {
                    const ticket = tickets[j];
                    const ticketHtml = getPnrTicketFormattedHtml(booking, ticket);
                    $("#ticketRows").append(ticketHtml);
                }
            }
        },
        error: function (error) {
            console.log(error)
        }
    });
})

getPnrRoasterFormatterRow = (booking) => {
    return '<tr>' +
        '<td>' + booking.roaster.flight.airline.airlineName + '</td>' +
        '<td>' + booking.roaster.flight.flightNumber + '</td>' +
        '<td>' + booking.roaster.from.cityName + '(' + booking.roaster.from.cityCode + ')' + '</td>' +
        '<td>' + booking.roaster.to.cityName + '(' + booking.roaster.to.cityCode + ')' + '</td>' +
        '<td>' + booking.roaster.roasterDate + '</td>' +
        '<td>' + booking.roaster.depurture + '</td>' +
        '<td>' + booking.roaster.arrival + '</td>' +
        '<td>' + (booking.confirmed ? "Confirmed" : "Not confirmed") + '</td>' +
        '<td>' + (booking.active ? "Active" : "Cancelled") + '</td>' +
        '<td>' + booking.price + '</td>' +
        '</tr>'
}

getPnrTicketFormattedHtml = (booking, ticket) => {
    return '<tr>' +
        '<td>' + ticket.ticketNumber + '</td>' +
        '<td>' + booking.roaster.from.cityCode + ' - ' + booking.roaster.to.cityCode + '</td>' +
        '<td>' + booking.roaster.flight.flightNumber + '</td>' +
        '<td>' + ticket.passengerName + '</td>' +
        '<td>' + ticket.passengerAge + '</td>' +
        '<td>' + ticket.passengerContact + '</td>' +
        '<td>' + ticket.passengerIdentityType + '</td>' +
        '<td>' + ticket.seatType + '</td>' +
        '<td>' +
        '<div class="d-flex">' +
        '<button type="click" class="btn btn-primary btn-sm me-2" onclick=viewTicket("' + ticket.ticketNumber + '") data-bs-toggle="modal" data-bs-target="#ticketDetailsModal"><i class="fa fa-eye" aria-hidden="true"></i></button>' +
        '<button type="click" class="btn btn-primary btn-sm" onclick=downloadTicket("' + ticket.ticketNumber + '")><i class="fa fa-download" aria-hidden="true"></i></button>' +
        '</div>' +
        '</td>' +
        '</tr>';
}

viewTicket = (ticketNumber) => {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/search-ticket",
        data: { "ticket": ticketNumber },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (ticketDetails) {
            console.log(ticketDetails);
            $("#ticketModalTicket").text(ticketDetails.ticketNumber);
            $("#ticketModalpnr").text(ticketDetails.pnrNumber);
            $("#ticketModalFlight").text(ticketDetails.flightNumber);
            $("#ticketModalAirline").text(ticketDetails.airline);
            $("#ticketModalJourneyFrom").text(ticketDetails.fromCityCode + ' (' + ticketDetails.fromCityName + ')');
            $("#ticketModalJourneyTo").text(ticketDetails.toCityCode + ' (' + ticketDetails.toCityName + ')');
            $("#ticketModalJourneyDate").text(ticketDetails.roasterDate);
            $("#ticketModalDeparture").text(ticketDetails.depurture);
            $("#ticketModalArrival").text(ticketDetails.arrival);
            $("#ticketModalRoasterStatus").text(ticketDetails.roasterStatus);
            $("#ticketModalTicketStatus").text(ticketDetails.bookingConfirmed ? 'Confirmed' : 'Not confirmed');
            $("#ticketModalticketPrice").text(ticketDetails.ticketPrice + '/-');
            $("#ticketModalpName").text(ticketDetails.passengerName);
            $("#ticketModalpAge").text(ticketDetails.passengerAge);
            $("#ticketModalpConatct").text(ticketDetails.passengerContact);
            $("#ticketModalpIdentityType").text(ticketDetails.passengerIdentityType);
            $("#ticketModalpSeatType").text(ticketDetails.seatType);
        },
        error: function (error) {
            console.log(error)
        }
    });
}

downloadTicket = (ticketNumber) => {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/download-ticket",
        data: { "ticket": ticketNumber },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        dataType: 'text',
        success: function (response) {
            let pdfbytes = base64ToArrayBuffer(response);
            saveByteArray("ticket-" + ticketNumber, pdfbytes);
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = reportName;
    link.click();
};