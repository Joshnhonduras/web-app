/**
 * Enhanced voice management with better male voice selection
 * and quality improvements for Web Speech API
 */

export interface VoiceProfile {
  voice: SpeechSynthesisVoice;
  quality: number; // 0-100 score
  type: 'premium' | 'standard' | 'basic';
}

export class VoiceManager {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  
  constructor() {
    this.loadVoices();
    
    // Voices load asynchronously in some browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
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
   * Speak with enhanced quality
   */
  speak(
    text: string, 
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: any) => void;
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
   * Stop speaking
   */
  stop(): void {
    speechSynthesis.cancel();
  }

  /**
   * Pause speaking
   */
  pause(): void {
    speechSynthesis.pause();
  }

  /**
   * Resume speaking
   */
  resume(): void {
    speechSynthesis.resume();
  }
}

// Singleton instance
export const voiceManager = new VoiceManager();
