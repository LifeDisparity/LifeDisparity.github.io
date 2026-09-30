import * as THREE from 'three';

/**
 * Teddy squishy. Placeholder spec — replace with the real design.
 * See src/squishies/README.md for the plug-in contract.
 */
export default {
  id: 'teddy', name: 'Teddy', color: '#f7f3ee', coreColor: '#fffaf4',
  size: [1.15, 1.0, 1.0], shape: 'ellipsoid', roundness: 0.3,
  surface: 'smooth', stamp: false, description: 'a chubby cuddle',
  wax: {}, core: {},
  profile: { mode: 'radial', compression: 0.4, exponent: 1, pressSpeed: 18, releaseSpeed: 12, damping: 1.9 },
  wobble: { omega: 12, zeta: 0.2, gain: 0.38 },
  ui: {
    detail: 'a chubby cuddle',
    colors: '--toy:#efe8e0;--toy-soft:#fbf8f4;--toy-edge:#d8cdc2;--toy-ink:#7a6a5e',
    icon: '<path fill="#f7f3ee" d="M5 5h14v14H5Z"/>',
    glow: '#fbf7f2', glowTint: '#e2d8cc',
  },
  accessories(root, size) {},
};
