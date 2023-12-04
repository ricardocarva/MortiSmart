(() => {
    console.log("loaded login.js");
    // Select the Google login link and the progress bar
    const googleLoginLink = document.getElementById("google-login");
    const loginProgress = document.getElementById("login-progress");
    const loginForm = document.querySelector("form");

    // Hide the progress bar initially
    loginProgress.classList.add("d-none");

    // Add an event listener to the Google login link
    googleLoginLink.addEventListener("click", function (e) {
        // Prevent the default link behavior
        e.preventDefault();

        // Show the progress bar
        loginProgress.classList.remove("d-none");

        window.location.href = e.target.href;
        // Simulate a delay for demonstration purposes
        //  setTimeout(function () {
        // Here you can add your actual Google login logic
        //googleLoginLink.click();
        // After the login attempt is complete, hide the progress bar
        //     loginProgress.style.display = 'none';
        // }, 2000); // Simulated 2-second delay, replace with your actual Google login logic
    });

    // Add an event listener to the form submission
    loginForm.addEventListener("submit", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Show the progress bar
        loginProgress.classList.remove("d-none");

        // Simulate a delay for demonstration purposes
        // setTimeout(function () {
        // Here you can add your actual login logic
        loginForm.submit();
        // After the login attempt is complete, hide the progress bar
        // loginProgress.style.display = 'none';
        // }, 2000); // Simulated 2-second delay, replace with your actual login logic
    });
})();
