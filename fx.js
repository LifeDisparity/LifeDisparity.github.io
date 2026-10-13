/* FQE background effects, ported from the previous React site.
 *
 * Usage: add data-fx="NAME" to any section; add data-fx-vignette for a dark edge vignette and
 * data-fx-opacity="0.6" to override the default strength. The script inserts the canvas behind
 * the section's content itself, so nothing breaks if it fails to load.
 * Effects: matrix (home hero rain), trading (ASCII price chart), torus (ASCII math torus),
 * pixelblast (WebGL dithered pattern with click ripples).
 *
 * Every effect pauses while offscreen and draws a single still frame when the visitor
 * prefers reduced motion.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  // Runs step() every `interval` ms while the host is on screen. size() is called on resize.
  function runLoop(host, opts) {
    var visible = true;
    var raf = 0;
    var last = 0;

    function frame(t) {
      raf = 0;
      if (!visible || document.hidden || reduceMotion.matches) return;
      if (!opts.interval || t - last >= opts.interval) {
        last = t;
        opts.step(t);
      }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (!raf && visible && !document.hidden && !reduceMotion.matches) raf = requestAnimationFrame(frame);
    }
    function resize() {
      opts.size();
      opts.step(performance.now()); // keep a frame on screen, including for reduced motion
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }).observe(host);
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', start);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', start);

    resize();
    start();
  }

  function sizeCanvas(canvas, host, useDpr) {
    var w = host.offsetWidth;
    var h = host.offsetHeight;
    var dpr = useDpr ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    return { w: w, h: h, dpr: dpr };
  }

  /* ---------- Matrix rain (old home hero) ---------- */
  function matrix(canvas, host) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var letters = 'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ∂∆∇∫∑∏∞≈≠≡≤≥√∝%01'.split('');
    var fontSize = 10, w = 0, h = 0, drops = [];

    runLoop(host, {
      interval: 42,
      size: function () {
        var s = sizeCanvas(canvas, host, true);
        w = s.w; h = s.h;
        ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
        fontSize = window.innerWidth < 768 ? 12 : 10;
        ctx.font = fontSize + 'px "IBM Plex Mono", monospace';
        drops = [];
        var rowCount = Math.ceil(h / fontSize);
        for (var i = 0, n = Math.max(1, Math.floor(w / fontSize)); i < n; i++) drops.push(Math.floor((Math.random() - 0.5) * 2 * rowCount));
      },
      step: function () {
        ctx.fillStyle = 'rgba(5, 20, 10, 0.12)';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#0f0';
        for (var i = 0; i < drops.length; i++) {
          ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize);
          drops[i] += 1;
          if (drops[i] * fontSize > h && Math.random() > 0.95) drops[i] = 0;
        }
      }
    });
  }

  /* ---------- ASCII price chart (old trading competition hero) ---------- */
  function trading(canvas, host) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var charW = 10, charH = 12, topPad = 2, bottomPad = 2;
    var rows = 0, cols = 0, prices = [], trend = -1, sinceSwitch = 0, switchAfter = 0;
    var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

    function init() {
      rows = Math.max(16, Math.floor(canvas.height / charH));
      cols = Math.max(28, Math.ceil(canvas.width / charW) + 4);
      trend = -1; sinceSwitch = 0; switchAfter = 18 + Math.floor(Math.random() * 16);
      prices = [Math.floor(rows * 0.55)];
      while (prices.length < cols + 2) prices.push(nextPrice(prices[prices.length - 1]));
    }
    function nextPrice(last) {
      var minRow = topPad, maxRow = Math.max(minRow + 8, rows - bottomPad);
      if (sinceSwitch >= switchAfter) { trend *= -1; sinceSwitch = 0; switchAfter = 14 + Math.floor(Math.random() * 22); }
      sinceSwitch += 1;
      var drift = trend * (Math.random() * 1.2 + 0.25);
      var noise = (Math.random() - 0.5) * 2.2;
      return clamp(Math.round(last + drift + noise), minRow, maxRow);
    }
    var GREEN = 'rgba(74, 222, 128, 0.95)', RED = 'rgba(248, 113, 113, 0.95)';
    function draw() {
      ctx.fillStyle = 'rgba(5, 20, 10, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // dotted grid
      ctx.fillStyle = 'rgba(163, 184, 170, 0.13)';
      for (var r = 2; r < rows; r += 4) for (var c = 0; c < cols; c += 3) ctx.fillText('.', c * charW, r * charH);
      // series
      for (var i = 1; i < prices.length; i++) {
        var prev = prices[i - 1], cur = prices[i], x = (i - 1) * charW;
        ctx.fillStyle = cur < prev ? GREEN : cur > prev ? RED : 'rgba(163, 184, 170, 0.75)';
        ctx.fillText(cur < prev ? '/' : cur > prev ? '\\' : '-', x, Math.min(prev, cur) * charH);
        ctx.fillStyle = cur < prev ? GREEN : cur > prev ? RED : 'rgba(163, 184, 170, 0.85)';
        ctx.fillText('#', x, cur * charH);
      }
      // latest candle
      var recent = prices.slice(-6);
      var high = Math.min.apply(null, recent), low = Math.max.apply(null, recent);
      var open = prices[prices.length - 2], close = prices[prices.length - 1];
      var cx = (prices.length - 2) * charW, bull = close < open;
      ctx.fillStyle = bull ? 'rgba(74, 222, 128, 0.45)' : 'rgba(248, 113, 113, 0.45)';
      for (var row = high; row <= low; row++) ctx.fillText('|', cx, row * charH);
      ctx.fillStyle = bull ? 'rgba(74, 222, 128, 0.98)' : 'rgba(248, 113, 113, 0.98)';
      for (row = Math.min(open, close); row <= Math.max(open, close); row++) ctx.fillText('#', cx, row * charH);
      // ticker
      var delta = open - close;
      var y = canvas.height - charH * 2;
      ctx.fillStyle = 'rgba(240, 250, 244, 0.9)';
      ctx.fillText('FQE.TRD', charW, y);
      ctx.fillStyle = delta > 0 ? GREEN : delta < 0 ? RED : 'rgba(163, 184, 170, 0.95)';
      ctx.fillText((delta > 0 ? 'BULL' : delta < 0 ? 'BEAR' : 'FLAT') + ' ' + (delta >= 0 ? '+' : '') + (delta * 0.37).toFixed(2) + '%', charW * 10, y);
    }

    runLoop(host, {
      interval: 68,
      size: function () {
        sizeCanvas(canvas, host, false);
        ctx.font = charH + 'px "IBM Plex Mono", monospace';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        init();
      },
      step: function () {
        prices.push(nextPrice(prices[prices.length - 1]));
        if (prices.length > cols + 2) prices.shift();
        draw();
      }
    });
  }

  /* ---------- ASCII math torus (old applied math hero) ---------- */
  function torus(canvas, host) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var cellW = 10, cellH = 13, R1 = 1, R2 = 2, K2 = 5;
    var shades = ['e', 'i', 'pi', 'phi', 'tau', 'ln', 'sin', 'cos', 'sum', 'int', 'sqrt', 'inf'];
    var cols = 0, rows = 0, A = 0, B = 0;

    runLoop(host, {
      size: function () {
        sizeCanvas(canvas, host, false);
        cols = Math.max(24, Math.floor(canvas.width / cellW));
        rows = Math.max(16, Math.floor(canvas.height / cellH));
        ctx.font = cellH + 'px "IBM Plex Mono", monospace';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
      },
      step: function () {
        var n = cols * rows;
        var zBuf = new Float32Array(n), lBuf = new Float32Array(n), chars = new Array(n);
        var cosA = Math.cos(A), sinA = Math.sin(A), cosB = Math.cos(B), sinB = Math.sin(B);
        var K1 = (cols * K2 * 2.4) / (8 * (R1 + R2));
        for (var theta = 0; theta < Math.PI * 2; theta += 0.07) {
          var ct = Math.cos(theta), st = Math.sin(theta);
          for (var phi = 0; phi < Math.PI * 2; phi += 0.02) {
            var cp = Math.cos(phi), sp = Math.sin(phi);
            var cx = R2 + R1 * ct, cy = R1 * st;
            var x = cx * (cosB * cp + sinA * sinB * sp) - cy * cosA * sinB;
            var y = cx * (sinB * cp - sinA * cosB * sp) + cy * cosA * cosB;
            var ooz = 1 / (K2 + cosA * cx * sp + cy * sinA);
            var xp = Math.floor(cols * 0.5 + K1 * ooz * x);
            var yp = Math.floor(rows * 0.5 - K1 * ooz * y * 0.58);
            var L = cp * ct * sinB - cosA * ct * sp - sinA * st + cosB * (cosA * st - ct * sinA * sp);
            if (L <= 0 || xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;
            var idx = xp + yp * cols;
            if (ooz > zBuf[idx]) {
              zBuf[idx] = ooz;
              chars[idx] = shades[Math.max(0, Math.min(shades.length - 1, Math.floor(L * (shades.length - 1))))];
              lBuf[idx] = L;
            }
          }
        }
        ctx.fillStyle = 'rgba(5, 20, 10, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var i = c + r * cols;
            if (!chars[i]) continue;
            ctx.fillStyle = 'rgba(110, 140, 175, ' + Math.min(0.42, 0.08 + lBuf[i] * 0.34) + ')';
            ctx.fillText(chars[i], c * cellW, r * cellH);
          }
        }
        A += 0.0055;
        B += 0.0025;
      }
    });
  }

  /* ---------- PixelBlast (old competition + events backgrounds) ----------
   * Same shader and settings as the old React component (variant diamond, pixelSize 2,
   * color #0a4f12, ripples on click), rewritten for raw WebGL2 so it needs no libraries. */
  var PB_FRAG = [
    '#version 300 es',
    'precision highp float;',
    'uniform vec3 uColor; uniform vec2 uResolution; uniform float uTime; uniform float uPixelSize;',
    'uniform float uScale; uniform float uDensity; uniform float uPixelJitter; uniform int uEnableRipples;',
    'uniform float uRippleSpeed; uniform float uRippleThickness; uniform float uRippleIntensity; uniform float uEdgeFade;',
    'uniform int uShapeType;',
    'const int SHAPE_CIRCLE = 1; const int SHAPE_TRIANGLE = 2; const int SHAPE_DIAMOND = 3;',
    'const int MAX_CLICKS = 10;',
    'uniform vec2 uClickPos[MAX_CLICKS]; uniform float uClickTimes[MAX_CLICKS];',
    'out vec4 fragColor;',
    'float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }',
    '#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))',
    '#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))',
    'float hash11(float n){ return fract(sin(n)*43758.5453); }',
    'float vnoise(vec3 p){',
    '  vec3 ip = floor(p); vec3 fp = fract(p); vec3 k = vec3(1.0,57.0,113.0);',
    '  float n000 = hash11(dot(ip, k)); float n100 = hash11(dot(ip + vec3(1,0,0), k));',
    '  float n010 = hash11(dot(ip + vec3(0,1,0), k)); float n110 = hash11(dot(ip + vec3(1,1,0), k));',
    '  float n001 = hash11(dot(ip + vec3(0,0,1), k)); float n101 = hash11(dot(ip + vec3(1,0,1), k));',
    '  float n011 = hash11(dot(ip + vec3(0,1,1), k)); float n111 = hash11(dot(ip + vec3(1,1,1), k));',
    '  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);',
    '  float y0 = mix(mix(n000, n100, w.x), mix(n010, n110, w.x), w.y);',
    '  float y1 = mix(mix(n001, n101, w.x), mix(n011, n111, w.x), w.y);',
    '  return mix(y0, y1, w.z) * 2.0 - 1.0;',
    '}',
    'float fbm2(vec2 uv, float t){',
    '  vec3 p = vec3(uv * uScale, t); float amp = 1.0; float freq = 1.0; float sum = 1.0;',
    '  for (int i = 0; i < 5; ++i){ sum += amp * vnoise(p * freq); freq *= 1.25; }',
    '  return sum * 0.5 + 0.5;',
    '}',
    'float maskCircle(vec2 p, float cov){ float r = sqrt(cov) * .25; float d = length(p - 0.5) - r; float aa = 0.5 * fwidth(d); return cov * (1.0 - smoothstep(-aa, aa, d * 2.0)); }',
    'float maskTriangle(vec2 p, vec2 id, float cov){ if (mod(id.x + id.y, 2.0) > 0.5) p.x = 1.0 - p.x; float r = sqrt(cov); float d = p.y - r*(1.0 - p.x); float aa = fwidth(d); return cov * clamp(0.5 - d/aa, 0.0, 1.0); }',
    'float maskDiamond(vec2 p, float cov){ float r = sqrt(cov) * 0.564; return step(abs(p.x - 0.49) + abs(p.y - 0.49), r); }',
    'void main(){',
    '  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;',
    '  float aspectRatio = uResolution.x / uResolution.y;',
    '  vec2 pixelId = floor(fragCoord / uPixelSize); vec2 pixelUV = fract(fragCoord / uPixelSize);',
    '  float cellPixelSize = 8.0 * uPixelSize;',
    '  vec2 uv = floor(fragCoord / cellPixelSize) * cellPixelSize / uResolution * vec2(aspectRatio, 1.0);',
    '  float feed = (fbm2(uv, uTime * 0.05) * 0.5 - 0.65) + (uDensity - 0.5) * 0.3;',
    '  if (uEnableRipples == 1) {',
    '    for (int i = 0; i < MAX_CLICKS; ++i){',
    '      vec2 pos = uClickPos[i]; if (pos.x < 0.0) continue;',
    '      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);',
    '      float t = max(uTime - uClickTimes[i], 0.0); float r = distance(uv, cuv);',
    '      float ring = exp(-pow((r - uRippleSpeed * t) / uRippleThickness, 2.0));',
    '      feed = max(feed, ring * exp(-1.0 * t) * exp(-10.0 * r) * uRippleIntensity);',
    '    }',
    '  }',
    '  float bw = step(0.5, feed + Bayer8(fragCoord / uPixelSize) - 0.5);',
    '  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);',
    '  float coverage = bw * (1.0 + (h - 0.5) * uPixelJitter);',
    '  float M;',
    '  if (uShapeType == SHAPE_CIRCLE) M = maskCircle(pixelUV, coverage);',
    '  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);',
    '  else if (uShapeType == SHAPE_DIAMOND) M = maskDiamond(pixelUV, coverage);',
    '  else M = coverage;',
    '  if (uEdgeFade > 0.0) { vec2 norm = gl_FragCoord.xy / uResolution; float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y)); M *= smoothstep(0.0, uEdgeFade, edge); }',
    '  vec3 srgb = mix(uColor * 12.92, 1.055 * pow(uColor, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, uColor));',
    '  fragColor = vec4(srgb * M, M);',
    '}'
  ].join('\n');
  var PB_VERT = '#version 300 es\nin vec2 position;\nvoid main() { gl_Position = vec4(position, 0.0, 1.0); }';

  function pixelblast(el, host) {
    var opts = {
      color: el.dataset.color || '#0a4f12', pixelSize: 2, shape: 3 /* diamond */, scale: 2, density: 1,
      jitter: 0, rippleSpeed: 0.25, rippleThickness: 0.1, rippleIntensity: 1, speed: 0.7, edgeFade: 0.5
    };
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    el.appendChild(canvas);
    var gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!gl) { el.remove(); return; } // no WebGL2: page just keeps its plain background

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var prog = gl.createProgram();
    try {
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, PB_VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, PB_FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (err) {
      console.warn('[fx] pixelblast disabled:', err);
      el.remove();
      return;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    var u = {};
    ['uColor', 'uResolution', 'uTime', 'uPixelSize', 'uScale', 'uDensity', 'uPixelJitter', 'uEnableRipples',
      'uRippleSpeed', 'uRippleThickness', 'uRippleIntensity', 'uEdgeFade', 'uShapeType', 'uClickPos', 'uClickTimes'
    ].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });

    // Hex (sRGB) to linear, like three.js color management; the shader converts back to sRGB.
    var hex = parseInt(opts.color.slice(1), 16);
    var lin = [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255].map(function (c) {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    gl.uniform3f(u.uColor, lin[0], lin[1], lin[2]);
    gl.uniform1f(u.uScale, opts.scale);
    gl.uniform1f(u.uDensity, opts.density);
    gl.uniform1f(u.uPixelJitter, opts.jitter);
    gl.uniform1i(u.uEnableRipples, 1);
    gl.uniform1f(u.uRippleSpeed, opts.rippleSpeed);
    gl.uniform1f(u.uRippleThickness, opts.rippleThickness);
    gl.uniform1f(u.uRippleIntensity, opts.rippleIntensity);
    gl.uniform1f(u.uEdgeFade, opts.edgeFade);
    gl.uniform1i(u.uShapeType, opts.shape);

    var MAX_CLICKS = 10;
    var clickPos = new Float32Array(MAX_CLICKS * 2).fill(-1);
    var clickTimes = new Float32Array(MAX_CLICKS);
    var clickIx = 0;
    var timeOffset = Math.random() * 1000;
    var t0 = performance.now();
    var time = timeOffset;

    // Ripples start wherever the visitor clicks inside the host section.
    host.addEventListener('pointerdown', function (e) {
      var rect = canvas.getBoundingClientRect();
      clickPos[clickIx * 2] = (e.clientX - rect.left) * (canvas.width / rect.width);
      clickPos[clickIx * 2 + 1] = (rect.height - (e.clientY - rect.top)) * (canvas.height / rect.height);
      clickTimes[clickIx] = time;
      clickIx = (clickIx + 1) % MAX_CLICKS;
      if (reduceMotion.matches) render();
    }, { passive: true });

    function render() {
      gl.uniform1f(u.uTime, time);
      gl.uniform2fv(u.uClickPos, clickPos);
      gl.uniform1fv(u.uClickTimes, clickTimes);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    runLoop(host, {
      size: function () {
        var s = sizeCanvas(canvas, host, true);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(u.uResolution, canvas.width, canvas.height);
        gl.uniform1f(u.uPixelSize, opts.pixelSize * s.dpr);
      },
      step: function (t) {
        time = timeOffset + ((t - t0) / 1000) * opts.speed;
        render();
      }
    });
  }

  var effects = { matrix: matrix, trading: trading, torus: torus, pixelblast: pixelblast };
  var defaultOpacity = { matrix: 0.5, trading: 0.7, torus: 1, pixelblast: 0.72 };
  var LAYER = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:-1;';

  // The host becomes its own stacking context, so a z-index:-1 layer paints above the host's
  // background but below all of its content.
  function mount(host) {
    var name = host.getAttribute('data-fx');
    var fn = effects[name];
    if (!fn) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.style.isolation = 'isolate';
    host.style.overflow = 'hidden';
    var layer = document.createElement(name === 'pixelblast' ? 'div' : 'canvas');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = LAYER + 'opacity:' + (host.getAttribute('data-fx-opacity') || defaultOpacity[name]);
    host.insertBefore(layer, host.firstChild);
    if (host.hasAttribute('data-fx-vignette')) {
      var v = document.createElement('div');
      v.setAttribute('aria-hidden', 'true');
      v.style.cssText = LAYER + 'background:radial-gradient(ellipse at center,transparent 0%,transparent 50%,rgba(0,0,0,.4) 100%)';
      layer.after(v);
    }
    fn(layer, host);
  }
  function init() {
    document.querySelectorAll('[data-fx]').forEach(function (host) {
      try { mount(host); } catch (err) { console.warn('[fx]', err); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
