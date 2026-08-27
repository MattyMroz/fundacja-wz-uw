/* Shared behaviour for every page. No dependencies, no inline handlers, so
   the site runs under a CSP without 'unsafe-inline'. Each block exits
   quietly when its elements are absent - one file serves all seven pages. */

(function () {
  'use strict';

  /* ---- Mobile menu ---------------------------------------------------
     Opens #mnav, keeps aria-expanded in sync, closes on Escape (returning
     focus to the button), on outside click, on link activation and when
     the viewport grows past the desktop breakpoint. */
  var menuBtn = document.querySelector('.menu-btn');
  var mnav = document.getElementById('mnav');

  if (menuBtn && mnav) {
    var desktop = window.matchMedia('(min-width: 66em)');

    var setMenu = function (open) {
      mnav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    var isOpen = function () {
      return menuBtn.getAttribute('aria-expanded') === 'true';
    };

    menuBtn.addEventListener('click', function () {
      setMenu(!isOpen());
    });

    mnav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!isOpen()) return;
      if (event.target.closest('#mnav') || event.target.closest('.menu-btn')) return;
      setMenu(false);
    });

    var onBreakpoint = function (event) {
      if (event.matches) setMenu(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }

  /* ---- Sticky header shade -------------------------------------------
     A hairline shadow appears once the page is scrolled, so the sticky bar
     stays readable over content. Throttled with requestAnimationFrame. */
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var ticking = false;
    var syncShade = function () {
      topbar.classList.toggle('is-stuck', window.scrollY > 4);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncShade);
    }, { passive: true });
    syncShade();
  }

  /* ---- Netlify Forms submission ---------------------------------------
     The form posts normally without JavaScript (method="POST",
     action="/dziekujemy.html"). With JavaScript we post the same payload
     over fetch so a failed request shows an error instead of a thank-you
     page - the exact case that used to fail silently. */
  var encode = function (formData) {
    var pairs = [];
    formData.forEach(function (value, key) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    });
    return pairs.join('&');
  };

  Array.prototype.forEach.call(document.querySelectorAll('form[data-form]'), function (form) {
    var button = form.querySelector('button[type="submit"]');
    var message = form.querySelector('[data-form-msg]');
    var buttonLabel = button ? button.textContent : '';

    var fail = function () {
      if (!message) return;
      message.className = 'form-msg is-error';
      message.innerHTML = 'Nie udało się wysłać zgłoszenia. Sprawdź połączenie i spróbuj ponownie ' +
        'albo napisz bezpośrednio na <a href="mailto:kontakt@fundacjawzuw.pl">kontakt@fundacjawzuw.pl</a>.';
      message.focus();
    };

    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) return;
      event.preventDefault();

      if (message) message.className = 'form-msg';
      if (button) {
        button.disabled = true;
        button.textContent = 'Wysyłanie…';
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(new FormData(form))
      }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        window.location.assign(form.getAttribute('action') || 'dziekujemy.html');
      }).catch(function () {
        if (button) {
          button.disabled = false;
          button.textContent = buttonLabel;
        }
        fail();
      });
    });
  });
})();
