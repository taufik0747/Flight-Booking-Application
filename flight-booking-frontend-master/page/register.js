registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("errorMessage").innerText = "";
    const name = registerForm.name.value;
    const email = registerForm.email.value;
    const contact = registerForm.contact.value;
    const password = registerForm.password.value;
    if (!name || !email || !contact || !password) {
        document.getElementById("errorMessage").innerText = "Please provide required inputs";
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1.0/user/register",
            headers: { "password": password },
            data: JSON.stringify({
                "email": email,
                "emailVerified": false,
                "phone": contact,
                "role": "USER",
                "userName": name
            }),
            dataType: 'text',
            contentType: 'application/json',
            success: function (response) {
                console.log(response)
                if (response) {
                    sessionStorage.setItem("loggedIn", "true");
                    sessionStorage.setItem("token", response);
                    sessionStorage.setItem("userId", email);
                    $('#main').load("./page/flight-search.html");
                    $('#header').load("#header");
                } else {
                    document.getElementById("errorMessage").innerText = "Not able to save records. Please try later.";
                }
            },
            error: function (error) {
                document.getElementById("errorMessage").innerText = "Not able to save records. Please try later.";
            }
        });
    }
})

function gotoLogin() {
    $('#main').load("./page/login.html");
}