// Original procedural wax foley. Fracture impulses come from the shell simulation,
// rather than playing unrelated crackles whenever the pressure changes.
export function createCrackle() {
  let context;
  let output;
  let noise;
  let enabled = true;
  let lastPressure = 0;
  let lastFoley = 0;
  let lastFracture = -1;

  function unlock() {
    if (!enabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!context || context.state === 'closed') {
        context = new AudioContext();
        output = context.createGain();
        output.gain.value = 0.68;
        const compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -14;
        compressor.ratio.value = 5;
        output.connect(compressor).connect(context.destination);
        noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.25), context.sampleRate);
        const data = noise.getChannelData(0);
        let previous = 0;
        for (let i = 0; i < data.length; i++) {
          previous = (previous + Math.random() * 0.16 - 0.08) / 1.025;
          data[i] = previous * 2.5 + (Math.random() * 2 - 1) * 0.22;
        }
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch { /* Sound is optional; manual and camera play remain available. */ }
  }

  function grain(start, duration, strength, frequency) {
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = noise;
    source.playbackRate.value = 0.85 + Math.random() * 0.65;
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.65;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, strength), start + 0.0015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(output);
    source.start(start);
    source.stop(start + duration + 0.01);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  }

  function fracture({ strength = 0.5, count = 1 } = {}) {
    if (!enabled || !context || context.state !== 'running') return;
    const now = context.currentTime;
    if (now - lastFracture < 0.035) return;
    lastFracture = now;
    const amount = Math.max(0, Math.min(1, strength));
    const grains = Math.min(7, Math.max(2, Math.round(Math.sqrt(count) + 1)));
    for (let i = 0; i < grains; i++) {
      grain(now + i * (0.007 + Math.random() * 0.012), 0.016 + Math.random() * 0.035,
        (0.16 + amount * 0.16) / Math.sqrt(grains), 900 + Math.random() * 3700);
    }
    // Quiet, low resonance gives a brittle snap some body without a glassy ping.
    const body = context.createOscillator();
    const gain = context.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(280 + Math.random() * 100, now);
    body.frequency.exponentialRampToValueAtTime(110, now + 0.028);
    gain.gain.setValueAtTime(0.018 + amount * 0.018, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.034);
    body.connect(gain).connect(output);
    body.start(now); body.stop(now + 0.04);
    body.onended = () => { body.disconnect(); gain.disconnect(); };
  }

  return {
    unlock,
    fracture,
    setEnabled(value) {
      enabled = value;
      if (enabled) unlock();
      if (output && context?.state !== 'closed') output.gain.setTargetAtTime(enabled ? 0.68 : 0, context.currentTime, 0.012);
    },
    update(pressure) {
      // A much quieter rubbing texture only while the already-cracked shell moves.
      const delta = Math.abs(pressure - lastPressure);
      if (enabled && context?.state === 'running' && pressure > 0.3 && delta > 0.002
          && context.currentTime - lastFoley > 0.085) {
        grain(context.currentTime, 0.06, Math.min(0.028, delta * 0.8), 700 + pressure * 900);
        lastFoley = context.currentTime;
      }
      lastPressure = pressure;
    },
    reset() { lastPressure = 0; lastFracture = -1; },
    dispose() { context?.close().catch(() => {}); },
  };
}
