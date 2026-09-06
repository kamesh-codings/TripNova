import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PhoneCall, 
  MapPin, 
  Navigation, 
  Star, 
  CheckCircle, 
  Radio, 
  AlertOctagon, 
  Clock, 
  Globe,
  ShieldCheck,
  Search,
  Pill,
  Hotel,
  Sparkles,
  RefreshCw,
  Mic,
  MicOff,
  ExternalLink,
  ShieldAlert,
  HeartPulse,
  Check
} from 'lucide-react';
import { SafetyPlace, SafetyPlaceType, UserProfile, UserLocation } from '../types';
import { COUNTRY_RULES } from '../data/mockData';
import { getNearbySafetyPlaces } from '../data/safetyPlaces';
import { 
  getStoredLocation, 
  saveStoredLocation, 
  detectUserCurrentLocation, 
  setManualUserLocation,
  forwardGeocodePlace,
  KNOWN_HUBS 
} from '../utils/geoLocator';
import { listenVoiceInput } from '../utils/speech';
import { logSOSEvent } from '../utils/storage';

interface SafetyHubProps {
  userProfile: UserProfile;
  isSOSModalOpen: boolean;
  setIsSOSModalOpen: (open: boolean) => void;
}

export const SafetyHub: React.FC<SafetyHubProps> = ({
  userProfile,
  isSOSModalOpen,
  setIsSOSModalOpen
}) => {
  // Location state
  const [currentLoc, setCurrentLoc] = useState<UserLocation | null>(() => getStoredLocation());
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [manualCityInput, setManualCityInput] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isListeningLocation, setIsListeningLocation] = useState(false);
  const [stopVoiceFn, setStopVoiceFn] = useState<(() => void) | null>(null);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<'all' | SafetyPlaceType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListeningSearch, setIsListeningSearch] = useState(false);
  const [stopSearchVoiceFn, setStopSearchVoiceFn] = useState<(() => void) | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_RULES[0]);

  // Load initial location if null
  useEffect(() => {
    if (!currentLoc) {
      detectUserCurrentLocation().then(loc => {
        setCurrentLoc(loc);
      }).catch(() => {});
    }

    const handleLocationUpdate = (e: any) => {
      if (e.detail) setCurrentLoc(e.detail);
    };

    window.addEventListener('tripnova_location_updated', handleLocationUpdate);
    return () => {
      window.removeEventListener('tripnova_location_updated', handleLocationUpdate);
    };
  }, []);

  // Handle GPS detection
  const handleRefreshGPS = async () => {
    setIsDetectingLoc(true);
    try {
      const freshLoc = await detectUserCurrentLocation();
      setCurrentLoc(freshLoc);
    } catch {
      // Keep existing location
    } finally {
      setIsDetectingLoc(false);
    }
  };

  // Handle setting a custom/manual city
  const handleSelectCity = async (cityName: string) => {
    const clean = cityName.trim();
    if (!clean) return;
    const initial = setManualUserLocation(clean);
    setCurrentLoc(initial);
    setShowLocationPicker(false);
    setManualCityInput('');

    try {
      const resolved = await forwardGeocodePlace(clean);
      if (resolved) {
        const updated: UserLocation = {
          latitude: resolved.latitude,
          longitude: resolved.longitude,
          city: resolved.city,
          state: resolved.state,
          country: resolved.country,
          formattedAddress: resolved.formattedAddress,
          timestamp: new Date().toISOString(),
          isApproximate: false
        };
        saveStoredLocation(updated);
        setCurrentLoc(updated);
      }
    } catch {
      // Fallback works automatically
    }
  };

  // Compute nearby safety places based on current coordinates & city
  const userLat = currentLoc?.latitude || 13.0827;
  const userLng = currentLoc?.longitude || 80.2707;
  const userCity = currentLoc?.city || 'Chennai';
  const userState = currentLoc?.state || 'Tamil Nadu';

  const rawSafetyPlaces = getNearbySafetyPlaces(userLat, userLng, userCity, userState);

  // Filter by category and search query
  const filteredPlaces = rawSafetyPlaces.filter(place => {
    const matchesCat = activeCategory === 'all' || place.type === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      place.name.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q) ||
      (place.specialty && place.specialty.toLowerCase().includes(q)) ||
      (place.facilities && place.facilities.some(f => f.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  // Count items per category
  const countAll = rawSafetyPlaces.length;
  const countHospitals = rawSafetyPlaces.filter(p => p.type === 'hospital').length;
  const countPharmacies = rawSafetyPlaces.filter(p => p.type === 'pharmacy').length;
  const countPolice = rawSafetyPlaces.filter(p => p.type === 'police').length;
  const countHotels = rawSafetyPlaces.filter(p => p.type === 'hotel' || p.type === 'residency').length;

  const getCategoryTheme = (type: SafetyPlaceType) => {
    switch (type) {
      case 'hospital':
        return {
          icon: <Building2 style={{ width: '18px', height: '18px' }} />,
          label: 'Hospital & Trauma',
          bg: 'rgba(239, 68, 68, 0.16)',
          border: 'rgba(239, 68, 68, 0.35)',
          color: '#f87171',
          badgeClass: 'badge-red'
        };
      case 'pharmacy':
        return {
          icon: <Pill style={{ width: '18px', height: '18px' }} />,
          label: '24/7 Pharmacy',
          bg: 'rgba(16, 185, 129, 0.16)',
          border: 'rgba(16, 185, 129, 0.35)',
          color: '#34d399',
          badgeClass: 'badge-green'
        };
      case 'police':
        return {
          icon: <ShieldCheck style={{ width: '18px', height: '18px' }} />,
          label: 'Police & Safety',
          bg: 'rgba(56, 189, 248, 0.16)',
          border: 'rgba(56, 189, 248, 0.35)',
          color: '#38bdf8',
          badgeClass: 'badge-blue'
        };
      case 'hotel':
      case 'residency':
        return {
          icon: <Hotel style={{ width: '18px', height: '18px' }} />,
          label: type === 'hotel' ? 'Verified Hotel' : 'Safe Residency',
          bg: 'rgba(245, 158, 11, 0.16)',
          border: 'rgba(245, 158, 11, 0.35)',
          color: '#fbbf24',
          badgeClass: 'badge-amber'
        };
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with Big SOS Trigger Action */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(90deg, rgba(136, 19, 55, 0.45) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'rgba(239, 68, 68, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="flex items-center gap-2">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800, color: '#f87171', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
              24/7 TOURIST SAFETY & RAPID RESPONSE GUARDIAN
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
            Instant Safety Radar & Emergency Dispatch
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            Real-time directory of verified hospitals, 24/7 pharmacies, police stations, and safe tourist residencies calculated dynamically from your live GPS or chosen destination.
          </p>
        </div>

        <button
          onClick={() => setIsSOSModalOpen(true)}
          className="btn-sos"
          style={{ padding: '14px 28px', fontSize: '0.95rem' }}
        >
          <AlertOctagon style={{ width: '20px', height: '20px' }} />
          <span>ACTIVATE SOS BROADCAST</span>
        </button>
      </div>

      {/* Dynamic Location Bar & Radar Status */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Radio style={{ width: '18px', height: '18px', animation: isDetectingLoc ? 'spin 1s linear infinite' : 'pulse 2s infinite' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                  Active Safety Zone:
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                  {currentLoc?.formattedAddress || currentLoc?.city || 'Detecting Active GPS...'}
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Coordinates: {userLat.toFixed(4)}° N, {userLng.toFixed(4)}° E • Verified Emergency Facilities sorted by nearest distance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshGPS}
              disabled={isDetectingLoc}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.74rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}
              title="Refresh live GPS lock"
            >
              <RefreshCw style={{ width: '12px', height: '12px', animation: isDetectingLoc ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isDetectingLoc ? 'Locking GPS...' : '🎯 Auto GPS'}</span>
            </button>

            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.74rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <MapPin style={{ width: '12px', height: '12px' }} />
              <span>{showLocationPicker ? 'Close Selector' : '📍 Change City / Landmark'}</span>
            </button>
          </div>
        </div>

        {/* Manual Location Search Dropdown */}
        {showLocationPicker && (
          <div className="animate-fade" style={{
            padding: '14px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>
              Search Any Indian City, Tourist Town or Landmark:
            </span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualCityInput}
                onChange={e => setManualCityInput(e.target.value)}
                placeholder="Type destination (e.g., Ooty, Kodaikanal, Madurai, Taj Mahal, Connaught Place, Goa)..."
                className="input-glass"
                style={{ fontSize: '0.78rem', padding: '6px 12px', flex: 1 }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && manualCityInput.trim()) {
                    handleSelectCity(manualCityInput.trim());
                  }
                }}
              />

              {/* Voice input button */}
              <button
                type="button"
                onClick={() => {
                  if (isListeningLocation) {
                    stopVoiceFn?.();
                    setIsListeningLocation(false);
                  } else {
                    const stop = listenVoiceInput(
                      (text) => {
                        setManualCityInput(text);
                        handleSelectCity(text);
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
                  gap: '5px'
                }}
                title="Speak location"
              >
                <Mic style={{ width: '13px', height: '13px', animation: isListeningLocation ? 'pulse 1s infinite' : 'none' }} />
                <span>{isListeningLocation ? '🎙️ Listening...' : '🎙️ Voice'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (manualCityInput.trim()) handleSelectCity(manualCityInput.trim());
                }}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.76rem', fontWeight: 800 }}
              >
                Update Radar
              </button>
            </div>

            {/* Quick Hub buttons */}
            <div className="flex items-center gap-1.5 flex-wrap" style={{ marginTop: '2px' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginRight: '4px' }}>Popular Hubs:</span>
              {KNOWN_HUBS.slice(0, 10).map(hub => (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => handleSelectCity(hub.name)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: userCity.toLowerCase().includes(hub.name.toLowerCase()) ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: userCity.toLowerCase().includes(hub.name.toLowerCase()) ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: userCity.toLowerCase().includes(hub.name.toLowerCase()) ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {userCity.toLowerCase().includes(hub.name.toLowerCase()) && (
                    <Check style={{ width: '10px', height: '10px', display: 'inline', marginRight: '2px' }} />
                  )}
                  {hub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Country Emergency Dials Widget */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Globe style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Emergency Numbers As Per Country / Location</h3>
          </div>
          <select
            value={selectedCountry.country}
            onChange={(e) => {
              const found = COUNTRY_RULES.find(c => c.country === e.target.value);
              if (found) setSelectedCountry(found);
            }}
            className="input-glass"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}
          >
            {COUNTRY_RULES.map(c => (
              <option key={c.country} value={c.country} style={{ background: '#090e17' }}>
                {c.flag} {c.country}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-4 gap-3">
          <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#fca5a5', display: 'block' }}>Universal SOS</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{selectedCountry.emergencyNumbers.universal}</span>
            </div>
            <a href={`tel:${selectedCountry.emergencyNumbers.universal}`} className="btn-sos" style={{ padding: '8px', borderRadius: '10px' }} title="Call Universal Emergency">
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>

          <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#bae6fd', display: 'block' }}>Police Patrol</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{selectedCountry.emergencyNumbers.police}</span>
            </div>
            <a href={`tel:${selectedCountry.emergencyNumbers.police}`} className="btn-primary" style={{ padding: '8px', borderRadius: '10px' }} title="Call Police">
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>

          <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#a7f3d0', display: 'block' }}>Medical Ambulance</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{selectedCountry.emergencyNumbers.ambulance}</span>
            </div>
            <a href={`tel:${selectedCountry.emergencyNumbers.ambulance}`} className="btn-secondary" style={{ padding: '8px', borderRadius: '10px', color: '#34d399' }} title="Call Ambulance">
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>

          <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#fef08a', display: 'block' }}>Fire & Rescue</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{selectedCountry.emergencyNumbers.fire}</span>
            </div>
            <a href={`tel:${selectedCountry.emergencyNumbers.fire}`} className="btn-secondary" style={{ padding: '8px', borderRadius: '10px', color: '#fbbf24' }} title="Call Fire Department">
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>
        </div>
      </div>

      {/* Nearest Verified Essential Services Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Building2 style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
              Nearest Verified Essential Services
            </h3>
            <span className="badge badge-blue">{filteredPlaces.length} Available</span>
          </div>

          {/* Search Box with Voice input */}
          <div className="flex items-center gap-2 flex-wrap">
            <div style={{ position: 'relative', width: '240px' }}>
              <Search style={{ width: '14px', height: '14px', color: '#94a3b8', position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search hospital, police, hotel..."
                className="input-glass"
                style={{ paddingLeft: '32px', paddingRight: '12px', paddingBlock: '6px', fontSize: '0.78rem' }}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (isListeningSearch) {
                  stopSearchVoiceFn?.();
                  setIsListeningSearch(false);
                } else {
                  const stop = listenVoiceInput(
                    (text) => setSearchQuery(text),
                    (listening) => setIsListeningSearch(listening),
                    userProfile.preferredLanguage || 'English'
                  );
                  setStopSearchVoiceFn(() => stop);
                }
              }}
              style={{
                background: isListeningSearch ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.15)',
                border: isListeningSearch ? '1px solid #ef4444' : '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '8px',
                color: isListeningSearch ? '#f87171' : '#38bdf8',
                padding: '6px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Voice search services"
            >
              <Mic style={{ width: '12px', height: '12px', animation: isListeningSearch ? 'pulse 1s infinite' : 'none' }} />
              <span>{isListeningSearch ? 'Listening...' : 'Voice'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: activeCategory === 'all' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
              background: activeCategory === 'all' ? '#38bdf8' : 'rgba(15, 23, 42, 0.7)',
              color: activeCategory === 'all' ? '#0f172a' : '#cbd5e1'
            }}
          >
            <Sparkles style={{ width: '13px', height: '13px' }} />
            <span>All Verified Services ({countAll})</span>
          </button>

          <button
            onClick={() => setActiveCategory('hospital')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: activeCategory === 'hospital' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
              background: activeCategory === 'hospital' ? '#ef4444' : 'rgba(15, 23, 42, 0.7)',
              color: activeCategory === 'hospital' ? '#ffffff' : '#f87171'
            }}
          >
            <Building2 style={{ width: '13px', height: '13px' }} />
            <span>🏥 Hospitals & Emergency ({countHospitals})</span>
          </button>

          <button
            onClick={() => setActiveCategory('pharmacy')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: activeCategory === 'pharmacy' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
              background: activeCategory === 'pharmacy' ? '#10b981' : 'rgba(15, 23, 42, 0.7)',
              color: activeCategory === 'pharmacy' ? '#ffffff' : '#34d399'
            }}
          >
            <Pill style={{ width: '13px', height: '13px' }} />
            <span>💊 24/7 Pharmacies ({countPharmacies})</span>
          </button>

          <button
            onClick={() => setActiveCategory('police')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: activeCategory === 'police' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
              background: activeCategory === 'police' ? '#38bdf8' : 'rgba(15, 23, 42, 0.7)',
              color: activeCategory === 'police' ? '#0f172a' : '#38bdf8'
            }}
          >
            <ShieldCheck style={{ width: '13px', height: '13px' }} />
            <span>🚓 Police Stations ({countPolice})</span>
          </button>

          <button
            onClick={() => setActiveCategory('hotel')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: (activeCategory === 'hotel' || activeCategory === 'residency') ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
              background: (activeCategory === 'hotel' || activeCategory === 'residency') ? '#fbbf24' : 'rgba(15, 23, 42, 0.7)',
              color: (activeCategory === 'hotel' || activeCategory === 'residency') ? '#0f172a' : '#fbbf24'
            }}
          >
            <Hotel style={{ width: '13px', height: '13px' }} />
            <span>🏨 Hotels & Residencies ({countHotels})</span>
          </button>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
            <MapPin style={{ width: '32px', height: '32px', margin: '0 auto 8px', color: '#38bdf8' }} />
            <p style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>No specific facilities matching your filter.</p>
            <p style={{ fontSize: '0.75rem' }}>Try clearing your search query or switching category tabs.</p>
          </div>
        ) : (
          <div className="grid grid-2 gap-4">
            {filteredPlaces.map(place => {
              const theme = getCategoryTheme(place.type);
              const mapQuery = place.latitude && place.longitude 
                ? `${place.latitude},${place.longitude}` 
                : encodeURIComponent(`${place.name} ${place.address}`);

              return (
                <div 
                  key={place.id}
                  className="glass-panel"
                  style={{
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    border: `1px solid ${theme.border}`,
                    background: 'rgba(15, 23, 42, 0.85)'
                  }}
                >
                  <div>
                    {/* Header: Icon, Name, Category & Verified Badge */}
                    <div className="flex items-start justify-between gap-2" style={{ marginBottom: '8px' }}>
                      <div className="flex items-start gap-2.5">
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: theme.bg,
                          color: theme.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {theme.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                              {place.name}
                            </h4>
                            {place.verified && (
                              <span style={{ fontSize: '0.62rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                ✓ Verified 24/7
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin style={{ width: '12px', height: '12px', color: '#38bdf8', flexShrink: 0 }} />
                            <span>
                              <strong style={{ color: '#38bdf8' }}>{place.distanceKm} km away</strong> • {place.address}
                            </span>
                          </p>
                        </div>
                      </div>

                      <span className={`badge ${theme.badgeClass}`} style={{ fontSize: '0.65rem' }}>
                        {theme.label}
                      </span>
                    </div>

                    {/* Specialty & Price Note if any */}
                    {place.specialty && (
                      <p style={{ fontSize: '0.72rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.25)', padding: '6px 10px', borderRadius: '8px', margin: '6px 0 8px 0', border: '1px solid rgba(255,255,255,0.04)' }}>
                        💡 <strong>Highlights:</strong> {place.specialty}
                        {place.priceRange && <span style={{ display: 'block', color: '#fbbf24', marginTop: '2px' }}>🏷️ Tariff: {place.priceRange}</span>}
                      </p>
                    )}

                    {/* Facilities Chips */}
                    {place.facilities && place.facilities.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap" style={{ margin: '6px 0' }}>
                        {place.facilities.map((fac, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.65rem',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.06)',
                              color: '#94a3b8',
                              border: '1px solid rgba(255, 255, 255, 0.08)'
                            }}
                          >
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rating & Hours Strip */}
                    <div className="flex items-center gap-3" style={{ fontSize: '0.72rem', color: '#cbd5e1', padding: '8px 0 0 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="flex items-center gap-1" style={{ color: '#fbbf24', fontWeight: 700 }}>
                        <Star style={{ width: '12px', height: '12px', fill: 'currentColor' }} /> {place.rating} / 5.0
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1" style={{ color: '#34d399', fontWeight: 700 }}>
                        <Clock style={{ width: '12px', height: '12px' }} /> {place.openHours}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Call & Google Maps Navigation */}
                  <div className="flex items-center gap-2" style={{ paddingTop: '4px' }}>
                    <a
                      href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
                      className="btn-primary"
                      style={{ flex: 1, padding: '7px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      title={`Call ${place.phone}`}
                    >
                      <PhoneCall style={{ width: '13px', height: '13px' }} />
                      <span>Call {place.phone}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                      style={{ padding: '7px 12px', fontSize: '0.76rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}
                      title="Navigate on Google Maps"
                    >
                      <Navigation style={{ width: '13px', height: '13px' }} />
                      <span>Directions</span>
                      <ExternalLink style={{ width: '10px', height: '10px' }} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
