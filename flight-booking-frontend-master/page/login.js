loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("errorMessage").innerText = "";
    const userId = loginForm.userId.value;
    const password = loginForm.password.value;
    const loginAsAdmin = loginForm.loginAsAdmin.checked;
    if (!userId || !password) {
        document.getElementById("errorMessage").innerText = "Please provide required inputs";
    } else {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1.0/user/signin",
            headers: { "password": password },
            data: { signInId: userId, adminLogin: loginAsAdmin },
            dataType: 'text',
            success: function (response) {
                if (response) {
                    sessionStorage.setItem("loggedIn", "true");
                    sessionStorage.setItem("token", response);
                    sessionStorage.setItem("userId", userId);
                    if (loginAsAdmin) {
                        $('#main').load("./page/admin.html");
                    } else {
                        $('#main').load("./page/user.html");
                    }
                    $('#header').load("#header");
                } else {
                    document.getElementById("errorMessage").innerText = "Invalid credentials";
                }
            },
            error: function (error) {
                document.getElementById("errorMessage").innerText = "Invalid credentials";
            }
        });
    }
})

function gotoRegister() {
    $('#main').load("./page/register.html");
}