(function initApp() {
  const access = requireLiveAccess();
  if (!access) return;

  document.querySelector("[data-plan-badge]").textContent = planLabel(access);
  document.querySelector("[data-user]").textContent = access.email;
  document.querySelector("[data-sign-out]").addEventListener("click", () => {
    clearAccess();
    window.location.href = "index.html";
  });
})();
