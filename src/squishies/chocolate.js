import * as THREE from 'three';

/**
 * Chocolate squishy. Placeholder spec — replace with the real design.
 * See src/squishies/README.md for the plug-in contract.
 */
export default {
  id: 'chocolate', name: 'Chocolate', color: '#6b4232', coreColor: '#8a5a44',
  size: [1.9, 0.42, 1.0], shape: 'roundedBox', roundness: 0.3,
  surface: 'smooth', stamp: false, description: 'a snappy little bar',
  wax: {}, core: {},
  profile: { mode: 'radial', compression: 0.4, exponent: 1, pressSpeed: 18, releaseSpeed: 12, damping: 1.9 },
  wobble: { omega: 12, zeta: 0.2, gain: 0.38 },
  ui: {
    detail: 'a snappy little bar',
    colors: '--toy:#8a5a44;--toy-soft:#f1e2d8;--toy-edge:#6b4232;--toy-ink:#4e3024',
    icon: '<path fill="#6b4232" d="M5 5h14v14H5Z"/>',
    glow: '#f6e6dc', glowTint: '#c9a18a',
  },
  accessories(root, size) {},
};
