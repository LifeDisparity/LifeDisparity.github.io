import * as THREE from 'three';

/** Dimensions are half extents. Every accessory is in the shell's local space. */
export const SQUISHY_TYPES = [
  { id: 'butter', name: 'Butter', color: '#efd88e', coreColor: '#fff0af',
    size: [2.22, 0.75, 0.68], shape: 'roundedBox', roundness: 0.29,
    surface: 'smooth', stamp: true, description: 'A gentle middle pinch. A slow return.' },
  { id: 'platypus', name: 'Platypus', color: '#a87550', coreColor: '#e5bd8d',
    size: [1.32, 0.87, 0.94], shape: 'ellipsoid', roundness: 0.3,
    surface: 'smooth', stamp: false, description: 'A soft belly. A bouncy little friend.' },
  { id: 'lychee', name: 'Lychee', color: '#e9989d', coreColor: '#fff6e5',
    size: [1.12, 1.22, 1.12], shape: 'ellipsoid', roundness: 0.3,
    surface: 'lychee', stamp: false, description: 'Round, juicy, and quick to spring back.' },
  { id: 'mangosteen', name: 'Mangosteen', color: '#73465f', coreColor: '#fff4e7',
    size: [1.22, 1.07, 1.22], shape: 'ellipsoid', roundness: 0.3,
    surface: 'smooth', stamp: false, description: 'A firmer squeeze. A mellow rebound.' },
];

export function getSquishySpec(type = 'butter') {
  const spec = SQUISHY_TYPES.find(item => item.id === type) || SQUISHY_TYPES[0];
  return { ...spec, size: [...spec.size] };
}

function material(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.48, metalness: 0,
    clearcoat: 0.16, clearcoatRoughness: 0.5, ...options });
}

function addMesh(parent, geometry, mat, position = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function oval(parent, mat, position, scale, segments = 32) {
  return addMesh(parent, new THREE.SphereGeometry(1, segments, 20), mat, position, scale);
}

function line(parent, mat, points, radius = 0.012) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  return addMesh(parent, new THREE.TubeGeometry(curve, Math.max(12, points.length * 6), radius, 5, false), mat);
}

