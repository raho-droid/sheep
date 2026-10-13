/**
 * Web Audio API synthesizer for relaxing sleep sounds & interactive chimes.
 * Works 100% offline and in all modern browsers without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Active ambient nodes
  private currentAmbientType: 'none' | 'lullaby' | 'rain' | 'crickets' | 'waves' = 'none';
  private ambientInterval: any = null;
  private ambientSourceNodes: any[] = [];

  private isMuted: boolean = false;
  private masterVolume: number = 0.5;
  private sfxVolume: number = 0.6;
  private ambientVolume: number = 0.4;

  private noteIndex: number = 0;
  // Sleepy pentatonic scale frequencies (C major / A minor pentatonic: C4, D4, E4, G4, A4, C5, D5, E5)
  private pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setAmbientVolume(val: number) {
    this.ambientVolume = Math.max(0, Math.min(1, val));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.ambientVolume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Plays a cozy, gentle marimba/kalimba chime when a sheep jumps over the fence.
   */
  public playSheepJump(count?: number) {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const freq = count 
        ? this.pentatonicNotes[(count - 1) % this.pentatonicNotes.length]
        : this.pentatonicNotes[this.noteIndex % this.pentatonicNotes.length];
      this.noteIndex++;

      // Primary warm tone (sine wave)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle warm overtone (triangle wave an octave higher, very low)
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now);

      // Envelope: soft bell/kalimba hit
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      overtoneGain.gain.setValueAtTime(0, now);
      overtoneGain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      overtone.connect(overtoneGain);
      overtoneGain.connect(this.sfxGain);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 1.3);
      overtone.stop(now + 0.9);
    } catch {
      // Audio auto-play policies fallback silently
    }
  }

  /**
   * Sound effect for milestone reached (sweet gentle chord)
   */
  public playMilestoneSound() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const chord = [329.63, 392.00, 523.25, 659.25]; // E minor / G major restful chord
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.0);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 2.1);
      });
    } catch {
      // Audio context ignore
    }
  }

  /**
   * Ambient sound controller
   */
  public stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.ambientSourceNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {}
    });
    this.ambientSourceNodes = [];
    this.currentAmbientType = 'none';
  }

  public getCurrentAmbient(): string {
    return this.currentAmbientType;
  }

  public playAmbient(type: 'none' | 'lullaby' | 'rain' | 'crickets' | 'waves') {
    this.stopAmbient();
    if (type === 'none') return;

    this.initContext();
    if (!this.ctx || !this.ambientGain) return;

    this.currentAmbientType = type;

    switch (type) {
      case 'rain':
        this.startRainSound();
        break;
      case 'crickets':
        this.startCricketsSound();
        break;
      case 'waves':
        this.startWavesSound();
        break;
      case 'lullaby':
        this.startLullabySound();
        break;
    }
  }

  /**
   * Ambient Gentle Rain (Filtered White/Pink Noise with soft drops)
   */
  private startRainSound() {
    if (!this.ctx || !this.ambientGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink-like soothing noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.ambientGain);

    noiseSource.start();
    this.ambientSourceNodes.push(noiseSource, filter, rainGain);
  }

  /**
   * Ambient Crickets & Night Wind
   */
  private startCricketsSound() {
    if (!this.ctx || !this.ambientGain) return;

    // Wind base
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.ambientGain);
    windSource.start();
    this.ambientSourceNodes.push(windSource, windFilter, windGain);

    // Periodic gentle cricket chirp
    this.ambientInterval = setInterval(() => {
      if (!this.ctx || !this.ambientGain || this.isMuted) return;
      try {
        const now = this.ctx.currentTime;
        const chirpOsc = this.ctx.createOscillator();
        const chirpGain = this.ctx.createGain();
        chirpOsc.type = 'triangle';
        chirpOsc.frequency.setValueAtTime(4600 + Math.random() * 400, now);

        // Chirp pulses
        chirpGain.gain.setValueAtTime(0, now);
        chirpGain.gain.linearRampToValueAtTime(0.04, now + 0.03);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        chirpOsc.connect(chirpGain);
        chirpGain.connect(this.ambientGain);
        chirpOsc.start(now);
        chirpOsc.stop(now + 0.15);
      } catch {}
    }, 1800);
  }

  /**
   * Ambient Calm Waves
   */
  private startWavesSound() {
    if (!this.ctx || !this.ambientGain) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // LFO for periodic wave tide swelling (every 6 seconds)
    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.14, this.ctx.currentTime); // ~7 seconds per cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    source.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.ambientGain);

    source.start();
    lfo.start();
    this.ambientSourceNodes.push(source, filter, waveGain, lfo, lfoGain);
  }

  /**
   * Ambient Dreamy Music Box Lullaby
   */
  private startLullabySound() {
    if (!this.ctx || !this.ambientGain) return;

    // Sweet lullaby melodic motif notes (Hz)
    const melody = [
      329.63, 392.00, 440.00, 392.00, // E4, G4, A4, G4
      329.63, 293.66, 261.63, 293.66, // E4, D4, C4, D4
      329.63, 392.00, 523.25, 440.00, // E4, G4, C5, A4
      392.00, 329.63, 293.66, 261.63  // G4, E4, D4, C4
    ];

    let step = 0;
    this.ambientInterval = setInterval(() => {
      if (!this.ctx || !this.ambientGain || this.isMuted) return;
      try {
        const note = melody[step % melody.length];
        step++;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);

        // Music box soft attack and gentle ring
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ambientGain);
        osc.start(now);
        osc.stop(now + 1.9);
      } catch {}
    }, 1200);
  }
}

export const soundEngine = new SoundEngine();
