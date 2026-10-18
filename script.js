/* =========================================================
   Portfolio scripts - Syed Wajid Ali Shah
   Vanilla JavaScript, no libraries needed.
   ========================================================= */

// Tell CSS that JavaScript is running (so reveal animations only hide
// content when they are guaranteed to be shown again).
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- 1. Mobile navigation menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var navLinks = document.querySelectorAll(".nav-link");

  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", function () {
    setMenu(!navMenu.classList.contains("open"));
  });

  // Close the menu after choosing a link (smooth scrolling itself is done by CSS)
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  // Close the menu with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  /* ---------- 2. Active link while scrolling ---------- */
  var sections = document.querySelectorAll("main section[id]");

  function updateActiveLink() {
    var scrollPos = window.scrollY + 120; // offset for the fixed header
    var current = "home";

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) { current = section.id; }
    });

    // Career Goals lives inside the Education section, so keep Education highlighted
    if (current === "goals") { current = "education"; }

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", isActive);
      if (isActive) { link.setAttribute("aria-current", "true"); }
      else { link.removeAttribute("aria-current"); }
    });
  }

  /* ---------- 3. Back-to-top button ---------- */
  var backToTop = document.getElementById("backToTop");

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function toggleBackToTop() {
    backToTop.classList.toggle("show", window.scrollY > 500);
  }

  // One throttled scroll handler for both features (keeps the page fast)
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(function () {
      updateActiveLink();
      toggleBackToTop();
      ticking = false;
    });
  }, { passive: true });

  updateActiveLink();
  toggleBackToTop();

  /* ---------- 4. Reveal animations ---------- */
  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    // Older browsers: just show everything
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  }

  /* ---------- 5. GitHub buttons ---------- */
  // Buttons stay inactive until you add a real URL in data-github="..." in index.html
  document.querySelectorAll(".github-btn").forEach(function (btn) {
    var url = (btn.getAttribute("data-github") || "").trim();

    if (url) {
      btn.href = url;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.removeAttribute("aria-disabled");
    } else {
      btn.title = "GitHub link coming soon";
      btn.addEventListener("click", function (e) { e.preventDefault(); });
    }
  });

  /* ---------- 6. Contact form validation ---------- */
  var form = document.getElementById("contactForm");
  var statusBox = document.getElementById("formStatus");

  // Put your email address here if you ever change it
  var RECIPIENT = "shahwajidalisyed@gmail.com";

  function showError(input, message) {
    var errorBox = document.getElementById(input.id + "Error");
    errorBox.textContent = message;
    input.closest(".field").classList.toggle("invalid", message !== "");
    if (message) { input.setAttribute("aria-invalid", "true"); }
    else { input.removeAttribute("aria-invalid"); }
  }

  function validateField(input) {
    var value = input.value.trim();
    var message = "";

    if (value === "") {
      message = "Please fill in this field.";
    } else if (input.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Please enter a valid email address.";
    } else if (input.id === "name" && value.length < 2) {
      message = "Name must be at least 2 characters.";
    } else if (input.id === "message" && value.length < 10) {
      message = "Message must be at least 10 characters.";
    }

    showError(input, message);
    return message === "";
  }

  var fields = form.querySelectorAll("input, textarea");

  // Re-check a field as soon as the user leaves it or fixes it
  fields.forEach(function (input) {
    input.addEventListener("blur", function () { validateField(input); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("invalid")) { validateField(input); }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusBox.textContent = "";

    var allValid = true;
    var firstInvalid = null;

    fields.forEach(function (input) {
      if (!validateField(input)) {
        allValid = false;
        if (!firstInvalid) { firstInvalid = input; }
      }
    });

    if (!allValid) {
      firstInvalid.focus();
      return;
    }

    // This site has no server, so the message opens in the visitor's email app.
    var subject = encodeURIComponent(form.subject.value.trim());
    var body = encodeURIComponent(
      "Name: " + form.name.value.trim() + "\n" +
      "Email: " + form.email.value.trim() + "\n\n" +
      form.message.value.trim()
    );

    window.location.href = "mailto:" + RECIPIENT + "?subject=" + subject + "&body=" + body;

    statusBox.textContent = "Thank you! Your email app should open with your message ready to send.";
    form.reset();
  });

  /* ---------- 7. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});
