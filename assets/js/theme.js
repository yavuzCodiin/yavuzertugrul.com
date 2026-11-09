/*
 * Light and dark themes. The page is developed like a contact print: going
 * dark, a wet, grainy front rises from the bottom; going light, it pours down
 * from the top. After the "Cyanotype Bloom" study by Subframe.
 *
 * Uses the View Transitions API. Browsers without it, and visitors who ask for
 * reduced motion, get an instant switch.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-theme-toggle]');
  if (!buttons.length) return;

  var COLORS = { black: '#100f0f', paper: '#fffcf0' };
  var NEXT = { black: 'light', paper: 'dark' };
  var meta = document.querySelector('meta[name="theme-color"]');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prints = null;
  var busy = false;

  function current() { return root.getAttribute('data-theme') === 'paper' ? 'paper' : 'black'; }

  function label() {
    var name = NEXT[current()];
    buttons.forEach(function (button) {
      button.setAttribute('aria-label', 'Switch to ' + name + ' theme');
      button.title = 'Switch to ' + name + ' theme';
    });
  }

  function commit(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode: lasts for this page only */ }
    if (meta) meta.content = COLORS[next];
    label();
  }

  function canvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }

  // Layered noise, scaled up by the canvas itself: much cheaper than per-pixel maths.
  function cloud(w, h) {
    var field = canvas(w, h);
    var ctx = field.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    [[6, 1], [15, 0.45], [41, 0.16]].forEach(function (octave) {
      var cols = octave[0], rows = Math.max(2, Math.round(cols * h / w / 3));
      var cells = canvas(cols, rows), c2 = cells.getContext('2d');
      var img = c2.createImageData(cols, rows);
      for (var i = 0; i < img.data.length; i += 4) {
        img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.random() * 255;
        img.data[i + 3] = 255;
      }
      c2.putImageData(img, 0, 0);
      ctx.globalAlpha = octave[1];
      ctx.drawImage(cells, 0, 0, w, h);
    });
    return ctx.getImageData(0, 0, w, h).data;
  }

  function url(c) {
    return new Promise(function (resolve) {
      c.toBlob(function (blob) { resolve(URL.createObjectURL(blob)); }, 'image/png');
    });
  }

  // Two masks share one wandering edge, a small gap apart. The gap is the wet band.
  function makePrints() {
    if (prints) return prints;
    var TOTAL = 2.7, EDGE = 1.35, SOFT = 0.05, GAP = 0.05;
    var w = 520, h = Math.min(1500, Math.round(w * (window.innerHeight / window.innerWidth) * TOTAL));
    var noise = cloud(w, h);
    var below = canvas(w, h), above = canvas(w, h);
    var bc = below.getContext('2d'), ac = above.getContext('2d');
    var bi = bc.createImageData(w, h), ai = ac.createImageData(w, h);
    function smooth(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
    for (var y = 0, p = 0; y < h; y++) {
      var u = (y + 0.5) / h * TOTAL;
      for (var x = 0; x < w; x++, p += 4) {
        var wander = (noise[p] / 255 - 0.5) * 0.62;
        wander = wander < -0.22 ? -0.22 : wander > 0.22 ? 0.22 : wander;
        var edge = EDGE + wander + (Math.random() - 0.5) * 0.045;
        bi.data[p + 3] = 255 * smooth((u - edge + SOFT) / (2 * SOFT));
        ai.data[p + 3] = 255 * (1 - smooth((u - edge + GAP + SOFT) / (2 * SOFT)));
      }
    }
    bc.putImageData(bi, 0, 0);
    ac.putImageData(ai, 0, 0);
    prints = Promise.all([url(below), url(above)]).then(function (urls) {
      return { below: urls[0], above: urls[1] };
    });
    return prints;
  }

  function develop(next) {
    var rising = next === 'black';
    return makePrints().then(function (p) {
      root.style.setProperty('--print-new', 'url("' + (rising ? p.below : p.above) + '")');
      root.style.setProperty('--print-old', 'url("' + (rising ? p.above : p.below) + '")');
      root.setAttribute('data-developing', rising ? 'up' : 'down');
      var transition = document.startViewTransition(function () { commit(next); });
      return transition.finished.then(done, done);
      function done() {
        root.removeAttribute('data-developing');
        root.style.removeProperty('--print-new');
        root.style.removeProperty('--print-old');
      }
    });
  }

  function toggle() {
    if (busy) return;
    var next = current() === 'paper' ? 'black' : 'paper';
    if (!document.startViewTransition || motion.matches) { commit(next); return; }
    busy = true;
    develop(next).catch(function () { commit(next); }).then(function () { busy = false; });
  }

  // Prepare the masks at the first sign of intent, so the first click is instant.
  function warm() { makePrints(); }
  buttons.forEach(function (button) {
    button.addEventListener('click', toggle);
    ['pointerenter', 'focus', 'touchstart'].forEach(function (type) {
      button.addEventListener(type, warm, { once: true, passive: true });
    });
  });
  label();
})();
