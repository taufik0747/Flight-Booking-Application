var request = null;
var response = null;

$(function () {
    const from = sessionStorage.getItem("from");
    const to = sessionStorage.getItem("to");
    const journeyType = sessionStorage.getItem("journeyType");
    const journeyDate = sessionStorage.getItem("journeyDate");
    const returnDate = sessionStorage.getItem("returnDate");
    request = {
        "searchType": journeyType,
        "currentSearch": 1,
        "searchCriterias": [
            {
                "originCityCode": from,
                "destinationCityCode": to,
                "journeyDate": journeyDate
            }
        ],
        "selectedFlights": []
    }
    if (journeyType === 'roundtrip') {
        request.searchCriterias.push({
            "originCityCode": to,
            "destinationCityCode": from,
            "journeyDate": returnDate
        })
    }
    search(request);
});

backToSearch = () => {
    $('#booking').load("./page/flight-search.html");
}

nextSearch = () => {
    console.log($('input:radio[name=flightSelect]:checked').val());
    if ($('input:radio[name=flightSelect]:checked').val()) {
        const selectedArray = $('input:radio[name=flightSelect]:checked').val().split("-");
        request.selectedFlights.push({
            "roasterId": selectedArray[1],
            "seatType": selectedArray[2],
            "seatPrice": selectedArray[3]
        });
        request.currentSearch = response.nextSearch;
        search(request);
    } else {
        alert("Please select one flight to proceed")
    }

}

bookTrips = () => {
    sessionStorage.setItem("selectedFlights", JSON.stringify(response.selectedFlights));
    $('#booking').load("./page/booking.html");
}

search = (request) => {
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/v1.0/flight/search",
        data: JSON.stringify(request),
        cache: false,
        contentType: 'application/json',
        success: function (flightSearchResults) {
            response = flightSearchResults;
            $('#selectedFlights').empty();
            $('#searchResult').empty();
            $('#activeSearchCriteria').empty();
            const currentSearchCriteria = flightSearchResults.request.searchCriterias[flightSearchResults.currentSearch - 1];
            if (!(flightSearchResults.currentSearch === 0 && flightSearchResults.nextSearch === 0)) {
                if (flightSearchResults.searchResults && flightSearchResults.searchResults.length > 0) {
                    $('#activeSearchCriteria').html('<div class="card mb-2 shadow">' +
                        '<div class="card-body"><h5>Showing results for ' + currentSearchCriteria.originCityCode + ' to ' + currentSearchCriteria.destinationCityCode + ' on ' + currentSearchCriteria.journeyDate + '</h5></div>' +
                        '</div>');
                    for (let rcount = 0; rcount < flightSearchResults.searchResults.length; rcount++) {
                        const availableRoaster = flightSearchResults.searchResults[rcount];
                        const html = getRoasterFormattedHtml(availableRoaster);
                        $('#searchResult').append(html);
                    }
                } else {
                    const html = '<div class="card shadow-sm mb-1"> <div class="card-body">No flights availabe for this journey</div></div>';
                    $('#searchResult').html(html);
                    $('#bookButton').hide();
                    $('#nextTripButton').hide();
                }
            }
            if (flightSearchResults.selectedFlights && flightSearchResults.selectedFlights.length > 0) {
                $('#selectedFlights').append('<div class="card mb-2 shadow">' +
                    '<div class="card-body"><h5>Selected flights</h5></div>' +
                    '</div>');
                for (let rcount = 0; rcount < flightSearchResults.selectedFlights.length; rcount++) {
                    const selectedFlight = flightSearchResults.selectedFlights[rcount];
                    const html = getSelectedFlightFormattedHtml(selectedFlight);
                    $('#selectedFlights').append(html);
                }
            }
            if (flightSearchResults.nextSearch === 0) {
                $('#nextTripButton').html("Preview selection");
                if (flightSearchResults.currentSearch === 0) {
                    $('#bookButton').show();
                    $('#nextTripButton').hide();
                } else {
                    $('#bookButton').hide();
                    $('#nextTripButton').show();
                }
            } else {
                $('#bookButton').hide();
                $('#nextTripButton').show();
            }
        },
        error: function (flightSearchError) {
            console.log(flightSearchError);
            const html = '<div class="card shadow-sm mb-1"> <div class="card-body">No flights availabe for this journey</div></div>';
            $('#searchResult').html(html);
            $('#bookButton').hide();
            $('#nextTripButton').hide();
        }
    })
}

getRoasterFormattedHtml = (availableRoaster) => {
    return '<div class="card mb-1 shadow" id="rs-' + availableRoaster.roasterId + '">' +
        '<div class="card-body">' +
        '<div class="row g-3">' +
        '<div class="col">' + availableRoaster.flight.airline.airlineName + '</div>' +
        '<div class="col">' + availableRoaster.flight.flightNumber + '</div>' +
        '<div class="col">' + availableRoaster.depurture + ' - ' + availableRoaster.arrival + ' (Delay ' + availableRoaster.delayTimeInMins + ')' + '</div>' +
        '<div class="col">' + availableRoaster.flight.meal.mealType + '</div>' +
        '<div class="col"><div class="form-check">' +
        '<input class="form-check-input" type="radio" name="flightSelect" id="flightSelect" value="r-' + availableRoaster.roasterId + '-ECONOMY-' + availableRoaster.nonBusinessClassSeatsPrice + '">' +
        '<label class="form-check-label" for="flightSelect">' +
        'Economy: ' + availableRoaster.nonBusinessClassSeatsPrice +
        '</label>' +
        '</div></div>' +
        '<div class="col"><div class="form-check">' +
        '<input class="form-check-input" type="radio" name="flightSelect" id="flightSelect" value="r-' + availableRoaster.roasterId + '-BUSINESS-' + availableRoaster.businessClassSeatsPrice + '">' +
        '<label class="form-check-label" for="flightSelect">' +
        'Business: ' + availableRoaster.businessClassSeatsPrice +
        '</label>' +
        '</div></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}

getSelectedFlightFormattedHtml = (selectedFlight) => {
    return '<div class="card mb-1 shadow" id="fl-' + selectedFlight.roasterId + '">' +
        '<div class="card-body">' +
        '<div class="row g-3">' +
        '<div class="col">' + selectedFlight.roaster.flight.airline.airlineName + '</div>' +
        '<div class="col">' + selectedFlight.roaster.flight.flightNumber + '</div>' +
        '<div class="col">' + selectedFlight.roaster.from.cityCode + ' - ' + selectedFlight.roaster.to.cityCode + '</div>' +
        '<div class="col">' + selectedFlight.roaster.depurture + ' - ' + selectedFlight.roaster.arrival + ' (Delay ' + selectedFlight.roaster.delayTimeInMins + ')' + '</div>' +
        '<div class="col">' + selectedFlight.roaster.flight.meal.mealType + '</div>' +
        '<div class="col">' + selectedFlight.seatType + '</div>' +
        '<div class="col">' + selectedFlight.seatPrice + '/-</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}