$(function () {
    const loggedIn = sessionStorage.getItem("loggedIn");
    sessionStorage.setItem("loginRedirect", 'booking');
    if (!sessionStorage.getItem("loggedIn") || sessionStorage.getItem("loggedIn") !== 'true') {
        $('#main').load("./page/login.html");
    } else {
        const userId = sessionStorage.getItem("userId");
        const token = sessionStorage.getItem("token");
        const selectedFlights = JSON.parse(sessionStorage.getItem("selectedFlights"));
        getSelectedFlights(selectedFlights);
        const html = getPassengerFormFormatted(1);
        document.getElementById("passengerFormDiv").innerHTML = html;
    }
})

getSelectedFlights = (selectedFlights) => {
    let request = {
        "currentSearch": 0,
        "selectedFlights": []
    };
    selectedFlights.forEach(flight => {
        request.selectedFlights.push({
            "roasterId": flight.roasterId,
            "seatType": flight.seatType,
            "seatPrice": flight.seatPrice
        });
    });
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/v1.0/flight/search",
        data: JSON.stringify(request),
        cache: false,
        contentType: 'application/json',
        success: function (flightSearchResults) {
            if (flightSearchResults.selectedFlights && flightSearchResults.selectedFlights.length > 0) {
                for (let rcount = 0; rcount < flightSearchResults.selectedFlights.length; rcount++) {
                    const selectedFlight = flightSearchResults.selectedFlights[rcount];
                    const html = getSelectedFlightFormattedHtml(selectedFlight);
                    $('#selectedFlights').append(html);
                }
            }
        }
    });
}

applyCoupon = (e) => {
    e.preventDefault();
    document.getElementById("copunApplyStatusSuccess").innerHTML = '';
    document.getElementById("copunApplyStatusError").innerHTML = '';
    const couponName = document.getElementById("coupon").value;
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/get-by-coupon-name",
        data: { "name": couponName },
        success: function (coupons) {
            if (coupons && coupons.length > 0) {
                const coupon = coupons[0];
                document.getElementById("copunApplyStatusSuccess").innerHTML = '<input type="hidden" id="couponId" value="' + coupon.couponId + '"></span><i class="fa fa-check" aria-hidden="true"></i> Coupon applied successfully.';
            } else {
                document.getElementById("copunApplyStatusError").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Not able to apply coupon.';
            }
        },
        error: function (error) {
            console.log(error);
            document.getElementById("copunApplyStatusError").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Not able to apply coupon.';
        }
    });
}

getPassengerForm = (e) => {
    e.preventDefault();
    const numberOfPassenger = e.target.value;
    var html = ''
    for (var i = 0; i < numberOfPassenger; i++) {
        html = html + getPassengerFormFormatted(i + 1);
    }
    document.getElementById("passengerFormDiv").innerHTML = html;
}

getSelectedFlightFormattedHtml = (selectedFlight) => {
    return '<div class="row g-3" id="fl-' + selectedFlight.roasterId + '">' +
        '<div class="col">' + selectedFlight.roaster.flight.airline.airlineName + '</div>' +
        '<div class="col">' + selectedFlight.roaster.flight.flightNumber + '</div>' +
        '<div class="col">' + selectedFlight.roaster.from.cityCode + ' - ' + selectedFlight.roaster.to.cityCode + '</div>' +
        '<div class="col">' + selectedFlight.roaster.depurture + ' - ' + selectedFlight.roaster.arrival + ' (Delay ' + selectedFlight.roaster.delayTimeInMins + ')' + '</div>' +
        '<div class="col">' + selectedFlight.roaster.flight.meal.mealType + '</div>' +
        '<div class="col">' + selectedFlight.seatType + '</div>' +
        '<div class="col">' + selectedFlight.seatPrice + '/-</div>' +
        '</div>' +
        '</div>';
}

getPassengerFormFormatted = (id) => {
    return '<div id="pass-' + id + '" class="row mb-1 g-3">' +
        '<div class="col-3">' +
        '<input type="text" class="form-control" id="name" name="name">' +
        '</div>' +
        '<div class="col-1">' +
        '<input type="text" class="form-control" id="age" name="age">' +
        '</div>' +
        '<div class="col-2">' +
        '<input type="text" class="form-control" id="phone" name="phone">' +
        '</div>' +
        '<div class="col-2">' +
        '<select class="form-select" aria-label="Security Type" id="securityType" name="securityType">' +
        '<option value="AADHAR" selected>AADHAR</option>' +
        '<option value="PAN">PAN</option>' +
        '<option value="VOTAR">VOTAR</option>' +
        '</select>' +
        '</div>' +
        '<div class="col-4">' +
        '<input type="text" class="form-control" id="securityNumber" name="securityNumber">' +
        '</div>' +
        '</div >'
}

bookTrips = () => {
    document.getElementById("bookingError").innerText = "";
    document.getElementById("passengerNotAddedMessage").innerText = "";
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    const selectedFlights = JSON.parse(sessionStorage.getItem("selectedFlights"));
    let couponId = document.getElementById("couponId") ? document.getElementById("couponId").value : null;
    let passengerCount = document.getElementById("passengerCount").value;
    let bookingRequest = {
        "bookings": [],
        "user": {
            "email": userId
        }
    }
    selectedFlights.forEach(flight => {
        let roasterPrice = flight.seatPrice * passengerCount;
        let tickets = [];
        for (let i = 0; i < passengerCount; i++) {
            let name = document.getElementsByName("name")[i].value;
            let age = document.getElementsByName("age")[i].value;
            let phone = document.getElementsByName("phone")[i].value;
            let securityType = document.getElementsByName("securityType")[i].value;
            let securityNumber = document.getElementsByName("securityNumber")[i].value;
            if (!name || !age || !phone || !securityType || !securityNumber) {
                document.getElementById("passengerNotAddedMessage").innerText = "Provide all passenger details";
                return;
            } else {
                tickets.push({
                    "passengerAge": age,
                    "passengerContact": phone,
                    "passengerIdentityNumber": securityNumber,
                    "passengerIdentityType": securityType,
                    "passengerName": name,
                    "seatType": flight.seatType
                });
            }
        }
        let flightDetails = {
            "appliedCoupon": {
                "couponId": couponId
            },
            "numberOfPassengers": passengerCount,
            "price": roasterPrice,
            "roaster": {
                "roasterId": flight.roasterId
            },
            "tickets": tickets
        }
        bookingRequest.bookings.push(flightDetails);
    });
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/v1.0/flight/book",
        data: JSON.stringify(bookingRequest),
        cache: false,
        contentType: 'application/json',
        success: function (bookingResponse) {
            sessionStorage.removeItem("journeyType");
            sessionStorage.removeItem("to");
            sessionStorage.removeItem("journeyDate");
            sessionStorage.removeItem("selectedFlights");
            sessionStorage.removeItem("returnDate");
            sessionStorage.removeItem("loginRedirect");
            sessionStorage.removeItem("from");
            sessionStorage.setItem("pnr", bookingResponse.pnrNumber);
            $('#main').load("./page/pnr-details.html");
        },
        error: function (bookingErrorResponse) {
            document.getElementById("bookingError").innerText = "Not able to complete booking";
        }
    });
}
