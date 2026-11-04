
/*
  INTERNATIONAL REWARDS
  STATIC WEBSITE SETTINGS

  Configure EmailJS and Cloudinary below.
*/

// =====================================
// 1. YOUR SERVICE CONFIGURATION
// =====================================

const SETTINGS = {
  adminEmail: "okoyechamaka@gmail.com",
  whatsapp: "2349040071415",

  // Replace these with your EmailJS details.
  emailServiceID: "YOUR_EMAILJS_SERVICE_ID",
  emailTemplateID: "YOUR_EMAILJS_TEMPLATE_ID",
  emailPublicKey: "YOUR_EMAILJS_PUBLIC_KEY",

  // Replace these with your Cloudinary details.
  cloudinaryName: "YOUR_CLOUDINARY_CLOUD_NAME",
  cloudinaryPreset: "YOUR_UNSIGNED_UPLOAD_PRESET"
};

// =====================================
// 2. EMAIL CONFIGURATION
// =====================================

function emailConfigured() {
  return SETTINGS.emailServiceID.startsWith("service_") &&
    SETTINGS.emailTemplateID.startsWith("template_") &&
    SETTINGS.emailPublicKey !== "YOUR_EMAILJS_PUBLIC_KEY";
}

function initializeEmail() {
  if (emailConfigured() && window.emailjs) {
    emailjs.init({
      publicKey: SETTINGS.emailPublicKey
    });
  }
}

async function sendAdminNotification(details) {
  if (!emailConfigured() || !window.emailjs) {
    console.warn("EmailJS has not been configured.");
    return false;
  }

  try {
    await emailjs.send(
      SETTINGS.emailServiceID,
      SETTINGS.emailTemplateID,
      {
        to_email: SETTINGS.adminEmail,
        event_type: details.event,
        visitor_name: details.name || "Website visitor",
        visitor_phone: details.phone || "Not provided",
        visitor_country: details.country || "Not provided",
        visitor_email: details.email || "Not provided",
        event_time: new Date().toLocaleString(),
        page_url: window.location.href,
        message: details.message || "",
        image_url: details.image || "No image attached"
      }
    );

    return true;
  } catch (error) {
    console.error("Notification failed:", error);
    return false;
  }
}

// =====================================
// 3. PAGE NAVIGATION
// =====================================

function showPage(page) {
  ["register", "login"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  document.getElementById(page).classList.remove("hidden");

  document.getElementById(page).scrollIntoView({
    behavior: "smooth"
  });
}

// =====================================
// 4. PRIVACY CONSENT AND VISITOR ALERTS
// =====================================

function acceptPrivacy() {
  sessionStorage.setItem("visitorConsent", "yes");

  document.getElementById("privacyBanner")
    .classList.add("hidden");

  notifyVisitor();
}

function declinePrivacy() {
  sessionStorage.setItem("visitorConsent", "no");

  document.getElementById("privacyBanner")
    .classList.add("hidden");
}

function notifyVisitor() {
  if (sessionStorage.getItem("visitorConsent") !== "yes") {
    return;
  }

  // One notification per browser session.
  if (sessionStorage.getItem("visitNotified") === "yes") {
    return;
  }

  sessionStorage.setItem("visitNotified", "yes");

  sendAdminNotification({
    event: "NEW WEBSITE VISIT",
    message: "A visitor opened the International Rewards website."
  }).then(success => {
    if (!success) {
      sessionStorage.removeItem("visitNotified");
    }
  });
}

function setupPrivacy() {
  const banner = document.getElementById("privacyBanner");
  const consent = sessionStorage.getItem("visitorConsent");

  if (consent === "yes") {
    banner.classList.add("hidden");
    notifyVisitor();
  } else if (consent === "no") {
    banner.classList.add("hidden");
  }
}

// =====================================
// 5. REGISTRATION NOTIFICATIONS
// =====================================

document.getElementById("registerForm")
  .addEventListener("submit", async function(event) {

    event.preventDefault();

    const honeypot = this.querySelector(".honeypot");

    if (honeypot.value) {
      return;
    }

    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("memberEmail").value.trim();
    const country = document.getElementById("country").value;
    const plan = document.getElementById("memberPlan").value;
    const referral = document.getElementById("referralCode").value.trim();

    if (!name || !phone || !country ||
        !document.getElementById("agree").checked) {
      alert("Please complete the required fields.");
      return;
    }

    const button = this.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Sending...";

    const success = await sendAdminNotification({
      event: "NEW REGISTRATION REQUEST",
      name: name,
      phone: phone,
      email: email,
      country: country,
      message:
        "Membership interest: " + plan +
        "\nReferral code: " + (referral || "None")
    });

    button.disabled = false;
    button.textContent = "Submit Registration";

    if (!success) {
      alert(
        "Notification could not be sent. " +
        "Please check your EmailJS configuration and try again."
      );
      return;
    }

    document.getElementById("register").classList.add("hidden");

    document.getElementById("memberName").textContent = name;

    document.getElementById("dashboard")
      .classList.remove("hidden");

    document.getElementById("dashboard").scrollIntoView({
      behavior: "smooth"
    });

    alert("Your registration request was sent successfully!");

    this.reset();
  });

// =====================================
// 6. LOGIN DEMONSTRATION
// =====================================

document.getElementById("loginForm")
  .addEventListener("submit", function(event) {

    event.preventDefault();

    alert(
      "Real account login requires a secure authentication backend."
    );
  });

function logout() {
  document.getElementById("dashboard")
    .classList.add("hidden");

  alert("You have left the dashboard.");
}

// =====================================
// 7. MEMBERSHIP INFORMATION
// =====================================

function selectPlan(plan) {
  alert(
    plan + " Membership\n\n" +
    "This is an informational plan preview. " +
    "No payment or guaranteed reward is being requested."
  );
}

// =====================================
// 8. DASHBOARD SERVICES
// =====================================

function accountAction(action) {
  const descriptions = {
    Wallet: "View your wallet information.",
    Transfer: "Real transfers require an approved payment provider.",
    Withdrawal: "Real withdrawals require verified available funds.",
    Savings: "Savings functionality is not activated.",
    Referrals: "Referral tracking requires a verified member account.",
    Rewards: "View official reward announcements."
  };

  alert(action + "\n\n" + descriptions[action]);
}

// =====================================
// 9. SHARE WEBSITE
// =====================================

function shareInvite() {
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: "International Rewards",
      text: "Visit our community rewards website.",
      url: url
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
      .then(() => alert("Website link copied!"))
      .catch(() => alert(url));
  } else {
    alert(url);
  }
}

