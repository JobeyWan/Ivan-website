const ACCESS_KEY = "coolay_access";
const TRIAL_MS = 7 * 24 * 60 * 60 * 1000;

function readAccess() {
  const raw = localStorage.getItem(ACCESS_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    if (!data.email || !data.plan || !data.paymentLast4) return null;

    const expired =
      data.plan === "trial" &&
      typeof data.trialEnds === "number" &&
      Date.now() > data.trialEnds;

    return { ...data, expired };
  } catch {
    return null;
  }
}

function hasLiveAccess() {
  const access = readAccess();
  return Boolean(access && !access.expired);
}

function grantAccess({ email, name, plan, last4 }) {
  const now = Date.now();
  const record = {
    email: email.trim(),
    name: name.trim(),
    plan,
    paymentLast4: last4,
    grantedAt: now,
    trialEnds: plan === "trial" ? now + TRIAL_MS : null,
  };
  localStorage.setItem(ACCESS_KEY, JSON.stringify(record));
  return record;
}

function clearAccess() {
  localStorage.removeItem(ACCESS_KEY);
}

function requireLiveAccess() {
  const access = readAccess();
  if (!access) {
    window.location.replace("shop.html?reason=locked");
    return null;
  }
  if (access.expired) {
    window.location.replace("shop.html?reason=expired");
    return null;
  }
  return access;
}

function trialDaysLeft(access) {
  if (!access || access.plan !== "trial" || !access.trialEnds) return null;
  return Math.max(0, Math.ceil((access.trialEnds - Date.now()) / 86400000));
}

function planLabel(access) {
  if (!access) return "";
  if (access.plan === "full") return "Full license";
  const days = trialDaysLeft(access);
  return days === 1 ? "Trial · 1 day left" : `Trial · ${days} days left`;
}
