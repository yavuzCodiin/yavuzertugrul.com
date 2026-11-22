/* Client-side chip filtering for the Posts / Sketches / Archive ledgers, plus
   the "Load more" step on the sketch mosaic. Everything is already in the DOM;
   the chips only hide rows, so the ledgers work with JS off (the mosaic then
   shows its first batch). */
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

        // (the mosaic starts its batches again for what is left)
        scope.dispatchEvent(new CustomEvent('filtered', { detail: value }));
      });
    });
  });

  // ── Load more (sketch mosaic) ──────────────────────────────────────────────
  // The mosaic shows its pieces a batch at a time, and a batch always ends on a
  // full row. Tiles come in three sizes (a feature takes 2 × 2 cells, a tall one
  // 1 × 2), so a fixed count left empty cells at the bottom of the grid until the
  // next "Load more". A chip shows its whole category batch by batch from the
  // first piece — not only the pieces that happened to be loaded already.
  var more = document.querySelector('[data-load-more]');
  var mosaic = more && document.querySelector(more.getAttribute('data-load-more'));
  if (mosaic) {
    var counter = document.querySelector('[data-shown-count]');
    var step = parseInt(more.getAttribute('data-step'), 10) || 8;
    var tiles = Array.prototype.slice.call(mosaic.querySelectorAll('.tile'));
    // the first batch is as many as the page was built to show
    var first = tiles.filter(function (t) { return !t.classList.contains('is-hidden'); }).length || step;
    var list = tiles, sizes = [], cols = 0, shown = 0;

    var columns = function () {
      var t = getComputedStyle(mosaic).gridTemplateColumns || '';
      var r = /repeat\(\s*(\d+)/.exec(t);
      return Math.max(1, r ? +r[1] : t.split(/\s+/).filter(Boolean).length);
    };
    var span = function (value) {
      var m = /span\s+(\d+)/.exec(value || '');
      return m ? +m[1] : 1;
    };

    // Empty cells left in the rows the first n tiles of the list take, laid out the
    // way the grid does it: in order, each in the first place after the one before
    // it where it fits.
    var holes = function (n) {
      var taken = [], row = 0, col = 0, depth = 0, used = 0, x, y;
      var fits = function (w, h) {
        for (y = row; y < row + h; y++) for (x = col; x < col + w; x++) if (taken[y] && taken[y][x]) return false;
        return true;
      };
      for (var i = 0; i < n; i++) {
        var w = sizes[i][0], h = sizes[i][1];
        for (;;) {
          if (col + w > cols) { row += 1; col = 0; } else if (fits(w, h)) break; else col += 1;
        }
        for (y = row; y < row + h; y++) {
          taken[y] = taken[y] || [];
          for (x = col; x < col + w; x++) taken[y][x] = true;
        }
        used += w * h;
        depth = Math.max(depth, row + h);
      }
      return depth * cols - used;
    };

    // Shows at least `want` tiles — more, up to a batch more, if that ends the grid on
    // a full row. (The last batch ends where the pieces do.)
    var show = function (want) {
      cols = columns();
      sizes = list.map(function (t) {
        var s = getComputedStyle(t);
        return [Math.min(cols, span(s.gridColumnStart)), span(s.gridRowStart)];
      });
      shown = Math.min(want, list.length);
      for (var k = shown; k <= Math.min(list.length, shown + step - 1); k++) {
        if (!holes(k)) { shown = k; break; }
      }
      tiles.forEach(function (t) {
        var at = list.indexOf(t);
        t.classList.toggle('is-hidden', at === -1 || at >= shown);
      });
      if (counter) counter.textContent = shown + ' / ' + list.length + ' shown';
      more.hidden = shown >= list.length;
    };

    more.addEventListener('click', function (e) {
      e.preventDefault();
      show(shown + step);
    });
    mosaic.addEventListener('filtered', function () {
      list = tiles.filter(function (t) { return !t.hidden; });
      show(first);
    });
    // a wider or narrower window has a different number of columns: what is shown stays, rounded up to a full row
    window.addEventListener('resize', function () {
      if (columns() !== cols) show(shown);
    });
    show(first);
  }
})();
