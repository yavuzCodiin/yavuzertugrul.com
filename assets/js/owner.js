/* Owner mode — progressive disclosure, NOT authentication.

   The site is static: anyone can read the page source and flip this flag.
   It only keeps owner-facing affordances out of a visitor's way. Anything
   genuinely private must never be committed to the repository at all.

   Enable:  visit any page with ?owner=1
            or press the hidden chord  Shift + O  three times in a row
   Disable: visit any page with ?owner=0 */
(function () {
  'use strict';
  var KEY = 'owner';

  function isOwner() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function setOwner(on) {
    try { on ? localStorage.setItem(KEY, '1') : localStorage.removeItem(KEY); } catch (e) {}
    apply();
  }
  function apply() {
    document.body.classList.toggle('is-owner', isOwner());
  }

  var param = new URLSearchParams(window.location.search).get(KEY);
  if (param === '1') setOwner(true);
  if (param === '0') setOwner(false);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  // Hidden shortcut: Shift+O three times within 1.5s.
  var taps = 0, timer = null;
  document.addEventListener('keydown', function (e) {
    if (!e.shiftKey || (e.key !== 'O' && e.key !== 'o')) return;
    if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    taps++;
    clearTimeout(timer);
    timer = setTimeout(function () { taps = 0; }, 1500);
    if (taps >= 3) { taps = 0; setOwner(!isOwner()); }
  });

  // "Public download" toggle inside the owner box — local preference only.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-owner-toggle]') : null;
    if (!btn) return;
    var on = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', on ? 'false' : 'true');
    var state = btn.parentNode.querySelector('[data-owner-state]');
    if (state) {
      state.textContent = state.textContent.replace(on ? '— on' : '— off', on ? '— off' : '— on');
    }
  });
})();
