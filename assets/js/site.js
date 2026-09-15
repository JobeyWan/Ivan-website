(function initSite() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const appLink = document.querySelector("[data-app-link]");
  if (appLink && hasLiveAccess()) {
    appLink.textContent = "Access saved";
    appLink.setAttribute("href", "#");
  }
})();
