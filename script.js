
/*
  INTERNATIONAL REWARDS
  Login and dashboard demonstration.

  NOTE:
  This is a browser-only demo login.
  It does not verify phone ownership or create secure accounts.
  Supabase authentication will be connected separately.
*/

const loginForm = document.getElementById("loginForm");
const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginError = document.getElementById("loginError");

const fullNameInput = document.getElementById("fullName");
const phoneInput = document.getElementById("phone");
const genderInput = document.getElementById("gender");

const memberName = document.getElementById("memberName");
const profileName = document.getElementById("profileName");
const profilePhone = document.getElementById("profilePhone");
const profileGender = document.getElementById("profileGender");

const logoutButton = document.getElementById("logoutButton");
const currencySelect = document.getElementById("currencySelect");
const poolAmount = document.getElementById("poolAmount");
const rateNote = document.getElementById("rateNote");

const PROGRAMME_POOL_USD = 1500000;

// Illustrative rates only. These are not live exchange rates.
const exchangeRates = {
  USD: 1,
  NGN: 1450,
  GBP: 0.78,
  EUR: 0.92,
  MXN: 17.1,
  GHS: 15.2,
  KES: 129,
  CAD: 1.37,
  AUD: 1.52,
  INR: 83.5,
  ZAR: 18.6
};

// Update the programme pool display.
function updateCurrency() {
  const currency = currencySelect.value;
  const rate = exchangeRates[currency];

  if (!rate) return;

  const convertedAmount = PROGRAMME_POOL_USD * rate;

  try {
    poolAmount.textContent = new Intl.NumberFormat(
      undefined,
      {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0
      }
    ).format(convertedAmount);
  } catch (error) {
    poolAmount.textContent =
      currency + " " + Math.round(convertedAmount).toLocaleString();
  }

  rateNote.textContent =
    `Illustrative rate: 1 USD ≈ ${rate} ${currency}. Not a live exchange quote.`;
}

// Display the member dashboard.
function openDashboard(member) {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");

  memberName.textContent =
    member.fullName.split(/\s+/)[0];

  profileName.textContent = member.fullName;
  profilePhone.textContent = member.phone;
  profileGender.textContent = member.gender;

  currencySelect.value = member.currency || "USD";

  updateCurrency();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Handle login.
loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  loginError.textContent = "";

  const fullName = fullNameInput.value.trim().replace(/\s+/g, " ");
  const phone = phoneInput.value.trim();
  const gender = genderInput.value;

  if (fullName.length < 2) {
    loginError.textContent = "Please enter your full name.";
    return;
  }

  const validPhone = /^[+()\d\s.-]{7,24}$/;

  if (!validPhone.test(phone)) {
    loginError.textContent = "Please enter a valid phone number.";
    return;
  }

  if (!gender) {
    loginError.textContent = "Please select your gender.";
    return;
  }

  const member = {
    fullName: fullName,
    phone: phone,
    gender: gender,
    currency: "USD"
  };

  // Keep the demo session only in this browser tab.
  sessionStorage.setItem(
    "ir_demo_member",
    JSON.stringify(member)
  );

  openDashboard(member);
});

// Change currency.
currencySelect.addEventListener("change", function() {
  updateCurrency();
});

// Sign out.
logoutButton.addEventListener("click", function() {
  sessionStorage.removeItem("ir_demo_member");

  dashboardView.classList.add("hidden");
  loginView.classList.remove("hidden");

  loginForm.reset();
  loginError.textContent = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Show current year.
document.getElementById("year").textContent =
  new Date().getFullYear();

// Restore demo session when the page is refreshed in this tab.
try {
  const savedMember = sessionStorage.getItem("ir_demo_member");

  if (savedMember) {
    openDashboard(JSON.parse(savedMember));
  }
} catch (error) {
  sessionStorage.removeItem("ir_demo_member");
}
