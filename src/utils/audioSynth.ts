class FocusAudioSynth {
  private audioCtx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentType: 'brown' | 'white' | 'rain' | 'binaural' = 'brown';

  public start(type: 'brown' | 'white' | 'rain' | 'binaural' = 'brown', volume: number = 0.3) {
    this.stop();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();
      this.currentType = type;

      const bufferSize = 2 * this.audioCtx.sampleRate;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (type === 'white') {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      } else if (type === 'brown' || type === 'rain') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // boost brown noise
        }
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for rain / brown noise tone
      const filter = this.audioCtx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 0.5;
      } else if (type === 'brown') {
        filter.type = 'lowpass';
        filter.frequency.value = 400;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      whiteNoise.start();
      this.noiseNode = whiteNoise;
      this.isPlaying = true;
    } catch (e) {
      console.error("Audio synth error:", e);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioCtx.currentTime);
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop();
      } catch (e) {}
      this.noiseNode = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
      this.audioCtx = null;
    }
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentType(): string {
    return this.currentType;
  }
}

export const focusAudioSynth = new FocusAudioSynth();
