/* ⌘K search — fetches the prebuilt /search.json index once, filters with a
   plain case-insensitive contains match, renders grouped results. */
(function () {
  'use strict';
  var dialog = document.getElementById('search-dialog');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  if (!dialog || !input || !results) return;

  var index = null;
  var loading = false;
  var lastFocus = null;
  var GROUPS = [
    { type: 'post', label: 'Posts' },
    { type: 'note', label: 'Notes' },
    { type: 'art', label: 'Artwork' }
  ];

  function load() {
    if (index || loading) return;
    loading = true;
    fetch((window.SITE_BASEURL || '') + '/search.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; loading = false; render(input.value); })
      .catch(function () {
        loading = false;
        results.innerHTML = '<p class="search__empty">Search index could not be loaded.</p>';
      });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function match(item, q) {
    var hay = (item.title + ' ' + (item.excerpt || '') + ' ' + (item.tags || []).join(' ')).toLowerCase();
    return q.split(/\s+/).every(function (word) { return hay.indexOf(word) !== -1; });
  }

  function render(query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<p class="search__empty">Type to search — posts, thoughts and artwork.</p>';
      return;
    }
    if (!index) {
      results.innerHTML = '<p class="search__empty">Loading…</p>';
      return;
    }
    var hits = index.filter(function (item) { return match(item, q); });
    if (!hits.length) {
      results.innerHTML = '<p class="search__empty">No results for “' + esc(query) + '”.</p>';
      return;
    }
    var html = '';
    GROUPS.forEach(function (g) {
      var group = hits.filter(function (h) { return h.type === g.type; }).slice(0, 8);
      if (!group.length) return;
      html += '<div class="search__group-title">' + g.label + '</div>';
      group.forEach(function (h) {
        html += '<a class="search__hit" href="' + esc(h.url) + '">' +
          '<span class="search__hit-title">' + esc(h.title) + '</span>' +
          '<span class="search__hit-date">' + esc(h.date || '') + '</span>' +
          (h.excerpt ? '<span class="search__hit-excerpt">' + esc(h.excerpt) + '</span>' : '') +
          '</a>';
      });
    });
    results.innerHTML = html;
    var first = results.querySelector('.search__hit');
    if (first) first.classList.add('is-active');
  }

  function open() {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    dialog.classList.add('is-open');
    document.body.classList.add('dialog-open');
    load();
    input.focus();
    input.select();
  }

  function close() {
    dialog.classList.remove('is-open');
    dialog.hidden = true;
    document.body.classList.remove('dialog-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-search-open]'), function (btn) {
    btn.addEventListener('click', open);
  });

  input.addEventListener('input', function () {
    if (!index) load(); // retry after a failed fetch
    render(input.value);
  });

  dialog.addEventListener('mousedown', function (e) {
    if (e.target === dialog) close();
  });

  document.addEventListener('keydown', function (e) {
    var isK = e.key === 'k' || e.key === 'K';
    if (isK && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (dialog.classList.contains('is-open')) close(); else open();
      return;
    }
    if (!dialog.classList.contains('is-open')) return;
    // A lightbox or book-note stacked above this dialog owns ESC.
    if (document.body.classList.contains('lightbox-open') ||
        document.body.classList.contains('booknote-open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
      var hits = Array.prototype.slice.call(results.querySelectorAll('.search__hit'));
      if (!hits.length) return;
      var i = hits.findIndex(function (h) { return h.classList.contains('is-active'); });
      if (e.key === 'Enter') {
        if (i >= 0) { e.preventDefault(); hits[i].click(); }
        return;
      }
      e.preventDefault();
      if (i >= 0) hits[i].classList.remove('is-active');
      var next = e.key === 'ArrowDown'
        ? (i + 1 >= hits.length ? 0 : i + 1)
        : (i - 1 < 0 ? hits.length - 1 : i - 1);
      hits[next].classList.add('is-active');
      hits[next].scrollIntoView({ block: 'nearest' });
    }
  });
})();
