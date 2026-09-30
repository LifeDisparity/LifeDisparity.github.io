import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Snail squishy: a round, sideways-flattened spiral shell in peach-caramel wax
 * resting on a long, glossy sage foot that rises at the front into a small
 * head with two eye stalks (little bead eyes on top) and two short feelers.
 *
 * The shell's ±z sides carry a raised cream spiral band. It is an accessory
 * rather than a texture because the shell's per-face UVs repeat the same image
 * on all six faces, which would put a second spiral on the rim. The wax itself
 * gets a soft mottle; with the wax off, the bare core shows painted whorls
 * that sit under the band.
 * See src/squishies/README.md for the plug-in contract.
 */

const SIZE = [1.02, 1.0, 0.66];
const SHELL = '#e8a67d';
const COLORS = {
  band: '#fbe9d2', body: '#a8b98c', sole: '#d8dfbf', knob: '#9aad80',
  eye: '#2a2120', glint: '#f6efe8',
};
// The shell's underside is lifted into the body so it rests on the foot.
const CUT = -0.6, CUT_SOFT = 0.06;
// Side spiral in normalized shell coordinates, winding clockwise (seen from
// +z) outward from a centre a little up and back to the front-bottom.
const SPIRAL = { cx: -0.07, cy: 0.1, R: 0.8, turns: 2.35, power: 1.2, end: -1.15 };
const TURN = Math.PI * 2, SWEEP = SPIRAL.turns * TURN;

const smoothstep = THREE.MathUtils.smoothstep;
const clamp01 = t => Math.min(1, Math.max(0, t));

function randomGenerator(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** Smooth tileable value noise in 0..1. */
function valueNoise(seed, cells) {
  const random = randomGenerator(seed), grid = Float32Array.from({ length: cells * cells }, random);
  const at = (i, j) => grid[((j % cells) + cells) % cells * cells + ((i % cells) + cells) % cells];
  return (u, v) => {
    const x = u * cells, y = v * cells, i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const top = at(i, j) + (at(i + 1, j) - at(i, j)) * sx;
    const bottom = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * sx;
    return top + (bottom - top) * sy;
  };
}

/** Offset along the normal that tucks the shell's underside up into the foot. */
function shellLift(point, normal) {
  if (normal.y >= 0) return 0;
  const t = (CUT - point.y) / CUT_SOFT;
  const below = CUT_SOFT * (t > 30 ? t : Math.log1p(Math.exp(t)));
  return -below / Math.max(0.35, -normal.y) * smoothstep(-normal.y, 0, 0.25);
}

/** A point on the (displaced) shell side from normalized x/y; `side` is ±1 for ±z. */
function shellPoint(X, Y, side) {
  const Z = Math.sqrt(Math.max(0, 1 - X * X - Y * Y));
  const point = new THREE.Vector3(X * SIZE[0], Y * SIZE[1], side * Z * SIZE[2]);
  const normal = new THREE.Vector3(X / SIZE[0], Y / SIZE[1], side * Z / SIZE[2]).normalize();
  point.addScaledVector(normal, shellLift(point, normal));
  return { point, normal };
}

/** The spiral at s in 0..1 (centre to outer end) in normalized side coordinates. */
function spiralAt(s) {
  const theta = SPIRAL.end + SWEEP * (1 - s), r = SPIRAL.R * Math.pow(s, SPIRAL.power);
  return [SPIRAL.cx + r * Math.cos(theta), SPIRAL.cy + r * Math.sin(theta)];
}

/**
 * Whorl phase at a normalized side point: 0 on the spiral band, 0.5 midway
 * between turns; `outer` is how far past the last turn the point lies.
 */
function whorlPhase(X, Y) {
  const dx = X - SPIRAL.cx, dy = Y - SPIRAL.cy, r = Math.hypot(dx, dy);
  const radial = SWEEP * Math.pow(r / SPIRAL.R, 1 / SPIRAL.power);
  const theta = Math.atan2(dy, dx);
  const along = ((SPIRAL.end + SWEEP - theta) % TURN + TURN) % TURN;
  const last = along + TURN * Math.floor((SWEEP - along) / TURN);
  const phase = (((radial - along) / TURN) % 1 + 1) % 1;
  return { phase, outer: Math.max(0, (radial - last) / TURN), r };
}

function finish(positions, indices, colors) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (colors) geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  const merged = mergeVertices(geometry, 1e-5);
  geometry.dispose();
  merged.computeVertexNormals();
  return merged;
}

