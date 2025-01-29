const passwordField = document.getElementById("password");
const strengthMeter = document.getElementById("strengthMeter");

passwordField.addEventListener("input", function () {
  const password = passwordField.value;
  let strength = "Weak";
  let color = "red";

  // Simple strength checks
  if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    strength = "Strong";
    color = "green";
  } else if (password.length > 5) {
    strength = "Medium";
    color = "orange";
  }

  // Update the strength meter
  strengthMeter.style.backgroundColor = color;
  strengthMeter.innerText = strength;
});
