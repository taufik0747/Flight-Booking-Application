$(function () {
    $("#roasterDate").datepicker({ dateFormat: 'dd/mm/yy' });
});

var roastersForDate = null;

function searchRoaster(e) {
    e.preventDefault();
    const roasterDate = document.getElementById("roasterDate").value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/roaster-for-date",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        data: { "date": roasterDate },
        success: function (roasters) {
            $('#allRoasters').empty();
            if (roasters && roasters.length > 0) {
                roastersForDate = roasters;
                for (let rcount = 0; rcount < roasters.length; rcount++) {
                    const roaster = roasters[rcount];
                    const html = getRoasterFormattedHtml(roaster);
                    $('#allRoasters').append(html);
                    $('#rs-' + roaster.flight.flightId).find('input[type=checkbox]').prop('checked', roaster.status.statusName !== 'NOT-SCHEDULED' && roaster.status.statusName !== 'CANCELLED');
                    $('#rs-' + roaster.flight.flightId).find('label[for=disableRoasterSwitch]').text(roaster.status.statusName);
                }
            } else {
                const html = '<div class="card shadow-sm mb-1 mx-auto" style="width:90%"> <div class="card-body">No flights found to schedule</div></div>';
                $('#allRoasters').append(html);
            }
        },
        error: function (error) {
            console.log(error);
            const html = '<div class="card shadow-sm mb-1 mx-auto" style="width:90%"> <div class="card-body">No flights found to schedule</div></div>';
            $('#allRoasters').append(html);
        }
    });
}

function disableRoasterSwitchAction(event, roasterFlightId) {
    const roaster = roastersForDate.find(rs => rs.flight.flightId === roasterFlightId);
    if (event.target.checked) {
        roaster.status.statusId = 1;
        roaster.status.statusName = "ACTIVE";
        roaster.remarks = "";
    } else {
        roaster.status.statusId = 2;
        roaster.status.statusName = "CANCELLED";
        roaster.remarks = "Cancelled";
    }
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/v1.0/flight/schedule-roaster",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        data: JSON.stringify([roaster]),
        cache: false,
        contentType: 'application/json',
        success: modifiedRoasters => {
            const modifiedRoaster = modifiedRoasters[0];
            $('#rs-' + modifiedRoaster.flight.flightId).find('input[type=checkbox]').prop('checked', modifiedRoaster.status.statusName !== 'NOT-SCHEDULED' && modifiedRoaster.status.statusName !== 'CANCELLED');
            $('#rs-' + modifiedRoaster.flight.flightId).find('label[for=disableRoasterSwitch]').text(modifiedRoaster.status.statusName);
        },
        error: error => {
            console.log(error);
        }
    });
}

function getRoasterFormattedHtml(roaster) {
    return '<div class="card mb-1 mx-auto shadow" style="width:90%" id="rs-' + roaster.flight.flightId + '">' +
        '<div class="card-body">' +
        '<div class="row g-3">' +
        '<div class="col">' + roaster.flight.flightNumber + '</div>' +
        '<div class="col">' + roaster.flight.airline.airlineName + '</div>' +
        '<div class="col">' + roaster.from.cityCode + ' - ' + roaster.to.cityCode + '</div>' +
        '<div class="col">' + roaster.depurture + ' - ' + roaster.arrival + '(Delay ' + roaster.delayTimeInMins + ')' + '</div>' +
        '<div class="col">Business: ' + roaster.businessClassSeatsAvailable + ' @' + roaster.businessClassSeatsPrice + '/-</div>' +
        '<div class="col">Economy: ' + roaster.nonBusinessClassSeatsAvailable + ' @' + roaster.nonBusinessClassSeatsPrice + '/-</div>' +
        '<div class="col">' +
        '<div class="d-inline-block form-check form-switch float-end">' +
        '<input class="form-check-input" type="checkbox" id="disableRoasterSwitch" onchange="disableRoasterSwitchAction(event,' + roaster.flight.flightId + ')">' +
        '<label class="form-check-label" for="disableRoasterSwitch"></label>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}