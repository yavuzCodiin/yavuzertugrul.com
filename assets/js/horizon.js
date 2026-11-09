/*
 * The whoami scene: a small figure leads a T. rex skeleton on a rope across a
 * moving perspective floor. The figures are cut-out vector parts traced from
 * the photo and posed with two-bone inverse kinematics, so feet stay planted
 * instead of sliding.
 *
 * Stops when off-screen or when the tab is hidden, and never starts under
 * prefers-reduced-motion.
 */

/*
 * The perspective floor is adapted from retro-grid by Magic UI:
 * https://github.com/magicuidesign/magicui
 *
 * MIT License
 *
 * Copyright (c) Magic UI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
  'use strict';

  var figures = document.querySelectorAll('[data-horizon]');
  if (!figures.length) return;

  var NS = 'http://www.w3.org/2000/svg';
  var TAU = Math.PI * 2;
  var DEG = 180 / Math.PI;

  // Silhouette bounds and rest-pose joints, in pixels of the source photo.
  var BOUNDS = { left: 60, right: 1208, top: 85, ground: 617 };
  var LEGS = {
    f: { H: [790, 340], K: [715, 447], A: [708, 555], T: [590, 612], offset: 0 },
    r: { H: [838, 345], K: [865, 450], A: [953, 535], T: [870, 613], offset: 0.5 }
  };
  var GAIT = { period: 3, stance: 0.6, front: -200, back: -20, lift: 30, heel: 26 / DEG, hang: 30 / DEG };
  var STRIDE = GAIT.back - GAIT.front;
  var SPEED = STRIDE / (GAIT.stance * GAIT.period); // source px per second
  var ROPE = { man: [95, 561], rex: [503, 214], bend: [422, 528] };
  var MAN = { hip: [76, 588], thigh: 16.5, shin: 16.5, foot: 5.5, front: -20, back: 20, lift: 6, period: 0.69, stance: 0.58 };

  Object.keys(LEGS).forEach(function (key) {
    var leg = LEGS[key];
    leg.l1 = dist(leg.H, leg.K); leg.l2 = dist(leg.K, leg.A); leg.l3 = dist(leg.A, leg.T);
    leg.a1 = angle(leg.H, leg.K); leg.a2 = angle(leg.K, leg.A); leg.a3 = angle(leg.A, leg.T);
  });

  function dist(a, b) { return Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function angle(a, b) { return Math.atan2(b[1] - a[1], b[0] - a[0]); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function n(v) { return Math.round(v * 100) / 100; }

  // Hip to ankle with fixed bone lengths. The knee always points forward.
  function knee(hip, ankle, l1, l2) {
    var d = Math.min(dist(hip, ankle), (l1 + l2) * 0.999);
    var base = angle(hip, ankle);
    var bend = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
    return [hip[0] + l1 * Math.cos(base + bend), hip[1] + l1 * Math.sin(base + bend)];
  }

  function place(el, from, to, a0, a1) {
    el.setAttribute('transform', 'translate(' + n(to[0]) + ' ' + n(to[1]) + ') rotate(' + n((a1 - a0) * DEG) + ') translate(' + (-from[0]) + ' ' + (-from[1]) + ')');
  }

  function init(fig) {
    var svg = fig.querySelector('svg');
    var q = function (s) { return svg.querySelector(s); };
    var part = function (name) { return q('[data-part="' + name + '"]'); };
    var walkers = q('[data-walkers]'), body = q('[data-body]'), head = part('head'), tail = part('tail');
    var man = q('[data-man]'), rope = q('[data-rope]'), legA = q('[data-man-leg="a"]'), legB = q('[data-man-leg="b"]');
    var rowsG = q('[data-rows]'), raysG = q('[data-rays]'), glow = q('[data-glow]'), line = q('[data-line]');
    var parts = { f: [part('thigh_f'), part('shin_f'), part('foot_f')], r: [part('thigh_r'), part('shin_r'), part('foot_r')] };

    var ROWS = 31, RAYS = 41;
    var NEAR = [0.22, 0.3, 0.42, 0.58]; // rows only a stretched panel ever shows
    var rows = [], rays = [];
    for (var i = 0; i < ROWS; i++) { var r = document.createElementNS(NS, 'line'); rowsG.appendChild(r); rows.push(r); }
    for (var j = 0; j < RAYS; j++) { var s = document.createElementNS(NS, 'line'); raysG.appendChild(s); rays.push(s); }

    var W = 0, H = 0, natural = 0, horizon = 0, feet = 0, base = 0, scale = 1, cell = 1, far = 1;
    var time = 0, shift = 0, last = 0, frame = 0;
    var visible = true;

    function layout() {
      var box = fig.getBoundingClientRect();
      if (!box.width || !box.height) return;
      W = box.width; H = box.height;
      // The scene is composed for the panel's natural height (its CSS min-height).
      // When the page stretches it to reach the bottom of a tall screen, the extra
      // is only more floor: the pair keeps its place and size.
      natural = Math.min(H, parseFloat(getComputedStyle(fig).minHeight) || H);
      svg.setAttribute('viewBox', '0 0 ' + n(W) + ' ' + n(H));
      horizon = natural * 0.36;
      feet = natural * 0.816;
      base = natural * 1.09;
      far = natural * 0.906;
      var fw = BOUNDS.right - BOUNDS.left, fh = BOUNDS.ground - BOUNDS.top;
      scale = Math.min((W * 0.76) / fw, (natural * 0.7) / fh);
      // The floor is sized from the figure, so a wider window shows more floor, not bigger tiles.
      cell = Math.max(scale * 320, 84);
      glow.setAttribute('cx', n(W / 2)); glow.setAttribute('cy', n(horizon + natural * 0.02));
      glow.setAttribute('rx', n(W * 0.64)); glow.setAttribute('ry', n(natural * 0.17));
      line.setAttribute('d', 'M0 ' + n(horizon) + 'H' + n(W));
      var mask = q('[data-mask-rect]');
      mask.setAttribute('y', n(horizon)); mask.setAttribute('width', n(W)); mask.setAttribute('height', n(H - horizon));
      var fade = svg.querySelector('#hz-fade');
      fade.setAttribute('y1', n(horizon)); fade.setAttribute('y2', n(natural));
      var edge = q('[data-edge-rect]');
      edge.setAttribute('width', n(W)); edge.setAttribute('height', n(H));
      draw();
    }

    function drawGrid() {
      var cx = W / 2;
      var bottom = Math.max(H, base), reach = (bottom - horizon) / (base - horizon);
      rows.forEach(function (el, i) {
        var y = horizon + far / (i < NEAR.length ? NEAR[i] : i - NEAR.length + 0.75);
        el.setAttribute('x1', 0); el.setAttribute('x2', n(W));
        el.setAttribute('y1', n(y)); el.setAttribute('y2', n(y));
        el.setAttribute('opacity', n(Math.min(0.76, Math.max(0, (y - horizon - natural * 0.04) / (natural * 0.29)))));
      });
      rays.forEach(function (el, i) {
        el.setAttribute('x1', n(cx)); el.setAttribute('y1', n(horizon));
        el.setAttribute('x2', n(cx + (i - 20 + shift) * cell * reach)); el.setAttribute('y2', n(bottom));
      });
    }

    function drawRex(phase) {
      var bob = 5 * Math.cos(2 * TAU * phase);
      ['f', 'r'].forEach(function (key) {
        var leg = LEGS[key], p = parts[key];
        var ph = (phase + leg.offset) % 1;
        var hip = [leg.H[0], leg.H[1] + bob];
        var tx, ty = leg.T[1], ar;
        if (ph < GAIT.stance) {
          // Planted: the toe holds the ground and the heel peels up late in the step.
          var st = ph / GAIT.stance;
          tx = hip[0] + lerp(GAIT.front, GAIT.back, st);
          ar = leg.a3 - GAIT.heel * st * st;
        } else {
          var sw = (ph - GAIT.stance) / (1 - GAIT.stance);
          tx = hip[0] + lerp(GAIT.back, GAIT.front, smooth(sw));
          ty -= GAIT.lift * Math.sin(Math.PI * sw);
          ar = sw < 0.4 ? leg.a3 - lerp(GAIT.heel, GAIT.hang, sw / 0.4) : leg.a3 - lerp(GAIT.hang, 0, smooth((sw - 0.4) / 0.6));
        }
        var toe = [tx, ty];
        var ankle = [toe[0] - leg.l3 * Math.cos(ar), toe[1] - leg.l3 * Math.sin(ar)];
        var kn = knee(hip, ankle, leg.l1, leg.l2);
        place(p[0], leg.H, hip, leg.a1, angle(hip, kn));
        place(p[1], leg.K, kn, leg.a2, angle(kn, ankle));
        place(p[2], leg.A, ankle, leg.a3, ar);
      });
      body.setAttribute('transform', 'translate(0 ' + n(bob) + ') rotate(' + n(0.5 * Math.sin(TAU * phase)) + ' 800 340)');
      head.setAttribute('transform', 'rotate(' + n(1.3 * Math.sin(2 * TAU * phase + 0.7) - 0.3) + ' 545 190)');
      tail.setAttribute('transform', 'rotate(' + n(1.7 * Math.sin(TAU * phase + 1.1)) + ' 905 350)');
      return bob;
    }

    function manLeg(el, ph, hip) {
      var x, y = BOUNDS.ground - 2;
      if (ph < MAN.stance) {
        x = hip[0] + lerp(MAN.front, MAN.back, ph / MAN.stance);
      } else {
        var sw = (ph - MAN.stance) / (1 - MAN.stance);
        x = hip[0] + lerp(MAN.back, MAN.front, smooth(sw));
        y -= MAN.lift * Math.sin(Math.PI * sw);
      }
      var ankle = [x, y];
      var kn = knee(hip, ankle, MAN.thigh, MAN.shin);
      el.setAttribute('d', 'M' + n(hip[0]) + ' ' + n(hip[1]) + 'L' + n(kn[0]) + ' ' + n(kn[1]) + 'L' + n(ankle[0]) + ' ' + n(ankle[1]) + 'l' + (-MAN.foot) + ' .6');
    }

    function drawMan(t) {
      var ph = (t / MAN.period) % 1;
      var bob = 1.1 * Math.cos(2 * TAU * ph);
      var hip = [MAN.hip[0], MAN.hip[1] + bob];
      man.setAttribute('transform', 'translate(0 ' + n(bob) + ') rotate(' + n(1.2 * Math.sin(TAU * ph)) + ' ' + MAN.hip[0] + ' ' + MAN.hip[1] + ')');
      manLeg(legA, ph, hip);
      manLeg(legB, (ph + 0.5) % 1, hip);
      return bob;
    }

    function drawRope(t, rexBob, manBob) {
      var sway = 5 * Math.sin(t * 1.3), lift = 3 * Math.sin(t * 2.1 + 1);
      var a = ROPE.man, b = ROPE.rex;
      rope.setAttribute('d', 'M' + a[0] + ' ' + n(a[1] + manBob) + 'Q' + n(ROPE.bend[0] + sway) + ' ' + n(ROPE.bend[1] + lift) + ' ' + b[0] + ' ' + n(b[1] + rexBob));
    }

    function drawWalkers() {
      var rexBob = drawRex((time / GAIT.period) % 1);
      drawRope(time, rexBob, drawMan(time));
      // The photo faces left, so the pair is mirrored to walk left to right.
      var cx = (BOUNDS.left + BOUNDS.right) / 2;
      walkers.setAttribute('transform', 'translate(' + n(W / 2) + ' ' + n(feet) + ') scale(' + (-scale).toFixed(4) + ' ' + scale.toFixed(4) + ') translate(' + (-cx) + ' ' + (-BOUNDS.ground) + ')');
    }

    function draw() { if (W) { drawGrid(); drawWalkers(); } }

    // Floor cells per second at the depth of the feet, so the planted foot moves with the floor.
    function shiftRate() { return SPEED * scale / (cell * (feet - horizon) / (base - horizon)); }

    function step(dt) {
      time += dt;
      shift -= dt * shiftRate();
      shift -= Math.floor(shift);
    }

    function tick(now) {
      if (last) step(Math.min((now - last) / 1000, 0.05));
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      frame = 0; last = 0;
      draw();
      if (visible && !motion.matches && !document.hidden) frame = requestAnimationFrame(tick);
    }

    document.addEventListener('visibilitychange', sync);
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }, { rootMargin: '80px' }).observe(fig);
    new ResizeObserver(layout).observe(fig);
    motion.addEventListener('change', sync);
    layout();
    sync();
  }

  var motion = matchMedia('(prefers-reduced-motion: reduce)');

  figures.forEach(init);
})();
