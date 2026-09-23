// Web Audio procedural page flip sound generator
class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  playPageTurn() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const bufferSize = Math.floor(ctx.sampleRate * 0.18);
      if (bufferSize <= 0) return;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Synthesize soft friction / paper page flutter noise
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const white = Math.random() * 2 - 1;
        const envelope = Math.sin(t * Math.PI) * Math.exp(-t * 3.5);
        output[i] = white * envelope;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const now = ctx.currentTime || 0;

      // Filter to simulate warm cardboard/paper frequency spectrum
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
    } catch {
      // Audio playback fails silently if browser policy restricts
    }
  }
}

export const soundManager = new SoundManager();
