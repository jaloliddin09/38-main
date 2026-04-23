// ============================================================
// BG-ANIM — Canvas animated background (Divergent style)
// ============================================================
(function () {
  var canvas, ctx, W, H, animId;
  var particles = [], lines = [], questionMarks = [], cityBuildings = [];
  var CENTER_X, CENTER_Y;
  var COLORS = ['#7c3aed', '#6366f1', '#a855f7', '#4f46e5', '#818cf8', '#06b6d4'];
  var running = false;

  function init() {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    buildScene();
    if (!running) { running = true; loop(); }
    window.addEventListener('resize', onResize);
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    CENTER_X = W * 0.5;
    CENTER_Y = H * 0.32;
  }

  function onResize() {
    resize();
    buildScene();
  }

  // ── City silhouette (static) ──────────────────────────────
  function buildScene() {
    cityBuildings = [];
    var bCount = Math.floor(W / 18);
    for (var i = 0; i < bCount; i++) {
      cityBuildings.push({
        x: (i / bCount) * W,
        w: 10 + Math.random() * 14,
        h: 30 + Math.random() * 90
      });
    }

    // Neural flow lines — Bezier paths from center outward
    lines = [];
    var lineCount = 22;
    for (var l = 0; l < lineCount; l++) {
      var angle = (l / lineCount) * Math.PI * 2;
      var spread = 0.9 + Math.random() * 0.4;
      lines.push({
        angle: angle,
        cp1x: CENTER_X + Math.cos(angle - 0.4) * W * 0.25,
        cp1y: CENTER_Y + Math.sin(angle - 0.4) * H * 0.3,
        cp2x: CENTER_X + Math.cos(angle + 0.4) * W * 0.45,
        cp2y: CENTER_Y + Math.sin(angle + 0.4) * H * 0.45,
        ex:   CENTER_X + Math.cos(angle) * W * spread,
        ey:   CENTER_Y + Math.sin(angle) * H * spread,
        color: COLORS[l % COLORS.length],
        alpha: 0.12 + Math.random() * 0.14,
        width: 0.6 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004
      });
    }

    // Particles along lines
    particles = [];
    for (var p = 0; p < 60; p++) {
      var li = lines[Math.floor(Math.random() * lines.length)];
      particles.push({
        line: li,
        t: Math.random(),
        speed: 0.0015 + Math.random() * 0.003,
        r: 1.2 + Math.random() * 2.2,
        color: li.color,
        alpha: 0.5 + Math.random() * 0.5,
        glow: Math.random() > 0.6
      });
    }

    // Floating ? marks
    questionMarks = [];
    var qPositions = [
      { x: W * 0.28, y: H * 0.42 },
      { x: W * 0.68, y: H * 0.38 },
      { x: W * 0.18, y: H * 0.55 },
      { x: W * 0.78, y: H * 0.52 }
    ];
    qPositions.forEach(function (q, i) {
      questionMarks.push({
        x: q.x, y: q.y,
        baseY: q.y,
        phase: i * 1.5,
        speed: 0.008 + Math.random() * 0.005,
        alpha: 0.25 + Math.random() * 0.2,
        size: 18 + Math.random() * 14,
        color: i % 2 === 0 ? '#f59e0b' : '#a855f7'
      });
    });
  }

  // ── Bezier point at t ──────────────────────────────────────
  function bezierPoint(li, t) {
    var mt = 1 - t;
    return {
      x: mt*mt*mt*CENTER_X + 3*mt*mt*t*li.cp1x + 3*mt*t*t*li.cp2x + t*t*t*li.ex,
      y: mt*mt*mt*CENTER_Y + 3*mt*mt*t*li.cp1y + 3*mt*t*t*li.cp2y + t*t*t*li.ey
    };
  }

  var tick = 0;

  function loop() {
    animId = requestAnimationFrame(loop);
    tick += 0.016;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Fon rasmi bormi?
    var hasBgUrl = !!(window.DATA && window.DATA.settings && window.DATA.settings.bgUrl);

    if (hasBgUrl) {
      // Fon rasmi bor — canvas shaffof, faqat detallar va efektlar chiziladi
      // Yengil qoramtir overlay — animatsiya ko'zga yaqqolroq ko'rinsin
      ctx.fillStyle = 'rgba(5, 2, 20, 0.35)';
      ctx.fillRect(0, 0, W, H);
    } else {
      // Fon rasmi yo'q — canvas o'zi to'q fon chizadi
      var bg = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, H * 0.6, Math.max(W, H) * 0.85);
      bg.addColorStop(0,   '#1a083a');
      bg.addColorStop(0.4, '#0f0528');
      bg.addColorStop(0.8, '#080018');
      bg.addColorStop(1,   '#030010');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
    }

    // ── Neural flow lines ─────────────────────────────────
    lines.forEach(function (li) {
      var pulse = 0.5 + 0.5 * Math.sin(tick * li.speed * 60 + li.phase);
      ctx.beginPath();
      ctx.moveTo(CENTER_X, CENTER_Y);
      ctx.bezierCurveTo(li.cp1x, li.cp1y, li.cp2x, li.cp2y, li.ex, li.ey);
      ctx.strokeStyle = hexAlpha(li.color, li.alpha * (0.7 + 0.3 * pulse));
      ctx.lineWidth = li.width;
      ctx.stroke();
    });

    // ── Particles ─────────────────────────────────────────
    particles.forEach(function (p) {
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      var pt = bezierPoint(p.line, p.t);
      if (p.glow) {
        var g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, p.r * 3);
        g.addColorStop(0, hexAlpha(p.color, p.alpha));
        g.addColorStop(1, hexAlpha(p.color, 0));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = hexAlpha(p.color, p.alpha);
      ctx.fill();
    });

    // ── Brain glow (center) ───────────────────────────────
    var brainPulse = 0.8 + 0.2 * Math.sin(tick * 1.2);
    var brainGlow = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, 80 * brainPulse);
    brainGlow.addColorStop(0,   'rgba(255,255,255,0.18)');
    brainGlow.addColorStop(0.2, 'rgba(168,85,247,0.22)');
    brainGlow.addColorStop(0.5, 'rgba(99,102,241,0.12)');
    brainGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 80 * brainPulse, 0, Math.PI * 2);
    ctx.fillStyle = brainGlow;
    ctx.fill();

    // outer ring glow
    var outerGlow = ctx.createRadialGradient(CENTER_X, CENTER_Y, 0, CENTER_X, CENTER_Y, 160);
    outerGlow.addColorStop(0,   'rgba(139,92,246,0.1)');
    outerGlow.addColorStop(0.6, 'rgba(99,102,241,0.05)');
    outerGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, 160, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow;
    ctx.fill();

    // ── City silhouette ───────────────────────────────────
    ctx.fillStyle = 'rgba(30,8,60,0.75)';
    cityBuildings.forEach(function (b) {
      ctx.fillRect(b.x, H - b.h, b.w, b.h);
    });

    // City glow at horizon
    var cityGlow = ctx.createLinearGradient(0, H - 110, 0, H);
    cityGlow.addColorStop(0, 'rgba(99,102,241,0.08)');
    cityGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cityGlow;
    ctx.fillRect(0, H - 110, W, 110);

    // ── Floating ? marks ──────────────────────────────────
    questionMarks.forEach(function (q) {
      q.y = q.baseY + Math.sin(tick * q.speed * 60 + q.phase) * 10;
      ctx.font = 'bold ' + q.size + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = hexAlpha(q.color, q.alpha * (0.7 + 0.3 * Math.sin(tick + q.phase)));
      ctx.fillText('?', q.x, q.y);
    });

    // ── Binary drizzle left edge ──────────────────────────
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    for (var bi = 0; bi < 8; bi++) {
      var bx = 6 + bi * 12;
      for (var bj = 0; bj < 18; bj++) {
        var by = bj * 28 + ((tick * 18 + bi * 14) % (H + 28)) - 14;
        var bit = (Math.floor(tick * 3 + bi * 7 + bj) % 2) === 0 ? '1' : '0';
        ctx.fillStyle = 'rgba(99,102,241,' + (0.06 + 0.04 * Math.sin(tick + bj)) + ')';
        ctx.fillText(bit, bx, by % H);
      }
    }
  }

  // ── util: hex + alpha ─────────────────────────────────────
  function hexAlpha(hex, a) {
    var r = parseInt(hex.slice(1,3),16);
    var g = parseInt(hex.slice(3,5),16);
    var b = parseInt(hex.slice(5,7),16);
    return 'rgba('+r+','+g+','+b+','+a.toFixed(3)+')';
  }

  // ── Public: stop/start when bgUrl set ──────────────────────
  window.bgAnimShow = function () {
    var c = document.getElementById('bg-canvas');
    if (c) c.style.display = 'block';
  };
  window.bgAnimHide = function () {
    var c = document.getElementById('bg-canvas');
    if (c) c.style.display = 'none';
  };

  // Start after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
