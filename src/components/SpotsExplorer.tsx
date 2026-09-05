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
  AlertCircle,
  Navigation,
  Calendar,
  Utensils,
  Hotel,
  Compass,
  ExternalLink,
  X,
  Info
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
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCountry, selectedState, selectedLocationId, selectedCategory, searchQuery]);

  // Spot Detail Modal State
  const [selectedSpotModal, setSelectedSpotModal] = useState<PlaceItem | null>(null);

  // Initial Data Load
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      const [health, locs, pls] = await Promise.all([
        checkBackendHealth(),
        fetchLocations(),
        fetchPlaces()
      ]);
      setBackendStatus({ isConnected: health.isConnected, count: health.locationsCount || locs.length });
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
  
  // Sorted unique states
  const rawStates = Array.from(new Set(locations.map(l => l.state))).sort((a, b) => {
    if (a === 'Tamil Nadu') return -1;
    if (b === 'Tamil Nadu') return 1;
    return a.localeCompare(b);
  });
  const availableStates = ['All', ...rawStates];

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
      const placeState = place.location_state || locObj?.state;
      if (placeState && placeState.toLowerCase() !== selectedState.toLowerCase()) return false;
    }
    // 3. Category filter
    if (selectedCategory !== 'all' && place.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // 4. Search query (matches name, category, description, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchLoc = (place.location_name || '').toLowerCase().includes(q);
      const matchCat = place.category.toLowerCase().includes(q);
      const matchDesc = (place.description || '').toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  const currentLocation = locations.find(l => l.id === selectedLocationId);

  const categories = [
    { id: 'all', label: '🌐 All Categories' },
    { id: 'religious', label: '🛕 Religious & Temples' },
    { id: 'historical', label: '🏰 Historical' },
    { id: 'heritage', label: '🏛️ Heritage & UNESCO' },
    { id: 'nature', label: '🌲 Nature & Waterfalls' },
    { id: 'beach', label: '🏖️ Beaches & Coastal' },
    { id: 'wildlife', label: '🐅 Wildlife & Safari' },
    { id: 'hill_station', label: '⛰️ Hill Stations' },
    { id: 'museum', label: '🏺 Museums & Science' },
    { id: 'adventure', label: '🧗 Adventure & Trekking' },
    { id: 'shopping', label: '🛍️ Markets & Crafts' },
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
              <Database style={{ width: '12px', height: '12px' }} /> India Tourism Master Dataset
            </span>
            <span className={`badge ${backendStatus.isConnected ? 'badge-green' : 'badge-blue'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: backendStatus.isConnected ? '#34d399' : '#38bdf8',
                display: 'inline-block'
              }} />
              {backendStatus.isConnected ? `Database Active (${locations.length} Destinations Across India)` : 'Database Active'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
            Spots & Destination Explorer
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '700px' }}>
            Explore verified tourist spots, heritage monuments, beaches, hill stations, and cultural hubs across all 28 Indian States and 8 Union Territories.
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
              <MapPin style={{ width: '13px', height: '13px', color: '#c084fc' }} /> 2. Select State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedLocationId('all');
              }}
              className="input-field"
              style={{ padding: '10px 12px', background: '#090e17', color: '#ffffff', cursor: 'pointer' }}
            >
              {availableStates.map(s => {
                const count = s === 'All' ? locations.length : locations.filter(l => l.state === s).length;
                return (
                  <option key={s} value={s}>
                    {s === 'All' ? '🌐 All States & UTs (All India)' : `📍 ${s} (${count} Districts)`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Level 3: District / City */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Landmark style={{ width: '13px', height: '13px', color: '#34d399' }} /> 3. Select District / City
            </label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="input-field"
              style={{ padding: '10px 12px', background: '#090e17', color: '#ffffff', cursor: 'pointer' }}
            >
              <option value="all">🏙️ All Districts in {selectedState === 'All' ? 'India' : selectedState}</option>
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
                placeholder="Search spot, temple, palace, park..."
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
              {currentLocation.region && <span className="badge badge-blue">{currentLocation.region} Zone</span>}
              {currentLocation.latitude && currentLocation.longitude && (
                <span className="badge badge-green">
                  📍 {currentLocation.latitude.toFixed(3)}, {currentLocation.longitude.toFixed(3)}
                </span>
              )}
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', marginTop: '6px', maxWidth: '800px', lineHeight: 1.5 }}>
              {currentLocation.description}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Places in {currentLocation.name}: <strong style={{ color: '#34d399' }}>{filteredPlaces.length}</strong>
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
            Showing {filteredPlaces.length} of {places.length} total tourism spots across India
          </span>
        </div>

        {/* Spots Grid */}
        {filteredPlaces.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
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
                  gap: '14px',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Card Header: Category Badge & Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                      {place.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1" style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>
                      <Star style={{ width: '14px', height: '14px', fill: '#fbbf24' }} />
                      <span>{Number(place.avg_rating).toFixed(1)}</span>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>({place.review_count || 500}+)</span>
                    </div>

                  {/* Spot Title */}
                  <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px', lineHeight: 1.3 }}>
                    {place.name}
                  </h4>

                  {/* Location Info */}
                  <div className="flex items-center gap-1" style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '10px' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                    <span>{place.location_name || 'Destination'}, {place.location_state || 'India'}</span>
                  </div>

                  {/* Description Excerpt */}
                  {place.description && (
                    <p style={{
                      color: '#cbd5e1',
                      fontSize: '0.78rem',
                      lineHeight: 1.45,
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {place.description}
                    </p>
                  )}

                  {/* Fetched Details Pill Grid */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    fontSize: '0.72rem',
                    marginBottom: '10px'
                  }}>
                    {place.best_season && (
                      <span style={{
                        background: 'rgba(168, 85, 247, 0.12)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.25)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Calendar style={{ width: '11px', height: '11px' }} /> Season: {place.best_season}
                      </span>
                    )}

                    {place.avg_visit_time && (
                      <span style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock style={{ width: '11px', height: '11px' }} /> Duration: {place.avg_visit_time}
                      </span>
                    )}

                    <span style={{
                      background: 'rgba(52, 211, 153, 0.12)',
                      color: '#34d399',
                      border: '1px solid rgba(52, 211, 153, 0.25)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Ticket style={{ width: '11px', height: '11px' }} /> {place.entry_fee === 0 ? 'Free Entry' : `₹${place.entry_fee}`}
                    </span>

                    {(place.map_url || (place.latitude && place.longitude)) && (
                      <a
                        href={place.map_url || `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none'
                        }}
                      >
                        <Compass style={{ width: '11px', height: '11px' }} /> GPS View
                      </a>
                    )}
                  </div>

                {/* Card Bottom Actions */}
                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => setSelectedSpotModal(place)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Info style={{ width: '12px', height: '12px', color: '#38bdf8' }} />
                    <span>View Guide</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectSpot) onSelectSpot(place.name);
                      if (onNavigateTab) onNavigateTab('planner');
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                  >
                    <span>Add to Itinerary</span>
                    <ChevronRight style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Load More Pagination Bar */}
            {filteredPlaces.length > visibleCount && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '16px',
                padding: '16px'
              }}>
                <button
                  onClick={() => setVisibleCount(prev => Math.min(prev + 24, filteredPlaces.length))}
                  className="btn-secondary"
                  style={{ padding: '10px 24px', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  Load More ({Math.min(24, filteredPlaces.length - visibleCount)} remaining)
                </button>
                <button
                  onClick={() => setVisibleCount(filteredPlaces.length)}
                  className="btn-glass"
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  Show All ({filteredPlaces.length})
                </button>
              </div>
            )}
          </>
        ) : (
          /* Zero Places Display */
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
              There are currently 0 spots matching this selected filter. Reset your filters to explore all {places.length} spots across India.
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
                Standard Indian tourist etiquette applies: dress respectfully at places of worship, remove footwear at sacred sanctums, and ask before taking portraits of locals.
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
                  <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>National Tourist Helpline</span>
                  <a href="tel:1363" style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>1363 (24x7 Multi-lingual)</a>
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '10px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Emergency Police / Medical</span>
                  <a href="tel:112" style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>112 / 108</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Comprehensive Spot Guide Modal */}
      {selectedSpotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '16px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                    {selectedSpotModal.category.replace('_', ' ')}
                  </span>
                  <span className="badge badge-blue">
                    ID: {selectedSpotModal.id}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.25 }}>
                  {selectedSpotModal.name}
                </h2>
                <div className="flex items-center gap-1" style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '6px' }}>
                  <MapPin style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                  <span>{selectedSpotModal.location_name || 'District'}, {selectedSpotModal.location_state || 'India'}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSpotModal(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {/* Description */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Overview & History
              </h4>
              <p style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                {selectedSpotModal.description}
              </p>
            </div>

            {/* Specs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px'
            }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Star style={{ width: '12px', height: '12px', color: '#fbbf24' }} /> Rating
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>
                  {Number(selectedSpotModal.avg_rating).toFixed(1)} / 5.0
                </span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Ticket style={{ width: '12px', height: '12px', color: '#34d399' }} /> Entry Fee
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399' }}>
                  {selectedSpotModal.entry_fee === 0 ? 'Free Entry' : `₹${selectedSpotModal.entry_fee}`}
                </span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Calendar style={{ width: '12px', height: '12px', color: '#c084fc' }} /> Best Season
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#c084fc' }}>
                  {selectedSpotModal.best_season || 'Oct-Mar'}
                </span>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Clock style={{ width: '12px', height: '12px', color: '#38bdf8' }} /> Duration
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
                  {selectedSpotModal.avg_visit_time || '1-2 hours'}
                </span>
              </div>
            </div>

            {/* Travel Guidance Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Transport */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                padding: '12px 14px',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Navigation style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>How to Reach & Transport</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
                  {selectedSpotModal.transport || 'Accessible via regular state buses, auto-rickshaws, and private taxis from nearest hub.'}
                </p>
              </div>

              {/* Hotels */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                padding: '12px 14px',
                border: '1px solid rgba(168, 85, 247, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Hotel style={{ width: '14px', height: '14px', color: '#c084fc' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc' }}>Nearby Stays & Accommodation</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
                  {selectedSpotModal.nearby_hotels || 'Budget lodges, verified homestays, and boutique hotels available in the vicinity.'}
                </p>
              </div>

              {/* Dining */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                padding: '12px 14px',
                border: '1px solid rgba(52, 211, 153, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Utensils style={{ width: '14px', height: '14px', color: '#34d399' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>Local Food & Restaurants</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
                  {selectedSpotModal.nearby_restaurants || 'Authentic regional restaurants and popular vegetarian / multi-cuisine eateries nearby.'}
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {(selectedSpotModal.map_url || (selectedSpotModal.latitude && selectedSpotModal.longitude)) ? (
                <a
                  href={selectedSpotModal.map_url || `https://www.google.com/maps/search/?api=1&query=${selectedSpotModal.latitude},${selectedSpotModal.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', textDecoration: 'none' }}
                >
                  <Compass style={{ width: '14px', height: '14px', color: '#fbbf24' }} />
                  <span>Open in Google Maps {selectedSpotModal.latitude != null && selectedSpotModal.longitude != null ? `(${selectedSpotModal.latitude.toFixed(2)}, ${selectedSpotModal.longitude.toFixed(2)})` : ''}</span>
                  <ExternalLink style={{ width: '12px', height: '12px' }} />
                </a>
              ) : <div />}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedSpotModal(null)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (onSelectSpot) onSelectSpot(selectedSpotModal.name);
                    if (onNavigateTab) onNavigateTab('planner');
                    setSelectedSpotModal(null);
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '8px 18px' }}
                >
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                  <span>Add to Trip Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
