/* TOC scroll-spy for post pages.

   Builds the table of contents from the rendered H2/H3 (kramdown auto_ids),
   then tracks the active heading with an IntersectionObserver: the active H2
   group expands, every other group collapses, and the active H3 gets the
   accent-100 highlight.

   No scrollIntoView on load — the hash, if any, is the browser's business. */
(function () {
  'use strict';
  var body = document.getElementById('post-body');
  var targets = document.querySelectorAll('[data-toc-target]');
  if (!body || !targets.length) return;

  var headings = Array.prototype.slice.call(body.querySelectorAll('h2[id], h3[id]'));
  if (!headings.length) {
    Array.prototype.forEach.call(targets, function (t) {
      var block = t.closest('.rail__block') || t.closest('.toc-mobile');
      if (block) block.style.display = 'none';
    });
    return;
  }

  // ── Build the tree: each H2 owns the H3s that follow it ────────────────────
  var tree = [];
  headings.forEach(function (h) {
    if (h.tagName === 'H2' || !tree.length) {
      tree.push({ el: h, children: [] });
    } else {
      tree[tree.length - 1].children.push(h);
    }
  });

  Array.prototype.forEach.call(targets, function (nav) {
    var html = '';
    tree.forEach(function (group) {
      html += '<span class="toc__group" data-group="' + group.el.id + '">';
      html += '<a class="toc__h2" href="#' + group.el.id + '" data-toc-link="' + group.el.id + '">' + group.el.textContent + '</a>';
      if (group.children.length) {
        html += '<span class="toc__children">';
        group.children.forEach(function (c) {
          html += '<a class="toc__h3" href="#' + c.id + '" data-toc-link="' + c.id + '">' + c.textContent + '</a>';
        });
        html += '</span>';
      }
      html += '</span>';
    });
    nav.innerHTML = html;
  });

  // ── Active state ───────────────────────────────────────────────────────────
  function groupIdFor(id) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].el.id === id) return tree[i].el.id;
      for (var j = 0; j < tree[i].children.length; j++) {
        if (tree[i].children[j].id === id) return tree[i].el.id;
      }
    }
    return null;
  }

  var current = null;
  function setActive(id) {
    if (id === current) return;
    current = id;
    var gid = groupIdFor(id);
    Array.prototype.forEach.call(document.querySelectorAll('.toc__group'), function (g) {
      g.classList.toggle('is-open', g.getAttribute('data-group') === gid);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-toc-link]'), function (a) {
      var linkId = a.getAttribute('data-toc-link');
      a.classList.toggle('is-active', a.classList.contains('toc__h2') ? linkId === gid : linkId === id);
    });
  }

  function currentId() {
    // At the end of the document the final section can be shorter than the
    // viewport, so its heading never reaches the trigger line — pin it there.
    var doc = document.documentElement;
    var atBottom = window.pageYOffset + window.innerHeight >= doc.scrollHeight - 4;
    if (atBottom) return headings[headings.length - 1].id;

    var line = Math.min(240, window.innerHeight * 0.35);
    var active = headings[0].id;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= line) active = headings[i].id;
    }
    return active;
  }

  var observer = new IntersectionObserver(function () {
    setActive(currentId());
  }, { rootMargin: '-120px 0px -60% 0px', threshold: [0, 1] });

  headings.forEach(function (h) { observer.observe(h); });

  // Scrolling alone (without crossing an observed edge) still updates the spy.
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      setActive(currentId());
      ticking = false;
    });
  }, { passive: true });

  setActive(currentId());

  window.addEventListener('resize', function () { setActive(currentId()); }, { passive: true });

  // Clicking a TOC entry scrolls with the sticky offset accounted for.
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('[data-toc-link]') : null;
    if (!link) return;
    e.preventDefault();
    var el = document.getElementById(link.getAttribute('data-toc-link'));
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - 120;
    window.scrollTo({ top: top, behavior: 'smooth' });
    history.replaceState(null, '', '#' + el.id);
  });

  // ── Mobile collapsible box ─────────────────────────────────────────────────
  var mobile = document.querySelector('[data-toc-mobile]');
  if (mobile) {
    var toggle = mobile.querySelector('[data-toc-toggle]');
    var arrow = mobile.querySelector('[data-toc-arrow]');
    toggle.addEventListener('click', function () {
      var open = mobile.getAttribute('aria-expanded') === 'true';
      mobile.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (arrow) arrow.textContent = open ? '▾' : '▴';
    });
  }
})();
