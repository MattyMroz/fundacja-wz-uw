/* Shared behaviour for every page. No dependencies, no inline handlers, so
   the site runs under a CSP without 'unsafe-inline'. Each block exits
   quietly when its elements are absent - one file serves every page. */

(function () {
  'use strict';

  /* The breakpoint matches the desktop @media block in site.css. */
  var desktop = window.matchMedia('(min-width: 56em)');
  var onBreakpoint = function (handler) {
    if (desktop.addEventListener) desktop.addEventListener('change', handler);
    else desktop.addListener(handler);
  };

  /* ---- Mobile menu ---------------------------------------------------
     Opens #mnav, keeps aria-expanded in sync, closes on Escape (returning
     focus to the button), on outside click, on link activation and when
     the viewport grows past the desktop breakpoint. */
  var menuBtn = document.querySelector('.menu-btn');
  var mnav = document.getElementById('mnav');

  if (menuBtn && mnav) {
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

    onBreakpoint(function (event) {
      if (event.matches) setMenu(false);
    });
  }

  /* ---- Programmes dropdown ---------------------------------------------
     The "Programy" button opens .navdrop-panel. Click, Enter and Space
     toggle it; Escape, an outside click, focus leaving the dropdown and
     the switch to the mobile menu close it. A mouse hover opens it and
     closes it 200 ms after the pointer leaves, so crossing the gap to the
     panel does not flicker; a click while hover-open keeps it open.
     Without JavaScript .is-ready is missing and site.css opens the panel
     on hover and focus-within instead. */
  var drop = document.querySelector('.navdrop');

  if (drop) {
    var dropBtn = drop.querySelector('.navdrop-btn');
    var closeTimer = 0;
    var openedByHover = false;

    var setDrop = function (open, byHover) {
      window.clearTimeout(closeTimer);
      openedByHover = open && byHover === true;
      dropBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    var dropOpen = function () {
      return dropBtn.getAttribute('aria-expanded') === 'true';
    };

    drop.classList.add('is-ready');

    dropBtn.addEventListener('click', function () {
      if (openedByHover) setDrop(true);
      else setDrop(!dropOpen());
    });

    drop.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(closeTimer);
      if (!dropOpen()) setDrop(true, true);
    });

    drop.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse' || !openedByHover) return;
      closeTimer = window.setTimeout(function () {
        setDrop(false);
      }, 200);
    });

    drop.addEventListener('focusout', function (event) {
      if (event.relatedTarget && !drop.contains(event.relatedTarget)) setDrop(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !dropOpen()) return;
      var hadFocus = drop.contains(document.activeElement);
      setDrop(false);
      if (hadFocus) dropBtn.focus();
    });

    document.addEventListener('click', function (event) {
      if (dropOpen() && !drop.contains(event.target)) setDrop(false);
    });

    onBreakpoint(function (event) {
      if (!event.matches) setDrop(false);
    });
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
