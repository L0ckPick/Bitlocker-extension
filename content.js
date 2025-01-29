// Define currentUrl to be used for various checks
const currentUrl = window.location.hostname;

// 1. **Phishing Protection**
// A basic list of known phishing domains (expand this as needed)
const phishingDomains = ["examplephishing.com", "malicious-site.com"];

if (phishingDomains.includes(currentUrl)) {
  alert("Warning: This site is potentially a phishing site!");
  // Optionally, you could redirect to a safer place
  window.location.href = "https://www.google.com";
}

// 2. **HTTPS Enforcer**
// Redirect HTTP sites to HTTPS if possible
if (window.location.protocol === 'http:') {
  window.location.href = window.location.href.replace('http://', 'https://');
}

// 3. **Malware Blocker**
// List of known malicious domains (expand as needed)
const maliciousDomains = ["malicious-site.com", "dangerous-website.org"];

if (maliciousDomains.includes(currentUrl)) {
  alert("Warning: This site is known for hosting malware.");
  window.location.href = "https://www.google.com"; // Redirect to a safe site
}

// 4. **Privacy Mode**
// Block common trackers or unwanted scripts (Example: Google Analytics, Facebook trackers, etc.)
const blockedTrackers = [
  "google-analytics.com",
  "facebook.com",
  "doubleclick.net",
  "trackerscript.js",
  "adtracking.js"
];

const allScripts = document.querySelectorAll("script, iframe, img");

allScripts.forEach(request => {
  const src = request.src || request.href;
  if (blockedTrackers.some(tracker => src.includes(tracker))) {
    request.remove();  // Block the tracking scripts
    console.log(`Blocked tracker/script: ${src}`);
  }
});

// 5. **Password Strength Meter (Client-Side)**
// Since we're not in an actual password input context here, we'd usually inject this feature in a form. 
// But for now, we'll monitor password inputs and show strength (just as an illustration).
const passwordField = document.querySelector("input[type='password']");

if (passwordField) {
  passwordField.addEventListener("input", function () {
    const password = passwordField.value;
    let strength = "Weak";
    let color = "red";

    // Simple password strength checks (expand this logic)
    if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      strength = "Strong";
      color = "green";
    } else if (password.length > 5) {
      strength = "Medium";
      color = "orange";
    }

    // Update password strength meter (assuming you have an element to show this)
    const strengthMeter = document.getElementById("strengthMeter");
    if (strengthMeter) {
      strengthMeter.style.backgroundColor = color;
      strengthMeter.innerText = `Strength: ${strength}`;
    }
  });
}

// 6. **Ad and Tracker Blocker**
// Block common ad networks and tracking sources
const blockedAdDomains = [
  "doubleclick.net", "ads.google.com", "advertisement.com", "trackingscript.js"
];

const allRequests = document.querySelectorAll("script, iframe, img");

allRequests.forEach(request => {
  const src = request.src || request.href;
  if (blockedAdDomains.some(domain => src.includes(domain))) {
    request.remove();
    console.log(`Blocked ad/tracker: ${src}`);
  }
});
