/* Lightbox — opens on any [data-lightbox] element, zooms 50–300% in 25% steps.
   ESC and backdrop click close. */
(function () {
  'use strict';
  var box = document.getElementById('lightbox');
  if (!box) return;
  var img = document.getElementById('lightbox-img');
  var pct = document.getElementById('lightbox-pct');
  var zoom = 1;
  var lastFocus = null;

  function applyZoom() {
    img.style.transform = 'scale(' + zoom + ')';
    pct.textContent = Math.round(zoom * 100) + '%';
  }

  function open(src, alt) {
    lastFocus = document.activeElement;
    zoom = 1;
    img.src = src;
    img.alt = alt || '';
    applyZoom();
    box.hidden = false;
    box.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    var close = box.querySelector('[data-lightbox-close]');
    if (close) close.focus();
  }

  function close() {
    box.classList.remove('is-open');
    box.hidden = true;
    document.body.classList.remove('lightbox-open');
    img.src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest ? e.target.closest('[data-lightbox]') : null;
    if (!trigger) return;
    e.preventDefault();
    var full = trigger.getAttribute('data-lightbox');
    var inner = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
    open(full || (inner && inner.src), inner && inner.alt);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var trigger = e.target.closest ? e.target.closest('[data-lightbox]') : null;
    if (!trigger) return;
    e.preventDefault();
    var inner = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
    open(trigger.getAttribute('data-lightbox') || (inner && inner.src), inner && inner.alt);
  });

  box.addEventListener('click', function (e) {
    if (e.target === box || e.target === img || e.target.hasAttribute('data-lightbox-close')) {
      close();
    }
  });

  Array.prototype.forEach.call(box.querySelectorAll('[data-zoom]'), function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dir = parseInt(btn.getAttribute('data-zoom'), 10);
      zoom = Math.min(3, Math.max(0.5, zoom + dir * 0.25));
      applyZoom();
    });
  });

  var zoomBar = box.querySelector('.lightbox__zoom');
  if (zoomBar) zoomBar.addEventListener('click', function (e) { e.stopPropagation(); });

  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') { zoom = Math.min(3, zoom + 0.25); applyZoom(); }
    if (e.key === '-') { zoom = Math.max(0.5, zoom - 0.25); applyZoom(); }
  });
})();
