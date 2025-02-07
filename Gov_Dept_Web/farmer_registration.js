document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("farmerRegistration");

  // Create error message containers
  function createErrorMessage(elementId) {
    const errorDiv = document.createElement("div");
    errorDiv.id = `${elementId}Error`;
    errorDiv.style.color = "red";
    errorDiv.style.fontSize = "0.8em";
    errorDiv.style.marginTop = "5px";

    const parentElement = document.getElementById(elementId).parentNode;
    parentElement.appendChild(errorDiv);
    return errorDiv;
  }

  // Error message elements
  const aadhaarError = createErrorMessage("aadhaar");
  const mobileError = createErrorMessage("mobile");
  const stateError = createErrorMessage("state");
  const captchaError = createErrorMessage("captchaInput");

  // Number-only input for Aadhaar and Mobile with real-time validation
  const numberInputs = [
    {
      id: "aadhaar",
      length: 12,
      errorElement: aadhaarError,
      errorMessage: "Please fill 12-digit Aadhaar number",
    },
    {
      id: "mobile",
      length: 10,
      errorElement: mobileError,
      errorMessage: "Please fill 10-digit mobile number",
    },
  ];

  numberInputs.forEach((input) => {
    const inputElement = document.getElementById(input.id);

    // Sanitize input to numbers only and limit length
    inputElement.addEventListener("input", function () {
      // Remove non-numeric characters
      this.value = this.value.replace(/[^0-9]/g, "");

      // Truncate to max length
      if (this.value.length > input.length) {
        this.value = this.value.slice(0, input.length);
      }

      // Real-time validation
      if (this.value.length > 0 && this.value.length < input.length) {
        input.errorElement.textContent = input.errorMessage;
      } else {
        input.errorElement.textContent = "";
      }
    });

    // Blur validation
    inputElement.addEventListener("blur", function () {
      if (this.value.length > 0 && this.value.length < input.length) {
        input.errorElement.textContent = input.errorMessage;
      } else {
        input.errorElement.textContent = "";
      }
    });
  });

  // Toggle Aadhaar password visibility
  window.toggleAadhaar = function () {
    const aadhaarInput = document.getElementById("aadhaar");
    aadhaarInput.type = aadhaarInput.type === "password" ? "text" : "password";
  };

  // Captcha Generation and Refresh
  window.refreshCaptcha = function () {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    document.getElementById("captchaText").textContent = captcha;
  };

  // Initial captcha generation
  refreshCaptcha();

  // Form Validation
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    // Aadhaar Validation
    const aadhaar = document.getElementById("aadhaar");
    if (aadhaar.value.trim() === "" || aadhaar.value.length !== 12) {
      aadhaarError.textContent = "Please fill 12-digit Aadhaar number";
      isValid = false;
    }

    // Mobile Number Validation
    const mobile = document.getElementById("mobile");
    if (mobile.value.trim() === "" || mobile.value.length !== 10) {
      mobileError.textContent = "Please fill 10-digit mobile number";
      isValid = false;
    }

    // State Validation
    const state = document.getElementById("state");
    if (state.value === "") {
      stateError.textContent = "Please select a state";
      isValid = false;
    }

    // Captcha Validation
    const captchaText = document.getElementById("captchaText").textContent;
    const captchaInput = document.getElementById("captchaInput");
    if (
      captchaInput.value.trim() === "" ||
      captchaInput.value !== captchaText
    ) {
      captchaError.textContent = "Incorrect captcha. Please try again.";
      refreshCaptcha();
      isValid = false;
    }

    // If all validations pass
    if (isValid) {
      console.log("OTP Request Successful!");
      alert("OTP Request Successful!")
    }
  });
});
