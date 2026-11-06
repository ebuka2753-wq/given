
/*
 INTERNATIONAL REWARDS
 Secure Supabase login and withdrawal system

 IMPORTANT:
 1. Run supabase_setup.sql in Supabase SQL Editor.
 2. Configure phone OTP in Supabase.
 3. Replace the two Supabase settings below.
*/

// ===================================
// SUPABASE CONFIGURATION
// ===================================

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const configured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

const supabaseClient = configured
  ? window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    )
  : null;


// ===================================
// HELPER FUNCTIONS
// ===================================

const $ = (id) => document.getElementById(id);

const mainViews = [
  "loginView",
  "pinSetupView",
  "dashboardView"
];

function showView(id) {
  mainViews.forEach(view => {
    $(view).classList.toggle("hidden", view !== id);
  });
}

function showSubView(id) {
  document.querySelectorAll(".subview").forEach(view => {
    view.classList.add("hidden");
  });

  $(id).classList.remove("hidden");
}

function checkConfiguration() {
  if (!supabaseClient) {
    alert(
      "Please add your Supabase Project URL and anon key inside script.js."
    );
    return false;
  }

  return true;
}


// ===================================
// PHONE LOGIN
// ===================================

let pendingPhone = "";

$("sendOtpForm").addEventListener("submit", async function(event) {

  event.preventDefault();

  if (!checkConfiguration()) return;

  const phone = $("phone").value.trim();

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    alert("Enter your phone number with country code. Example: +234...");
    return;
  }

  pendingPhone = phone;

  const fullName = $("fullName").value.trim();
  const gender = $("gender").value;

  const { error } = await supabaseClient.auth.signInWithOtp({

    phone: pendingPhone,

    options: {
      shouldCreateUser: true,

      data: {
        full_name: fullName,
        gender: gender
      }
    }

  });

  if (error) {
    alert(error.message);
    return;
  }

  $("verifyOtpForm").classList.remove("hidden");

  alert("Verification code sent to your phone.");

});


// ===================================
// VERIFY PHONE OTP
// ===================================

$("verifyOtpForm").addEventListener("submit", async function(event) {

  event.preventDefault();

  const token = $("otp").value.trim();

  const { data, error } = await supabaseClient.auth.verifyOtp({

    phone: pendingPhone,
    token: token,
    type: "sms"

  });

  if (error) {
    alert(error.message);
    return;
  }

  $("memberName").textContent =
    data.user.user_metadata?.full_name || "Member";

  const { data: hasPin, error: pinError } =
    await supabaseClient.rpc("has_withdrawal_pin");

  if (pinError) {
    alert("Please run supabase_setup.sql in your Supabase SQL Editor.");
    return;
  }

  if (hasPin) {
    showView("dashboardView");
  } else {
    showView("pinSetupView");
  }

});


// ===================================
// CREATE WITHDRAWAL PIN
// ===================================

$("pinSetupForm").addEventListener("submit", async function(event) {

  event.preventDefault();

  const pin = $("newPin").value;
  const confirmPin = $("confirmPin").value;

  if (!/^\d{4}$/.test(pin)) {
    alert("Your PIN must contain exactly four digits.");
    return;
  }

  if (pin !== confirmPin) {
    alert("Your PINs do not match.");
    return;
  }

  const { error } = await supabaseClient.rpc(
    "set_withdrawal_pin",
    {
      p_pin: pin
    }
  );

  if (error) {
    alert(error.message);
    return;
  }

  $("newPin").value = "";
  $("confirmPin").value = "";

  alert("Your withdrawal PIN has been created.");

  showView("dashboardView");

});


// ===================================
// DASHBOARD BUTTONS
// ===================================

document.querySelectorAll("[data-view]").forEach(button => {

  button.addEventListener("click", function() {

    const target = this.dataset.view;

    showSubView(target);

  });

});


// ===================================
// WITHDRAWAL REQUEST
// ===================================

$("withdrawForm").addEventListener("submit", async function(event) {

  event.preventDefault();

  if (!checkConfiguration()) return;

  const bankName = $("bankName").value.trim();
  const accountName = $("accountName").value.trim();
  const accountNumber = $("accountNumber").value.trim();

  const amount = Number($("withdrawAmount").value);

  const pin = $("withdrawPin").value;

  if (
    !bankName ||
    !accountName ||
    accountNumber.length < 6 ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !/^\d{4}$/.test(pin)
  ) {
    alert("Please check all your withdrawal details.");
    return;
  }

  const { data, error } = await supabaseClient.rpc(

    "submit_withdrawal_request",

    {
      p_bank_name: bankName,
      p_account_name: accountName,
      p_account_number: accountNumber,
      p_amount: amount,
      p_pin: pin
    }

  );

  // Clear PIN from the page immediately.
  $("withdrawPin").value = "";

  if (error) {

    $("withdrawMessage").textContent = error.message;

    return;
  }

  $("withdrawMessage").textContent =
    "Your withdrawal request has been submitted for admin review. Reference: " + data;

  $("withdrawForm").reset();

});


// ===================================
// LOG OUT
// ===================================

$("logoutButton").addEventListener("click", async function() {

  if (supabaseClient) {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }
  }

  $("verifyOtpForm").classList.add("hidden");
  $("sendOtpForm").reset();
  $("verifyOtpForm").reset();

  showView("loginView");

});


// ===================================
// RESTORE EXISTING LOGIN SESSION
// ===================================

async function restoreSession() {

  if (!supabaseClient) return;

  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error || !session) return;

  $("memberName").textContent =
    session.user.user_metadata?.full_name || "Member";

  const { data: hasPin, error: pinError } =
    await supabaseClient.rpc("has_withdrawal_pin");

  if (pinError) {
    console.error(pinError.message);
    return;
  }

  showView(hasPin ? "dashboardView" : "pinSetupView");

}


// Start website
restoreSession();
