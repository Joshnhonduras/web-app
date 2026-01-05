/**
 * Enhanced voice management with better male voice selection
 * Supports Web Speech API and Piper TTS
 */

export type VoiceEngine = 'browser' | 'piper' | 'openai';

export interface VoiceProfile {
  voice: SpeechSynthesisVoice;
  quality: number; // 0-100 score
  type: 'premium' | 'standard' | 'basic';
}

export class VoiceManager {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private engine: VoiceEngine = 'browser';
  private piperServerUrl = 'http://127.0.0.1:5174';
  private currentAudio: HTMLAudioElement | null = null;
  
  constructor() {
    this.loadVoices();
    
    // Voices load asynchronously in some browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }
  
  /**
   * Set the voice engine
   */
  setEngine(engine: VoiceEngine): void {
    this.engine = engine;
  }
  
  /**
   * Get current engine
   */
  getEngine(): VoiceEngine {
    return this.engine;
  }
  
  /**
   * Check if Piper is available
   */
  async isPiperAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.piperServerUrl}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test' })
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private loadVoices() {
    this.voices = speechSynthesis.getVoices();
  }

  /**
   * Get all available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.voices = speechSynthesis.getVoices();
    }
    return this.voices;
  }

  /**
   * Score and rank male voices
   */
  getMaleVoices(): VoiceProfile[] {
    const voices = this.getVoices();
    const maleVoices: VoiceProfile[] = [];

    voices.forEach(voice => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();
      
      // Skip non-English and clearly female voices
      if (!lang.startsWith('en')) return;
      if (name.includes('female') || name.includes('woman')) return;
      
      let quality = 0;
      let type: 'premium' | 'standard' | 'basic' = 'basic';

      // Premium quality voices (natural sounding)
      if (name.includes('google') || name.includes('neural')) {
        quality += 50;
        type = 'premium';
      }
      
      // Known high-quality male voices
      if (name.includes('david') || name.includes('daniel')) {
        quality += 30;
        if (type === 'basic') type = 'standard';
      }
      
      if (name.includes('alex') || name.includes('oliver')) {
        quality += 25;
        if (type === 'basic') type = 'standard';
      }
      
      // Generic male indicators
      if (name.includes('male') || name.includes('man')) {
        quality += 20;
      }

      // Premium voices from specific engines
      if (name.includes('microsoft') && name.includes('guy')) {
        quality += 30;
        type = 'standard';
      }

      // espeak (Linux common) - lower quality but reliable
      if (name.includes('espeak')) {
        quality += 10;
      }

      // Prefer US English
      if (lang === 'en-us' || lang === 'en_us') {
        quality += 15;
      } else if (lang.startsWith('en-gb') || lang.startsWith('en-au')) {
        quality += 10;
      }

      // Local voices are usually better quality
      if (voice.localService) {
        quality += 10;
      }

      // Only include voices with some quality score
      if (quality > 0) {
        maleVoices.push({ voice, quality, type });
      }
    });

    // Sort by quality (highest first)
    return maleVoices.sort((a, b) => b.quality - a.quality);
  }

  /**
   * Get the best available male voice
   */
  getBestMaleVoice(): SpeechSynthesisVoice | null {
    if (this.selectedVoice) return this.selectedVoice;
    
    const maleVoices = this.getMaleVoices();
    
    if (maleVoices.length > 0) {
      this.selectedVoice = maleVoices[0].voice;
      console.log('Selected voice:', this.selectedVoice.name, 'Quality:', maleVoices[0].quality);
      return this.selectedVoice;
    }

    // Fallback to any English voice
    const voices = this.getVoices();
    const englishVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    
    if (englishVoice) {
      this.selectedVoice = englishVoice;
      console.log('Fallback voice:', this.selectedVoice.name);
      return this.selectedVoice;
    }

    return null;
  }

  /**
   * Set a specific voice by name
   */
  setVoice(voiceName: string): boolean {
    const voices = this.getVoices();
    const voice = voices.find(v => v.name === voiceName);
    
    if (voice) {
      this.selectedVoice = voice;
      return true;
    }
    
    return false;
  }

  /**
   * Create optimized speech utterance
   */
  createUtterance(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {}): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use selected voice or find best one
    const voice = this.selectedVoice || this.getBestMaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Apply options with defaults optimized for masculine sound
    utterance.rate = options.rate ?? 0.95;  // Slightly slower for clarity
    utterance.pitch = options.pitch ?? 0.85; // Lower pitch for deeper voice
    utterance.volume = options.volume ?? 1.0;

    return utterance;
  }

  /**
   * Speak with Piper TTS
   */
  private async speakWithPiper(
    text: string,
    options: {
      rate?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: unknown) => void;
    } = {}
  ): Promise<void> {
    try {
      // Stop any current audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      
      const response = await fetch(`${this.piperServerUrl}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (!response.ok) {
        throw new Error('Piper TTS request failed');
      }
      
      const data = await response.json();
      
      // Convert base64 to audio
      const audioData = atob(data.audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }
      
      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audio.volume = options.volume ?? 1.0;
      audio.playbackRate = options.rate ?? 1.0;
      
      this.currentAudio = audio;
      
      if (options.onStart) {
        audio.addEventListener('play', options.onStart, { once: true });
      }
      
      if (options.onEnd) {
        audio.addEventListener('ended', () => {
          URL.revokeObjectURL(url);
          options.onEnd!();
        }, { once: true });
      }
      
      if (options.onError) {
        audio.addEventListener('error', options.onError, { once: true });
      }
      
      await audio.play();
    } catch (err: unknown) {
      console.error('Piper TTS error:', err);
      if (options.onError) {
        options.onError(err);
      }
      // Fallback to browser TTS
      this.engine = 'browser';
      this.speakWithBrowser(text, options);
    }
  }
  
  /**
   * Speak with browser TTS
   */
  private speakWithBrowser(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: unknown) => void;
    } = {}
  ): void {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = this.createUtterance(text, options);
    
    if (options.onStart) {
      utterance.onstart = options.onStart;
    }
    
    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }
    
    if (options.onError) {
      utterance.onerror = options.onError;
    }

    // Chrome sometimes needs a delay to prevent cutting off
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 100);
  }

  /**
   * Speak with enhanced quality (auto-selects best engine)
   */
  async speak(
    text: string, 
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: unknown) => void;
    } = {}
  ): Promise<void> {
    if (this.engine === 'piper') {
      await this.speakWithPiper(text, options);
    } else {
      this.speakWithBrowser(text, options);
    }
  }

  /**
   * Stop speaking
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    speechSynthesis.cancel();
  }

  /**
   * Pause speaking
   */
  pause(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    speechSynthesis.pause();
  }

  /**
   * Resume speaking
   */
  resume(): void {
    if (this.currentAudio) {
      this.currentAudio.play();
    }
    speechSynthesis.resume();
  }
}

// Singleton instance
export const voiceManager = new VoiceManager();
