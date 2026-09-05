import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  Languages, 
  ArrowRight,
  Bot,
  Car,
  Building2,
  HeartPulse,
  MapPin,
  Navigation,
  Check,
  AlertCircle,
  Lock,
  User
} from 'lucide-react';
import { LANG_CODE_MAP } from '../utils/speech';
import { 
  detectUserCurrentLocation, 
  getStoredLocation, 
  saveStoredLocation, 
  getStoredLanguage, 
  saveStoredLanguage 
} from '../utils/geoLocator';
import { UserLocation } from '../types';

interface WelcomeGatewayProps {
  isOpen: boolean;
  onSelectRegister: () => void;
  onSelectExplore: () => void;
  onSelectProviderRegister: () => void;
  onOpenLogin: () => void;
  onLocationDetected?: (loc: UserLocation) => void;
  onLanguageChanged?: (lang: string) => void;
}

export const WelcomeGateway: React.FC<WelcomeGatewayProps> = ({
  isOpen,
  onSelectRegister,
  onSelectExplore,
  onSelectProviderRegister,
  onOpenLogin,
  onLocationDetected,
  onLanguageChanged
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => getStoredLanguage());
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => getStoredLocation());
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedLanguage(getStoredLanguage());
      const stored = getStoredLocation();
      setUserLocation(stored);
      if (!stored) {
        setIsDetecting(true);
        detectUserCurrentLocation().then(loc => {
          if (loc) {
            setUserLocation(loc);
            setLocationStatus(`📍 Detected: ${loc.city}, ${loc.state}`);
            if (onLocationDetected) onLocationDetected(loc);
          }
        }).finally(() => {
          setIsDetecting(false);
        });
      }
    }
  }, [isOpen]);

  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    saveStoredLanguage(lang);
    if (onLanguageChanged) onLanguageChanged(lang);
  };

  const handleDetectGPS = async () => {
    setIsDetecting(true);
    setLocationStatus(null);
    try {
      const loc = await detectUserCurrentLocation();
      setUserLocation(loc);
      setLocationStatus(`📍 Detected: ${loc.city}, ${loc.state}`);
      if (onLocationDetected) onLocationDetected(loc);
    } catch {
      setLocationStatus('📍 Default location configured.');
    } finally {
      setIsDetecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(circle at 50% 30%, rgba(30, 27, 75, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)',
      backdropFilter: 'blur(20px)'
    }} className="animate-fade">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1080px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '30px 26px',
        background: 'rgba(15, 23, 42, 0.96)',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'var(--gradient-brand)',
            padding: '2.5px',
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#090e17',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass style={{ width: '26px', height: '26px', color: '#38bdf8' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Welcome to <span className="text-gradient">TripNova</span>
              </h1>
              <span className="badge badge-blue">Smart AI Guardian</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', maxWidth: '560px', margin: '2px auto 0' }}>
              Your intelligent, fair-fare & safety-first travel companion.
            </p>
          </div>
        </div>

        {/* Quick Setup: Webpage Language & Live GPS Location Option */}
        <div style={{
          padding: '14px 20px',
          borderRadius: '18px',
          background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          textAlign: 'left'
        }}>
          {/* 1. Webpage Language Option */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 260px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              <Languages style={{ width: '20px', height: '20px' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Webpage Language
              </label>
              <select
                value={selectedLanguage}
                onChange={handleLanguageSelect}
                className="input-glass"
                style={{ padding: '6px 10px', fontSize: '0.82rem', fontWeight: 700, marginTop: '2px', background: '#090e17' }}
              >
                {Object.entries(LANG_CODE_MAP).map(([key, cfg]) => (
                  <option key={key} value={key} style={{ background: '#090e17' }}>
                    {cfg.flag} {cfg.nativeName ? `${cfg.name} (${cfg.nativeName})` : cfg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.08)' }} className="hidden sm:block" />

          {/* 2. Current Location Option */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: userLocation ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: userLocation ? '#34d399' : '#fbbf24',
              flexShrink: 0
            }}>
              <MapPin style={{ width: '20px', height: '20px' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '2px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Current Location Detection
                </label>
                {userLocation && (
                  <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                    GPS Active
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isDetecting}
                  className="btn-secondary"
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: userLocation ? '#34d399' : '#38bdf8',
                    borderColor: userLocation ? 'rgba(52, 211, 153, 0.4)' : 'rgba(56, 189, 248, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Navigation style={{ width: '12px', height: '12px' }} />
                  <span>{isDetecting ? 'Detecting GPS...' : userLocation ? 'Update GPS Location' : '📍 Detect My Location'}</span>
                </button>
                <span style={{ fontSize: '0.75rem', color: userLocation ? '#f8fafc' : '#94a3b8', fontWeight: 600 }}>
                  {userLocation ? `${userLocation.city}, ${userLocation.state}` : 'Click to detect your location'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Already have an account? Sign In Banner */}
        <div style={{
          padding: '12px 20px',
          borderRadius: '16px',
          background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.12) 0%, rgba(251, 191, 36, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div className="flex items-center gap-3 text-left">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Lock style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                  Already have an account?
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>Tourist & Partner Login</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 0' }}>
                Sign in with your Username & Password. (Password reset available via registered email).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLogin}
            className="btn-primary"
            style={{
              padding: '8px 20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Log In to Account</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>

        {/* 3 Choice Cards: Consumer Register vs Explore Mode vs Service Provider Register */}
        <div className="grid grid-3 gap-4" style={{ textAlign: 'left' }}>
          {/* Choice 1: Consumer / Tourist Registration */}
          <div 
            onClick={onSelectRegister}
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '2px solid #38bdf8',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 12px 30px rgba(56, 189, 248, 0.2)',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <UserPlus style={{ width: '22px', height: '22px' }} />
                </div>
                <span className="badge badge-blue">Tourist ID</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Tourist / Consumer Registration
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                Enter personal details, Google Email, Native Currency, blood group, and 5 trusted SOS contacts.
              </p>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <CreditCard style={{ width: '13px', height: '13px' }} /> Offline Emergency Voice Card
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <ShieldCheck style={{ width: '13px', height: '13px' }} /> 5 SOS Emergency Dispatch
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Sparkles style={{ width: '13px', height: '13px' }} /> Personalized Itinerary Planner
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.82rem' }}
            >
              <span>Register Tourist Profile</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {/* Choice 2: Explore Mode */}
          <div 
            onClick={onSelectExplore}
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc'
                }}>
                  <Compass style={{ width: '22px', height: '22px' }} />
                </div>
                <span className="badge badge-purple">Guest Mode</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Navigation to Explore
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                Browse the application freely. Test travel tools, Fare Guard, 195 world clocks, weather, and Nova AI.
              </p>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign style={{ width: '13px', height: '13px', color: '#34d399' }} /> Live Currency & 195 Clocks
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Languages style={{ width: '13px', height: '13px', color: '#38bdf8' }} /> Smart Voice Translator
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bot style={{ width: '13px', height: '13px', color: '#c084fc' }} /> 24/7 Nova AI Concierge
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.82rem', color: '#c084fc' }}
            >
              <span>Explore As Guest</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {/* Choice 3: Service Provider Registration */}
          <div 
            onClick={onSelectProviderRegister}
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '2px solid #fbbf24',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 12px 30px rgba(245, 158, 11, 0.15)',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24'
                }}>
                  <ShieldCheck style={{ width: '22px', height: '22px' }} />
                </div>
                <span className="badge badge-amber">Partner Portal</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Service Provider Register
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                For Drivers, Tour Guides, Homestay Hosts, Medical Responders & Rental Agencies.
              </p>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Car style={{ width: '13px', height: '13px' }} /> Role-Based Category Forms
                </span>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <ShieldCheck style={{ width: '13px', height: '13px' }} /> Verified Provider Badge & ID
                </span>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <DollarSign style={{ width: '13px', height: '13px' }} /> Anti-Overcharging Fair-Fare Seal
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.82rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.5)' }}
            >
              <span>Onboard Your Services</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 auto' }}>
          * You can register, update profiles, or switch modes at any time from the top navigation bar.
        </p>
      </div>
    </div>
  );
};
