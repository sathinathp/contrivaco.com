/* ═══════════════════════════════════════════════════════
   CONTRIVA — Shared JavaScript
   Hamburger nav · Scroll-to-top · Scroll-reveal · Counters
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── NAVBAR: active link ───────────────────────────── */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── NAVBAR: scroll shadow ─────────────────────────── */
  var navbar = document.querySelector('nav');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ── HAMBURGER ─────────────────────────────────────── */
  var toggle   = document.getElementById('navToggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── SCROLL-TO-TOP ─────────────────────────────────── */
  var scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', function () {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── SCROLL REVEAL ─────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .stat-card, .job-card, .team-card, .about-item, .reveal').forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ── COUNTER ANIMATIONS ────────────────────────────── */
  function animateCount(el, target, suffix) {
    var start = 0;
    var step  = target / (1800 / 16);
    var run   = function () {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start) + suffix;
      if (start < target) requestAnimationFrame(run);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(run);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var raw = el.getAttribute('data-count') || el.textContent.trim();
          var suffix = raw.replace(/[\d,]/g, '');
          var num = parseInt(raw.replace(/\D/g, ''), 10);
          if (!isNaN(num)) { el.textContent = '0' + suffix; animateCount(el, num, suffix); }
          cio.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-num, .hero-metric-num').forEach(function (el) { cio.observe(el); });
  }

  /* ── CONTACT FORM VALIDATION ───────────────────────── */
  var form = document.getElementById('contactForm');
  if (form) {
    var msgBox    = document.getElementById('formMsg');
    var submitBtn = document.getElementById('submitBtn');

    function showMsg(text, type) {
      msgBox.textContent = text;
      msgBox.className   = 'form-msg ' + type;
    }

    function validate() {
      var ok = true;
      form.querySelectorAll('.err').forEach(function (el) { el.classList.remove('err'); });
      var name    = form.querySelector('[name="firstName"]');
      var email   = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      if (name    && !name.value.trim())                          { name.classList.add('err');    ok = false; }
      if (email   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('err'); ok = false; }
      if (message && !message.value.trim())                       { message.classList.add('err'); ok = false; }
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) { showMsg('Please fill in all required fields correctly.', 'error'); return; }
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending\u2026';

      /* Replace 'FORMSPREE_ID' with your actual Formspree form ID */
      fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          firstName: (form.querySelector('[name="firstName"]') || {}).value,
          lastName:  (form.querySelector('[name="lastName"]')  || {}).value,
          email:     (form.querySelector('[name="email"]')     || {}).value,
          phone:     (form.querySelector('[name="phone"]')     || {}).value,
          service:   (form.querySelector('[name="service"]')   || {}).value,
          message:   (form.querySelector('[name="message"]')   || {}).value
        })
      })
      .then(function (res) {
        return res.json().then(function(data) {
          if (res.ok && data.ok) {
            showMsg('\u2713 Message sent! We\u2019ll be in touch shortly.', 'success');
            form.reset();
          } else {
            showMsg('Something went wrong. Please email us directly at info@contrivainc.com', 'error');
          }
        });
      })
      .catch(function () {
        showMsg('Something went wrong. Please email us directly at info@contrivainc.com', 'error');
      })
      .finally(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message \u2192';
      });
    });
  }

})();

