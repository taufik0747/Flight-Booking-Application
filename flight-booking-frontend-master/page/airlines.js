$(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/all-airlines",
        data: { "include-inactive": true },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (response) {
            $('#allAirlines').empty();
            if (response && response.length > 0) {
                for (let airlineCoult = 0; airlineCoult < response.length; airlineCoult++) {
                    const airline = response[airlineCoult];
                    const html = getAirlineFormattedHtml(airline);
                    $('#allAirlines').append(html);
                    $('#al-' + airline.airlineId).find('input[type=checkbox]').prop('checked', airline.active);
                    $('#al-' + airline.airlineId).find('label[for=disableAirlineSwitch]').text(airline.active ? "Disable" : "Enable");
                }
            } else {
                const html = '<div class="card mx-3 mb-3 shadow-sm mx-auto"> <div class="card-body">No airlines found</div></div>'
                $('#allAirlines').append(html);
            }
        }
    });
});

airlineAddForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("airlineAddErrorMessage").innerText = "";
    const logo = airlineAddForm.file.files[0];
    const name = airlineAddForm.name.value;
    const contact = airlineAddForm.contact.value;
    const address = airlineAddForm.address.value;
    var form = $('#airlineAddForm')[0];
    var data = new FormData(form);
    if (!logo || !name || !contact || !address) {
        document.getElementById("airlineAddErrorMessage").innerText = "Please provide required inputs";
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1.0/flight/upload-file",
            headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
            data: data,
            dataType: 'text',
            cache: false,
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            success: function (savedFileLogoId) {
                if (savedFileLogoId) {
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8080/api/v1.0/flight/add-airline",
                        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
                        data: JSON.stringify([{
                            "airlineLogoId": savedFileLogoId,
                            "airlineName": name,
                            "airlineContactNumber": contact,
                            "airlineAddress": address,
                            "active": true
                        }]),
                        cache: false,
                        contentType: 'application/json',
                        processData: false,
                        success: function (airlineSavedResponse) {
                            $('#airlineAddForm').trigger("reset");
                            if (airlineSavedResponse && airlineSavedResponse.length > 0) {
                                for (let airlineCoult = 0; airlineCoult < airlineSavedResponse.length; airlineCoult++) {
                                    const airline = airlineSavedResponse[airlineCoult];
                                    const html = getAirlineFormattedHtml(airline);
                                    $('#allAirlines').append(html);
                                    $('#al-' + airline.airlineId).find('input[type=checkbox]').prop('checked', airline.active);
                                    $('#al-' + airline.airlineId).find('label[for=disableAirlineSwitch]').text(airline.active ? "Disable" : "Enable");
                                    $('#airlineList').append(new Option(airline.airlineName, airline.airlineId));
                                }
                            }
                            document.getElementById("airlineAddSuccessMessage").innerText = "Airlines saved successfully.";
                        },
                        error: function (airlineSavedError) {
                            document.getElementById("airlineAddErrorMessage").innerText = "Not able to save records. Please try later.";
                        }
                    })
                } else {
                    document.getElementById("airlineAddErrorMessage").innerText = "Not able to save records. Please try later.";
                }
            },
            error: function (error) {
                document.getElementById("airlineAddErrorMessage").innerText = "Not able to save records. Please try later.";
            }
        });
    }
});

function disableAirlineSwitchAction(event, airlineId) {
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/api/v1.0/flight/change-airline-status",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        data: { airlineId: airlineId, status: event.target.checked },
        dataType: 'text',
        success: modifiedAirlineId => {
            $('#al-' + modifiedAirlineId).find('input[type=checkbox]').prop('checked', event.target.checked);
            $('#al-' + modifiedAirlineId).find('label[for=disableAirlineSwitch]').text(event.target.checked ? "Disable" : "Enable");
            if (event.target.checked) {
                $('#airlineList').append(new Option(airline.airlineName, airline.airlineId));
            } else {
                $('#airlineList option[value=' + modifiedAirlineId + ']').remove();
            }

        },
        error: error => {
            console.log(error);
        }
    });
}

function getAirlineFormattedHtml(airline) {
    const html = '<div class="card mb-3 mx-auto shadow" style="width:45%" id="al-' + airline.airlineId + '"> ' +
        '<div class="card-body">' +
        '<div class="d-inline-block"><img src=data:image/' + airline.airlineLogoType + ';base64,' + airline.airlineLogo + ' class="img-fluid align-middle img-logo" alt="logo"></div>' +
        '<div class="d-inline-block align-middle mx-3">' +
        '<h6>' + airline.airlineName + '</h6>' +
        '<div style="font-size: 14px;">' +
        '<div>' +
        '<i class="fa fa-phone" aria-hidden="true"></i> ' + airline.airlineContactNumber + '</div>' +
        '<div>' +
        '<i class="fa fa-home" aria-hidden="true"></i> ' + airline.airlineAddress + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="d-inline-block form-check form-switch float-end">' +
        '<input class="form-check-input" type="checkbox" id="disableAirlineSwitch" onchange="disableAirlineSwitchAction(event,' + airline.airlineId + ')">' +
        '<label class="form-check-label" for="disableAirlineSwitch"></label>' +
        '</div>' +
        '</div>' +
        '</div>';
    return html;
}