/** Index a (rows+1) x radial grid of closed rings. */
function ringIndices(rows, radial) {
  const indices = [];
  for (let i = 0; i < rows; i++) for (let j = 0; j < radial; j++) {
    const a = i * radial + j, b = (i + 1) * radial + j;
    const c = (i + 1) * radial + (j + 1) % radial, d = i * radial + (j + 1) % radial;
    indices.push(a, d, b, b, d, c);
  }
  return indices;
}

/** Smoothly interpolated keyframes [[u, value], ...]. */
function keyed(keys) {
  return u => {
    if (u <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (u <= keys[i][0]) {
      const [u0, a] = keys[i - 1], [u1, b] = keys[i];
      const t = (u - u0) / (u1 - u0);
      return a + (b - a) * t * t * (3 - 2 * t);
    }
    return keys[keys.length - 1][1];
  };
}

const roundCap = (d, length) => d >= length ? 1 : Math.sqrt(Math.max(0, 1 - (1 - d / length) ** 2));

/**
 * The raised cream band that follows the side spiral: a soft rounded strip
 * half sunk into the wax, tapering at the centre and tucking into the foot.
 */
function spiralBand(side) {
  const rows = 360, radial = 12, s0 = 0.03, width = 0.1, height = 0.03;
  const positions = [], tangent = new THREE.Vector3(), across = new THREE.Vector3();
  const samples = [];
  for (let i = 0; i <= rows + 2; i++) {
    const s = s0 + (1 - s0) * Math.min(1, Math.max(0, (i - 1) / rows));
    samples.push(shellPoint(...spiralAt(s), side));
  }
  for (let i = 0; i <= rows; i++) {
    const u = i / rows, s = s0 + (1 - s0) * u;
    const { point, normal } = samples[i + 1];
    tangent.subVectors(samples[i + 2].point, samples[i].point).normalize();
    across.crossVectors(normal, tangent).normalize();
    const cap = roundCap(s - s0, 0.035) * roundCap(1 - s, 0.02);
    const w = width * 0.5 * (0.5 + 0.5 * Math.sqrt(s)) * cap, h = height * (0.65 + 0.35 * s) * cap;
    for (let j = 0; j < radial; j++) {
      const a = j / radial * TURN, c = Math.cos(a), sn = Math.sin(a);
      // Flat-ish top: a squarer profile above the wax, rounder below it.
      const up = sn >= 0 ? Math.pow(sn, 0.7) : sn;
      const x = w * Math.sign(c) * Math.pow(Math.abs(c), 0.8);
      positions.push(point.x + across.x * x + normal.x * (h * up + 0.003),
        point.y + across.y * x + normal.y * (h * up + 0.003),
        point.z + across.z * x + normal.z * (h * up + 0.003));
    }
  }
  const indices = ringIndices(rows, radial);
  if (side < 0) for (let i = 0; i < indices.length; i += 3) [indices[i + 1], indices[i + 2]] = [indices[i + 2], indices[i + 1]];
  return finish(positions, indices);
}

// Foot spine (xy plane) from tail tip to the top of the head.
const SPINE = [[-1.68, -0.94], [-1.28, -0.89], [-0.62, -0.83], [0.2, -0.815], [0.86, -0.815],
  [1.2, -0.76], [1.47, -0.57], [1.66, -0.27], [1.78, 0.05], [1.83, 0.34]];

/**
 * The soft body: a swept, superelliptic foot with a flat sole that runs under
 * the shell, tapers to a tail at the back and rises into a rounded head.
 */
function bodyGeometry() {
  const spine = new THREE.CatmullRomCurve3(SPINE.map(([x, y]) => new THREE.Vector3(x, y, 0)), false, 'centripetal');
  const length = spine.getLength();
  const width = keyed([[0, 0.1], [0.1, 0.25], [0.28, 0.42], [0.48, 0.47], [0.64, 0.45], [0.74, 0.36],
    [0.84, 0.3], [0.93, 0.31], [1, 0.31]]);
  const top = keyed([[0, 0.06], [0.1, 0.15], [0.28, 0.31], [0.48, 0.37], [0.64, 0.34], [0.74, 0.27],
    [0.84, 0.26], [0.93, 0.29], [1, 0.3]]);
  const rows = 150, radial = 40, positions = [], colors = [];
  const sole = new THREE.Color(COLORS.sole), body = new THREE.Color(COLORS.body), color = new THREE.Color();
  const tailCap = 0.12 / length, headCap = 0.3 / length;
  for (let i = 0; i <= rows; i++) {
    const u = i / rows, c = spine.getPointAt(u), t = spine.getTangentAt(u);
    const nx = -t.y, ny = t.x;
    // Along the ground the sole sits on the table; up the neck it rounds out.
    const rise = smoothstep(u, 0.66, 0.86);
    const bottom = THREE.MathUtils.lerp(c.y + 1 - 0.004, top(u) * 0.95, rise);
    const cap = roundCap(u, tailCap) * roundCap(1 - u, headCap);
    const w = width(u) * cap, ht = top(u) * cap, hb = bottom * cap;
    for (let j = 0; j < radial; j++) {
      const a = j / radial * TURN, ca = Math.cos(a), sa = Math.sin(a);
      const exponent = sa >= 0 ? 2 / 2.3 : 2 / THREE.MathUtils.lerp(3.4, 2.2, rise);
      const lateral = w * Math.sign(ca) * Math.pow(Math.abs(ca), exponent);
      const vertical = (sa >= 0 ? ht : hb) * Math.sign(sa) * Math.pow(Math.abs(sa), exponent);
      positions.push(c.x + nx * vertical, c.y + ny * vertical, lateral);
      color.copy(body).lerp(sole, smoothstep(-sa, 0.05, 0.75) * (1 - 0.6 * rise));
      colors.push(color.r, color.g, color.b);
    }
  }
  return finish(positions, ringIndices(rows, radial), colors);
}

/** A tapered tube along points with rounded ends; `radius(u)` sets the profile. */
function tube(points, radius, { tubular = 32, radial = 14, cap = 0.12 } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const frames = curve.computeFrenetFrames(tubular, false), positions = [];
  for (let i = 0; i <= tubular; i++) {
    const u = i / tubular, p = curve.getPointAt(u);
    const r = radius(u) * roundCap(u, 0.04) * roundCap(1 - u, cap);
    for (let j = 0; j < radial; j++) {
      const a = j / radial * TURN;
      const n = frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a));
      positions.push(p.x + n.x * r, p.y + n.y * r, p.z + n.z * r);
    }
  }
  return { geometry: finish(positions, ringIndices(tubular, radial)), curve };
}

