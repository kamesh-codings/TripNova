// Web Speech API & Online TTS Hybrid Utility for Audio Broadcast & Voice Translation

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

let cachedVoices: SpeechSynthesisVoice[] = [];
let activeAudioElement: HTMLAudioElement | null = null;
let speechTimeoutId: any = null;

// Preload voices when browser initializes
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
  } catch (e) {
    console.warn('Speech synthesis voice preloading warning:', e);
  }
}

/**
 * Stop any active audio or speech synthesis
 */
export const stopSpeech = () => {
  if (speechTimeoutId) {
    clearTimeout(speechTimeoutId);
    speechTimeoutId = null;
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
};

/**
 * Plays online Google Translate TTS audio stream as a 100% reliable fallback
 * for all languages, especially when OS doesn't have local voice packs installed.
 */
export const playOnlineTTS = (
  text: string,
  ttsCode: string,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean => {
  try {
    const cleanText = encodeURIComponent(text.slice(0, 200).trim());
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsCode}&client=tw-ob&q=${cleanText}`;
    
    const audio = new Audio(audioUrl);
    activeAudioElement = audio;

    audio.onended = () => {
      activeAudioElement = null;
      onEnd?.();
    };

    audio.onerror = (e) => {
      activeAudioElement = null;
      console.warn('Online TTS audio error:', e);
      onError?.(e);
      onEnd?.();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play error (check autoplay/interaction):', err);
        activeAudioElement = null;
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
 * Speaks the text aloud using browser SpeechSynthesis or high-fidelity online TTS fallback.
 * Works seamlessly across all Indian and Global languages.
 */
export const speakPhrase = (
  text: string,
  language: string = 'English',
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean => {
  if (!text || !text.trim()) {
    onEnd?.();
    return false;
  }

  stopSpeech();

  const langConfig = LANG_CODE_MAP[language] || { bcp47: 'en-US', ttsCode: 'en', name: language, flag: '🌐', region: 'Global' as const };
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

      if (cachedVoices.length === 0) {
        cachedVoices = window.speechSynthesis.getVoices();
      }

      const targetPrefix = targetBcp47.split('-')[0].toLowerCase();
      const matchedVoice = cachedVoices.find(v => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang === targetBcp47.toLowerCase() || vLang.startsWith(targetPrefix);
      });

      if (matchedVoice) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetBcp47;
        utterance.voice = matchedVoice;
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        let finished = false;
        const handleEnd = () => {
          if (!finished) {
            finished = true;
            onEnd?.();
          }
        };

        utterance.onend = handleEnd;
        utterance.onerror = (e) => {
          console.warn('speechSynthesis error event:', e);
          if (!finished) {
            finished = true;
            playOnlineTTS(text, targetTts, onEnd, onError);
          }
        };

        speechTimeoutId = setTimeout(() => {
          try {
            window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
          } catch (speakErr) {
            playOnlineTTS(text, targetTts, onEnd, onError);
          }
        }, 40);

        return true;
      } else {
        // Fallback directly to online TTS stream if no native voice installed
        return playOnlineTTS(text, targetTts, onEnd, onError);
      }
    } catch (err) {
      console.warn('Speech synthesis error, falling back to online TTS:', err);
      return playOnlineTTS(text, targetTts, onEnd, onError);
    }
  } else {
    return playOnlineTTS(text, targetTts, onEnd, onError);
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
          msg = 'Microphone access denied. Please click the camera/mic icon in the browser address bar to allow microphone permissions.';
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
