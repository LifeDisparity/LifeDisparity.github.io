import * as THREE from 'three';

/**
 * Snail squishy. Placeholder spec — replace with the real design.
 * See src/squishies/README.md for the plug-in contract.
 */
export default {
  id: 'snail', name: 'Snail', color: '#e3b38f', coreColor: '#f7dcc4',
  size: [1.0, 1.0, 0.8], shape: 'ellipsoid', roundness: 0.3,
  surface: 'smooth', stamp: false, description: 'slow and spiral',
  wax: {}, core: {},
  profile: { mode: 'radial', compression: 0.4, exponent: 1, pressSpeed: 18, releaseSpeed: 12, damping: 1.9 },
  wobble: { omega: 12, zeta: 0.2, gain: 0.38 },
  ui: {
    detail: 'slow and spiral',
    colors: '--toy:#e3b38f;--toy-soft:#fbeee2;--toy-edge:#c99670;--toy-ink:#7d5638',
    icon: '<path fill="#e3b38f" d="M5 5h14v14H5Z"/>',
    glow: '#fdeee0', glowTint: '#e7c3a3',
  },
  accessories(root, size) {},
};
