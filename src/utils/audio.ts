// Web Audio API realistic cube sounds & haptic feedback without external audio files

class SoundFX {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Check localStorage preference if in browser
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rubix_sound_enabled');
      if (stored !== null) {
        this.soundEnabled = stored === 'true';
      }
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rubix_sound_enabled', String(this.soundEnabled));
    }
    return this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rubix_sound_enabled', String(enabled));
    }
  }

  // Realistic mechanical cube layer turn "snick/click" sound
  public playCubeTurn() {
    if (!this.soundEnabled) return;
    this.triggerHaptic(8);
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Short noise burst for plastic friction
      const bufferSize = this.ctx.sampleRate * 0.035; // 35ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
      filter.Q.setValueAtTime(3.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);

      // 2. Resonant plastic "click" body
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340 + Math.random() * 60, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Timer start beep
  public playTimerStart() {
    if (!this.soundEnabled) return;
    this.triggerHaptic(20);
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignore audio failure
    }
  }

  // Timer finish chime
  public playTimerFinish() {
    if (!this.soundEnabled) return;
    this.triggerHaptic([15, 30, 15]);
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const noteTime = now + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.25);
      });
    } catch {
      // Ignore audio failure
    }
  }

  // Tactile vibration on mobile devices
  public triggerHaptic(pattern: number | number[]) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe catch
      }
    }
  }
}

export const sound = new SoundFX();
