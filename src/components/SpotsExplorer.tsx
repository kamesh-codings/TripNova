import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Landmark, 
  Search, 
  Filter, 
  Clock, 
  Ticket, 
  Star, 
  ShieldAlert, 
  Phone, 
  Sparkles, 
  Layers, 
  Database,
  Globe,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  fetchLocations, 
  fetchPlaces, 
  fetchCulturalRules, 
  fetchSafetyContacts, 
  checkBackendHealth,
  LocationItem, 
  PlaceItem, 
  CulturalRuleItem, 
  SafetyContactItem 
} from '../utils/api';

interface SpotsExplorerProps {
  onSelectSpot?: (spotName: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const SpotsExplorer: React.FC<SpotsExplorerProps> = ({ onSelectSpot, onNavigateTab }) => {
  // Data States
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [culturalRules, setCulturalRules] = useState<CulturalRuleItem[]>([]);
  const [safetyContacts, setSafetyContacts] = useState<SafetyContactItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendStatus, setBackendStatus] = useState<{ isConnected: boolean; count: number }>({ isConnected: false, count: 0 });

  // Hierarchy Selection States
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Data Load
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      const [health, locs, pls] = await Promise.all([
        checkBackendHealth(),
        fetchLocations(),
        fetchPlaces()
      ]);
      setBackendStatus({ isConnected: health.isConnected, count: health.locationsCount });
      setLocations(locs);
      setPlaces(pls);
      setIsLoading(false);
    }
    loadInitialData();
  }, []);

  // When selectedLocationId changes, load specific rules & contacts
  useEffect(() => {
    async function loadLocationSpecifics() {
      if (selectedLocationId && selectedLocationId !== 'all') {
        const [rules, contacts] = await Promise.all([
          fetchCulturalRules(selectedLocationId),
          fetchSafetyContacts(selectedLocationId)
        ]);
        setCulturalRules(rules);
        setSafetyContacts(contacts);
      } else {
        setCulturalRules([]);
        setSafetyContacts([]);
      }
    }
    loadLocationSpecifics();
  }, [selectedLocationId]);

  // Derived filtered options
  const countries = ['India'];
  const availableStates = ['All', ...Array.from(new Set(locations.map(l => l.state)))];

  const filteredLocations = locations.filter(loc => {
    if (selectedState !== 'All' && loc.state !== selectedState) return false;
    return true;
  });

  // Filtered places according to hierarchy & search
  const filteredPlaces = places.filter(place => {
    // 1. Location filter
    if (selectedLocationId !== 'all' && place.location_id !== selectedLocationId) {
      return false;
    }
    // 2. State filter (if specific district is 'all' but state is selected)
    if (selectedState !== 'All') {
      const locObj = locations.find(l => l.id === place.location_id);
      if (locObj && locObj.state !== selectedState) return false;
    }
    // 3. Category filter
    if (selectedCategory !== 'all' && place.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchLoc = (place.location_name || '').toLowerCase().includes(q);
      const matchCat = place.category.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchCat) return false;
    }
    return true;
  });

  const currentLocation = locations.find(l => l.id === selectedLocationId);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'historical', label: '🏛️ Historical' },
    { id: 'religious', label: '🛕 Religious / Temples' },
    { id: 'beach', label: '🏖️ Beach & Coastal' },
    { id: 'nature', label: '🌲 Nature & Hills' },
    { id: 'cultural', label: '🎭 Cultural' },
    { id: 'food_dining', label: '🍲 Food & Dining' }
  ];

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'radial-gradient(ellipse at top right, rgba(56, 189, 248, 0.15), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Database style={{ width: '12px', height: '12px' }} /> Live Tourism Database
            </span>
            <span className={`badge ${backendStatus.isConnected ? 'badge-green' : 'badge-blue'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: backendStatus.isConnected ? '#34d399' : '#38bdf8',
                display: 'inline-block'
              }} />
              {backendStatus.isConnected ? 'API Connected (38 Destinations)' : 'Database Active'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Spots & Destination Explorer
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '650px' }}>
            Browse authentic places, temples, beaches, and heritage monuments through our Country ➔ State ➔ District hierarchy.
          </p>
        </div>

        {/* Database Metric Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '10px 16px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Locations</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>{locations.length}</span>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Places Count</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>{filteredPlaces.length}</span>
          </div>
        </div>
      </div>

      {/* 2. Hierarchical Filter Controls (Country -> State -> District) */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Hierarchical Location Navigator
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}>
          {/* Level 1: Country */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe style={{ width: '13px', height: '13px', color: '#38bdf8' }} /> 1. Select Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="input-field"
              style={{ padding: '10px 12px', background: '#090e17', color: '#ffffff', cursor: 'pointer' }}
            >
              {countries.map(c => (
                <option key={c} value={c}>🇮🇳 {c}</option>
              ))}
            </select>
          </div>

          {/* Level 2: State */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin style={{ width: '13px', height: '13px', color: '#c084fc' }} /> 2. Select State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedLocationId('all'); // Reset district filter on state change
              }}
              className="input-field"
              style={{ padding: '10px 12px', background: '#090e17', color: '#ffffff', cursor: 'pointer' }}
            >
              {availableStates.map(s => {
                const count = s === 'All' ? locations.length : locations.filter(l => l.state === s).length;
                return (
                  <option key={s} value={s}>
                    {s === 'All' ? '🌐 All States' : `📍 ${s} (${count} Districts)`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Level 3: District / City */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Landmark style={{ width: '13px', height: '13px', color: '#34d399' }} /> 3. Select District / Location
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="input-field"
              style={{ padding: '10px 12px', background: '#090e17', color: '#ffffff', cursor: 'pointer' }}
            >
              <option value="all">🏙️ All Districts in {selectedState === 'All' ? 'Database' : selectedState}</option>
              {filteredLocations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Search style={{ width: '13px', height: '13px', color: '#f59e0b' }} /> Search Spots
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search spot name, temple, beach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ padding: '10px 12px 10px 34px', background: '#090e17' }}
              />
              <Search style={{ width: '14px', height: '14px', color: '#64748b', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginTop: '4px' }}>
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(79, 70, 229, 0.3) 100%)' : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Location Profile Banner (If specific location picked) */}
      {currentLocation && (
        <div className="glass-panel" style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderLeft: '4px solid #38bdf8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div className="flex items-center gap-2">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {currentLocation.name}
              </h2>
              <span className="badge badge-purple">{currentLocation.state}</span>
              <span className="badge badge-blue">Currency: {currentLocation.currency_code}</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginTop: '6px', maxWidth: '800px', lineHeight: 1.5 }}>
              {currentLocation.description}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Places Count in {currentLocation.name}: <strong style={{ color: '#34d399' }}>{filteredPlaces.length}</strong>
            </span>
          </div>
        </div>
      )}

      {/* 4. Places Grid & Real-time Count */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark style={{ width: '18px', height: '18px', color: '#34d399' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Available Spots
            </h3>
            <span style={{
              background: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '20px',
              padding: '2px 10px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              Places Count: {filteredPlaces.length}
            </span>
          </div>

          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Showing {filteredPlaces.length} of {places.length} total database spots
          </span>
        </div>

        {/* Spots Grid */}
        {filteredPlaces.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                      {place.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1" style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>
                      <Star style={{ width: '14px', height: '14px', fill: '#fbbf24' }} />
                      <span>{place.avg_rating.toFixed(1)}</span>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>({place.review_count})</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px', lineHeight: 1.3 }}>
                    {place.name}
                  </h4>

                  <div className="flex items-center gap-1" style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '10px' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                    <span>{place.location_name || 'Destination'}, {place.location_state || 'Tamil Nadu'}</span>
                  </div>

                  {/* Details Badges */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    {place.opening_hours && (
                      <div className="flex items-center gap-2">
                        <Clock style={{ width: '13px', height: '13px', color: '#a855f7' }} />
                        <span>{place.opening_hours}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Ticket style={{ width: '13px', height: '13px', color: '#34d399' }} />
                      <span>Entry Fee: {place.entry_fee === 0 ? 'Free Entry' : `₹${place.entry_fee}`}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => {
                      if (onSelectSpot) onSelectSpot(place.name);
                      if (onNavigateTab) onNavigateTab('planner');
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    <span>Add to Itinerary</span>
                    <ChevronRight style={{ width: '12px', height: '12px' }} />
                  </button>

                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    ID: {place.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Zero Places Display (Handled cleanly as requested) */
          <div className="glass-panel" style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Landmark style={{ width: '24px', height: '24px', color: '#38bdf8' }} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              0 Places Found for Current Filter
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', maxWidth: '480px', margin: 0 }}>
              There are currently 0 spots in this selected category or district in the seed database. 
              Switch to "All Categories" or pick another district to explore all 38 destinations.
            </p>
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedLocationId('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', marginTop: '8px' }}
            >
              Reset Filters to View All Spots
            </button>
          </div>
        )}
      </div>

      {/* 5. Location Cultural Rules & Safety Contacts Section (If specific district is selected) */}
      {selectedLocationId !== 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Cultural Rules & Precautions */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Precautions & Etiquette for {currentLocation?.name}
              </h4>
            </div>

            {culturalRules.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {culturalRules.map(rule => (
                  <div key={rule.id} style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '10px',
                    padding: '12px'
                  }}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span style={{ fontWeight: 700, color: '#fcd34d', fontSize: '0.82rem' }}>{rule.title}</span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{rule.severity}</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.78rem', margin: 0, lineHeight: 1.4 }}>{rule.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Standard South India tourist etiquette applies (dress modestly at places of worship, remove footwear at temple entrances).
              </p>
            )}
          </div>

          {/* Safety Helpline Contacts */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div className="flex items-center gap-2 mb-3">
              <Phone style={{ width: '18px', height: '18px', color: '#34d399' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Emergency & Safety Contacts ({currentLocation?.name})
              </h4>
            </div>

            {safetyContacts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {safetyContacts.map(sc => (
                  <div key={sc.id} style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.82rem', display: 'block' }}>{sc.service_type}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Hours: {sc.operating_hours}</span>
                    </div>
                    <a
                      href={`tel:${sc.contact_number}`}
                      className="btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.72rem', textDecoration: 'none' }}
                    >
                      <Phone style={{ width: '11px', height: '11px' }} /> {sc.contact_number}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '10px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Tourist Police Hotline</span>
                  <a href="tel:1363" style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>1363 / 112</a>
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '10px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Medical Ambulance</span>
                  <a href="tel:108" style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>108</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