function mesh(root, geometry, material, role, pivot) {
  const m = new THREE.Mesh(geometry, material);
  if (role) { m.userData.role = role; m.userData.pivot = [...pivot]; }
  root.add(m);
  return m;
}

function makeSnail(root) {
  const skin = { roughness: 0.34, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.22,
    sheen: 0.45, sheenRoughness: 0.45, sheenColor: new THREE.Color('#f4f8e6') };
  const body = new THREE.MeshPhysicalMaterial({ ...skin, color: '#ffffff', vertexColors: true });
  const stalk = new THREE.MeshPhysicalMaterial({ ...skin, color: COLORS.body });
  const knob = new THREE.MeshPhysicalMaterial({ ...skin, color: COLORS.knob });
  const band = new THREE.MeshPhysicalMaterial({ color: COLORS.band, roughness: 0.5, clearcoat: 0.25,
    clearcoatRoughness: 0.4, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new THREE.Color('#fffaf2') });
  const eye = new THREE.MeshPhysicalMaterial({ color: COLORS.eye, roughness: 0.12, clearcoat: 1,
    clearcoatRoughness: 0.04, specularIntensity: 1 });
  const glint = new THREE.MeshBasicMaterial({ color: COLORS.glint, transparent: true, opacity: 0.75 });

  mesh(root, bodyGeometry(), body);
  for (const side of [1, -1]) mesh(root, spiralBand(side), band);

  for (const side of [1, -1]) {
    // Upper stalks: out of the top of the head, leaning forward and apart.
    const { curve } = (() => {
      const result = tube([[1.76, 0.24, side * 0.1], [1.82, 0.5, side * 0.17], [1.91, 0.74, side * 0.25],
        [1.99, 0.9, side * 0.3]], u => THREE.MathUtils.lerp(0.056, 0.038, u), { tubular: 30, radial: 14, cap: 0.05 });
      mesh(root, result.geometry, stalk);
      return result;
    })();
    const tip = curve.getPointAt(1), dir = curve.getTangentAt(1);
    const center = tip.clone().addScaledVector(dir, 0.02);
    const k = mesh(root, new THREE.SphereGeometry(0.068, 24, 16), knob);
    k.position.copy(center);
    // A small glossy bead set into the front of each knob, looking forward/out.
    const look = new THREE.Vector3(0.82, 0.3, side * 0.48).normalize();
    const eyeCenter = center.clone().addScaledVector(look, 0.042);
    const pivot = eyeCenter.toArray();
    const bead = mesh(root, new THREE.SphereGeometry(1, 24, 16), eye, 'eye', pivot);
    bead.position.copy(eyeCenter);
    bead.scale.set(0.05, 0.05, 0.034);
    bead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), look);
    const g = mesh(root, new THREE.SphereGeometry(1, 12, 8), glint, 'eye', pivot);
    const gdir = look.clone().add(new THREE.Vector3(-0.25, 0.55, 0).multiplyScalar(0.7)).normalize();
    g.position.copy(eyeCenter).addScaledVector(gdir, 0.033);
    g.scale.set(0.012, 0.012, 0.004);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), gdir);

    // Lower feelers: short soft nubs at the front of the head.
    mesh(root, tube([[1.96, 0.1, side * 0.1], [2.04, 0.07, side * 0.13], [2.1, 0.02, side * 0.155]],
      u => THREE.MathUtils.lerp(0.046, 0.034, u), { tubular: 14, radial: 12, cap: 0.3 }).geometry, stalk);
  }
}