// =====================================
// 10. PRIVATE PICTURE SUBMISSION
// =====================================

function cloudinaryConfigured() {
  return SETTINGS.cloudinaryName !==
      "YOUR_CLOUDINARY_CLOUD_NAME" &&
    SETTINGS.cloudinaryPreset !==
      "YOUR_UNSIGNED_UPLOAD_PRESET";
}

async function uploadPicture(file) {
  if (!cloudinaryConfigured()) {
    throw new Error("Cloudinary has not been configured.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", SETTINGS.cloudinaryPreset);

  const endpoint =
    "https://api.cloudinary.com/v1_1/" +
    SETTINGS.cloudinaryName +
    "/image/upload";

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Picture upload failed.");
  }

  const result = await response.json();

  return result.secure_url;
}

document.getElementById("pictureForm")
  .addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("pictureName").value.trim();
    const phone = document.getElementById("picturePhone").value.trim();
    const message = document.getElementById("pictureMessage").value.trim();
    const file = document.getElementById("pictureFile").files[0];

    if (!name || !phone || !file) {
      alert("Please complete the picture form.");
      return;
    }

    if (!document.getElementById("pictureConsent").checked) {
      alert("Please agree to the picture submission notice.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      alert("Choose a JPG, PNG or WEBP image under 5MB.");
      return;
    }

    const button = this.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Uploading picture...";

    try {
      const imageURL = await uploadPicture(file);

      button.textContent = "Sending notification...";

      const success = await sendAdminNotification({
        event: "PRIVATE PICTURE SUBMISSION",
        name: name,
        phone: phone,
        message: message,
        image: imageURL
      });

      if (!success) {
        alert(
          "The picture was uploaded, but email notification failed. " +
          "Please contact the administrator."
        );
        return;
      }

      alert("Your picture has been sent privately for review.");

      this.reset();

    } catch (error) {
      console.error(error);
      alert("Picture submission failed. Check your service settings.");
    } finally {
      button.disabled = false;
      button.textContent = "Submit Picture";
    }
  });

// =====================================
// 11. ADMIN ANNOUNCEMENT PREVIEW
// =====================================

function publishPost() {
  const title =
    document.getElementById("postTitle").value.trim();

  const content =
    document.getElementById("postContent").value.trim();

  const file =
    document.getElementById("postImage").files[0];

  if (!title || !content) {
    alert("Enter a title and announcement.");
    return;
  }

  if (file && ![
    "image/jpeg",
    "image/png",
    "image/webp"
  ].includes(file.type)) {
    alert("Select a JPG, PNG or WEBP image.");
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
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = "Administrator announcement picture";

    post.appendChild(image);
  }

  document.getElementById("posts").prepend(post);

  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
  document.getElementById("postImage").value = "";

  alert(
    "Announcement preview created. " +
    "It is visible only in this browser session."
  );
}

// =====================================
// 12. LANGUAGE SETTINGS
// =====================================

const translations = {
  en: "WELCOME TO OUR GLOBAL COMMUNITY",
  es: "BIENVENIDO A NUESTRA COMUNIDAD GLOBAL",
  fr: "BIENVENUE DANS NOTRE COMMUNAUTÉ MONDIALE"
};

const languageSelect = document.getElementById("language");

function changeLanguage(language) {
  if (translations[language]) {
    document.querySelector(".eyebrow").textContent =
      translations[language];
  }
}

languageSelect.addEventListener("change", function() {
  changeLanguage(this.value);
});

const browserLanguage = navigator.language
  .slice(0, 2).toLowerCase();

if (translations[browserLanguage]) {
  languageSelect.value = browserLanguage;
  changeLanguage(browserLanguage);
}

// =====================================
// 13. CURRENCY PREFERENCE
// =====================================

document.getElementById("currency")
  .addEventListener("change", function() {

    document.getElementById("currencyStatus").textContent =
      "Your selected display currency is " +
      this.value +
      ". Live exchange-rate conversion is not connected.";
  });

// =====================================
// 14. INITIALIZE WEBSITE
// =====================================

initializeEmail();
setupPrivacy();

console.log("International Rewards website loaded.");
