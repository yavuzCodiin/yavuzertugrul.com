/* Book-note modal — reads the note off the clicked cover's data attributes. */
(function () {
  'use strict';
  var modal = document.getElementById('book-note');
  if (!modal) return;
  var cover = document.getElementById('book-note-cover');
  var title = document.getElementById('book-note-title');
  var author = document.getElementById('book-note-author');
  var rating = document.getElementById('book-note-rating');
  var text = document.getElementById('book-note-text');
  var lastFocus = null;

  function open(btn) {
    lastFocus = btn;
    cover.src = btn.getAttribute('data-cover') || '';
    cover.alt = btn.getAttribute('data-title') || '';
    title.textContent = btn.getAttribute('data-title') || '';
    author.textContent = btn.getAttribute('data-author') || '';
    text.textContent = btn.getAttribute('data-note') || 'No note yet.';

    var score = parseInt(btn.getAttribute('data-rating'), 10) || 0;
    rating.innerHTML = '';
    for (var i = 1; i <= 5; i++) {
      var sq = document.createElement('span');
      if (i <= score) sq.className = 'is-on';
      rating.appendChild(sq);
    }
    rating.setAttribute('aria-label', score ? score + ' out of 5' : 'Not rated');

    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.classList.add('booknote-open');
    var close = modal.querySelector('[data-booknote-close]');
    if (close) close.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('booknote-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-book]') : null;
    if (btn) { e.preventDefault(); open(btn); return; }
    if (e.target === modal || (e.target.closest && e.target.closest('[data-booknote-close]'))) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !modal.classList.contains('is-open')) return;
    // A lightbox stacked above the note owns ESC.
    if (document.body.classList.contains('lightbox-open')) return;
    close();
  });
})();