function canvasTexture(canvas, srgb) {
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function fill(size, [w, h], shade) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d'), image = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const [r, g, b] = shade(x / w, y / h), o = (y * w + x) * 4;
    image.data[o] = r; image.data[o + 1] = g; image.data[o + 2] = b; image.data[o + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

/**
 * Wax: a soft hand-dyed mottle and a faint satin grain (the same image on
 * every face, so it stays free of direction). Core: the painted whorls on
 * the sphere's equirectangular UVs, deeper along each suture.
 */
function makeTextures() {
  const blotch = valueNoise(11, 5), mottle = valueNoise(23, 12), grain = valueNoise(37, 64);
  const wax = fill(0, [256, 256], (u, v) => {
    const m = 0.62 * blotch(u, v) + 0.38 * mottle(u, v);
    const k = 0.9 + 0.1 * m;
    return [255 * k, 255 * (k - 0.012 * (1 - m)), 255 * (k - 0.03 * (1 - m))];
  });
  const waxBump = fill(0, [256, 256], (u, v) => {
    const g = 0.55 * grain(u, v) + 0.45 * mottle(u, v), c = 200 + 55 * g;
    return [c, c, c];
  });
  const whorl = (u, v) => {
    const phi = u * TURN, theta = v * Math.PI;
    const X = -Math.cos(phi) * Math.sin(theta), Y = Math.cos(theta), Z = Math.sin(phi) * Math.sin(theta);
    const side = smoothstep(Math.abs(Z), 0.15, 0.45);
    const { phase, outer } = whorlPhase(X, Y);
    // Crest of each whorl is light, the suture tucks in darker.
    const crest = outer > 0 ? Math.min(1, 0.55 + outer * 2.2) : Math.sin(Math.PI * phase) ** 0.7;
    return { value: 1 - side * (1 - crest), side };
  };
  const coreMap = fill(0, [1024, 512], (u, v) => {
    const { value } = whorl(u, v), k = 0.84 + 0.16 * value, m = 0.96 + 0.04 * blotch(u * 2 % 1, v);
    return [255 * k * m, 255 * (k * m - 0.02 * (1 - value)), 255 * (k * m - 0.05 * (1 - value))];
  });
  const coreBump = fill(0, [512, 256], (u, v) => {
    const c = 120 + 135 * whorl(u, v).value;
    return [c, c, c];
  });
  return {
    map: canvasTexture(wax, true), bumpMap: canvasTexture(waxBump), bumpScale: 0.35,
    core: { map: canvasTexture(coreMap, true), bumpMap: canvasTexture(coreBump), bumpScale: 1.4 },
  };
}

export default {
  id: 'snail', name: 'Snail', color: SHELL, coreColor: '#fde6cf',
  size: SIZE, shape: 'ellipsoid', roundness: 0.3,
  surface: 'smooth', stamp: false, description: 'A slow, gooey squish and a lazy spiral home.',
  wax: { roughness: 0.4, clearcoat: 0.42, clearcoatRoughness: 0.3,
    sheen: 0.5, sheenColor: '#ffe3cf', sheenRoughness: 0.5 },
  core: { roughness: 0.36, clearcoat: 0.55, clearcoatRoughness: 0.22,
    sheen: 0.3, sheenColor: '#fff6ec', sheenRoughness: 0.5 },
  // Soft and deep, pressed in unhurriedly, then oozing back without a bounce.
  profile: { mode: 'radial', compression: 0.44, exponent: 0.95, pressSpeed: 12, releaseSpeed: 5.2, damping: 2.35 },
  wobble: { omega: 6.8, zeta: 0.26, gain: 0.34 },
  ui: {
    detail: 'slow and spiral',
    colors: '--toy:#e8a67d;--toy-soft:#fbeadc;--toy-edge:#cf8a62;--toy-ink:#7d5238',
    icon: '<path fill="#e8a67d" d="M5 5h14v14H5Z"/>',
    glow: '#fcefe3', glowTint: '#e6c9ad',
  },
  displace: shellLift,
  textures: makeTextures,
  accessories(root) { makeSnail(root); },
};
