import React, { useState } from 'react';
import { 
  Building2, 
  PhoneCall, 
  MapPin, 
  Navigation, 
  Star, 
  CheckCircle, 
  Radio, 
  AlertOctagon, 
  Send, 
  Clock, 
  Globe,
  ShieldCheck,
  Search
} from 'lucide-react';
import { SafetyPlace, UserProfile } from '../types';
import { NEARBY_HOSPITALS, NEARBY_POLICE_STATIONS, COUNTRY_RULES } from '../data/mockData';
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'hospital' | 'police'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sosSent, setSosSent] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_RULES[0]);

  const allPlaces: SafetyPlace[] = [...NEARBY_HOSPITALS, ...NEARBY_POLICE_STATIONS];

  const filteredPlaces = allPlaces.filter(place => {
    const matchesCat = activeCategory === 'all' || place.type === activeCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleTriggerSOSNow = () => {
    setSosSending(true);
    setTimeout(() => {
      setSosSending(false);
      setSosSent(true);
      logSOSEvent({
        timestamp: new Date().toLocaleString(),
        location: 'Current GPS Coordinates: 13.0827° N, 80.2707° E (Chennai)',
        note: `Distress alert broadcasted to ${userProfile.trustedContacts.length} trusted contacts.`
      });
    }, 1500);
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
            Real-time directory of verified hospitals, trauma centers, and police precincts. In extreme distress, activate SOS to transmit your GPS coordinates and medical pass to your 5 trusted contacts and local authorities.
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
            <a href={`tel:${selectedCountry.emergencyNumbers.universal}`} className="btn-sos" style={{ padding: '8px', borderRadius: '10px' }}>
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>

          <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#bae6fd', display: 'block' }}>Police Patrol</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{selectedCountry.emergencyNumbers.police}</span>
            </div>
            <a href={`tel:${selectedCountry.emergencyNumbers.police}`} className="btn-primary" style={{ padding: '8px', borderRadius: '10px' }}>
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>

          <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#a7f3d0', display: 'block' }}>Medical Ambulance</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{selectedCountry.emergencyNumbers.ambulance}</span>
            </div>
            <a href={`tel:${selectedCountry.emergencyNumbers.ambulance}`} className="btn-secondary" style={{ padding: '8px', borderRadius: '10px', color: '#34d399' }}>
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>

          <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#fef08a', display: 'block' }}>Fire & Rescue</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>{selectedCountry.emergencyNumbers.fire}</span>
            </div>
            <a href={`tel:${selectedCountry.emergencyNumbers.fire}`} className="btn-secondary" style={{ padding: '8px', borderRadius: '10px', color: '#fbbf24' }}>
              <PhoneCall style={{ width: '16px', height: '16px' }} />
            </a>
          </div>
        </div>
      </div>

      {/* Places Search & Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Building2 style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Nearest Verified Medical & Police Stations</h3>
            <span className="badge badge-blue">{filteredPlaces.length} Found</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div style={{ position: 'relative', width: '240px' }}>
              <Search style={{ width: '14px', height: '14px', color: '#94a3b8', position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search hospital / police..."
                className="input-glass"
                style={{ paddingLeft: '32px', paddingRight: '12px', paddingBlock: '6px', fontSize: '0.78rem' }}
              />
            </div>
            <div style={{ display: 'flex', background: 'rgba(10, 15, 29, 0.9)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['all', 'hospital', 'police'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeCategory === cat ? '#38bdf8' : 'transparent',
                    color: activeCategory === cat ? '#0f172a' : '#94a3b8'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-2 gap-4">
          {filteredPlaces.map(place => (
            <div 
              key={place.id}
              className="glass-panel"
              style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2" style={{ marginBottom: '8px' }}>
                  <div className="flex items-center gap-2.5">
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: place.type === 'hospital' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      color: place.type === 'hospital' ? '#f87171' : '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {place.type === 'hospital' ? <Building2 style={{ width: '18px', height: '18px' }} /> : <ShieldCheck style={{ width: '18px', height: '18px' }} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>{place.name}</h4>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin style={{ width: '12px', height: '12px', color: '#38bdf8' }} />
                        {place.distanceKm} km away • {place.address}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${place.type === 'hospital' ? 'badge-red' : 'badge-blue'}`}>
                    {place.type === 'hospital' ? 'Hospital' : 'Police'}
                  </span>
                </div>

                <div className="flex items-center gap-3" style={{ fontSize: '0.72rem', color: '#cbd5e1', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="flex items-center gap-1" style={{ color: '#fbbf24', fontWeight: 700 }}>
                    <Star style={{ width: '12px', height: '12px', fill: 'currentColor' }} /> {place.rating} / 5.0
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1" style={{ color: '#34d399' }}>
                    <Clock style={{ width: '12px', height: '12px' }} /> {place.openHours}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${place.phone}`}
                  className="btn-primary"
                  style={{ flex: 1, padding: '7px 14px', fontSize: '0.78rem' }}
                >
                  <PhoneCall style={{ width: '14px', height: '14px' }} />
                  Call {place.phone}
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ padding: '7px 14px', fontSize: '0.78rem', color: '#38bdf8' }}
                >
                  <Navigation style={{ width: '14px', height: '14px' }} />
                  Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
