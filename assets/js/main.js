(function () {
  'use strict';

  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrDd0Ua5nAuRRivWb9dUv7tkqFpTK3PdrMC5ie_9aBxbN-LUSw1y0h6qgJCj8HyHX8Pw/exec';

  // --- Language Detection & Redirect ---
  // Only on English homepage, only if user hasn't manually chosen a language
  if (window.location.pathname === '/' && !localStorage.getItem('coorda-lang')) {
    var lang = navigator.language || navigator.userLanguage || '';
    if (lang.toLowerCase().startsWith('fr')) {
      window.location.replace('/fr/');
      return;
    }
  }

  // --- Language Toggle ---
  var langOptions = document.querySelectorAll('.lang-option');
  langOptions.forEach(function (el) {
    el.addEventListener('click', function () {
      localStorage.setItem('coorda-lang', el.getAttribute('data-lang'));
    });
  });

  // --- Smooth Scroll for CTA ---
  var ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('signup-form');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // --- Form Submission ---
  var form = document.getElementById('signup-form');
  if (!form) return;

  var submitBtn = document.getElementById('signup-submit');
  var successMsg = document.getElementById('form-success');
  var errorMsg = document.getElementById('form-error');

  // Store original button text for error recovery
  var originalText = submitBtn.textContent.trim();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var company = form.querySelector('[name="company"]').value.trim();

    // Clear previous error highlights
    nameInput.classList.remove('input-error');
    emailInput.classList.remove('input-error');
    errorMsg.hidden = true;

    // Validate required fields
    var hasError = false;
    if (!name) { nameInput.classList.add('input-error'); hasError = true; }
    if (!email) { emailInput.classList.add('input-error'); hasError = true; }
    if (hasError) return;

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add('input-error');
      errorMsg.textContent = form.getAttribute('data-email-error');
      errorMsg.hidden = false;
      return;
    }

    // Disable button, show loading
    submitBtn.disabled = true;
    submitBtn.textContent = '...';
    successMsg.hidden = true;
    errorMsg.hidden = true;

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, company: company })
    })
      .then(function () {
        form.reset();
        form.hidden = true;
        successMsg.hidden = false;
      })
      .catch(function () {
        errorMsg.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
})();
