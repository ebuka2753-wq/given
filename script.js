
// INTERNATIONAL REWARDS
// Membership page JavaScript

const membershipPrices = {
  "Normal Community": 500,
  "Gold Membership": 1000,
  "Platinum Membership": 1750,
  "Exclusive Membership": 3550
};

// Get page elements
const membership = document.getElementById("membership");
const price = document.getElementById("price");
const receipt = document.getElementById("receipt");
const preview = document.getElementById("preview");
const receiptImage = document.getElementById("receiptImage");
const membershipForm = document.getElementById("membershipForm");

// WhatsApp support number
const whatsappNumber = "2349040071415";

// Display membership price
if (membership) {
  membership.addEventListener("change", function () {
    const selected = membership.value;

    price.textContent = selected
      ? "$" + membershipPrices[selected].toLocaleString("en-US")
      : "$0";
  });
}

// Preview uploaded receipt
if (receipt) {
  receipt.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
      preview.style.display = "none";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please upload a JPG, PNG or WEBP image.");
      this.value = "";
      preview.style.display = "none";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Your image must be smaller than 5MB.");
      this.value = "";
      preview.style.display = "none";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      receiptImage.src = event.target.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  });
}

// Submit membership request to WhatsApp
if (membershipForm) {
  membershipForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const plan = membership.value;
    const method = document.getElementById("payment").value;
    const amount = document.getElementById("amount").value;
    const uploadedFile = receipt.files[0];

    if (!name || !plan || !method || !amount || !uploadedFile) {
      alert("Please complete all fields.");
      return;
    }

    if (!membershipPrices[plan]) {
      alert("Please select a valid membership.");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const message =
      "Hello International Rewards Support.\n\n" +
      "I would like to submit my membership payment for review.\n\n" +
      "Full name: " + name + "\n" +
      "Membership: " + plan + "\n" +
      "Listed price: $" + membershipPrices[plan].toLocaleString("en-US") + "\n" +
      "Payment method: " + method + "\n" +
      "Amount paid: $" + Number(amount).toLocaleString("en-US") + "\n\n" +
      "I will attach my payment receipt manually for review.";

    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
  });
}
