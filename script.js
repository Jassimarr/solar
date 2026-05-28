const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const themeLogos = document.querySelectorAll(".theme-logo");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeLogos.forEach(logo => {
    logo.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    logo.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  });
}

const savedTheme = localStorage.getItem("ss-solar-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
applyTheme(savedTheme || preferredTheme);

themeLogos.forEach(logo => {
  logo.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("ss-solar-theme", nextTheme);
    applyTheme(nextTheme);
  });
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealItems.forEach(item => revealObserver.observe(item));

const billInput = document.querySelector("#monthly-bill");
const sizeInput = document.querySelector("#system-size");
const roofInput = document.querySelector("#roof-type");
const estimateSize = document.querySelector("#estimate-size");
const estimateCopy = document.querySelector("#estimate-copy");

function formatRupees(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function recommendedKwFromBill(bill) {
  if (bill < 2800) return 3;
  if (bill < 5200) return 5;
  if (bill < 8500) return 7;
  return 10;
}

function updateEstimate() {
  if (!billInput || !sizeInput || !estimateSize || !estimateCopy) return;

  const bill = Number(billInput.value || 0);
  const selected = sizeInput.value === "auto" ? recommendedKwFromBill(bill) : Number(sizeInput.value);
  const roofType = roofInput ? roofInput.value : "flat";
  const lowSaving = Math.round(selected * 850);
  const highSaving = Math.round(selected * 1150);
  const roofNote = {
    flat: "Flat concrete roofs usually allow the cleanest mounting layout.",
    sloped: "Sloped roofs may need a custom structure and angle check.",
    tin: "Tin shed roofs require extra structural verification.",
    mixed: "Mixed roofs are best confirmed during the site survey."
  }[roofType];

  estimateSize.textContent = `${selected} kW`;
  estimateCopy.textContent = `Ideal for a monthly bill near ${formatRupees(bill)} with estimated savings around ${formatRupees(lowSaving)}-${formatRupees(highSaving)}. ${roofNote}`;
}

[billInput, sizeInput, roofInput].forEach(input => {
  if (input) input.addEventListener("input", updateEstimate);
});
updateEstimate();

const quoteForm = document.querySelector("#quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", event => {
    event.preventDefault();
    alert("Thank you. A solar advisor will contact you soon for your free consultation.");
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    alert("Thank you. Your free site visit request has been received.");
  });
}
