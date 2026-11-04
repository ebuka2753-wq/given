
let currentUser = null;
let selectedPlan = "No membership selected";

// PAGE NAVIGATION
function showPage(page) {
  ["register", "login"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  document.getElementById(page).classList.remove("hidden");

  document.getElementById(page).scrollIntoView({
    behavior: "smooth"
  });
}

// REGISTRATION DEMONSTRATION
document.getElementById("registerForm")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    currentUser = {
      name: document.getElementById("fullName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      country: document.getElementById("country").value
    };

    if (!currentUser.name || !currentUser.phone ||
        !currentUser.country) {
      alert("Please complete all fields.");
      return;
    }

    document.getElementById("memberName").textContent =
      currentUser.name;

    document.getElementById("currentPlan").textContent =
      selectedPlan;

    document.getElementById("register").classList.add("hidden");
    document.getElementById("login").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    document.getElementById("dashboard").scrollIntoView({
      behavior: "smooth"
    });

    alert("Demonstration registration successful!");
    this.reset();
  });

// LOGIN DEMONSTRATION
document.getElementById("loginForm")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    alert(
      "Real phone-number login is not connected yet. " +
      "A secure authentication backend is required."
    );
  });

// LOGOUT
function logout() {
  currentUser = null;

  document.getElementById("dashboard")
    .classList.add("hidden");

  document.getElementById("login").classList.add("hidden");

  alert("You have logged out.");
}

// MEMBERSHIP
function selectPlan(plan) {
  const details = {
    Normal: "$500",
    Gold: "$1,000",
    Platinum: "$1,750",
    Exclusive: "$3,550"
  };

  alert(
    plan + " Membership\n" +
    "Proposed price: " + details[plan] +
    "\nNo payment has been taken."
  );

  selectedPlan = plan + " Membership";

  if (currentUser) {
    document.getElementById("currentPlan").textContent =
      selectedPlan;
  }
}

// DASHBOARD ACTIONS
function accountAction(action) {
  const messages = {
    Wallet: "View your account activity.",
    Transfer: "Real transfers require a payment provider.",
    Withdrawal: "Withdrawals require verified available funds.",
    Savings: "Savings tools are not connected yet.",
    Referrals: "Share your invitation with friends.",
    Rewards: "View verified reward information."
  };

  alert(action + "\n\n" + messages[action]);
}

// SHARE INVITATION
function shareInvite() {
  const invite = window.location.href +
    "?ref=DEMO-MEMBER";

  if (navigator.share) {
    navigator.share({
      title: "International Rewards",
      text: "Join our community rewards platform.",
      url: invite
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(invite)
      .then(() => alert("Invitation link copied!"))
      .catch(() => alert(invite));
  } else {
    alert(invite);
  }
}

// CURRENCY DISPLAY
document.getElementById("currency")
  .addEventListener("change", function() {
    document.getElementById("currencyStatus").textContent =
      "Selected display currency: " + this.value +
      ". Live conversion is not connected.";
  });

// ADMIN ANNOUNCEMENT PREVIEW
function publishPost() {
  const title =
    document.getElementById("postTitle").value.trim();

  const content =
    document.getElementById("postContent").value.trim();

  const file =
    document.getElementById("postImage").files[0];

  if (!title || !content) {
    alert("Enter an announcement title and message.");
    return;
  }

  const post = document.createElement("article");
  post.className = "post";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = content;

  post.append(heading, paragraph);

  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = "Announcement image";
    post.appendChild(image);
  }

  document.getElementById("posts").prepend(post);

  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
  document.getElementById("postImage").value = "";

  alert("Announcement preview added to this page.");
}

// BASIC LANGUAGE SELECTOR
const translations = {
  en: {
    welcome: "WELCOME TO OUR GLOBAL COMMUNITY"
  },
  es: {
    welcome: "BIENVENIDO A NUESTRA COMUNIDAD GLOBAL"
  },
  fr: {
    welcome: "BIENVENUE DANS NOTRE COMMUNAUTÉ MONDIALE"
  },
  pt: {
    welcome: "BEM-VINDO À NOSSA COMUNIDADE GLOBAL"
  }
};

document.getElementById("language")
  .addEventListener("change", function() {
    const language = this.value;
    const text = translations[language];

    document.querySelector(".eyebrow").textContent =
      text.welcome;
  });

// AUTOMATIC BROWSER LANGUAGE DETECTION
const browserLanguage =
  navigator.language.slice(0, 2);

if (translations[browserLanguage]) {
  document.getElementById("language").value =
    browserLanguage;

  document.querySelector(".eyebrow").textContent =
    translations[browserLanguage].welcome;
}
