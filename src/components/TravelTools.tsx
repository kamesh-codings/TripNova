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
  Building2,
  Search,
  Wind,
  Droplets,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Activity,
  Thermometer,
  Zap,
  RefreshCw,
  Compass
} from 'lucide-react';
import { COUNTRY_RULES, TICKET_BOOKING_PLATFORMS } from '../data/mockData';
import { 
  HIERARCHICAL_TRANSIT_DATA, 
  POPULAR_ORIGIN_CITIES, 
  POPULAR_DESTINATION_CITIES, 
  getRouteTicketOptions, 
  JourneyRouteResult 
} from '../data/transitData';
import { speakPhrase, stopSpeech, VoiceRecognizer, LANG_CODE_MAP, LanguageVoiceConfig } from '../utils/speech';
import { translateText } from '../utils/translator';
import { 
  fetchCompleteDestinationData, 
  calculateTimeDifference, 
  DEFAULT_HOME_CITY, 
  DEFAULT_HOME_TIMEZONE, 
  FullDestinationIntelligence 
} from '../utils/weatherApi';
import { 
  GLOBAL_195_COUNTRIES, 
  UTC_OFFSET_BANDS, 
  MULTI_TIMEZONE_COUNTRIES_OVERVIEW, 
  CountryTimezoneInfo, 
  TimezoneSubZone 
} from '../data/timezoneData';

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
  const [activeSubTab, setActiveSubTab] = useState<'translator' | 'currency' | 'timezone' | 'rules' | 'booking' | 'weather'>('booking');

  // Ticket & Transit Booking Mode: 'route' (From -> To) or 'hierarchy' (Country -> City)
  const [bookingTabMode, setBookingTabMode] = useState<'route' | 'hierarchy'>('route');
  const [fromCityInput, setFromCityInput] = useState('Chennai, Tamil Nadu');
  const [toCityInput, setToCityInput] = useState('Ooty & Nilgiri Hills, Tamil Nadu');
  const [travelDateInput, setTravelDateInput] = useState('Tomorrow');
  const [travelClassInput, setTravelClassInput] = useState('All Classes (AC / Sleeper / Economy)');
  const [routeCategoryFilter, setRouteCategoryFilter] = useState<'all' | 'flight' | 'train' | 'bus' | 'cab' | 'pass'>('all');

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

  // Timezone & World Clock State (Complete 195-Country & UTC-12 to UTC+14 Engine)
  const [selectedCountryId, setSelectedCountryId] = useState<number>(185); // Default: United Kingdom (185)
  const [selectedSubZoneTzId, setSelectedSubZoneTzId] = useState<string>('Europe/London');
  const [timezoneSearchQuery, setTimezoneSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState<'All' | 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania'>('All');
  const [utcBandFilter, setUtcBandFilter] = useState<string>(''); // e.g. 'UTC+5:30' or ''
  const [homeCountryId, setHomeCountryId] = useState<number>(77); // Default: India (77)
  const [homeSubZoneTzId, setHomeSubZoneTzId] = useState<string>('Asia/Kolkata');
  const [clockSearchQuery, setClockSearchQuery] = useState('London');
  const [clockData, setClockData] = useState<FullDestinationIntelligence | null>(null);
  const [isLoadingClock, setIsLoadingClock] = useState(false);
  const [clockError, setClockError] = useState<string | null>(null);
  const [liveTick, setLiveTick] = useState(0);

  // Weather & AQI State (Live Open-Meteo Integration)
  const [weatherSearchInput, setWeatherSearchInput] = useState('Ooty');
  const [weatherData, setWeatherData] = useState<FullDestinationIntelligence | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Live timer tick every second for real-time clocks
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial clock and weather data
  useEffect(() => {
    if (activeSubTab === 'timezone' && !clockData && !isLoadingClock) {
      handleLoadClock('London', homeSubZoneTzId);
    }
    if (activeSubTab === 'weather' && !weatherData && !isLoadingWeather) {
      handleLoadWeather('Ooty');
    }
  }, [activeSubTab]);

  const handleLoadClock = async (cityToFetch: string = clockSearchQuery, hTz: string = homeSubZoneTzId) => {
    if (!cityToFetch.trim()) return;
    setIsLoadingClock(true);
    setClockError(null);
    try {
      const res = await fetchCompleteDestinationData(cityToFetch, hTz);
      if (res) {
        setClockData(res);
      } else {
        setClockError(`City "${cityToFetch}" not found. Try searching for a major city name.`);
      }
    } catch (err) {
      setClockError('Failed to fetch destination timezone details.');
    } finally {
      setIsLoadingClock(false);
    }
  };

  const handleLoadWeather = async (cityToFetch: string = weatherSearchInput) => {
    if (!cityToFetch.trim()) return;
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const res = await fetchCompleteDestinationData(cityToFetch, homeSubZoneTzId);
      if (res) {
        setWeatherData(res);
      } else {
        setWeatherError(`City "${cityToFetch}" not found. Try another city.`);
      }
    } catch (err) {
      setWeatherError('Failed to fetch weather report.');
    } finally {
      setIsLoadingWeather(false);
    }
  };

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

      {/* 3. Timezones & World Clock Engine (195 Countries & 38 UTC Offset Bands) */}
      {activeSubTab === 'timezone' && (() => {
        // Find current home country and selected destination country
        const homeCountry = GLOBAL_195_COUNTRIES.find(c => c.id === homeCountryId) || GLOBAL_195_COUNTRIES[76]; // India (id: 77)
        const activeHomeTz = homeSubZoneTzId || homeCountry.primaryTzId;

        const selectedCountry = GLOBAL_195_COUNTRIES.find(c => c.id === selectedCountryId) || GLOBAL_195_COUNTRIES[184]; // UK (id: 185)
        const activeDestTz = selectedSubZoneTzId || selectedCountry.primaryTzId;

        // Calculate live ticking times using exact IANA timezone IDs
        let currentHomeTimeStr = '--:--:--';
        let currentHomeDateStr = '';
        try {
          currentHomeTimeStr = new Date().toLocaleTimeString('en-US', {
            timeZone: activeHomeTz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          currentHomeDateStr = new Date().toLocaleDateString('en-US', {
            timeZone: activeHomeTz,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        } catch (e) {
          currentHomeTimeStr = new Date().toLocaleTimeString();
        }

        let currentDestTimeStr = '--:--:--';
        let currentDestDateStr = '';
        try {
          currentDestTimeStr = new Date().toLocaleTimeString('en-US', {
            timeZone: activeDestTz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });
          currentDestDateStr = new Date().toLocaleDateString('en-US', {
            timeZone: activeDestTz,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        } catch (e) {
          currentDestTimeStr = new Date().toLocaleTimeString();
        }

        const timeDelta = calculateTimeDifference(activeDestTz, activeHomeTz);

        // Filter 195 Countries
        const filtered195 = GLOBAL_195_COUNTRIES.filter(country => {
          if (timezoneSearchQuery.trim()) {
            const q = timezoneSearchQuery.toLowerCase();
            const mName = country.name.toLowerCase().includes(q);
            const mCity = country.capitalOrMajorCity.toLowerCase().includes(q);
            const mTz = country.timezoneName.toLowerCase().includes(q) || country.primaryTzId.toLowerCase().includes(q);
            const mOffset = country.utcOffset.toLowerCase().includes(q);
            if (!mName && !mCity && !mTz && !mOffset) return false;
          }

          if (continentFilter !== 'All' && country.continent !== continentFilter) {
            return false;
          }

          if (utcBandFilter) {
            const cleanBand = utcBandFilter.replace('−', '-');
            const cleanOffset = country.utcOffset.replace('−', '-');
            if (!cleanOffset.includes(cleanBand)) return false;
          }

          return true;
        });

        return (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Top Control Panel: Home Base Selector, Search & Stats */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px', borderColor: 'rgba(56, 189, 248, 0.35)' }}>
              
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    <Clock style={{ width: '24px', height: '24px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>Global 195-Country World Clock & UTC Engine</h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time synchronized clocks across 195 countries, 38 UTC Offset bands (UTC−12 to UTC+14) & IANA zones</p>
                  </div>
                </div>

                {/* Home Base Selector */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📍 Your Home Base:</span>
                  </span>
                  <select
                    value={homeCountryId}
                    onChange={e => {
                      const newId = parseInt(e.target.value, 10);
                      setHomeCountryId(newId);
                      const cObj = GLOBAL_195_COUNTRIES.find(c => c.id === newId);
                      if (cObj) {
                        setHomeSubZoneTzId(cObj.primaryTzId);
                      }
                    }}
                    className="input-glass"
                    style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', padding: '8px 14px', background: '#090e17' }}
                  >
                    {GLOBAL_195_COUNTRIES.map(c => (
                      <option key={c.id} value={c.id} style={{ background: '#090e17', color: '#ffffff' }}>
                        {c.flag} {c.name} ({c.utcOffset.split('(')[0].trim()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Form */}
              <div className="flex gap-2">
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                  <input
                    type="text"
                    value={timezoneSearchQuery}
                    onChange={e => setTimezoneSearchQuery(e.target.value)}
                    placeholder="Search 195 countries, capitals, IANA timezones (e.g., India, Tokyo, Asia/Kolkata, Paris, London, America/New_York...)"
                    className="input-glass"
                    style={{ paddingLeft: '44px', width: '100%', fontSize: '0.88rem', fontWeight: 700 }}
                  />
                  {timezoneSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setTimezoneSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Continent Filter Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-1 flex-wrap">
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginRight: '4px' }}>Region:</span>
                  {(['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'] as const).map(cont => {
                    const count = cont === 'All' ? 195 : GLOBAL_195_COUNTRIES.filter(c => c.continent === cont).length;
                    const isActive = continentFilter === cont;
                    return (
                      <button
                        key={cont}
                        type="button"
                        onClick={() => setContinentFilter(cont)}
                        className="btn-secondary"
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          borderRadius: '8px',
                          background: isActive ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                          color: isActive ? '#0f172a' : '#cbd5e1',
                          fontWeight: isActive ? 800 : 600,
                          borderColor: isActive ? '#38bdf8' : 'rgba(255,255,255,0.06)'
                        }}
                      >
                        {cont} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Showing <strong>{filtered195.length}</strong> of 195 Countries
                  </span>
                </div>
              </div>

              {/* Interactive 38 UTC Offset Bands Ribbon (UTC-12 to UTC+14) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap style={{ width: '13px', height: '13px' }} />
                    <span>38 Global UTC Offset Bands (UTC−12 to UTC+14):</span>
                  </span>
                  {utcBandFilter && (
                    <button
                      type="button"
                      onClick={() => setUtcBandFilter('')}
                      style={{ fontSize: '0.7rem', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Clear Offset Filter (✕ {utcBandFilter})
                    </button>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '6px',
                  scrollbarWidth: 'thin'
                }}>
                  {UTC_OFFSET_BANDS.map(band => {
                    const isSelected = utcBandFilter === band.offset;
                    const isIndia = band.offset === 'UTC+5:30';
                    return (
                      <button
                        key={band.offset}
                        type="button"
                        onClick={() => setUtcBandFilter(isSelected ? '' : band.offset)}
                        title={`${band.offset}: ${band.examplePlace}`}
                        style={{
                          padding: '5px 9px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          border: isSelected ? '1px solid #38bdf8' : isIndia ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                          background: isSelected ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : isIndia ? 'rgba(251, 191, 36, 0.12)' : 'rgba(10, 15, 29, 0.7)',
                          color: isSelected ? '#ffffff' : isIndia ? '#fbbf24' : '#cbd5e1',
                          fontWeight: isSelected || isIndia ? 800 : 500,
                          flexShrink: 0
                        }}
                      >
                        {band.offset}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Live Dual Clocks Hero Comparison for Selected Country */}
            <div className="grid grid-12 gap-4">
              
              {/* Left: Home Base Live Clock */}
              <div className="col-span-6 lg-col-span-12 glass-panel" style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 35, 65, 0.85) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.4rem' }}>{homeCountry.flag}</span>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>Your Home Base</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>{homeCountry.name}</h4>
                    </div>
                  </div>
                  <span className="badge badge-blue">{homeCountry.utcOffset.split('/')[0].trim()}</span>
                </div>

                <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(10, 15, 29, 0.85)', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {currentHomeTimeStr}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
                    📅 {currentHomeDateStr}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                  <span>Zone: <strong style={{ color: '#ffffff' }}>{activeHomeTz}</strong></span>
                  <span>Capital: <strong>{homeCountry.capitalOrMajorCity}</strong></span>
                </div>
              </div>

              {/* Right: Destination Location Live Clock */}
              <div className="col-span-6 lg-col-span-12 glass-panel" style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.75) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '1.4rem' }}>{selectedCountry.flag}</span>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800 }}>Inspected Destination</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>{selectedCountry.name}</h4>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 800 }}>
                    {selectedCountry.utcOffset}
                  </span>
                </div>

                {/* Sub-Zone Selector if Country has multiple timezones */}
                {selectedCountry.subZones && selectedCountry.subZones.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                    <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 800, whiteSpace: 'nowrap' }}>Multi-Zone:</span>
                    <select
                      value={activeDestTz}
                      onChange={e => setSelectedSubZoneTzId(e.target.value)}
                      className="input-glass"
                      style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', padding: '4px 8px', width: '100%', background: '#090e17' }}
                    >
                      {selectedCountry.subZones.map(sz => (
                        <option key={sz.tzId} value={sz.tzId} style={{ background: '#090e17' }}>
                          {sz.name} ({sz.offset})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(10, 15, 29, 0.85)', textAlign: 'center', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#c084fc', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {currentDestTimeStr}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
                    📅 {currentDestDateStr}
                  </p>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 text-xs" style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                  <span>Zone: <strong style={{ color: '#ffffff' }}>{activeDestTz}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      const cityName = selectedCountry.capitalOrMajorCity.split('&')[0].split(',')[0].trim();
                      setWeatherSearchInput(cityName);
                      setActiveSubTab('weather');
                      handleLoadWeather(cityName);
                    }}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(251, 191, 36, 0.15)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      color: '#fbbf24',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CloudSun style={{ width: '12px', height: '12px' }} />
                    <span>Check Live Weather &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Time Difference Banner */}
              {timeDelta && (
                <div className="col-span-12 glass-panel" style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.3) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                      <ArrowRightLeft style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 800 }}>Time Difference Assessment:</span>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                        {selectedCountry.flag} {selectedCountry.name} is <span style={{ color: '#34d399' }}>{timeDelta.differenceText}</span> ({homeCountry.name})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Official Timezone Name</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                        {selectedCountry.timezoneName}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>IANA Identifier</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                        {activeDestTz}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Complete 195-Country Live World Clock Grid */}
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Clock style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff' }}>
                    Live Clocks — {filtered195.length} Countries Synchronized in Real-Time
                  </h4>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Click any country card to inspect & compare
                </span>
              </div>

              <div className="grid grid-3 gap-3">
                {filtered195.map(country => {
                  let countryTime = '--:--:--';
                  try {
                    countryTime = new Date().toLocaleTimeString('en-US', {
                      timeZone: country.primaryTzId,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    });
                  } catch (e) {
                    countryTime = '--:--:--';
                  }

                  const isCurrentSelected = selectedCountryId === country.id;

                  return (
                    <div
                      key={country.id}
                      onClick={() => {
                        setSelectedCountryId(country.id);
                        setSelectedSubZoneTzId(country.primaryTzId);
                      }}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: isCurrentSelected ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)' : 'rgba(10, 15, 29, 0.75)',
                        border: isCurrentSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isCurrentSelected ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none'
                      }}
                      onMouseEnter={e => {
                        if (!isCurrentSelected) e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                      }}
                      onMouseLeave={e => {
                        if (!isCurrentSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '1.2rem' }}>{country.flag}</span>
                          <div>
                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', display: 'block', lineHeight: 1.2 }}>
                              {country.name}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{country.capitalOrMajorCity}</span>
                          </div>
                        </div>
                        <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                          {country.utcOffset.split('/')[0].split('to')[0].trim()}
                        </span>
                      </div>

                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isCurrentSelected ? '#38bdf8' : '#e2e8f0', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                        {countryTime}
                      </div>

                      <div className="flex items-center justify-between text-xs" style={{ fontSize: '0.68rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
                        <span>{country.primaryTzId}</span>
                        <span style={{ color: isCurrentSelected ? '#38bdf8' : '#94a3b8', fontWeight: 700 }}>
                          {isCurrentSelected ? 'Active Destination ★' : 'Click to inspect &rarr;'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered195.length === 0 && (
                <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No countries match your search / filter criteria. Try clearing the filter or searching for another country.
                </div>
              )}
            </div>

          </div>
        );
      })()}

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

      {/* 5. Complete From -> To Route Ticket Booking & Transit Hub Engine */}
      {activeSubTab === 'booking' && (() => {
        // Route Ticket Booking Result calculation
        const routeResult: JourneyRouteResult = getRouteTicketOptions(fromCityInput, toCityInput, travelDateInput);

        // Hierarchical explorer state calculation
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

        const handleSwapRoute = () => {
          const tempFrom = fromCityInput;
          setFromCityInput(toCityInput);
          setToCityInput(tempFrom);
        };

        return (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Switcher: Route Booking vs Station Hub Explorer */}
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <TicketIcon style={{ width: '22px', height: '22px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>Smart Transit & Ticket Booking Engine</h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Search From &rarr; To route tickets across Flights, Trains, Buses, Cabs & Destination Passes</p>
                </div>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBookingTabMode('route')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: bookingTabMode === 'route' ? 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.06)',
                    color: bookingTabMode === 'route' ? '#ffffff' : '#94a3b8',
                    boxShadow: bookingTabMode === 'route' ? '0 0 15px rgba(56, 189, 248, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Navigation style={{ width: '15px', height: '15px' }} />
                  <span>From &rarr; To Route Search</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingTabMode('hierarchy')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: bookingTabMode === 'hierarchy' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.06)',
                    color: bookingTabMode === 'hierarchy' ? '#ffffff' : '#94a3b8',
                    boxShadow: bookingTabMode === 'hierarchy' ? '0 0 15px rgba(16, 185, 129, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Building2 style={{ width: '15px', height: '15px' }} />
                  <span>Station & Hub Explorer</span>
                </button>
              </div>
            </div>

            {/* =========================================================================
                MODE 1: FROM -> TO ROUTE TICKET BOOKING ENGINE (PRIMARY)
               ========================================================================= */}
            {bookingTabMode === 'route' && (
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Search Panel: From, To, Date, Class */}
                <div className="glass-panel" style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 35, 65, 0.85) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}>
                  <div className="grid grid-12 gap-3 items-end">
                    
                    {/* FROM: Starting Point */}
                    <div className="col-span-4 lg-col-span-12">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <MapPin style={{ width: '14px', height: '14px' }} />
                        <span>Starting Point (From):</span>
                      </label>
                      <input
                        type="text"
                        value={fromCityInput}
                        onChange={e => setFromCityInput(e.target.value)}
                        placeholder="e.g., Chennai, Tamil Nadu"
                        className="input-glass"
                        style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', padding: '12px 14px' }}
                      />
                    </div>

                    {/* Swap Button */}
                    <div className="col-span-1 lg-col-span-12" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '4px' }}>
                      <button
                        type="button"
                        onClick={handleSwapRoute}
                        className="btn-secondary"
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          borderColor: 'rgba(56, 189, 248, 0.3)'
                        }}
                        title="Swap Origin & Destination"
                      >
                        <ArrowRightLeft style={{ width: '18px', height: '18px' }} />
                      </button>
                    </div>

                    {/* TO: Destination */}
                    <div className="col-span-4 lg-col-span-12">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Navigation style={{ width: '14px', height: '14px' }} />
                        <span>Destination (To):</span>
                      </label>
                      <input
                        type="text"
                        value={toCityInput}
                        onChange={e => setToCityInput(e.target.value)}
                        placeholder="e.g., Ooty & Nilgiri Hills, Tamil Nadu"
                        className="input-glass"
                        style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', padding: '12px 14px' }}
                      />
                    </div>

                    {/* Travel Date */}
                    <div className="col-span-3 lg-col-span-12">
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <Clock style={{ width: '14px', height: '14px' }} />
                        <span>Travel Date:</span>
                      </label>
                      <select
                        value={travelDateInput}
                        onChange={e => setTravelDateInput(e.target.value)}
                        className="input-glass"
                        style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', padding: '12px 14px', width: '100%' }}
                      >
                        <option value="Today" style={{ background: '#090e17' }}>Today (Instant Departure)</option>
                        <option value="Tomorrow" style={{ background: '#090e17' }}>Tomorrow Morning</option>
                        <option value="This Weekend (Saturday)" style={{ background: '#090e17' }}>This Weekend (Saturday)</option>
                        <option value="Next Week" style={{ background: '#090e17' }}>Next Week</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Popular Origin and Destination Chips */}
                  <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: '0.72rem' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>Popular Origins:</span>
                      {['Chennai', 'Bengaluru', 'Coimbatore', 'Madurai', 'Kochi', 'Mumbai', 'Delhi', 'Tokyo', 'Paris'].map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setFromCityInput(`${city}, India`)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: fromCityInput.includes(city) ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                            color: fromCityInput.includes(city) ? '#0f172a' : '#94a3b8',
                            fontWeight: fromCityInput.includes(city) ? 800 : 500
                          }}
                        >
                          {city}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: '0.72rem' }}>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>Popular Destinations:</span>
                      {['Ooty & Nilgiri Hills', 'Chennai Central', 'Madurai Heritage', 'Kanyakumari', 'Kochi & Fort Kochi', 'Tokyo', 'Paris'].map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setToCityInput(`${city}, Tamil Nadu`)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: toCityInput.includes(city) ? '#34d399' : 'rgba(255,255,255,0.06)',
                            color: toCityInput.includes(city) ? '#0f172a' : '#94a3b8',
                            fontWeight: toCityInput.includes(city) ? 800 : 500
                          }}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Route Journey Summary Banner */}
                <div className="glass-panel" style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#38bdf8' }}>{routeResult.fromCity}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                      <span style={{ height: '2px', width: '30px', background: '#38bdf8' }}></span>
                      <span>approx. {routeResult.distanceKm} km</span>
                      <span style={{ height: '2px', width: '30px', background: '#34d399' }}></span>
                      <ChevronRight style={{ width: '16px', height: '16px', color: '#34d399' }} />
                    </div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#34d399' }}>{routeResult.toCity}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="badge badge-blue">Travel Date: {routeResult.travelDate}</span>
                  </div>
                </div>

                {/* Multi-Modal Category Filter Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: 'all', label: 'All Route Options', icon: Navigation, count: routeResult.flights.length + routeResult.trains.length + routeResult.buses.length + routeResult.cabs.length + (routeResult.destinationPasses?.length || 0) },
                    { id: 'flight', label: 'Flights', icon: Plane, count: routeResult.flights.length },
                    { id: 'train', label: 'Trains & Railways', icon: Train, count: routeResult.trains.length },
                    { id: 'bus', label: 'Intercity Buses', icon: Bus, count: routeResult.buses.length },
                    { id: 'cab', label: 'Cabs & Self-Drive', icon: Car, count: routeResult.cabs.length },
                    { id: 'pass', label: 'Destination Passes', icon: TicketIcon, count: routeResult.destinationPasses?.length || 0 }
                  ].map(cat => {
                    const Icon = cat.icon;
                    const isActive = routeCategoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setRouteCategoryFilter(cat.id as any)}
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

                {/* Results Section for From -> To Route */}
                <div className="grid grid-12 gap-4">
                  
                  {/* 1. FLIGHTS SECTION */}
                  {(routeCategoryFilter === 'all' || routeCategoryFilter === 'flight') && routeResult.flights.map((flt, idx) => (
                    <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                            <Plane style={{ width: '20px', height: '20px' }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{flt.airline}</h4>
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{flt.flightNumber} • {flt.stops}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>{flt.estimatedPrice}</span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>per adult</span>
                        </div>
                      </div>

                      {/* Flight Timings Box */}
                      <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{flt.departureTime}</div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{flt.fromAirport}</p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>{flt.duration}</span>
                          <div style={{ width: '60px', height: '2px', background: '#38bdf8', margin: '3px auto' }}></div>
                          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Direct Flight</span>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{flt.arrivalTime}</div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{flt.toAirport}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Official Provider: <strong>{flt.provider}</strong></span>
                        <a
                          href={flt.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                        >
                          <span>Book Flight on {flt.provider.split(' ')[0]}</span>
                          <ExternalLink style={{ width: '13px', height: '13px' }} />
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* 2. TRAINS SECTION */}
                  {(routeCategoryFilter === 'all' || routeCategoryFilter === 'train') && routeResult.trains.map((trn, idx) => (
                    <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                            <Train style={{ width: '20px', height: '20px' }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{trn.trainName}</h4>
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Train #{trn.trainNumber} • {trn.duration}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>{trn.estimatedPrice}</span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>IRCTC Fare</span>
                        </div>
                      </div>

                      {/* Station Details */}
                      <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{trn.departureTime}</div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{trn.fromStation}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {trn.classes.map(cls => (
                            <span key={cls} style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800 }}>
                              {cls}
                            </span>
                          ))}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{trn.arrivalTime}</div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{trn.toStation}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                          ★ {trn.availabilityBadge || 'Confirmed Seats Prediction'}
                        </span>
                        <a
                          href={trn.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
                        >
                          <span>Book Train on IRCTC</span>
                          <ExternalLink style={{ width: '13px', height: '13px' }} />
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* 3. BUSES SECTION */}
                  {(routeCategoryFilter === 'all' || routeCategoryFilter === 'bus') && routeResult.buses.map((bus, idx) => (
                    <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                            <Bus style={{ width: '20px', height: '20px' }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{bus.operator}</h4>
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{bus.busType}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>{bus.estimatedPrice}</span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>per berth/seat</span>
                        </div>
                      </div>

                      {/* Bus Boarding & Drop */}
                      <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{bus.departureTime}</div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{bus.fromTerminal}</p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700 }}>{bus.duration}</span>
                          <div style={{ width: '50px', height: '2px', background: '#fbbf24', margin: '3px auto' }}></div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{bus.arrivalTime}</div>
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{bus.toTerminal}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {bus.seatsAvailable && (
                          <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>
                            {bus.seatsAvailable} seats remaining
                          </span>
                        )}
                        <a
                          href={bus.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
                        >
                          <span>Book Bus Ticket</span>
                          <ExternalLink style={{ width: '13px', height: '13px' }} />
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* 4. CABS & SELF DRIVE */}
                  {(routeCategoryFilter === 'all' || routeCategoryFilter === 'cab') && routeResult.cabs.map((cab, idx) => (
                    <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                            <Car style={{ width: '20px', height: '20px' }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{cab.serviceType}</h4>
                            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{cab.distanceKm} km • {cab.duration}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#c084fc', fontFamily: 'monospace' }}>{cab.estimatedPrice}</span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Estimated Cab Fare</span>
                        </div>
                      </div>

                      <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                        <p><strong>Route:</strong> {cab.routeVia}</p>
                        <p style={{ color: '#94a3b8', marginTop: '4px' }}><strong>Toll:</strong> {cab.tollEstimate}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Door-to-Door Pickup</span>
                        <a
                          href={cab.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.78rem', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.4)' }}
                        >
                          <span>Reserve Cab / Rental</span>
                          <ExternalLink style={{ width: '13px', height: '13px' }} />
                        </a>
                      </div>
                    </div>
                  ))}

                  {/* 5. DESTINATION PASSES */}
                  {(routeCategoryFilter === 'all' || routeCategoryFilter === 'pass') && routeResult.destinationPasses && routeResult.destinationPasses.map((pass, idx) => (
                    <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6' }}>
                            <TicketIcon style={{ width: '20px', height: '20px' }} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{pass.attractionName}</h4>
                            <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', fontWeight: 700, display: 'inline-block', marginTop: '2px' }}>
                              {pass.passType}
                            </span>
                          </div>
                        </div>

                        <a
                          href={pass.bookingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' }}
                        >
                          <span>Get Official Pass</span>
                          <ExternalLink style={{ width: '13px', height: '13px' }} />
                        </a>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}

            {/* =========================================================================
                MODE 2: HIERARCHICAL STATION & HUB EXPLORER (COUNTRY -> CITY)
               ========================================================================= */}
            {bookingTabMode === 'hierarchy' && (
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 4-Step Cascading Dropdowns */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                        <Building2 style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Hierarchical Location & Station Explorer</h3>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Browse all airports, train junctions, and central bus stands in any selected city.</p>
                      </div>
                    </div>

                    <span className="badge badge-blue">
                      Currency: {currentCountry.currency}
                    </span>
                  </div>

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

                {/* Resolved Transit Hubs Grid */}
                <div className="grid grid-12 gap-4">
                  {/* AIRPORTS */}
                  {airports.map((apt, idx) => (
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
                        <span className="badge badge-blue">IATA: {apt.code}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {apt.bookingLinks.map((link, lIdx) => (
                          <div key={lIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{link.provider}</span>
                              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{link.description}</p>
                            </div>
                            <a href={link.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.72rem' }}>
                              <span>Book Flights</span>
                              <ExternalLink style={{ width: '12px', height: '12px' }} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* RAILWAYS */}
                  {railways.map((rail, idx) => (
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
                        <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800 }}>
                          Code: {rail.code}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {rail.bookingLinks.map((link, lIdx) => (
                          <div key={lIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{link.provider}</span>
                              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{link.description}</p>
                            </div>
                            <a href={link.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.72rem', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
                              <span>Reserve Train</span>
                              <ExternalLink style={{ width: '12px', height: '12px' }} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* BUSES */}
                  {busTerminals.map((bus, idx) => (
                    <div key={idx} className="col-span-6 lg-col-span-12 glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                          <Bus style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>{bus.name}</h4>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{bus.type}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {bus.bookingLinks.map((link, lIdx) => (
                          <div key={lIdx} style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(10, 15, 29, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{link.provider}</span>
                              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{link.description}</p>
                            </div>
                            <a href={link.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.72rem', background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
                              <span>Book Bus</span>
                              <ExternalLink style={{ width: '12px', height: '12px' }} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {/* 6. Live Weather Reports, 7-Day Forecast & Air Quality Radar (Live Open-Meteo Integration) */}
      {activeSubTab === 'weather' && (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Header & City Search Bar */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                  <CloudSun style={{ width: '22px', height: '22px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>Live Weather Radar, 7-Day Forecast & AQI</h3>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time meteorological conditions, US AQI air quality ratings & dynamic travel safety advice</p>
                </div>
              </div>

              {weatherData && (
                <div className="flex items-center gap-2">
                  <span className="badge badge-blue">
                    📍 {weatherData.location.city}, {weatherData.location.country}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLoadWeather(weatherData.location.city)}
                    disabled={isLoadingWeather}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Refresh live weather"
                  >
                    <RefreshCw className={isLoadingWeather ? 'animate-spin' : ''} style={{ width: '12px', height: '12px' }} />
                    <span>Refresh</span>
                  </button>
                </div>
              )}
            </div>

            {/* Search Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleLoadWeather(weatherSearchInput);
              }}
              className="flex gap-2"
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b' }} />
                <input
                  type="text"
                  value={weatherSearchInput}
                  onChange={e => setWeatherSearchInput(e.target.value)}
                  placeholder="Search any destination worldwide (e.g., Ooty, Chennai, Kodaikanal, Tokyo, Paris, London...)"
                  className="input-glass"
                  style={{ paddingLeft: '44px', width: '100%', fontSize: '0.88rem', fontWeight: 700 }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoadingWeather}
                className="btn-primary"
                style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', flexShrink: 0, background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}
              >
                {isLoadingWeather ? <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} /> : <CloudSun style={{ width: '16px', height: '16px' }} />}
                <span>Fetch Weather</span>
              </button>
            </form>

            {/* Quick Popular Weather Cities */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Popular Spots:</span>
              {['Ooty', 'Chennai', 'Kodaikanal', 'Madurai', 'Bengaluru', 'Tokyo', 'Paris', 'London', 'New York'].map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setWeatherSearchInput(city);
                    handleLoadWeather(city);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: weatherData?.location.city.toLowerCase() === city.toLowerCase() ? '#fbbf24' : 'rgba(255, 255, 255, 0.06)',
                    color: weatherData?.location.city.toLowerCase() === city.toLowerCase() ? '#0f172a' : '#cbd5e1',
                    fontWeight: weatherData?.location.city.toLowerCase() === city.toLowerCase() ? 800 : 500,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {city}
                </button>
              ))}
            </div>

            {weatherError && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{weatherError}</span>
              </div>
            )}
          </div>

          {weatherData && (
            <>
              {/* Main Weather Overview & Key Metrics */}
              <div className="grid grid-12 gap-4">
                
                {/* Hero Current Weather Card */}
                <div className="col-span-7 lg-col-span-12 glass-panel" style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>{weatherData.location.city}</h3>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>({weatherData.location.country})</span>
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Timezone: {weatherData.location.timezone} &bull; Coordinates: {weatherData.location.latitude.toFixed(2)}°, {weatherData.location.longitude.toFixed(2)}°
                      </p>
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      background: weatherData.weather.isDay ? 'rgba(251, 191, 36, 0.2)' : 'rgba(129, 140, 248, 0.2)',
                      color: weatherData.weather.isDay ? '#fbbf24' : '#818cf8',
                      border: `1px solid ${weatherData.weather.isDay ? 'rgba(251, 191, 36, 0.3)' : 'rgba(129, 140, 248, 0.3)'}`
                    }}>
                      {weatherData.weather.isDay ? '☀️ Daylight' : '🌙 Night Time'}
                    </span>
                  </div>

                  {/* Giant Temp & Condition */}
                  <div className="flex items-center justify-between flex-wrap gap-4" style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(10, 15, 29, 0.75)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div>
                      <div style={{ fontSize: '3.2rem', fontWeight: 900, color: '#ffffff', lineHeight: 1, fontFamily: 'monospace' }}>
                        {weatherData.weather.temperature}°C
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px' }}>
                        Feels like <strong style={{ color: '#38bdf8' }}>{weatherData.weather.feelsLike}°C</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>
                        {weatherData.weather.condition}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                        WMO Weather Code: #{weatherData.weather.weatherCode}
                      </div>
                    </div>
                  </div>

                  {/* 4 Metrics Tiles */}
                  <div className="grid grid-4 gap-3">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                      <div className="flex items-center justify-center gap-1" style={{ color: '#38bdf8', marginBottom: '4px' }}>
                        <Droplets style={{ width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Humidity</span>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                        {weatherData.weather.humidity}%
                      </div>
                    </div>

                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                      <div className="flex items-center justify-center gap-1" style={{ color: '#34d399', marginBottom: '4px' }}>
                        <Wind style={{ width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Wind</span>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                        {weatherData.weather.windSpeed} <span style={{ fontSize: '0.7rem' }}>km/h</span>
                      </div>
                    </div>

                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                      <div className="flex items-center justify-center gap-1" style={{ color: '#818cf8', marginBottom: '4px' }}>
                        <CloudSun style={{ width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Rain / Precip</span>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                        {weatherData.weather.precipitation} <span style={{ fontSize: '0.7rem' }}>mm</span>
                      </div>
                    </div>

                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center' }}>
                      <div className="flex items-center justify-center gap-1" style={{ color: '#f59e0b', marginBottom: '4px' }}>
                        <Sun style={{ width: '14px', height: '14px' }} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>UV Index</span>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                        {weatherData.weather.uvIndex} <span style={{ fontSize: '0.65rem', color: weatherData.weather.uvIndex >= 6 ? '#f87171' : '#34d399' }}>({weatherData.weather.uvIndex >= 8 ? 'Very High' : weatherData.weather.uvIndex >= 6 ? 'High' : weatherData.weather.uvIndex >= 3 ? 'Moderate' : 'Low'})</span>
                      </div>
                    </div>
                  </div>

                  {/* Sunrise & Sunset Strip */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.75rem' }}>
                    <div className="flex items-center gap-2">
                      <Sunrise style={{ width: '15px', height: '15px', color: '#fbbf24' }} />
                      <span style={{ color: '#94a3b8' }}>Sunrise:</span>
                      <strong style={{ color: '#ffffff' }}>{weatherData.weather.sunrise}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset style={{ width: '15px', height: '15px', color: '#f97316' }} />
                      <span style={{ color: '#94a3b8' }}>Sunset:</span>
                      <strong style={{ color: '#ffffff' }}>{weatherData.weather.sunset}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                      <span style={{ color: '#94a3b8' }}>Daylight:</span>
                      <strong style={{ color: '#38bdf8' }}>{Math.floor(weatherData.weather.daylightDurationSeconds / 3600)}h {Math.round((weatherData.weather.daylightDurationSeconds % 3600) / 60)}m</strong>
                    </div>
                  </div>
                </div>

                {/* Right Column: Air Quality (AQI) Meter & Dynamic Travel Advice */}
                <div className="col-span-5 lg-col-span-12 flex flex-col gap-4">
                  
                  {/* Air Quality Index Card */}
                  <div className="glass-panel" style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 35, 65, 0.75) 100%)',
                    border: `1px solid ${weatherData.airQuality.aqiColor}40`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity style={{ width: '18px', height: '18px', color: weatherData.airQuality.aqiColor }} />
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>Air Quality Index (AQI)</h4>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: `${weatherData.airQuality.aqiColor}25`,
                        color: weatherData.airQuality.aqiColor,
                        border: `1px solid ${weatherData.airQuality.aqiColor}50`
                      }}>
                        {weatherData.airQuality.aqiStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(10, 15, 29, 0.75)' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>US AQI Score</span>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: weatherData.airQuality.aqiColor, fontFamily: 'monospace' }}>
                          {weatherData.airQuality.usAqi}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>PM2.5</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{weatherData.airQuality.pm25} <span style={{ fontSize: '0.65rem' }}>µg/m³</span></span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>PM10</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{weatherData.airQuality.pm10} <span style={{ fontSize: '0.65rem' }}>µg/m³</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Smart Travel & Safety Advice Card */}
                  <div className="glass-panel" style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 80, 50, 0.3) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    flex: 1
                  }}>
                    <div className="flex items-center gap-2">
                      <Sparkles style={{ width: '18px', height: '18px', color: '#34d399' }} />
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>AI Travel & Packing Advisory</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {weatherData.travelAdvice.map((adv, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(10, 15, 29, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            fontSize: '0.75rem',
                            color: '#e2e8f0',
                            lineHeight: 1.4
                          }}
                        >
                          {adv}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* 7-Day Interactive Forecast Slider */}
              {weatherData.forecast && weatherData.forecast.length > 0 && (
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                  <div className="flex items-center justify-between">
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CloudSun style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                      <span>7-Day Comprehensive Weather Forecast</span>
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Daily high &bull; low &bull; rain probability</span>
                  </div>

                  <div className="grid grid-7 gap-2">
                    {weatherData.forecast.map((item, idx) => {
                      const dateObj = new Date(item.date);
                      const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                      return (
                        <div
                          key={item.date}
                          style={{
                            padding: '14px 10px',
                            borderRadius: '12px',
                            background: idx === 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(10, 15, 29, 0.75)',
                            border: idx === 0 ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            textAlign: 'center'
                          }}
                        >
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: idx === 0 ? '#38bdf8' : '#ffffff' }}>
                            {dayName}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                            {formattedDate}
                          </span>

                          <div style={{ fontSize: '1.4rem', margin: '4px 0' }}>
                            {item.condition.split(' ')[0]}
                          </div>

                          <div style={{ fontSize: '0.68rem', color: '#cbd5e1', fontWeight: 600, minHeight: '28px' }}>
                            {item.condition.substring(item.condition.indexOf(' ') + 1)}
                          </div>

                          <div className="flex items-center gap-1" style={{ marginTop: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ffffff' }}>{item.maxTemp}°</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>/ {item.minTemp}°</span>
                          </div>

                          {item.rainProbability > 0 ? (
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                              💧 {item.rainProbability}%
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', color: '#64748b', marginTop: '2px' }}>
                              ☀️ Dry
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
};

