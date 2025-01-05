function toggleAadhaar() {
  const aadhaarInput = document.getElementById("aadhaar");
  if (aadhaarInput.type === "password") {
    aadhaarInput.type = "text";
  } else {
    aadhaarInput.type = "password";
  }
}

function refreshCaptcha() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.getElementById("captchaText").textContent = captcha;
}

document
  .getElementById("farmerRegistration")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    const aadhaar = document.getElementById("aadhaar").value;
    const mobile = document.getElementById("mobile").value;
    const state = document.getElementById("state").value;
    const captcha = document.getElementById("captchaInput").value;

    if (aadhaar.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    if (state === "") {
      alert("Please select your state");
      return;
    }

    if (captcha !== document.getElementById("captchaText").textContent) {
      alert("Invalid captcha");
      return;
    }

    // If all validations pass, you can proceed with OTP generation
    alert("Form validated! Proceeding to OTP generation...");
  });
