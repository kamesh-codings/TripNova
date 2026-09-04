import React, { useState, useEffect, useRef } from 'react';
import { 
  Languages, 
  DollarSign, 
  Clock, 
  BookOpen, 
  Ticket, 
  CloudSun, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2, 
  Sparkles, 
  MessageSquare, 
  Radio, 
  User, 
  MapPin, 
  Trash2, 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Ticket as TicketIcon, 
  Navigation, 
  ChevronRight, 
  Info, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Building2 
} from 'lucide-react';
import { COUNTRY_RULES, TICKET_BOOKING_PLATFORMS } from '../data/mockData';
import { HIERARCHICAL_TRANSIT_DATA } from '../data/transitData';
import { speakPhrase, stopSpeech, VoiceRecognizer, LANG_CODE_MAP, LanguageVoiceConfig } from '../utils/speech';
import { translateText } from '../utils/translator';

interface ConversationMessage {
  id: string;
  sender: 'tourist' | 'local';
  originalText: string;
  originalLang: string;
  translatedText: string;
  translatedLang: string;
  timestamp: string;
}

export const TravelTools: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'translator' | 'currency' | 'timezone' | 'rules' | 'booking' | 'weather'>('translator');

  // Hierarchical Ticket & Transit Booking State
  const [bookingCountryIdx, setBookingCountryIdx] = useState(0);
  const [bookingStateIdx, setBookingStateIdx] = useState(0);
  const [bookingDistrictIdx, setBookingDistrictIdx] = useState(0);
  const [bookingCityIdx, setBookingCityIdx] = useState(0);
  const [bookingCategoryFilter, setBookingCategoryFilter] = useState<'all' | 'flight' | 'train' | 'bus' | 'cab' | 'pass'>('all');

  // Translator Mode: 'standard' or 'conversation'
  const [translatorMode, setTranslatorMode] = useState<'standard' | 'conversation'>('standard');
  const [langFilterRegion, setLangFilterRegion] = useState<'All' | 'Indian' | 'Global'>('All');

  // Standard Translator State
  const [sourceText, setSourceText] = useState('Where is the nearest medical pharmacy?');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Tamil');
  const [translatedText, setTranslatedText] = useState('அருகிலுள்ள மருத்துவ மருந்தகம் எங்கே உள்ளது?');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activePhraseCategory, setActivePhraseCategory] = useState<'All' | 'Emergency' | 'Transport' | 'Food' | 'Greetings'>('All');

  // Conversation Mode State
  const [touristLang, setTouristLang] = useState('English');
  const [localLang, setLocalLang] = useState('Tamil');
  const [activeConversationMic, setActiveConversationMic] = useState<'tourist' | 'local' | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([
    {
      id: 'msg-1',
      sender: 'tourist',
      originalText: 'Hello, how much for this souvenir?',
      originalLang: 'English',
      translatedText: 'வணக்கம், இந்த நினைவுப் பொருளின் விலை என்ன?',
      translatedLang: 'Tamil',
      timestamp: 'Just now'
    }
  ]);
  const [convTranscribingText, setConvTranscribingText] = useState('');

  const [voiceRecognizer] = useState(() => new VoiceRecognizer());
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Currency State
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  // Rules & Regulations state
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);

  // Weather state
  const [weatherCity, setWeatherCity] = useState('Ooty & Nilgiris');

  // Stop audio when unmounting or switching tabs
  useEffect(() => {
    return () => {
      stopSpeech();
      voiceRecognizer.stopListening();
    };
  }, [activeSubTab, translatorMode]);

  // Scroll to bottom of conversation
  useEffect(() => {
    if (translatorMode === 'conversation') {
      conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory, convTranscribingText]);

  const allLanguageKeys = Object.keys(LANG_CODE_MAP);
  const filteredLanguages = allLanguageKeys.filter(langKey => {
    const config = LANG_CODE_MAP[langKey];
    if (langFilterRegion === 'Indian') return config.region === 'Indian';
    if (langFilterRegion === 'Global') return config.region === 'Global';
    return true;
  });

  const handleTranslate = async (
    textToTranslate: string = sourceText,
    fromL: string = sourceLang,
    toL: string = targetLang,
    shouldSpeakAfter: boolean = false
  ) => {
    if (!textToTranslate.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    setVoiceError(null);
    try {
      const result = await translateText(textToTranslate, fromL, toL);
      setTranslatedText(result);

      if (shouldSpeakAfter && result) {
        setIsPlayingAudio(true);
        speakPhrase(
          result,
          toL,
          () => setIsPlayingAudio(false),
          () => setIsPlayingAudio(false)
        );
      }
    } catch (err) {
      console.warn('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayAudio = (text: string = translatedText, lang: string = targetLang) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    if (!text.trim()) return;

    setIsPlayingAudio(true);
    const success = speakPhrase(
      text,
      lang,
      () => {
        setIsPlayingAudio(false);
      },
      (err) => {
        console.warn('Audio playback error callback:', err);
        setIsPlayingAudio(false);
      }
    );

    if (!success) {
      setIsPlayingAudio(false);
    }
  };

  const handleVoiceInput = () => {
    setVoiceError(null);
    if (isListening) {
      voiceRecognizer.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const started = voiceRecognizer.startListening(
        sourceLang,
        (result, isFinal) => {
          setSourceText(result);
          if (isFinal) {
            handleTranslate(result, sourceLang, targetLang, autoSpeak);
            setIsListening(false);
          }
        },
        (err) => {
          setVoiceError(err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (!started) {
        setIsListening(false);
      }
    }
  };

  // Two-way Conversation Mic Handler
  const handleConversationMic = (speaker: 'tourist' | 'local') => {
    setVoiceError(null);
    if (activeConversationMic === speaker) {
      voiceRecognizer.stopListening();
      setActiveConversationMic(null);
      setConvTranscribingText('');
      return;
    }

    const speakerLang = speaker === 'tourist' ? touristLang : localLang;
    const recipientLang = speaker === 'tourist' ? localLang : touristLang;

    setActiveConversationMic(speaker);
    setConvTranscribingText('');

    const started = voiceRecognizer.startListening(
      speakerLang,
      async (result, isFinal) => {
        setConvTranscribingText(result);
        if (isFinal && result.trim()) {
          setActiveConversationMic(null);
          setConvTranscribingText('');

          // Translate
          const translated = await translateText(result, speakerLang, recipientLang);
          
          const newMsg: ConversationMessage = {
            id: `msg-${Date.now()}`,
            sender: speaker,
            originalText: result,
            originalLang: speakerLang,
            translatedText: translated,
            translatedLang: recipientLang,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setConversationHistory(prev => [...prev, newMsg]);

          // Auto-speak translated phrase to the recipient
          speakPhrase(
            translated,
            recipientLang,
            () => setIsPlayingAudio(false),
            () => setIsPlayingAudio(false)
          );
        }
      },
      (err) => {
        setVoiceError(err);
        setActiveConversationMic(null);
        setConvTranscribingText('');
      },
      () => {
        setActiveConversationMic(null);
      }
    );

    if (!started) {
      setActiveConversationMic(null);
    }
  };

  const handleSwapLanguages = () => {
    const oldSrc = sourceLang;
    const oldTgt = targetLang;
    const oldSrcText = sourceText;
    const oldTgtText = translatedText;

    setSourceLang(oldTgt);
    setTargetLang(oldSrc);
    setSourceText(oldTgtText);
    setTranslatedText(oldSrcText);

    if (oldTgtText.trim()) {
      handleTranslate(oldTgtText, oldTgt, oldSrc, false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExchangeRate = (code: string) => {
    const country = COUNTRY_RULES.find(c => c.currencyCode === code);
    return country ? country.exchangeRateToINR : 1;
  };

  const calculateConversion = () => {
    const fromRate = getExchangeRate(fromCurrency);
    const toRate = getExchangeRate(toCurrency);
    const inrValue = amount * fromRate;
    const finalVal = inrValue / toRate;
    return finalVal.toFixed(2);
  };

  // Phrases for quick tap
  const PHRASE_CATEGORIES = {
    Emergency: [
      'Where is the nearest medical pharmacy?',
      'I need immediate doctor help',
      'Please call an ambulance',
      'I have an emergency'
    ],
    Transport: [
      'Please turn on the meter',
      'How much is the ticket?',
      'Take me to this address please',
      'Where is the bus stop?',
      'Where is the train station?'
    ],
    Food: [
      'I need vegetarian food',
      'Is drinking water safe here?',
      'Please give me bottled water',
      'How spicy is this dish?'
    ],
    Greetings: [
      'Hello, how are you?',
      'Thank you very much',
      'Can you help me please?',
      'Do you speak English?'
    ]
  };

  const allPhrases = activePhraseCategory === 'All'
    ? Object.values(PHRASE_CATEGORIES).flat()
    : PHRASE_CATEGORIES[activePhraseCategory];

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Tabs */}
      <div className="glass-panel" style={{ padding: '12px' }}>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'translator', label: 'Smart Voice Translator', icon: Languages },
            { id: 'currency', label: 'Currency Converter', icon: DollarSign },
            { id: 'timezone', label: 'World Clock & Timezones', icon: Clock },
            { id: 'rules', label: 'Country Rules & Etiquette', icon: BookOpen },
            { id: 'booking', label: 'Ticket Bookings', icon: Ticket },
            { id: 'weather', label: 'Weather Reports', icon: CloudSun },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)' : 'rgba(10, 15, 29, 0.7)',
                  borderColor: isActive ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#ffffff' : '#94a3b8'
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Language Translator Sub-Tab */}
      {activeSubTab === 'translator' && (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Mode Switcher Banner */}
          <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <div className="flex items-center gap-3">
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Languages style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>Global & Regional Voice Translator</h3>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>26 Indian & World Languages with speech-to-speech AI broadcast</p>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTranslatorMode('standard')}
                className="btn-secondary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: translatorMode === 'standard' ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                  color: translatorMode === 'standard' ? '#0f172a' : '#94a3b8'
                }}
              >
                <Languages style={{ width: '14px', height: '14px' }} />
                <span>Single Text & Voice</span>
              </button>

              <button
                type="button"
                onClick={() => setTranslatorMode('conversation')}
                className="btn-secondary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: translatorMode === 'conversation' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.06)',
                  color: translatorMode === 'conversation' ? '#ffffff' : '#94a3b8'
                }}
              >
                <MessageSquare style={{ width: '14px', height: '14px' }} />
                <span>2-Way Walkie-Talkie Mode</span>
              </button>
            </div>
          </div>

          {/* MODE A: Standard Single Voice & Text Translator */}
          {translatorMode === 'standard' && (
            <div className="grid grid-12 gap-5 animate-fade">
              <div className="col-span-7 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Region Filter & Swap */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginRight: '4px' }}>Filter:</span>
                      {(['All', 'Indian', 'Global'] as const).map(reg => (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => setLangFilterRegion(reg)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: langFilterRegion === reg ? '#4f46e5' : 'rgba(255,255,255,0.06)',
                            color: langFilterRegion === reg ? '#ffffff' : '#94a3b8',
                            fontWeight: langFilterRegion === reg ? 800 : 500
                          }}
                        >
                          {reg} ({reg === 'All' ? allLanguageKeys.length : reg === 'Indian' ? '10' : '16'})
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: autoSpeak ? '#38bdf8' : '#94a3b8', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={autoSpeak}
                          onChange={e => setAutoSpeak(e.target.checked)}
                          style={{ accentColor: '#38bdf8' }}
                        />
                        <span>Auto-speak Translation</span>
                      </label>

                      <button
                        type="button"
                        onClick={handleSwapLanguages}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}
                        title="Swap Languages"
                      >
                        <ArrowRightLeft style={{ width: '13px', height: '13px' }} /> Swap
                      </button>
                    </div>
                  </div>

                  {/* Source Language Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="flex justify-between items-center flex-wrap gap-2" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 800, color: '#38bdf8' }}>
                          From: {LANG_CODE_MAP[sourceLang]?.flag} {sourceLang} {LANG_CODE_MAP[sourceLang]?.nativeName ? `(${LANG_CODE_MAP[sourceLang]?.nativeName})` : ''}
                        </span>
                        <select
                          value={sourceLang}
                          onChange={e => {
                            const newL = e.target.value;
                            setSourceLang(newL);
                            handleTranslate(sourceText, newL, targetLang, false);
                          }}
                          className="input-glass"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, width: 'auto' }}
                        >
                          {filteredLanguages.map(l => (
                            <option key={l} value={l} style={{ background: '#090e17', color: '#ffffff' }}>
                              {LANG_CODE_MAP[l]?.flag} {l} {LANG_CODE_MAP[l]?.nativeName ? `- ${LANG_CODE_MAP[l]?.nativeName}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick Language Chips */}
                      <div className="flex gap-1 flex-wrap">
                        {['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'English', 'French'].map(l => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => {
                              setSourceLang(l);
                              handleTranslate(sourceText, l, targetLang, false);
                            }}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              border: 'none',
                              cursor: 'pointer',
                              background: sourceLang === l ? '#38bdf8' : '#1e293b',
                              color: sourceLang === l ? '#0f172a' : '#94a3b8',
                              fontWeight: sourceLang === l ? 800 : 500
                            }}
                          >
                            {LANG_CODE_MAP[l]?.flag} {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Source Textarea & Mic Trigger */}
                    <div style={{ position: 'relative' }}>
                      <textarea
                        rows={3}
                        value={sourceText}
                        onChange={e => {
                          setSourceText(e.target.value);
                          handleTranslate(e.target.value, sourceLang, targetLang, false);
                        }}
                        placeholder={`Type or speak in ${sourceLang}... (e.g., Where is the bus stop?)`}
                        className="input-glass"
                        style={{ resize: 'none', fontSize: '0.88rem', paddingRight: '110px' }}
                      />
                      <div style={{ position: 'absolute', right: '8px', bottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {sourceText && (
                          <button
                            type="button"
                            onClick={() => {
                              setSourceText('');
                              setTranslatedText('');
                            }}
                            style={{
                              padding: '6px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              background: 'rgba(255,255,255,0.06)',
                              color: '#94a3b8'
                            }}
                            title="Clear Text"
                          >
                            <RotateCcw style={{ width: '14px', height: '14px' }} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleVoiceInput}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isListening ? '#ef4444' : 'rgba(56, 189, 248, 0.2)',
                            color: isListening ? '#ffffff' : '#38bdf8',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                          title={`Click to speak in ${sourceLang}`}
                        >
                          {isListening ? (
                            <>
                              <MicOff style={{ width: '16px', height: '16px' }} />
                              <span>Listening...</span>
                            </>
                          ) : (
                            <>
                              <Mic style={{ width: '16px', height: '16px' }} />
                              <span>Speak</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {voiceError && (
                      <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                        <span>{voiceError}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Translate Button */}
                  <button
                    type="button"
                    onClick={() => handleTranslate(sourceText, sourceLang, targetLang, autoSpeak)}
                    disabled={isTranslating}
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                        <span>Translating accurately...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles style={{ width: '16px', height: '16px' }} />
                        <span>Translate to {LANG_CODE_MAP[targetLang]?.flag} {targetLang}</span>
                      </>
                    )}
                  </button>

                  {/* Translated Output Box */}
                  <div style={{
                    padding: '18px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 35, 60, 0.85) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div className="flex items-center justify-between flex-wrap gap-2" style={{ fontSize: '0.75rem' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 800, color: '#38bdf8' }}>
                          Target: {LANG_CODE_MAP[targetLang]?.flag} {targetLang} {LANG_CODE_MAP[targetLang]?.nativeName ? `(${LANG_CODE_MAP[targetLang]?.nativeName})` : ''}
                        </span>
                        <select
                          value={targetLang}
                          onChange={e => {
                            const newL = e.target.value;
                            setTargetLang(newL);
                            handleTranslate(sourceText, sourceLang, newL, false);
                          }}
                          className="input-glass"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, width: 'auto' }}
                        >
                          {filteredLanguages.map(l => (
                            <option key={l} value={l} style={{ background: '#090e17', color: '#ffffff' }}>
                              {LANG_CODE_MAP[l]?.flag} {l} {LANG_CODE_MAP[l]?.nativeName ? `- ${LANG_CODE_MAP[l]?.nativeName}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick target chips */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {['Tamil', 'Hindi', 'Telugu', 'Kannada', 'Spanish', 'Japanese'].map(l => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => {
                              setTargetLang(l);
                              handleTranslate(sourceText, sourceLang, l, false);
                            }}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              border: 'none',
                              cursor: 'pointer',
                              background: targetLang === l ? '#4f46e5' : '#1e293b',
                              color: targetLang === l ? '#ffffff' : '#94a3b8',
                              fontWeight: targetLang === l ? 800 : 500
                            }}
                          >
                            {LANG_CODE_MAP[l]?.flag} {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Translation Text & Audio Controls */}
                    <div style={{ minHeight: '52px', display: 'flex', alignItems: 'center' }}>
                      {isTranslating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                          <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite', color: '#38bdf8' }} />
                          <span>Generating real-time translation...</span>
                        </div>
                      ) : (
                        <p style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.4 }}>
                          {translatedText || <span style={{ color: '#64748b', fontWeight: 400 }}>Translation will appear here...</span>}
                        </p>
                      )}
                    </div>

                    {/* Bottom Bar: Speak and Copy Controls */}
                    <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(translatedText, targetLang)}
                          disabled={!translatedText}
                          className="btn-primary"
                          style={{
                            padding: '8px 16px',
                            fontSize: '0.78rem',
                            background: isPlayingAudio ? '#ef4444' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                            boxShadow: isPlayingAudio ? '0 0 15px rgba(239, 68, 68, 0.4)' : '0 0 15px rgba(56, 189, 248, 0.3)'
                          }}
                          title={isPlayingAudio ? 'Stop Audio' : `Play Voice Audio in ${targetLang}`}
                        >
                          {isPlayingAudio ? (
                            <>
                              <VolumeX style={{ width: '16px', height: '16px' }} />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 style={{ width: '16px', height: '16px' }} />
                              <span>Play Audio ({LANG_CODE_MAP[targetLang]?.flag} {targetLang})</span>
                            </>
                          )}
                        </button>

                        {isPlayingAudio && (
                          <div className="soundwave-container" title="Speaking...">
                            <div className="soundwave-bar"></div>
                            <div className="soundwave-bar"></div>
                            <div className="soundwave-bar"></div>
                            <div className="soundwave-bar"></div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!translatedText}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.72rem', color: copied ? '#34d399' : '#94a3b8' }}
                      >
                        {copied ? (
                          <>
                            <Check style={{ width: '14px', height: '14px' }} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy style={{ width: '14px', height: '14px' }} /> Copy Text
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Essential Travel Phrase Quick-Tap */}
              <div className="col-span-5 lg-col-span-12">
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="flex items-center justify-between">
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#cbd5e1' }}>
                      Essential Travel Phrase Quick-Tap
                    </h4>
                    <span className="badge badge-blue">Instant AI Translate</span>
                  </div>

                  {/* Categories selector */}
                  <div className="flex gap-1 flex-wrap">
                    {(['All', 'Emergency', 'Transport', 'Food', 'Greetings'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActivePhraseCategory(cat)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.68rem',
                          border: 'none',
                          cursor: 'pointer',
                          background: activePhraseCategory === cat ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                          color: activePhraseCategory === cat ? '#0f172a' : '#94a3b8',
                          fontWeight: activePhraseCategory === cat ? 800 : 600
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                    {allPhrases.map((phrase) => (
                      <div
                        key={phrase}
                        onClick={() => {
                          setSourceText(phrase);
                          setSourceLang('English');
                          handleTranslate(phrase, 'English', targetLang, autoSpeak);
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          background: 'rgba(10, 15, 29, 0.75)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          color: '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.background = 'rgba(10, 15, 29, 0.75)';
                        }}
                      >
                        <span>{phrase}</span>
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800, marginLeft: '8px', flexShrink: 0 }}>Translate &rarr;</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE B: Two-Way Conversation / Walkie-Talkie Mode */}
          {translatorMode === 'conversation' && (
            <div className="glass-panel animate-fade" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Radio style={{ width: '18px', height: '18px', color: '#10b981' }} />
                    Two-Way Live Walkie-Talkie Mode
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Tap either speaker button to talk. The app automatically recognizes speech, translates, and speaks aloud in the recipient's language.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setConversationHistory([])}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.72rem', color: '#f87171' }}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} /> Clear Chat
                </button>
              </div>

              {/* Language Selection Header for Conversation */}
              <div className="grid grid-2 gap-4">
                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User style={{ width: '14px', height: '14px' }} /> Tourist Language:
                    </span>
                    <select
                      value={touristLang}
                      onChange={e => setTouristLang(e.target.value)}
                      className="input-glass"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, width: 'auto' }}
                    >
                      {allLanguageKeys.map(l => (
                        <option key={l} value={l} style={{ background: '#090e17', color: '#ffffff' }}>
                          {LANG_CODE_MAP[l]?.flag} {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin style={{ width: '14px', height: '14px' }} /> Local Resident Language:
                    </span>
                    <select
                      value={localLang}
                      onChange={e => setLocalLang(e.target.value)}
                      className="input-glass"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#34d399', fontWeight: 700, width: 'auto' }}
                    >
                      {allLanguageKeys.map(l => (
                        <option key={l} value={l} style={{ background: '#090e17', color: '#ffffff' }}>
                          {LANG_CODE_MAP[l]?.flag} {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Chat Transcript Area */}
              <div style={{
                height: '320px',
                overflowY: 'auto',
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(10, 15, 29, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {conversationHistory.length === 0 && !convTranscribingText && (
                  <div style={{ margin: 'auto', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                    <MessageSquare style={{ width: '32px', height: '32px', margin: '0 auto 8px', opacity: 0.4 }} />
                    <p>No conversation messages yet. Tap either microphone button below to start talking!</p>
                  </div>
                )}

                {conversationHistory.map(msg => {
                  const isTourist = msg.sender === 'tourist';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isTourist ? 'flex-start' : 'flex-end',
                        maxWidth: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div className="flex items-center gap-2" style={{ fontSize: '0.68rem', color: '#94a3b8', alignSelf: isTourist ? 'flex-start' : 'flex-end' }}>
                        <span style={{ fontWeight: 800, color: isTourist ? '#38bdf8' : '#34d399' }}>
                          {isTourist ? `Tourist (${msg.originalLang})` : `Local (${msg.originalLang})`}
                        </span>
                        <span>• {msg.timestamp}</span>
                      </div>

                      <div style={{
                        padding: '12px 16px',
                        borderRadius: isTourist ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        background: isTourist ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
                        border: isTourist ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                      }}>
                        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>"{msg.originalText}"</p>
                        <div className="flex items-center justify-between gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{msg.translatedText}</p>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(msg.translatedText, msg.translatedLang)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: 'none',
                              cursor: 'pointer',
                              background: 'rgba(56, 189, 248, 0.2)',
                              color: '#38bdf8',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.7rem'
                            }}
                            title="Replay Audio"
                          >
                            <Volume2 style={{ width: '12px', height: '12px' }} /> Play
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Real-time transcribed text while listening */}
                {convTranscribingText && (
                  <div style={{
                    alignSelf: activeConversationMic === 'tourist' ? 'flex-start' : 'flex-end',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px dashed rgba(239, 68, 68, 0.5)',
                    color: '#fca5a5',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                    <span>Listening: "{convTranscribingText}"</span>
                  </div>
                )}

                <div ref={conversationEndRef} />
              </div>

              {/* Two Walkie-Talkie Action Buttons */}
              <div className="grid grid-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleConversationMic('tourist')}
                  className="btn-primary"
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: activeConversationMic === 'tourist' ? '#ef4444' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    boxShadow: activeConversationMic === 'tourist' ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(56, 189, 248, 0.3)'
                  }}
                >
                  {activeConversationMic === 'tourist' ? (
                    <>
                      <MicOff style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: 800 }}>Listening to Tourist ({LANG_CODE_MAP[touristLang]?.flag} {touristLang})...</span>
                    </>
                  ) : (
                    <>
                      <Mic style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: 800 }}>Tourist Speaks ({LANG_CODE_MAP[touristLang]?.flag} {touristLang})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleConversationMic('local')}
                  className="btn-primary"
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: activeConversationMic === 'local' ? '#ef4444' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: activeConversationMic === 'local' ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {activeConversationMic === 'local' ? (
                    <>
                      <MicOff style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: 800 }}>Listening to Local ({LANG_CODE_MAP[localLang]?.flag} {localLang})...</span>
                    </>
                  ) : (
                    <>
                      <Mic style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: 800 }}>Local Speaks ({LANG_CODE_MAP[localLang]?.flag} {localLang})</span>
                    </>
                  )}
                </button>
              </div>

              {voiceError && (
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>{voiceError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Currency Converter */}
      {activeSubTab === 'currency' && (
        <div className="glass-panel animate-fade" style={{ maxWidth: '640px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <DollarSign style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Live Global Currency Converter</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Accurate rates benchmarked to Indian Rupee (INR) and world currencies.</p>
            </div>
          </div>

          <div className="grid grid-2 gap-3">
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Amount & From Currency</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="input-glass"
                  style={{ fontFamily: 'monospace', fontWeight: 800 }}
                />
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  className="input-glass"
                  style={{ width: '110px', color: '#38bdf8', fontWeight: 700 }}
                >
                  {COUNTRY_RULES.map(c => (
                    <option key={c.currencyCode} value={c.currencyCode} style={{ background: '#090e17' }}>
                      {c.currencyCode} ({c.currencySymbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Currency</label>
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="input-glass"
                style={{ color: '#34d399', fontWeight: 800 }}
              >
                {COUNTRY_RULES.map(c => (
                  <option key={c.currencyCode} value={c.currencyCode} style={{ background: '#090e17' }}>
                    {c.currencyCode} ({c.currencySymbol}) - {c.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(10, 15, 29, 0.85)', border: '1px solid rgba(16, 185, 129, 0.4)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Converted Result:</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace', margin: '4px 0' }}>
              {calculateConversion()} {toCurrency}
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {amount} {fromCurrency} = {calculateConversion()} {toCurrency}
            </p>
          </div>
        </div>
      )}

      {/* 3. Timezones */}
      {activeSubTab === 'timezone' && (
        <div className="grid grid-3 gap-4 animate-fade">
          {COUNTRY_RULES.map(country => {
            const now = new Date();
            return (
              <div key={country.country} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                    {country.flag} {country.country.split('(')[0]}
                  </span>
                  <span className="badge badge-blue">{country.gmtOffset}</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
                  {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Timezone: {country.timezone}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Country Rules */}
      {activeSubTab === 'rules' && (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex flex-wrap gap-2">
            {COUNTRY_RULES.map((c, i) => (
              <button
                key={c.country}
                onClick={() => setSelectedCountryIndex(i)}
                className="btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  background: selectedCountryIndex === i ? '#38bdf8' : 'rgba(10, 15, 29, 0.7)',
                  color: selectedCountryIndex === i ? '#0f172a' : '#94a3b8',
                  fontWeight: 800
                }}
              >
                <span>{c.flag}</span>
                <span>{c.country}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-3 gap-4">
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck style={{ width: '16px', height: '16px' }} /> Legal Regulations
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
                {COUNTRY_RULES[selectedCountryIndex].keyRegulations.map((rule, idx) => (
                  <li key={idx} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    • {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen style={{ width: '16px', height: '16px' }} /> Cultural Etiquette
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
                {COUNTRY_RULES[selectedCountryIndex].culturalEtiquette.map((etiquette, idx) => (
                  <li key={idx} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    • {etiquette}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle style={{ width: '16px', height: '16px' }} /> Scams to Avoid
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }}>
                {COUNTRY_RULES[selectedCountryIndex].scamAlerts.map((scam, idx) => (
                  <li key={idx} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', fontSize: '0.75rem', color: '#fca5a5' }}>
                    ⚠️ {scam}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. Hierarchical Location-Based Ticket & Transit Bookings */}
      {activeSubTab === 'booking' && (() => {
        const currentCountry = HIERARCHICAL_TRANSIT_DATA[bookingCountryIdx] || HIERARCHICAL_TRANSIT_DATA[0];
        const statesList = currentCountry.states || [];
        const currentState = statesList[bookingStateIdx] || statesList[0] || { name: 'None', code: '', districts: [] };
        const districtsList = currentState.districts || [];
        const currentDistrict = districtsList[bookingDistrictIdx] || districtsList[0] || { name: 'None', headquarters: '', cities: [] };
        const citiesList = currentDistrict.cities || [];
        const currentCity = citiesList[bookingCityIdx] || citiesList[0] || {
          name: 'City',
          description: '',
          popularSpots: [],
          transit: { airports: [], railways: [], busTerminals: [], localTransit: { metroOrCabs: '', bookingLinks: [] } }
        };

        const { airports, railways, busTerminals, localTransit, monumentPasses = [] } = currentCity.transit;

        return (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Control Panel: Cascading Hierarchy Selectors */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    <Navigation style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Hierarchical Transit & Ticket Booking Hub</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Select your destination hierarchy to find official flights, trains, buses, cabs, and entry passes.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="badge badge-blue">
                    Currency: {currentCountry.currency}
                  </span>
                </div>
              </div>

              {/* 4-Step Cascading Dropdowns */}
              <div className="grid grid-4 gap-3">
                {/* 1. Country */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Step 1: Country</span>
                  </label>
                  <select
                    value={bookingCountryIdx}
                    onChange={e => {
                      const newCountryIdx = parseInt(e.target.value, 10);
                      setBookingCountryIdx(newCountryIdx);
                      setBookingStateIdx(0);
                      setBookingDistrictIdx(0);
                      setBookingCityIdx(0);
                    }}
                    className="input-glass"
                    style={{ fontWeight: 700, color: '#ffffff', width: '100%', padding: '10px 12px' }}
                  >
                    {HIERARCHICAL_TRANSIT_DATA.map((c, idx) => (
                      <option key={c.code} value={idx} style={{ background: '#090e17', color: '#ffffff' }}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. State / Province */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Step 2: State / Province</span>
                  </label>
                  <select
                    value={bookingStateIdx}
                    onChange={e => {
                      const newStateIdx = parseInt(e.target.value, 10);
                      setBookingStateIdx(newStateIdx);
                      setBookingDistrictIdx(0);
                      setBookingCityIdx(0);
                    }}
                    className="input-glass"
                    style={{ fontWeight: 700, color: '#34d399', width: '100%', padding: '10px 12px' }}
                  >
                    {statesList.map((s, idx) => (
                      <option key={s.name} value={idx} style={{ background: '#090e17', color: '#ffffff' }}>
                        📍 {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. District / Region */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Step 3: District / Region</span>
                  </label>
                  <select
                    value={bookingDistrictIdx}
                    onChange={e => {
                      const newDistIdx = parseInt(e.target.value, 10);
                      setBookingDistrictIdx(newDistIdx);
                      setBookingCityIdx(0);
                    }}
                    className="input-glass"
                    style={{ fontWeight: 700, color: '#fbbf24', width: '100%', padding: '10px 12px' }}
                  >
                    {districtsList.map((d, idx) => (
                      <option key={d.name} value={idx} style={{ background: '#090e17', color: '#ffffff' }}>
                        🏛️ {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. City / Town / Hub */}
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                    <span>Step 4: City / Town</span>
                  </label>
                  <select
                    value={bookingCityIdx}
                    onChange={e => {
                      const newCityIdx = parseInt(e.target.value, 10);
                      setBookingCityIdx(newCityIdx);
                    }}
                    className="input-glass"
                    style={{ fontWeight: 700, color: '#c084fc', width: '100%', padding: '10px 12px' }}
                  >
                    {citiesList.map((ct, idx) => (
                      <option key={ct.name} value={idx} style={{ background: '#090e17', color: '#ffffff' }}>
                        🏙️ {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Breadcrumbs & Destination Overview */}
            <div className="glass-panel" style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.5) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ color: '#ffffff' }}>{currentCountry.flag} {currentCountry.name}</span>
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#64748b' }} />
                  <span style={{ color: '#34d399' }}>{currentState.name}</span>
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#64748b' }} />
                  <span style={{ color: '#fbbf24' }}>{currentDistrict.name}</span>
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#64748b' }} />
                  <span style={{ color: '#38bdf8', fontWeight: 900, fontSize: '0.92rem' }}>{currentCity.name}</span>
                </div>

                {currentCity.pincodeOrZip && (
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '6px' }}>
                    PIN / ZIP: <strong>{currentCity.pincodeOrZip}</strong>
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {currentCity.description}
              </p>

              {/* Popular spots chips */}
              {currentCity.popularSpots && currentCity.popularSpots.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Key Spots:</span>
                  {currentCity.popularSpots.map((spot, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        color: '#bae6fd',
                        fontWeight: 600
                      }}
                    >
                      ★ {spot}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All Transits & Portals', icon: Navigation, count: airports.length + railways.length + busTerminals.length + (monumentPasses.length > 0 ? monumentPasses.length : 0) + 1 },
                { id: 'flight', label: 'Flights & Airports', icon: Plane, count: airports.length },
                { id: 'train', label: 'Trains & Railways', icon: Train, count: railways.length },
                { id: 'bus', label: 'Intercity Buses', icon: Bus, count: busTerminals.length },
                { id: 'cab', label: 'Cabs, Metro & Rentals', icon: Car, count: localTransit.bookingLinks.length },
                { id: 'pass', label: 'Sightseeing & Entry Passes', icon: TicketIcon, count: monumentPasses.length }
              ].map(cat => {
                const Icon = cat.icon;
                const isActive = bookingCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setBookingCategoryFilter(cat.id as any)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)' : 'rgba(15, 23, 42, 0.8)',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon style={{ width: '14px', height: '14px' }} />
                    <span>{cat.label}</span>
                    <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)' }}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Resolved Transit Hubs Grid */}
            <div className="grid grid-12 gap-4">
              
              {/* 1. AIRPORTS & FLIGHTS */}
              {(bookingCategoryFilter === 'all' || bookingCategoryFilter === 'flight') && airports.map((apt, idx) => (
                <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                        <Plane style={{ width: '18px', height: '18px' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{apt.name}</h4>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{apt.distance}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="badge badge-blue">IATA: {apt.code}</span>
                      <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>
                        {apt.type}
                      </span>
                    </div>
                  </div>

                  {/* Flight Booking Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {apt.bookingLinks.map((link, lIdx) => (
                      <div key={lIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{link.provider}</span>
                            <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>{link.badge}</span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{link.description}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                        >
                          <span>Book Flights</span>
                          <ExternalLink style={{ width: '12px', height: '12px' }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 2. RAILWAY STATIONS & TRAINS */}
              {(bookingCategoryFilter === 'all' || bookingCategoryFilter === 'train') && railways.map((rail, idx) => (
                <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                        <Train style={{ width: '18px', height: '18px' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{rail.name}</h4>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{rail.division}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                        Code: {rail.code}
                      </span>
                      <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' }}>
                        {rail.type}
                      </span>
                    </div>
                  </div>

                  {/* Rail Booking Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {rail.bookingLinks.map((link, lIdx) => (
                      <div key={lIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{link.provider}</span>
                            <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700 }}>{link.badge}</span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{link.description}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.72rem', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', whiteSpace: 'nowrap' }}
                        >
                          <span>Reserve Train</span>
                          <ExternalLink style={{ width: '12px', height: '12px' }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 3. BUS TERMINALS & INTERCITY COACHES */}
              {(bookingCategoryFilter === 'all' || bookingCategoryFilter === 'bus') && busTerminals.map((bus, idx) => (
                <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                        <Bus style={{ width: '18px', height: '18px' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{bus.name}</h4>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{bus.type}</p>
                      </div>
                    </div>
                  </div>

                  {bus.majorOperators && (
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(10, 15, 29, 0.5)', padding: '6px 10px', borderRadius: '8px' }}>
                      <strong style={{ color: '#fbbf24' }}>Key Fleets:</strong> {bus.majorOperators.join(' • ')}
                    </div>
                  )}

                  {/* Bus Booking Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {bus.bookingLinks.map((link, lIdx) => (
                      <div key={lIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{link.provider}</span>
                            <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 700 }}>{link.badge}</span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{link.description}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.72rem', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', whiteSpace: 'nowrap' }}
                        >
                          <span>Book Bus</span>
                          <ExternalLink style={{ width: '12px', height: '12px' }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 4. LOCAL TRANSIT, CABS & METRO */}
              {(bookingCategoryFilter === 'all' || bookingCategoryFilter === 'cab') && localTransit && (
                <div className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(168, 85, 247, 0.25)' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                      <Car style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Local Commute, Cabs & Self-Drive</h4>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{localTransit.metroOrCabs}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {localTransit.bookingLinks.map((link, lIdx) => (
                      <div key={lIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{link.provider}</span>
                            <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', fontWeight: 700 }}>{link.badge}</span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{link.description}</p>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.72rem', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)', whiteSpace: 'nowrap' }}
                        >
                          <span>Open Service</span>
                          <ExternalLink style={{ width: '12px', height: '12px' }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. MONUMENT & SIGHTSEEING PASSES */}
              {(bookingCategoryFilter === 'all' || bookingCategoryFilter === 'pass') && monumentPasses.length > 0 && (
                <div className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(236, 72, 153, 0.25)' }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
                      <TicketIcon style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Tourist E-Passes & Monument Tickets</h4>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Official government permits, heritage monument passes, and safari entries.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {monumentPasses.map((pass, pIdx) => (
                      <div key={pIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{pass.attractionName}</span>
                          </div>
                          <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', fontWeight: 700, display: 'inline-block', marginTop: '2px' }}>
                            {pass.passType}
                          </span>
                        </div>
                        <a
                          href={pass.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.72rem', background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)', whiteSpace: 'nowrap' }}
                        >
                          <span>Get Pass</span>
                          <ExternalLink style={{ width: '12px', height: '12px' }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* 6. Weather Reports */}
      {activeSubTab === 'weather' && (
        <div className="glass-panel animate-fade" style={{ maxWidth: '780px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <CloudSun style={{ width: '28px', height: '28px', color: '#fbbf24' }} />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Live Weather Radar & Trip Forecast</h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Monitors precipitation, storms, and cyclonic alerts for your spots.</p>
              </div>
            </div>

            <div className="flex gap-1">
              {['Ooty & Nilgiris', 'Chennai Coast', 'Madurai Heritage'].map(city => (
                <button
                  key={city}
                  onClick={() => setWeatherCity(city)}
                  className="btn-secondary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    background: weatherCity === city ? '#38bdf8' : 'rgba(10, 15, 29, 0.7)',
                    color: weatherCity === city ? '#0f172a' : '#94a3b8',
                    fontWeight: 700
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-3 gap-3">
            <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(10, 15, 29, 0.85)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Temperature</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff' }}>18°C</div>
              <p style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Mist & Light Drizzle</p>
            </div>

            <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(10, 15, 29, 0.85)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Humidity</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#818cf8' }}>82%</div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rain gear advised</p>
            </div>

            <div style={{ padding: '18px', borderRadius: '16px', background: 'rgba(10, 15, 29, 0.85)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Advisory</span>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>Ghat Road Clear</div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>Drive with fog lights</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
