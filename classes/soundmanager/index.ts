export class SoundManager {
  private ctx: AudioContext | null = null;
  private destination: AudioNode | null = null;
  private _muted = false;

  setMuted(m: boolean) {
    this._muted = m;
  }

  private ensureCtx() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new Ctx();
    this.destination = this.ctx.destination;
  }

  // Utility: quick envelope
  private envGain(duration: number, peak = 1) {
    if (!this.ctx) return null;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(
      peak,
      this.ctx.currentTime + Math.min(0.01, duration * 0.1)
    );
    g.gain.exponentialRampToValueAtTime(
      0.0001,
      this.ctx.currentTime + duration
    );
    return g;
  }

  // "ding" for pickup: short bell-like tone
  ding() {
    if (this._muted) return;
    this.ensureCtx();
    if (!this.ctx || !this.destination) return;
    const dur = 0.2;
    const osc = this.ctx.createOscillator();
    const gain = this.envGain(dur, 0.3)!;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      1320,
      this.ctx.currentTime + dur * 0.5
    );
    osc.connect(gain);
    gain.connect(this.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  // "thunk" for knock: filtered noise burst + low osc
  thunk() {
    if (this._muted) return;
    this.ensureCtx();
    if (!this.ctx || !this.destination) return;
    const dur = 0.12;
    // noise
    const bufferSize = 0.12 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / buffer.length); // decay
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.envGain(dur, 0.25)!;
    const biquad = this.ctx.createBiquadFilter();
    biquad.type = 'lowpass';
    biquad.frequency.value = 400;
    noise.connect(biquad);
    biquad.connect(noiseGain);
    noiseGain.connect(this.destination);
    noise.start();
    noise.stop(this.ctx.currentTime + dur);

    // low blip
    const osc = this.ctx.createOscillator();
    const gain = this.envGain(dur, 0.25)!;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  // "meow" on add kitten: simple soft chirp
  meow() {
    if (this._muted) return;
    this.ensureCtx();
    if (!this.ctx || !this.destination) return;
    const dur = 0.28;
    const osc = this.ctx.createOscillator();
    const gain = this.envGain(dur, 0.25)!;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      650,
      this.ctx.currentTime + dur * 0.6
    );
    osc.connect(gain);
    gain.connect(this.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }
}