// Closed, gently pillowed leaf: fine enough to catch a continuous wax highlight.
function leafGeometry(length, width, thickness = 0.055) {
  const positions = [], indices = [];
  const rows = 20, sides = 14;
  for (let i = 0; i <= rows; i++) {
    const t = i / rows;
    const swell = Math.sin(Math.PI * t);
    for (let j = 0; j <= sides; j++) {
      const angle = j / sides * Math.PI * 2;
      positions.push((t - 0.5) * length,
        swell * 0.08 + Math.cos(angle) * thickness * swell,
        Math.sin(angle) * width * 0.5 * Math.pow(swell, 0.72));
    }
  }
  for (let i = 0; i < rows; i++) for (let j = 0; j < sides; j++) {
    const a = i * (sides + 1) + j, b = a + sides + 1;
    indices.push(a, b + 1, b, a, a + 1, b + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function addLeaf(parent, mat, position, length, width, rotation = [0, 0, 0], veinMaterial) {
  const group = new THREE.Group();
  group.position.set(...position);
  group.rotation.set(...rotation);
  parent.add(group);
  addMesh(group, leafGeometry(length, width), mat);
  if (veinMaterial) line(group, veinMaterial,
    [[-length * 0.38, 0.06, 0], [0, 0.135, 0], [length * 0.39, 0.056, 0]], 0.009);
  return group;
}

function makePlatypus(root) {
  const bill = material('#bd8f60');
  const paws = material('#986747');
  const tail = material('#946343');
  const detail = material('#765038', { roughness: 0.68, clearcoat: 0.06 });
  const eye = material('#271e1b', { roughness: 0.17, clearcoat: 0.6 });
  const glint = material('#fff8e9', { roughness: 0.16 });
  const blush = material('#bc8068', { roughness: 0.64 });

  // A broad flattened duck bill, tucked into the continuous rounded body.
  oval(root, bill, [1.37, -0.14, 0], [0.73, 0.175, 0.55]);
  oval(root, detail, [1.69, 0.018, 0.19], [0.036, 0.012, 0.023], 16);
  oval(root, detail, [1.69, 0.018, -0.19], [0.036, 0.012, 0.023], 16);
  line(root, detail, [[1.53, -0.177, 0.522], [1.83, -0.166, 0.415],
    [2.04, -0.147, 0.20], [2.089, -0.14, 0], [2.04, -0.147, -0.20],
    [1.83, -0.166, -0.415], [1.53, -0.177, -0.522]], 0.009);

  for (const sign of [-1, 1]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(0.84, 0.41, sign * 0.587);
    eyeGroup.rotation.y = sign * 0.55;
    root.add(eyeGroup);
    oval(eyeGroup, eye, [0, 0, 0], [0.088, 0.104, 0.062]);
    oval(eyeGroup, glint, [0.021, 0.032, sign * 0.052], [0.024, 0.027, 0.011], 16);
    oval(root, blush, [0.91, 0.235, sign * 0.64], [0.114, 0.055, 0.023]);
    // Four webbed flippers; toe marks stay quiet and rounded.
    for (const x of [-0.73, 0.62]) {
      const foot = new THREE.Group();
      foot.position.set(x, -0.66, sign * 0.73);
      foot.rotation.y = sign * (x > 0 ? -0.3 : 0.24);
      root.add(foot);
      oval(foot, paws, [0, 0, 0], [0.34, 0.13, 0.37]);
      for (const toe of [-1, 1]) {
        const points = Array.from({ length: 9 }, (_, i) => {
          const t = i / 8, x = toe * (0.105 + t * 0.035), z = sign * (0.08 + t * 0.23);
          return [x, 0.13 * Math.sqrt(1 - (x / 0.34) ** 2 - (z / 0.37) ** 2) + 0.001, z];
        });
        line(foot, detail, points, 0.008);
      }
    }
  }

  const tailGroup = new THREE.Group();
  tailGroup.position.set(-1.5, -0.25, 0);
  tailGroup.rotation.z = -0.1;
  root.add(tailGroup);
  oval(tailGroup, tail, [0, 0, 0], [0.84, 0.16, 0.5]);
  // The beaver-like tail's diamond scoring follows the domed upper surface.
  for (const sign of [-1, 1]) for (let offset = -0.6; offset <= 0.61; offset += 0.22) {
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const x = -0.71 + i / 40 * 1.42;
      const z = sign * x * 0.51 + offset;
      const radial = (x / 0.84) ** 2 + (z / 0.5) ** 2;
      if (radial < 0.78) points.push([x, 0.16 * Math.sqrt(1 - radial) + 0.001, z]);
    }
    if (points.length > 2) line(tailGroup, detail, points, 0.008);
  }
}

function makeLychee(root) {
  const stem = material('#8f7851', { roughness: 0.7 });
  const leaf = material('#779756');
  const darkLeaf = material('#607b43');
  const vein = material('#a3b575');
  const twig = new THREE.Group();
  twig.position.set(-0.09, 1.17, -0.03);
  twig.rotation.z = 0.27;
  root.add(twig);
  oval(twig, stem, [0, 0.115, 0], [0.069, 0.22, 0.064], 20);
  addLeaf(root, leaf, [0.32, 1.26, -0.10], 0.9, 0.31, [0.18, 0.2, -0.20], vein);
  addLeaf(root, darkLeaf, [-0.39, 1.24, -0.16], 0.61, 0.23, [0.2, -0.45, 0.2], vein);
}

function makeMangosteen(root) {
  const leaf = material('#718948');
  const paleLeaf = material('#8f9e58');
  const vein = material('#a2ad6b');
  const stem = material('#73804b', { roughness: 0.64 });
  const crown = new THREE.Group();
  crown.position.set(0, 1.025, 0);
  root.add(crown);
  oval(crown, leaf, [0, 0.02, 0], [0.33, 0.145, 0.33]);
  for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2 + 0.34;
    const petal = new THREE.Group();
    petal.rotation.y = angle;
    crown.add(petal);
    addLeaf(petal, i % 2 ? paleLeaf : leaf, [0.28, -0.008, 0], 0.87, 0.48,
      [0, 0, -0.24], vein);
  }
  const stalk = oval(crown, stem, [0.025, 0.205, 0], [0.105, 0.255, 0.098], 24);
  stalk.rotation.z = -0.18;
  oval(crown, paleLeaf, [0.07, 0.438, 0], [0.084, 0.028, 0.08], 20);

  // Small blossom scar, visible on the underside when the fruit compresses.
  const scar = new THREE.Group();
  scar.position.set(0, -1.042, 0);
  root.add(scar);
  const scarMaterial = material('#a07869', { roughness: 0.76, clearcoat: 0 });
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    const petal = oval(scar, scarMaterial,
      [Math.cos(angle) * 0.105, -0.001, Math.sin(angle) * 0.105], [0.1, 0.026, 0.044], 16);
    petal.rotation.y = -angle;
  }
  oval(scar, scarMaterial, [0, -0.015, 0], [0.045, 0.025, 0.045], 16);
}

/** All geometry/materials are owned by this group and may be disposed by traversal. */
export function createAccessories(type = 'butter') {
  const group = new THREE.Group();
  group.name = `${type}-accessories`;
  if (type === 'platypus') makePlatypus(group);
  else if (type === 'lychee') makeLychee(group);
  else if (type === 'mangosteen') makeMangosteen(group);
  return group;
}
