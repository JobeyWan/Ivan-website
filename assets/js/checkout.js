(function initCheckout() {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan") === "trial" ? "trial" : "full";

  const plans = {
    trial: {
      name: "7-day free trial",
      price: "$0 today",
      note: "Payment details required. Full access for 7 days.",
    },
    full: {
      name: "Coolay full license",
      price: "$49",
      note: "One-time payment. Unlimited access to Coolay.",
    },
  };

  const selected = plans[plan];
  document.querySelector("[data-plan-name]").textContent = selected.name;
  document.querySelector("[data-plan-price]").textContent = selected.price;
  document.querySelector("[data-plan-note]").textContent = selected.note;
  document.querySelector("[data-submit-label]").textContent =
    plan === "trial" ? "Start free trial" : "Pay $49";

  const form = document.querySelector("[data-checkout-form]");
  const errorEl = document.querySelector("[data-form-error]");
  const cardInput = form.elements.card;
  const expiryInput = form.elements.expiry;

  cardInput.addEventListener("input", () => {
    const digits = cardInput.value.replace(/\D/g, "").slice(0, 16);
    cardInput.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  });

  expiryInput.addEventListener("input", () => {
    const digits = expiryInput.value.replace(/\D/g, "").slice(0, 4);
    expiryInput.value =
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorEl.hidden = true;

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const card = form.querySelector("#card").value.replace(/\s/g, "");
    const expiry = form.querySelector("#expiry").value.trim();
    const cvc = form.querySelector("#cvc").value.trim();
    const zip = form.querySelector("#zip").value.trim();

    const message = validatePayment({ name, email, card, expiry, cvc, zip });
    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      return;
    }

    grantAccess({
      email,
      name,
      plan,
      last4: card.slice(-4),
    });

    form.hidden = true;
    document.querySelector("[data-checkout-success]").hidden = false;
  });
})();

function validatePayment({ name, email, card, expiry, cvc, zip }) {
  if (name.length < 2) return "Enter the name on the card.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email.";
  if (!/^\d{16}$/.test(card)) return "Enter a 16-digit card number.";
  if (!isValidExpiry(expiry)) return "Enter a valid future expiry date (MM/YY).";
  if (!/^\d{3,4}$/.test(cvc)) return "Enter a 3 or 4 digit CVC.";
  if (!/^\d{5}(-\d{4})?$/.test(zip)) return "Enter a valid ZIP code.";
  return "";
}

function isValidExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const expires = new Date(year, month);
  return expires > new Date();
}
