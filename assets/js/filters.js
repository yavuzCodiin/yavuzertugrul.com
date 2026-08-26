/* Client-side chip filtering for the Posts / Sketches / Archive ledgers, plus
   the "Load more" step on the sketch mosaic. Everything is already in the DOM;
   the chips only hide rows, so the pages work with JS off. */
(function () {
  'use strict';

  // ── Filter chips ───────────────────────────────────────────────────────────
  Array.prototype.forEach.call(document.querySelectorAll('[data-filter-group]'), function (group) {
    var scope = document.querySelector(group.getAttribute('data-filter-group'));
    if (!scope) return;
    var chips = group.querySelectorAll('[data-filter]');

    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        var value = chip.getAttribute('data-filter');

        Array.prototype.forEach.call(chips, function (c) {
          var on = c === chip;
          c.classList.toggle('tag-solid', on);
          c.classList.toggle('tag-outline', !on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        Array.prototype.forEach.call(scope.querySelectorAll('[data-tags]'), function (item) {
          var tags = (item.getAttribute('data-tags') || '').split('|');
          item.hidden = !(value === 'all' || tags.indexOf(value) !== -1);
        });

        // Hide a year group whose rows are all filtered out.
        Array.prototype.forEach.call(scope.querySelectorAll('.year-group'), function (yg) {
          var shown = yg.querySelectorAll('[data-tags]:not([hidden])').length;
          yg.hidden = shown === 0;
        });
      });
    });
  });

  // ── Load more (sketch mosaic) ──────────────────────────────────────────────
  var more = document.querySelector('[data-load-more]');
  if (more) {
    var mosaic = document.querySelector(more.getAttribute('data-load-more'));
    var counter = document.querySelector('[data-shown-count]');
    var step = parseInt(more.getAttribute('data-step'), 10) || 8;

    more.addEventListener('click', function (e) {
      e.preventDefault();
      var hidden = mosaic.querySelectorAll('.tile.is-hidden');
      for (var i = 0; i < step && i < hidden.length; i++) {
        hidden[i].classList.remove('is-hidden');
      }
      var total = mosaic.querySelectorAll('.tile').length;
      var shown = total - mosaic.querySelectorAll('.tile.is-hidden').length;
      if (counter) counter.textContent = shown + ' / ' + total + ' shown';
      if (shown >= total) more.hidden = true;
    });
  }
})();
