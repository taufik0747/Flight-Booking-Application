$(function () {
    $("input[type='checkbox'][name='discountCoupon']").prop('checked', true);
    $("input[type='text'][name='couponDiscountPercentage']").prop("disabled", false);
    $("input[type='checkbox'][name='discountCoupon']").click(function (event) {
        if (event.target.checked) {
            $("input[type='text'][name='couponDiscountPercentage']").prop("disabled", false);
        } else {
            $("input[type='text'][name='couponDiscountPercentage']").prop("disabled", true);
        }
    });
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/v1.0/flight/all-coupons",
        data: { "include-inactive": true },
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        success: function (coupons) {
            $('#allCoupons').empty();
            if (coupons && coupons.length > 0) {
                for (let cCoult = 0; cCoult < coupons.length; cCoult++) {
                    const coupon = coupons[cCoult];
                    const html = getCouponFormattedHtml(coupon);
                    $('#allCoupons').append(html);
                    $('#coup-' + coupon.couponId).find('input[type=checkbox]').prop('checked', coupon.active);
                    $('#coup-' + coupon.couponId).find('label[for=disableCouponSwitch]').text(coupon.active ? "Disable" : "Enable");
                }
            } else {
                const html = '<div class="card shadow-sm mb-3 mx-auto"> <div class="card-body">No coupons found</div></div>'
                $('#allCoupons').append(html);
            }
        }
    });
});

function getCouponFormattedHtml(coupon) {
    return '<div class="card mb-3 mx-3 shadow d-inline-block" style="width:25%" id="coup-' + coupon.couponId + '">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + coupon.couponName + '</h5>' +
        '<p class="card-text">' + coupon.couponDescription + '</p>' +
        '<div class="form-check form-switch">' +
        '<input class="form-check-input" type="checkbox" id="disableCouponSwitch" onchange="disableCouponSwitchAction(event,' + coupon.couponId + ')">' +
        '<label class="form-check-label" for="disableCouponSwitch"></label>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function disableCouponSwitchAction(event, couponId) {
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/api/v1.0/flight/change-coupon-status",
        headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
        data: { couponId: couponId, status: event.target.checked },
        dataType: 'text',
        success: modifiedCouponId => {
            $('#coup-' + modifiedCouponId).find('input[type=checkbox]').prop('checked', event.target.checked);
            $('#coup-' + modifiedCouponId).find('label[for=disableCouponSwitch]').text(event.target.checked ? "Disable" : "Enable");
        },
        error: error => {
            console.log(error);
        }
    });
}

couponAddForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("couponAddErrorMessage").innerText = "";
    const couponName = couponAddForm.couponName.value;
    const couponDescription = couponAddForm.couponDescription.value;
    const discountCoupon = couponAddForm.discountCoupon.checked;
    const couponDiscountPercentage = couponAddForm.couponDiscountPercentage.value;
    if (!couponName || !couponDescription) {
        document.getElementById("couponAddErrorMessage").innerText = "Please provide required inputs";
    } else if (discountCoupon && (!couponDiscountPercentage || (couponDiscountPercentage < 0 || couponDiscountPercentage > 100))) {
        document.getElementById("couponAddErrorMessage").innerText = "Please provide valid discount percentage";
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1.0/flight/add-coupon",
            headers: { "AccessToken": "Bearer " + sessionStorage.getItem("token") },
            data: JSON.stringify([{
                "active": true,
                "couponDescription": couponDescription,
                "couponDiscountPercentage": discountCoupon ? couponDiscountPercentage : 0,
                "couponName": couponName,
                "discountCoupon": discountCoupon
            }]),
            cache: false,
            contentType: 'application/json',
            success: function (couponSavedResponse) {
                $('#couponAddForm').trigger("reset");
                if (couponSavedResponse && couponSavedResponse.length > 0) {
                    for (let cCoult = 0; cCoult < couponSavedResponse.length; cCoult++) {
                        const coupon = couponSavedResponse[cCoult];
                        const html = getCouponFormattedHtml(coupon);
                        $('#allCoupons').append(html);
                        $('#coup-' + coupon.couponId).find('input[type=checkbox]').prop('checked', coupon.active);
                        $('#coup-' + coupon.couponId).find('label[for=disableFlightSwitch]').text(coupon.active ? "Disable" : "Enable");
                    }
                }
                document.getElementById("couponAddSuccessMessage").innerText = "Coupons saved successfully.";
            },
            error: function (flightSavedError) {
                document.getElementById("couponAddErrorMessage").innerText = "Not able to save records. Please try later.";
            }
        })
    }
});