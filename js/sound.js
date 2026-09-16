/* ==========================================================================
   DinoClass (恐龙班级小帮手) - Web Audio API Synthesizer & Cheerful Happy BGM
   Bright, Joyful Music Box / Xylophone Melodies & Sound Effects
   ========================================================================== */

class SoundController {
  constructor() {
    this.enabled = true;
    this.bgmEnabled = true; // Auto-play BGM enabled by default
    this.audioCtx = null;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.setupAutoStart();
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setupAutoStart() {
    const handleFirstInteraction = () => {
      this.init();
      if (this.bgmEnabled && !this.bgmTimer) {
        this.startBGM();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('mousemove', handleFirstInteraction);
      window.removeEventListener('pointermove', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('mousemove', handleFirstInteraction);
    window.addEventListener('pointermove', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    // Try starting immediately on load if browser permits
    const tryAutoStart = () => {
      try {
        this.init();
        if (this.bgmEnabled && !this.bgmTimer) this.startBGM();
      } catch (e) {}
    };

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', tryAutoStart);
    } else {
      tryAutoStart();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  toggleBGM() {
    this.init();
    this.bgmEnabled = !this.bgmEnabled;

    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  // Sweet, Soft & Cheerful Music Box BGM (Relaxing Pentatonic Canon Theme)
  startBGM() {
    this.init();
    if (!this.audioCtx || this.bgmTimer) return;
    
    // Smooth, sweet C-Major pentatonic Canon melody
    const melody = [
      523.25, 659.25, 783.99, 1046.50,  659.25, 783.99, 1046.50, 1318.51,
      587.33, 698.46, 880.00, 1174.66,  698.46, 880.00, 1174.66, 1396.91,
      659.25, 783.99, 1046.50, 1318.51, 783.99, 1046.50, 1318.51, 1567.98,
      587.33, 659.25, 783.99, 1046.50,  523.25, 659.25, 783.99, 1046.50
    ];

    const bassline = [261.63, 220.00, 174.61, 196.00];

    this.bgmStep = 0;

    const playNextNote = () => {
      if (!this.bgmEnabled || !this.audioCtx) return;

      const step = this.bgmStep;
      const noteFreq = melody[step % melody.length];
      this.bgmStep++;

      const now = this.audioCtx.currentTime;

      // Pure soft sine tone for peaceful music box chime
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      gain.gain.setValueAtTime(0.022, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.32);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
      setTimeout(() => { try { osc.disconnect(); gain.disconnect(); } catch(e){} }, 400);

      // Soft bass note every 4 beats
      if (step % 4 === 0) {
        const bassFreq = bassline[Math.floor(step / 4) % bassline.length];
        const bassOsc = this.audioCtx.createOscillator();
        const bassGain = this.audioCtx.createGain();

        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.025, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        bassOsc.connect(bassGain);
        bassGain.connect(this.audioCtx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.48);
        setTimeout(() => { try { bassOsc.disconnect(); bassGain.disconnect(); } catch(e){} }, 550);
      }
    };

    // Relaxed tempo: 270ms per note (sweet & soothing pace)
    this.bgmTimer = setInterval(playNextNote, 270);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Quick chime when adding points
  playScoreAdd() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, this.audioCtx.currentTime + 0.1); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, this.audioCtx.currentTime + 0.2); // G5

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.35);
    setTimeout(() => { try { osc.disconnect(); gain.disconnect(); } catch(e){} }, 450);
  }

  // Soft tone when deducting points
  playScoreDeduct() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
    setTimeout(() => { try { osc.disconnect(); gain.disconnect(); } catch(e){} }, 400);
  }

  // Egg hatching sound effect!
  playEggHatch() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;

    const osc1 = this.audioCtx.createOscillator();
    const gain1 = this.audioCtx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc1.connect(gain1);
    gain1.connect(this.audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.15);
    setTimeout(() => { try { osc1.disconnect(); gain1.disconnect(); } catch(e){} }, 300);

    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.15 + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + 0.15 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8 + idx * 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + 0.15 + idx * 0.08);
      osc.stop(now + 0.9);
      setTimeout(() => { try { osc.disconnect(); gain.disconnect(); } catch(e){} }, 1100);
    });
  }

  // Level Up fanfare
  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.2, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6 + i * 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + 0.7 + i * 0.1);
      setTimeout(() => { try { osc.disconnect(); gain.disconnect(); } catch(e){} }, 1000);
    });
  }

  // Wheel tick sound
  playTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
    setTimeout(() => { try { osc.disconnect(); gain.disconnect(); } catch(e){} }, 120);
  }
}

window.soundCtrl = new SoundController();
