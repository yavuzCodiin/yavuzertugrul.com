/* Clips — silent loops standing in for animated GIFs (_includes/clip.html).
   Nothing downloads until a clip comes near the viewport; it plays while
   visible and pauses off-screen. Reduced-motion visitors, and browsers that
   refuse to autoplay (iOS Low Power Mode), get the poster and a play button. */
(function () {
  'use strict';
  var clips = document.querySelectorAll('video[data-clip]');
  if (!clips.length) return;

  function manual(v) { v.controls = true; }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(clips, manual);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        v.muted = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () { io.unobserve(v); manual(v); });
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px' });

  Array.prototype.forEach.call(clips, function (v) { io.observe(v); });
})();
