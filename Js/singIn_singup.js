document.addEventListener("DOMContentLoaded", function () {
  const userData = getUserData();

  document
    .getElementById("logInBtn")
    .addEventListener("click", function (event) {
      handleLogin(event, userData);
    });

  document.getElementById("singUpBtn").addEventListener("click", function () {
    handleSignUp(userData);
  });

  const eyeicon = document.getElementById("eyeicon");
  const password = document.getElementById("Password");
  eyeicon.addEventListener("click", function () {
    togglePasswordVisibility(password, eyeicon);
  });

  function handleLogin(event, userData) {
    event.preventDefault();

    const logInEmail = document.getElementById("logInEmail").value;
    const logInPassword = document.getElementById("logInPassword").value;

    if (isEmpty(logInEmail) || isEmpty(logInPassword)) {
      showAlert("Please fill in all fields for Log In");
      return;
    }

    const isValidUser = validateUser(logInEmail, logInPassword, userData);

    if (isValidUser) {
      window.location.href = "#auctionPage";
    } else {
      showAlert("Incorrect username or password. Please try again.");
    }
  }

  function handleSignUp(userData) {
    const signUpName = document.getElementById("signUpFullName").value;
    const signUpEmail = document.getElementById("signUpEmail").value;
    const signUpPassword = document.getElementById("signUpPassword").value;

    if (
      isEmpty(signUpName) ||
      isEmpty(signUpEmail) ||
      isEmpty(signUpPassword)
    ) {
      showAlert("Please fill in all fields for Sign Up");
      return;
    }

    if (!signUpEmail.includes("@")) {
      showAlert("Please enter a valid email address.");
      return;
    }

    userData.push({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
    });

    saveUserData(userData);
    showAlert(
      "Congratulations! You have successfully signed up. Please continue to the login to enter the auction."
    );
  }

  function showAlert(message) {
    alert(message);
  }

  function isEmpty(value) {
    return value.trim() === "";
  }

  function getUserData() {
    const userDataString = localStorage.getItem("userData");
    return userDataString ? JSON.parse(userDataString) : [];
  }

  function saveUserData(userData) {
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  function validateUser(email, password, userData) {
    return userData.some(
      (user) => user.email === email && user.password === password
    );
  }

  function togglePasswordVisibility(passwordElement, eyeIcon) {
    if (passwordElement.type === "password") {
      passwordElement.type = "text";
      eyeIcon.src = "./Images/eye-open.png";
    } else {
      passwordElement.type = "password";
      eyeIcon.src = "./Images/eye-close.png";
    }
  }
});
