/* Shared behaviour for all pages. Every block exits quietly when its elements
   are absent, because one file serves all six pages. */

/* Mobile menu: toggle #mnav, keep aria-expanded and the button glyph in sync. */
(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('mnav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? '\u2715' : '\u2630';
  });
  Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
    });
  });
})();

/* "Do pobrania" tiles: the link works when the file is present in materialy/.
   A missing document is marked "Wkrotce" instead of leading to a 404. */
(function () {
  var tiles = document.querySelectorAll('.dl a[download]');
  Array.prototype.forEach.call(tiles, function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    fetch(href, { method: 'HEAD' }).then(function (res) {
      if (res.ok) return;
      a.classList.add('dl-soon');
      a.removeAttribute('href');
      a.removeAttribute('download');
      a.setAttribute('aria-disabled', 'true');
      var title = a.querySelector('.t');
      if (title && !title.querySelector('.badge-soon')) {
        var badge = document.createElement('span');
        badge.className = 'badge-soon';
        badge.textContent = 'Wkr\u00f3tce';
        title.appendChild(badge);
      }
    }).catch(function () { /* no response - keep the link working */ });
  });
})();

/* Newsletter: moved here unchanged from index.html. Known to be unreliable
   (mailto plus an unconditional redirect); replaced by Netlify Forms in stage 3. */
(function () {
  var f = document.getElementById('nlForm');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var imie = (f.imie && f.imie.value || '').trim();
    var email = (f.email && f.email.value || '').trim();
    var s = encodeURIComponent('Zapis do newslettera Fundacji WZ UW');
    var b = encodeURIComponent('Prosze o zapisanie mnie do newslettera Fundacji na rzecz Wydzialu Zarzadzania UW.\n\nImie: ' + imie + '\nAdres e-mail: ' + email + '\n\nOswiadczam, ze zapoznalem/-am sie z Polityka prywatnosci oraz wyrazam zgode na otrzymywanie newslettera i informacji handlowych droga elektroniczna.');
    window.location.href = 'mailto:kontakt@fundacjawzuw.pl?subject=' + s + '&body=' + b;
    setTimeout(function () { window.location.href = 'dziekujemy.html'; }, 400);
  });
})();
