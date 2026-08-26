/* Mobile menu — full-screen overlay, body scroll locked while open. */
(function () {
  'use strict';
  var menu = document.getElementById('site-menu');
  var toggle = document.querySelector('[data-menu-toggle]');
  if (!menu || !toggle) return;

  function open() {
    menu.hidden = false;
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    var first = menu.querySelector('a, button');
    if (first) first.focus();
  }

  function close() {
    menu.classList.remove('is-open');
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    if (menu.classList.contains('is-open')) close(); else open();
  });

  var closeBtn = menu.querySelector('[data-menu-close]');
  if (closeBtn) closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !menu.classList.contains('is-open')) return;
    // Any overlay stacked above the menu owns ESC.
    if (document.body.classList.contains('dialog-open') ||
        document.body.classList.contains('lightbox-open') ||
        document.body.classList.contains('booknote-open')) return;
    close();
  });

  // A resize past the desktop breakpoint should not leave the body locked.
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && menu.classList.contains('is-open')) close();
  });
})();
