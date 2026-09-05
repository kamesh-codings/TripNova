// Web Speech API & Online TTS Hybrid Utility with Web Audio API Loud Amplification
// Supports all 26+ Indian & Global Languages with high-fidelity, audible voice-over

export interface LanguageVoiceConfig {
  bcp47: string;
  ttsCode: string;
  name: string;
  nativeName?: string;
  flag: string;
  region: 'Indian' | 'Global';
}

export const LANG_CODE_MAP: Record<string, LanguageVoiceConfig> = {
  // Indian Regional Languages
  'Tamil': { bcp47: 'ta-IN', ttsCode: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Indian' },
  'Hindi': { bcp47: 'hi-IN', ttsCode: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'Indian' },
  'Telugu': { bcp47: 'te-IN', ttsCode: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Indian' },
  'Malayalam': { bcp47: 'ml-IN', ttsCode: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'Indian' },
  'Kannada': { bcp47: 'kn-IN', ttsCode: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Indian' },
  'Bengali': { bcp47: 'bn-IN', ttsCode: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'Indian' },
  'Marathi': { bcp47: 'mr-IN', ttsCode: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'Indian' },
  'Gujarati': { bcp47: 'gu-IN', ttsCode: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Indian' },
  'Punjabi': { bcp47: 'pa-IN', ttsCode: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Indian' },
  'Urdu': { bcp47: 'ur-IN', ttsCode: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', region: 'Indian' },

  // Global Languages
  'English': { bcp47: 'en-US', ttsCode: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global' },
  'Spanish': { bcp47: 'es-ES', ttsCode: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Global' },
  'French': { bcp47: 'fr-FR', ttsCode: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Global' },
  'German': { bcp47: 'de-DE', ttsCode: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Global' },
  'Japanese': { bcp47: 'ja-JP', ttsCode: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Global' },
  'Italian': { bcp47: 'it-IT', ttsCode: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Global' },
  'Arabic': { bcp47: 'ar-SA', ttsCode: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Global' },
  'Chinese (Mandarin)': { bcp47: 'zh-CN', ttsCode: 'zh-CN', name: 'Chinese (Mandarin)', nativeName: '中文 (普通话)', flag: '🇨🇳', region: 'Global' },
  'Russian': { bcp47: 'ru-RU', ttsCode: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Global' },
  'Portuguese': { bcp47: 'pt-PT', ttsCode: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Global' },
  'Korean': { bcp47: 'ko-KR', ttsCode: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Global' },
  'Turkish': { bcp47: 'tr-TR', ttsCode: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Global' },
  'Thai': { bcp47: 'th-TH', ttsCode: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Global' },
  'Vietnamese': { bcp47: 'vi-VN', ttsCode: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Global' },
  'Indonesian': { bcp47: 'id-ID', ttsCode: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Global' },
  'Dutch': { bcp47: 'nl-NL', ttsCode: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Global' }
};

export interface SpeechOptions {
  rate?: number; // Speed: 0.5 to 1.5 (default 0.92)
  pitch?: number; // Pitch: 0.5 to 1.5 (default 1.0)
  volume?: number; // Volume: 0.1 to 1.0 (default 1.0)
  volumeBoost?: number; // Web Audio Gain multiplier: 1.0 to 2.5 (default 1.6 for loud voiceover)
}

let cachedVoices: SpeechSynthesisVoice[] = [];
let activeAudioElement: HTMLAudioElement | null = null;
let activeAudioContext: AudioContext | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let speechTimeoutId: any = null;
let speechKeepAliveInterval: any = null;

// Preload voices when browser initializes
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    const updateVoices = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  } catch (e) {
    console.warn('Speech synthesis voice preloading notice:', e);
  }
}

/**
 * Initializes and unlocks AudioContext on user interaction for maximum loudness
 */
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!activeAudioContext) {
      activeAudioContext = new AudioCtx();
    }
    if (activeAudioContext.state === 'suspended') {
      activeAudioContext.resume().catch(() => {});
    }
    return activeAudioContext;
  } catch (e) {
    return null;
  }
};

/**
 * Stop any active audio, speech synthesis, or keepalive timers
 */
export const stopSpeech = () => {
  if (speechTimeoutId) {
    clearTimeout(speechTimeoutId);
    speechTimeoutId = null;
  }

  if (speechKeepAliveInterval) {
    clearInterval(speechKeepAliveInterval);
    speechKeepAliveInterval = null;
  }

  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
      activeAudioElement.src = '';
    } catch (e) {
      // ignore
    }
    activeAudioElement = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }

  activeUtterance = null;
};

/**
 * Finds the best matching voice for a given BCP-47 tag or language name
 */
const findBestVoice = (targetBcp47: string, langName: string): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  if (cachedVoices.length === 0) return null;

  const targetLower = targetBcp47.toLowerCase();
  const prefix = targetBcp47.split('-')[0].toLowerCase();
  const langNameLower = langName.toLowerCase();

  // 1. Exact BCP-47 match (e.g., 'ta-IN')
  let match = cachedVoices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLower);
  if (match) return match;

  // 2. Prefix match with matching region or default (e.g., 'ta' for 'ta-IN')
  match = cachedVoices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
  if (match) return match;

  // 3. Name contains language (e.g. "Google Tamil", "Microsoft Valluvar - Tamil (India)")
  match = cachedVoices.find(v => v.name.toLowerCase().includes(langNameLower));
  if (match) return match;

  return null;
};

/**
 * Plays online Google / Alternative TTS audio stream with Web Audio API Gain Amplification (LOUD Voiceover)
 */
export const playOnlineTTS = (
  text: string,
  ttsCode: string,
  options?: SpeechOptions,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean => {
  try {
    const cleanText = encodeURIComponent(text.slice(0, 300).trim());
    if (!cleanText) {
      onEnd?.();
      return false;
    }

    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsCode}&client=tw-ob&q=${cleanText}`;
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = audioUrl;
    audio.playbackRate = options?.rate || 0.95;
    activeAudioElement = audio;

    // Apply Web Audio Gain amplification for loud, audible voiceover
    const gainFactor = options?.volumeBoost || 1.8; // Amplified loudness
    const ctx = getAudioContext();
    
    if (ctx) {
      try {
        const source = ctx.createMediaElementSource(audio);
        const gainNode = ctx.createGain();
        gainNode.gain.value = Math.min(2.5, Math.max(1.0, gainFactor));
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
      } catch (gainErr) {
        // Fallback to standard audio volume if media element already bound
        audio.volume = 1.0;
      }
    } else {
      audio.volume = 1.0;
    }

    let finished = false;
    const cleanup = () => {
      if (!finished) {
        finished = true;
        activeAudioElement = null;
      }
    };

    audio.onended = () => {
      cleanup();
      onEnd?.();
    };

    audio.onerror = (e) => {
      cleanup();
      console.warn('Online TTS audio error, attempting direct play fallback:', e);
      onError?.(e);
      onEnd?.();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play notice (autoplay policy or network):', err);
        cleanup();
        onError?.(err);
        onEnd?.();
      });
    }

    return true;
  } catch (err) {
    console.warn('Online TTS creation failed:', err);
    activeAudioElement = null;
    onError?.(err);
    onEnd?.();
    return false;
  }
};

/**
 * Speaks the text aloud in a loud, crystal-clear voiceover using browser SpeechSynthesis
 * or amplified online TTS fallback.
 * Works across all 26+ Indian & Global languages.
 */
export const speakPhrase = (
  text: string,
  language: string = 'English',
  onEnd?: () => void,
  onError?: (err: any) => void,
  options?: SpeechOptions
): boolean => {
  if (!text || !text.trim()) {
    onEnd?.();
    return false;
  }

  stopSpeech();

  const langConfig = LANG_CODE_MAP[language] || { 
    bcp47: 'en-US', 
    ttsCode: 'en', 
    name: language, 
    flag: '🌐', 
    region: 'Global' as const 
  };
  const targetBcp47 = langConfig.bcp47;
  const targetTts = langConfig.ttsCode;

  if (typeof window === 'undefined') {
    onEnd?.();
    return false;
  }

  const hasSpeechSynthesis = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

  if (hasSpeechSynthesis) {
    try {
      window.speechSynthesis.resume();

      const matchedVoice = findBestVoice(targetBcp47, langConfig.name);

      if (matchedVoice) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = matchedVoice.lang || targetBcp47;
        utterance.voice = matchedVoice;
        
        // Optimize for loud, crystal-clear voiceover delivery
        utterance.rate = options?.rate || 0.92; // slightly paced for comprehension
        utterance.pitch = options?.pitch || 1.0;
        utterance.volume = 1.0; // Maximum browser volume

        // Prevent Chrome GC bug by storing active utterance in module scope
        activeUtterance = utterance;

        let finished = false;
        const handleEnd = () => {
          if (!finished) {
            finished = true;
            if (speechKeepAliveInterval) {
              clearInterval(speechKeepAliveInterval);
              speechKeepAliveInterval = null;
            }
            activeUtterance = null;
            onEnd?.();
          }
        };

        utterance.onend = handleEnd;
        utterance.onerror = (e) => {
          console.warn('speechSynthesis error event, streaming loud online TTS fallback:', e);
          if (!finished) {
            finished = true;
            activeUtterance = null;
            playOnlineTTS(text, targetTts, options, onEnd, onError);
          }
        };

        // Keepalive heartbeat for long speech synthesis in Chrome
        speechKeepAliveInterval = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            clearInterval(speechKeepAliveInterval);
            speechKeepAliveInterval = null;
          }
        }, 12000);

        speechTimeoutId = setTimeout(() => {
          try {
            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
          } catch (speakErr) {
            playOnlineTTS(text, targetTts, options, onEnd, onError);
          }
        }, 30);

        return true;
      } else {
        // Fallback to amplified online TTS if native OS voice is missing for regional language
        return playOnlineTTS(text, targetTts, options, onEnd, onError);
      }
    } catch (err) {
      console.warn('Speech synthesis error, falling back to loud online TTS:', err);
      return playOnlineTTS(text, targetTts, options, onEnd, onError);
    }
  } else {
    return playOnlineTTS(text, targetTts, options, onEnd, onError);
  }
};

/**
 * Voice Recognition helper using Web Speech API (webkitSpeechRecognition)
 * Supports all popular Indian & Global languages
 */
export class VoiceRecognizer {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    lang: string,
    onResult: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    try {
      const langConfig = LANG_CODE_MAP[lang] || { bcp47: 'en-US' };
      this.recognition.lang = langConfig.bcp47;

      this.recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript;
          const isFinal = lastResult.isFinal;
          onResult(transcript, isFinal);
        }
      };

      this.recognition.onerror = (event: any) => {
        let msg = 'Voice recognition error';
        if (event.error === 'not-allowed') {
          msg = 'Microphone access denied. Please click the microphone icon in the browser address bar to allow permissions.';
        } else if (event.error === 'no-speech') {
          msg = 'No voice detected. Please speak clearly into the microphone.';
        } else if (event.error === 'network') {
          msg = 'Network connection error during voice recognition.';
        } else if (event.error === 'aborted') {
          return;
        }
        onError(msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      onError(e?.message || 'Failed to initialize microphone.');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}
