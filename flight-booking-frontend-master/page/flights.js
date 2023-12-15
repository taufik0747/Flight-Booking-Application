$(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/all-airlines",
        data: { "include-inactive": false },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: (airlines) => {
            if (airlines) {
                for (let airlineCount = 0; airlineCount < airlines.length; airlineCount++) {
                    $('#airlineList').append(new Option(airlines[airlineCount].airlineName, airlines[airlineCount].airlineId));
                }
            }
        }
    })
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/all-meals",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: (meals) => {
            if (meals) {
                for (let mealCount = 0; mealCount < meals.length; mealCount++) {
                    const meal = meals[mealCount];
                    const html = '<div class="form-check form-check-inline">' +
                        '<input class="form-check-input" type="radio" id="meal" value="' + meal.mealId + '" onchange=mealSelectionChange(' + meal.mealId + ',event)>' +
                        '<label class="form-check-label" for="meal">' + meal.mealType + '</label>' +
                        '</div>'
                    $('#mealRadioContainers').append(html);
                }
            }
        }
    })
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/all-operating-cities",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (response) {
            if (response) {
                for (let cityCount = 0; cityCount < response.length; cityCount++) {
                    $('#cityList').append(new Option(response[cityCount].cityCode + ':' + response[cityCount].cityName, response[cityCount].cityId));
                }
            }
        }
    });
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/all-flight",
        data: { "include-inactive": true },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (response) {
            $('#allFlights').empty();
            if (response && response.length > 0) {
                for (let flightCoult = 0; flightCoult < response.length; flightCoult++) {
                    const flight = response[flightCoult];
                    const html = getFlightFormattedHtml(flight);
                    $('#allFlights').append(html);
                    $('#fl-' + flight.flightId).find('input[type=checkbox]').prop('checked', flight.active);
                    $('#fl-' + flight.flightId).find('label[for=disableFlightSwitch]').text(flight.active ? "Disable" : "Enable");
                    $('#fl-' + flight.flightId).find('#journeyDaysContainer')
                        .append('<span class="me-2">' + (flight.onSunday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Sunday</span>')
                        .append('<span class="me-2">' + (flight.onMonday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Monday</span>')
                        .append('<span class="me-2">' + (flight.onTuesday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Tuesday</span>')
                        .append('<span class="me-2">' + (flight.onWednesday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Wednesday</span>')
                        .append('<span class="me-2">' + (flight.onThursday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Thursday</span>')
                        .append('<span class="me-2">' + (flight.onFriday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Friday</span>')
                        .append('<span class="me-2">' + (flight.onSaturday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Saturday</span>');
                }
            } else {
                const html = '<div class="card shadow-sm mb-3 mx-auto"> <div class="card-body">No flights found</div></div>'
                $('#allFlights').append(html);
            }
        }
    });
});

flightAddForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("flightAddErrorMessage").innerText = "";
    const airline = flightAddForm.airline.value;
    const flightNumber = flightAddForm.flightNumber.value;
    const instrument = flightAddForm.instrument.value;
    const from = flightAddForm.from.value;
    const to = flightAddForm.to.value;
    const startTime = flightAddForm.startTimeHour.value + ":" + flightAddForm.startTimeMinute.value;
    const endTime = flightAddForm.endTimeHour.value + ":" + flightAddForm.endTimeMinute.value;
    const duration = flightAddForm.durationHour.value + " h " + flightAddForm.durationMinute.value + " m";
    const sunday = flightAddForm.sunday.checked;
    const monday = flightAddForm.monday.checked;
    const tuesday = flightAddForm.tuesday.checked;
    const wednesday = flightAddForm.wednesday.checked;
    const thursday = flightAddForm.thursday.checked;
    const friday = flightAddForm.friday.checked;
    const saturday = flightAddForm.saturday.checked;
    const businessClassSeatCount = flightAddForm.businessClassSeatCount.value;
    const businessClassSeatPrice = flightAddForm.businessClassSeatPrice.value;
    const nonBusinessClassSeatCount = flightAddForm.nonBusinessClassSeatCount.value;
    const nonBusinessClassSeatPrice = flightAddForm.nonBusinessClassSeatPrice.value;
    const rowCount = flightAddForm.rowCount.value;
    const columnCount = flightAddForm.columnCount.value;
    const meal = flightAddForm.meal.value;
    if (!airline || !flightNumber || !instrument || !from || !to
        || !startTimeHour || !startTimeMinute || !endTimeHour || !endTimeMinute || !durationHour || !durationMinute
        || !businessClassSeatCount || !businessClassSeatPrice || !nonBusinessClassSeatCount || !nonBusinessClassSeatPrice
        || !rowCount || !columnCount || !meal) {
        document.getElementById("flightAddErrorMessage").innerText = "Please provide required inputs";
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1.0/flight/add-flight",
            headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
            data: JSON.stringify([{
                "active": true,
                "airline": {
                    "airlineId": airline
                },
                "startTime": startTime,
                "endTime": endTime,
                "duration": duration,
                "flightNumber": flightNumber,
                "from": {
                    "cityId": from
                },
                "to": {
                    "cityId": to
                },
                "instrument": instrument,
                "nonBusinessClassSeats": nonBusinessClassSeatCount,
                "nonBusinessClassSeatsPrice": nonBusinessClassSeatPrice,
                "onSunday": sunday,
                "onMonday": monday,
                "onTuesday": tuesday,
                "onWednesday": wednesday,
                "onThursday": thursday,
                "onFriday": friday,
                "onSaturday": saturday,
                "businessClassSeats": businessClassSeatCount,
                "businessClassSeatsPrice": businessClassSeatPrice,
                "rowCount": rowCount,
                "columnCount": columnCount,
                "meal": {
                    "mealId": meal
                }
            }]),
            cache: false,
            contentType: 'application/json',
            success: function (flightSavedResponse) {
                $('#flightAddForm').trigger("reset");
                if (flightSavedResponse && flightSavedResponse.length > 0) {
                    for (let flightCoult = 0; flightCoult < flightSavedResponse.length; flightCoult++) {
                        const flight = flightSavedResponse[flightCoult];
                        console.log(flight)
                        const html = getFlightFormattedHtml(flight);
                        $('#allFlights').append(html);
                        $('#fl-' + flight.flightId).find('input[type=checkbox]').prop('checked', flight.active);
                        $('#fl-' + flight.flightId).find('label[for=disableFlightSwitch]').text(flight.active ? "Disable" : "Enable");
                        $('#fl-' + flight.flightId).find('#journeyDaysContainer')
                            .append('<span class="me-2">' + (flight.onSunday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Sunday</span>')
                            .append('<span class="me-2">' + (flight.onMonday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Monday</span>')
                            .append('<span class="me-2">' + (flight.onTuesday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Tuesday</span>')
                            .append('<span class="me-2">' + (flight.onWednesday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Wednesday</span>')
                            .append('<span class="me-2">' + (flight.onThursday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Thursday</span>')
                            .append('<span class="me-2">' + (flight.onFriday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Friday</span>')
                            .append('<span class="me-2">' + (flight.onSaturday ? '<i class="fa fa-check" aria-hidden="true"></i>' : '<i class="fa fa-times" aria-hidden="true"></i>') + ' Saturday</span>');
                    }
                }
                document.getElementById("flightAddSuccessMessage").innerText = "Flights saved successfully.";
            },
            error: function (flightSavedError) {
                document.getElementById("flightAddErrorMessage").innerText = "Not able to save records. Please try later.";
            }
        })
    }
});

function mealSelectionChange(mealId, event) {
    $('input[id="meal"]').prop('checked', false);
    $('input[id="meal"]').filter('[value="' + mealId + '"]').prop('checked', true);
}

function disableFlightSwitchAction(event, flightId) {
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/api/v1.0/flight/change-flight-status",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        data: { flightId: flightId, status: event.target.checked },
        dataType: 'text',
        success: modifiedflightId => {
            $('#fl-' + modifiedflightId).find('input[type=checkbox]').prop('checked', event.target.checked);
            $('#fl-' + modifiedflightId).find('label[for=disableFlightSwitch]').text(event.target.checked ? "Disable" : "Enable");
        },
        error: error => {
            console.log(error);
        }
    });
}

function getFlightFormattedHtml(flight) {
    const html = '<div class="card mb-3 mx-auto shadow" style="width:90%" id="fl-' + flight.flightId + '">' +
        '<div class="card-body">' +
        '<div class="d-inline-block">' +
        '<img src="data:image/' + flight.airline.airlineLogoType + ';base64,' + flight.airline.airlineLogo + '" class="img-fluid align-middle img-logo" alt="logo">' +
        '<div>' + flight.flightNumber + '</div>' +
        '<div>' + flight.airline.airlineName + '</div>' +
        '</div>' +
        '<div class="d-inline-block mx-3" style="font-size: 14px;">' +
        '<div>' +
        '<span class="me-3">' + flight.from.cityCode + ' - ' + flight.to.cityCode + '</span>' +
        '<span class="me-3">' + flight.instrument + '</span>' +
        '<span class="me-3">' + flight.meal.mealType + '</span>' +
        '</div>' +
        '<div>' +
        '<div id="journeyDaysContainer">' +
        '<span class="me-3"><b><i class="fa fa-calendar" aria-hidden="true"></i></b></span>' +
        '</div>' +
        '<div>' +
        '<span class="me-3"><b><i class="fa fa-hourglass-half" aria-hidden="true"></i></b></span>' +
        '<span class="me-2">' + flight.startTime + ' - ' + flight.endTime + ' (' + flight.duration + ')</span>' +
        '</div>' +
        '<div>' +
        '<span class="me-2"><b><i class="fa fa-inr" aria-hidden="true"></i></b></span>' +
        '<span class="me-2"><b>Economy</b> ' + flight.nonBusinessClassSeats + ' seats @' + flight.nonBusinessClassSeatsPrice + '/-</span>' +
        '<span class="me-2"><b>Business</b> ' + flight.businessClassSeats + ' seats @' + flight.businessClassSeatsPrice + '/-</span>' +
        '</div>' +
        '<div>' +
        '<span class="me-2"><b>Row</b> ' + flight.rowCount + '</span>' +
        '<span class="me-2"><b>Count</b> ' + flight.columnCount + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="d-inline-block form-check form-switch float-end">' +
        '<input class="form-check-input" type="checkbox" id="disableFlightSwitch" onchange="disableFlightSwitchAction(event,' + flight.flightId + ')">' +
        '<label class="form-check-label" for="disableFlightSwitch"></label>' +
        '</div>' +
        '</div>' +
        '</div>';
    return html;
}