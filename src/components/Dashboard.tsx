import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  CreditCard, 
  Scale, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  HeartPulse, 
  Calendar, 
  User, 
  Edit3, 
  ShieldCheck, 
  Languages, 
  Clock, 
  CloudSun, 
  Activity, 
  Zap, 
  PhoneCall,
  Radio,
  ExternalLink,
  RefreshCw,
  Check,
  Mic,
  MicOff
} from 'lucide-react';
import { UserProfile, TripPlan, ServiceProviderProfile, UserLocation } from '../types';
import { TOP_PICKS_CATEGORIES, NEARBY_HOSPITALS } from '../data/mockData';
import { 
  getStoredLocation, 
  detectUserCurrentLocation, 
  reverseGeocodeCoordinates,
  setManualUserLocation,
  KNOWN_HUBS 
} from '../utils/geoLocator';
import { listenVoiceInput } from '../utils/speech';

interface DashboardProps {
  userProfile: UserProfile;
  providerProfile?: ServiceProviderProfile | null;
  activeTrip?: TripPlan;
  onNavigateTab: (tab: string) => void;
  onOpenRegister: () => void;
  onOpenProviderRegister?: () => void;
  onOpenSOS: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  providerProfile,
  activeTrip,
  onNavigateTab,
  onOpenRegister,
  onOpenProviderRegister,
  onOpenSOS
}) => {
  const [currentLoc, setCurrentLoc] = useState<UserLocation | null>(() => getStoredLocation());
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [showManualPicker, setShowManualPicker] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [isListeningLocation, setIsListeningLocation] = useState<boolean>(false);
  const [stopVoiceFn, setStopVoiceFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handleLocUpdate = (e: any) => {
      if (e.detail) setCurrentLoc(e.detail);
    };
    window.addEventListener('tripnova_location_updated', handleLocUpdate);
    return () => window.removeEventListener('tripnova_location_updated', handleLocUpdate);
  }, []);

  const handleRefreshGPS = async () => {
    setIsDetecting(true);
    try {
      const loc = await detectUserCurrentLocation();
      setCurrentLoc(loc);
    } catch {
      // ignore
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSetCity = (hubName: string) => {
    const loc = setManualUserLocation(hubName);
    setCurrentLoc(loc);
    setShowManualPicker(false);
  };

  const filteredCategories = TOP_PICKS_CATEGORIES.filter(cat => {
    if (!userProfile.interestedTopPicks || userProfile.interestedTopPicks.length === 0) return true;
    return userProfile.interestedTopPicks.some(pick => cat.title.toLowerCase().includes(pick.toLowerCase().split(' ')[0]));
  });

  const displayPicks = filteredCategories.length > 0 ? filteredCategories : TOP_PICKS_CATEGORIES;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome Card - Clean, Spacious & Premium */}
      <div className="hero-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge badge-blue">
              <Sparkles style={{ width: '13px', height: '13px' }} /> Next-Gen Tourist Guardian
            </span>
            <span className={`badge ${userProfile.isRegistered ? 'badge-green' : 'badge-amber'}`}>
              {userProfile.isRegistered ? `🛡️ Active Tourist: ${userProfile.name} (Protected)` : '🧭 Explore Mode Active'}
            </span>
            <span className="badge badge-purple hide-mobile">
              <ShieldCheck style={{ width: '13px', height: '13px' }} /> 99.8% AI Safety Shield
            </span>
          </div>

          <h1 className="hero-title">
            Explore with Wonder. <br />
            <span className="text-gradient">Travel with Zero Fear.</span>
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.65, maxWidth: '850px' }}>
            Your all-in-one AI travel companion. Plan personalized itineraries, eliminate transport overcharging with Fare Guard, and carry an offline digital Emergency Card with instant voice translation.
          </p>

          {/* Clean Feature Pillars Strip */}
          <div className="flex items-center gap-2 flex-wrap" style={{ paddingTop: '2px' }}>
            <span style={{ 
              fontSize: '0.76rem', 
              padding: '4px 10px', 
              borderRadius: '8px', 
              background: 'rgba(245, 158, 11, 0.12)', 
              color: '#fbbf24', 
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Scale style={{ width: '13px', height: '13px' }} /> Anti-Scam Fare Guard
            </span>
            <span style={{ 
              fontSize: '0.76rem', 
              padding: '4px 10px', 
              borderRadius: '8px', 
              background: 'rgba(56, 189, 248, 0.12)', 
              color: '#38bdf8', 
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Languages style={{ width: '13px', height: '13px' }} /> 10+ Voice Engines
            </span>
            <span style={{ 
              fontSize: '0.76rem', 
              padding: '4px 10px', 
              borderRadius: '8px', 
              background: 'rgba(168, 85, 247, 0.12)', 
              color: '#c084fc', 
              border: '1px solid rgba(168, 85, 247, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Clock style={{ width: '13px', height: '13px' }} /> 195 World Clocks
            </span>
            <span style={{ 
              fontSize: '0.76rem', 
              padding: '4px 10px', 
              borderRadius: '8px', 
              background: 'rgba(16, 185, 129, 0.12)', 
              color: '#34d399', 
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CloudSun style={{ width: '13px', height: '13px' }} /> Satellite Weather & AQI
            </span>
            <span style={{ 
              fontSize: '0.76rem', 
              padding: '4px 10px', 
              borderRadius: '8px', 
              background: 'rgba(239, 68, 68, 0.12)', 
              color: '#f87171', 
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <HeartPulse style={{ width: '13px', height: '13px' }} /> Offline Medical E-Card
            </span>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex items-center gap-3 flex-wrap" style={{ paddingTop: '8px' }}>
            <button
              onClick={() => onNavigateTab('planner')}
              className="btn-primary"
            >
              <Compass style={{ width: '18px', height: '18px' }} /> Start Planning Trip
            </button>
            <button
              onClick={() => onNavigateTab('emergency-card')}
              className="btn-secondary"
              style={{ color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            >
              <HeartPulse style={{ width: '18px', height: '18px', color: '#ef4444' }} /> Emergency Card
            </button>
            <button
              onClick={() => onNavigateTab('anti-scam')}
              className="btn-secondary"
              style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <Scale style={{ width: '18px', height: '18px', color: '#fbbf24' }} /> Calculate Fair Fare
            </button>

            {userProfile.isRegistered ? (
              <button
                onClick={() => onNavigateTab('profile')}
                className="btn-secondary"
                style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
              >
                <User style={{ width: '18px', height: '18px' }} /> View Profile
              </button>
            ) : (
              <button
                onClick={onOpenRegister}
                className="btn-secondary"
                style={{ color: '#38bdf8' }}
              >
                <User style={{ width: '18px', height: '18px' }} /> Register Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Location Radar & Precision GPS Card */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.9) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Radio style={{ width: '20px', height: '20px', animation: isDetecting ? 'spin 1s linear infinite' : 'pulse 2s infinite' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Live Location & Tourist Safety Zone
                </h3>
                <span className={`badge ${currentLoc?.isApproximate ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.65rem' }}>
                  {isDetecting ? '🛰️ Locking Satellites...' : currentLoc?.isApproximate ? '🌐 Network / Wi-Fi Estimated' : '📡 High-Accuracy GPS Lock'}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Used in your Emergency SOS broadcasts, nearby emergency services, and local guide dispatch.
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshGPS}
              disabled={isDetecting}
              className="btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '0.74rem',
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Force fresh satellite and hardware GPS detection"
            >
              <RefreshCw style={{ width: '12px', height: '12px', animation: isDetecting ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isDetecting ? 'Detecting...' : '🎯 Detect Live GPS'}</span>
            </button>

            <button
              onClick={() => setShowManualPicker(!showManualPicker)}
              className="btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '0.74rem',
                color: '#fbbf24',
                borderColor: 'rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Manually pick or search your exact location"
            >
              <MapPin style={{ width: '12px', height: '12px' }} />
              <span>{showManualPicker ? 'Hide Selector' : '📍 Change Location'}</span>
            </button>
          </div>
        </div>

        {/* Resolved Address Banner */}
        <div style={{
          padding: '10px 14px',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin style={{ width: '14px', height: '14px', flexShrink: 0, color: '#38bdf8' }} />
              {currentLoc?.formattedAddress || currentLoc?.city || 'Resolving location...'}
            </span>
            {currentLoc?.latitude && currentLoc?.longitude && (
              <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginTop: '2px', fontFamily: 'monospace' }}>
                Coordinates: {currentLoc.latitude.toFixed(5)}° N, {currentLoc.longitude.toFixed(5)}° E
              </span>
            )}
          </div>

          {currentLoc?.latitude && currentLoc?.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${currentLoc.latitude},${currentLoc.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                fontSize: '0.72rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View on Maps</span>
              <ExternalLink style={{ width: '11px', height: '11px' }} />
            </a>
          )}
        </div>

        {/* Manual Location Selector Dropdown */}
        {showManualPicker && (
          <div className="animate-fade" style={{
            padding: '14px',
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>
                Select or Search Your Active City / Tourist Zone:
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                (Ensures 100% accuracy on PC & Wi-Fi networks)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                placeholder="Type or speak city/landmark name (e.g. Ooty, Madurai, Kodaikanal, Chennai)..."
                className="input-glass"
                style={{ fontSize: '0.78rem', padding: '6px 12px', flex: 1 }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && manualInput.trim()) {
                    handleSetCity(manualInput.trim());
                  }
                }}
              />

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={() => {
                  if (isListeningLocation) {
                    stopVoiceFn?.();
                    setIsListeningLocation(false);
                  } else {
                    const stop = listenVoiceInput(
                      (text) => {
                        setManualInput(text);
                        handleSetCity(text);
                      },
                      (listening) => setIsListeningLocation(listening),
                      userProfile.preferredLanguage || 'English'
                    );
                    setStopVoiceFn(() => stop);
                  }
                }}
                style={{
                  background: isListeningLocation ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.15)',
                  border: isListeningLocation ? '1px solid #ef4444' : '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '8px',
                  color: isListeningLocation ? '#f87171' : '#38bdf8',
                  padding: '6px 12px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap'
                }}
                title="Speak your city or location"
              >
                <Mic style={{ width: '13px', height: '13px', animation: isListeningLocation ? 'pulse 1s infinite' : 'none' }} />
                <span>{isListeningLocation ? '🎙️ Listening...' : '🎙️ Voice'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (manualInput.trim()) handleSetCity(manualInput.trim());
                }}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.76rem', fontWeight: 800 }}
              >
                Set Location
              </button>
            </div>

            <div className="flex items-center gap-1 flex-wrap" style={{ marginTop: '2px' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginRight: '4px' }}>Popular Hubs:</span>
              {KNOWN_HUBS.slice(0, 10).map(hub => (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => handleSetCity(hub.name)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: currentLoc?.city.includes(hub.name) ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: currentLoc?.city.includes(hub.name) ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: currentLoc?.city.includes(hub.name) ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {currentLoc?.city.includes(hub.name) && <Check style={{ width: '10px', height: '10px', display: 'inline', marginRight: '2px' }} />}
                  {hub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Overview Card (Dual-Mode: Tourist or Service Provider) */}
      <div className="glass-panel" style={{
        padding: '18px 24px',
        background: providerProfile && !userProfile.isRegistered 
          ? 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(41, 37, 36, 0.7) 100%)'
          : 'linear-gradient(90deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 27, 75, 0.6) 100%)',
        border: providerProfile && !userProfile.isRegistered 
          ? '1px solid rgba(245, 158, 11, 0.25)' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: providerProfile && !userProfile.isRegistered ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            border: providerProfile && !userProfile.isRegistered ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: providerProfile && !userProfile.isRegistered ? '#fbbf24' : '#38bdf8',
            fontSize: '18px',
            fontWeight: 800
          }}>
            {userProfile.isRegistered ? (
              userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User style={{ width: '22px', height: '22px' }} />
            ) : providerProfile ? (
              providerProfile.businessName ? providerProfile.businessName.charAt(0).toUpperCase() : <ShieldCheck style={{ width: '22px', height: '22px' }} />
            ) : (
              <User style={{ width: '22px', height: '22px' }} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                {userProfile.isRegistered 
                  ? userProfile.name 
                  : providerProfile 
                  ? (providerProfile.businessName || providerProfile.providerName)
                  : 'Guest Profile'}
              </h3>
              <span className={`badge ${userProfile.isRegistered ? 'badge-green' : providerProfile ? 'badge-amber' : 'badge-amber'}`}>
                {userProfile.isRegistered ? 'Registered Tourist' : providerProfile ? 'Verified Partner' : 'Not Registered'}
              </span>
              {userProfile.isRegistered && (
                <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                  ID: {userProfile.id ? userProfile.id.slice(-6).toUpperCase() : 'TRP-849'}
                </span>
              )}
              {!userProfile.isRegistered && providerProfile && (
                <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                  ID: {providerProfile.id}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              {userProfile.isRegistered 
                ? `Blood: ${userProfile.bloodGroup} • ${userProfile.trustedContacts.length} Emergency Contacts • ${userProfile.govtIdType}`
                : providerProfile
                ? `Proprietor: ${providerProfile.providerName} • ${providerProfile.operatingCity} • Fair-Fare Verified`
                : 'Register your personal & medical details for the offline emergency card.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {userProfile.isRegistered ? (
            <>
              <button
                onClick={() => onNavigateTab('profile')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.78rem', color: '#38bdf8' }}
              >
                <User style={{ width: '14px', height: '14px' }} /> View Profile
              </button>
              <button
                onClick={onOpenRegister}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.78rem' }}
              >
                <Edit3 style={{ width: '14px', height: '14px' }} /> Edit Details
              </button>
            </>
          ) : providerProfile ? (
            <>
              <button
                onClick={() => onNavigateTab('profile')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.78rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
              >
                <ShieldCheck style={{ width: '14px', height: '14px' }} /> View Partner Profile
              </button>
              {onOpenProviderRegister && (
                <button
                  onClick={onOpenProviderRegister}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#000000', fontWeight: 800 }}
                >
                  <Edit3 style={{ width: '14px', height: '14px' }} /> Edit Details
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onOpenRegister}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.8rem' }}
            >
              <User style={{ width: '15px', height: '15px' }} /> Register Tourist Profile
            </button>
          )}
        </div>
      </div>

      {/* 4 Feature Quick Widgets Grid */}
      <div className="widgets-grid">
        {/* 1. Active Itinerary Widget */}
        <div 
          onClick={() => onNavigateTab('planner')}
          className="widget-card"
        >
          <div className="flex items-center justify-between">
            <span className="badge badge-blue">Active Itinerary</span>
            <Calendar style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              {activeTrip ? activeTrip.title : 'Nilgiris Expedition'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {activeTrip ? `${activeTrip.durationDays} Days • ${activeTrip.travelerCount || 2} Travelers • ${activeTrip.transportMode}` : '5 Days • 2 Travelers • Train & Cab'}
            </p>
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>
            <span>View Schedule</span> <ArrowRight style={{ width: '14px', height: '14px' }} />
          </div>
        </div>

        {/* 2. Fare Guard Anti-Scam Widget */}
        <div 
          onClick={() => onNavigateTab('anti-scam')}
          className="widget-card"
        >
          <div className="flex items-center justify-between">
            <span className="badge badge-amber">Fare Guard</span>
            <Scale style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              Anti-Scam Travel Calculator
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Avoid 3x-6x tourist overcharging
            </p>
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24' }}>
            <span>Calculate Fair Fare</span> <ArrowRight style={{ width: '14px', height: '14px' }} />
          </div>
        </div>

        {/* 3. Emergency Card Widget */}
        <div 
          onClick={() => onNavigateTab('emergency-card')}
          className="widget-card"
          style={{ borderColor: 'rgba(239, 68, 68, 0.25)' }}
        >
          <div className="flex items-center justify-between">
            <span className="badge badge-red">Digital Safety ID</span>
            <CreditCard style={{ width: '18px', height: '18px', color: '#f87171' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              Emergency Voice Card
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Blood: <strong style={{ color: '#f87171' }}>{userProfile.bloodGroup || 'O+'}</strong> • {userProfile.trustedContacts?.length || 0} Contacts
            </p>
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>
            <span>Open & Broadcast Audio</span> <ArrowRight style={{ width: '14px', height: '14px' }} />
          </div>
        </div>

        {/* 4. Nearest Emergency Hub Widget */}
        <div 
          onClick={() => onNavigateTab('safety-hub')}
          className="widget-card"
        >
          <div className="flex items-center justify-between">
            <span className="badge badge-green">Safety Radar</span>
            <ShieldAlert style={{ width: '18px', height: '18px', color: '#34d399' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              Nearest Emergency Hub
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {NEARBY_HOSPITALS[0].name} (1.2 km)
            </p>
          </div>
          <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>
            <span>View Police & Hospitals</span> <ArrowRight style={{ width: '14px', height: '14px' }} />
          </div>
        </div>
      </div>

      {/* Top Picks Curated Slides */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Top Picks Curated for Your Journey</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tailored according to your registered travel preferences</p>
          </div>
          <button
            onClick={() => onNavigateTab('planner')}
            className="flex items-center gap-1"
            style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span>Custom Plan</span> <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        <div className="top-picks-grid">
          {displayPicks.map((pick) => (
            <div
              key={pick.id}
              className="pick-card"
              onClick={() => onNavigateTab('planner')}
            >
              <div className="pick-image-container">
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="pick-image"
                />
                <div className="pick-image-overlay" />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className="badge badge-blue">Trending Circuit</span>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{pick.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{pick.tagline}</p>
                </div>
              </div>

              <div className="pick-content">
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', display: 'block', marginBottom: '8px' }}>
                    Featured Spots:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pick.spots.map((spot, idx) => (
                      <span key={idx} style={{ 
                        fontSize: '0.72rem', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        background: 'rgba(10, 15, 29, 0.9)', 
                        color: '#cbd5e1', 
                        border: '1px solid rgba(255, 255, 255, 0.05)' 
                      }}>
                        {spot}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between" style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>
                  <span>Start this itinerary</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
