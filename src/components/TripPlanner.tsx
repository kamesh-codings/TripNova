import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Hotel, 
  Sparkles, 
  Plus, 
  Check, 
  UserCheck, 
  Star, 
  Phone, 
  Clock
} from 'lucide-react';
import { TripPlan, TransportMode, LocalGuide, ItineraryItem } from '../types';
import { LOCAL_GUIDES } from '../data/mockData';

interface TripPlannerProps {
  trips: TripPlan[];
  onSaveTrip: (trip: TripPlan) => void;
}

const POPULAR_DESTINATIONS = [
  'Madurai & Thanjavur Heritage Corridor',
  'Ooty & Nilgiri Mountain Escapes',
  'Kodaikanal Lake & Pine Forests',
  'Rameshwaram & Dhanushkodi Coast',
  'Mahabalipuram & East Coast Road',
  'Kanyakumari Ocean Confluence',
  'Puducherry French Quarter & Auroville'
];

export const TripPlanner: React.FC<TripPlannerProps> = ({
  trips,
  onSaveTrip
}) => {
  const [boardingPoint, setBoardingPoint] = useState('Chennai Central');
  const [destination, setDestination] = useState('Ooty & Nilgiri Mountain Escapes');
  const [transportMode, setTransportMode] = useState<TransportMode>('Train');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-19');
  const [budgetType, setBudgetType] = useState<'suggested' | 'manual'>('suggested');
  const [budgetAmount, setBudgetAmount] = useState<number>(15000);
  
  const [selectedSpots, setSelectedSpots] = useState<string[]>([
    'Nilgiri Mountain Railway',
    'Botanical Gardens',
    'Doddabetta Peak',
    'Pykara Waterfalls'
  ]);
  const [newSpotInput, setNewSpotInput] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(LOCAL_GUIDES[1]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
    return Math.max(1, diff || 1);
  };

  const durationDays = calculateDays();

  const suggestedBreakdown = {
    travel: Math.round(durationDays * 1200),
    stay: Math.round(durationDays * 1800),
    food: Math.round(durationDays * 900),
    activities: Math.round(durationDays * 600),
    buffer: Math.round(durationDays * 500)
  };
  const totalSuggested = Object.values(suggestedBreakdown).reduce((a, b) => a + b, 0);
  const effectiveBudget = budgetType === 'suggested' ? totalSuggested : budgetAmount;

  const handleAddSpot = () => {
    if (newSpotInput.trim() && !selectedSpots.includes(newSpotInput.trim())) {
      setSelectedSpots([...selectedSpots, newSpotInput.trim()]);
      setNewSpotInput('');
    }
  };

  const handleRemoveSpot = (spot: string) => {
    setSelectedSpots(selectedSpots.filter(s => s !== spot));
  };

  const handleCreateTripPlan = () => {
    const generatedItinerary: ItineraryItem[] = [];
    for (let day = 1; day <= durationDays; day++) {
      const spotForDay = selectedSpots[(day - 1) % selectedSpots.length] || 'Local Sightseeing & Market';
      generatedItinerary.push({
        id: `it_gen_${Date.now()}_${day}`,
        day,
        time: day === 1 ? '07:30 AM' : '09:00 AM',
        title: `Day ${day}: Explore ${spotForDay}`,
        description: `Scheduled exploration of ${spotForDay} with certified travel guidance and local food breaks.`,
        spotName: spotForDay,
        residencyName: day === 1 ? 'Eco-Residency Heritage Stay' : 'Highland Mountain Retreat',
        transportNotes: transportMode === 'Train' ? 'Mountain Steam Heritage Train' : `${transportMode} Ride`,
        estimatedCost: Math.round(effectiveBudget / durationDays),
        weatherForecast: day === 2 
          ? { temp: '17°C', condition: 'Rain & Mist', alert: '⚠️ Hill Fog: Proceed with daytime driver' }
          : { temp: '22°C', condition: 'Sunny & Pleasant' }
      });
    }

    const newTrip: TripPlan = {
      id: `trip_${Date.now()}`,
      title: `${destination.split('&')[0].trim()} Adventure`,
      boardingPoint,
      destination,
      transportMode,
      startDate,
      endDate,
      durationDays,
      budgetType,
      budgetAmount: effectiveBudget,
      suggestedBudgetBreakdown: suggestedBreakdown,
      selectedSpots,
      selectedResidencies: ['Eco-Residency Heritage Stay', 'Highland Mountain Retreat'],
      itinerary: generatedItinerary,
      assignedGuide: selectedGuide || undefined,
      createdAt: new Date().toISOString(),
      status: 'ongoing'
    };

    onSaveTrip(newTrip);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(90deg, rgba(49, 46, 129, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-blue">Smart Travel Planner</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Boarding $\leftrightarrow$ Destination & Schedule</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>Design Your Perfect Journey</h2>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
            Customize transport modes, duration dates, budget projections, spot planners, and connect directly with local guides.
          </p>
        </div>

        <button
          onClick={handleCreateTripPlan}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.9rem' }}
        >
          {savedSuccess ? (
            <span className="flex items-center gap-2" style={{ color: '#6ee7b7' }}>
              <Check style={{ width: '18px', height: '18px' }} /> Trip Plan Activated!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles style={{ width: '18px', height: '18px' }} /> Generate & Save Itinerary
            </span>
          )}
        </button>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-12 gap-5">
        {/* Left 7 cols: Route, Dates, Transport, Budget, Spots */}
        <div className="col-span-7 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Boarding & Destination */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              1. Boarding Point & Destination
            </h3>
            <div className="grid grid-2 gap-3">
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Boarding Location</label>
                <input
                  type="text"
                  value={boardingPoint}
                  onChange={e => setBoardingPoint(e.target.value)}
                  placeholder="e.g. Chennai Central"
                  className="input-glass"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Ooty, Nilgiris"
                  className="input-glass"
                  style={{ color: '#38bdf8', fontWeight: 700 }}
                />
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Popular Circuits:</span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_DESTINATIONS.map(dest => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setDestination(dest)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: destination === dest ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                      background: destination === dest ? 'rgba(56, 189, 248, 0.2)' : 'rgba(10, 15, 29, 0.7)',
                      color: destination === dest ? '#38bdf8' : '#94a3b8'
                    }}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Transport Mode & Dates */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              2. Mode of Transport & Travel Dates
            </h3>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Preferred Transport</label>
              <div className="grid grid-5 gap-2">
                {[
                  { mode: 'Flight' as TransportMode, icon: Plane },
                  { mode: 'Train' as TransportMode, icon: Train },
                  { mode: 'Bus' as TransportMode, icon: Bus },
                  { mode: 'Cab / Taxi' as TransportMode, icon: Car },
                  { mode: 'Self-Drive / Rental' as TransportMode, icon: Car }
                ].map(t => {
                  const Icon = t.icon;
                  const isSelected = transportMode === t.mode;
                  return (
                    <button
                      key={t.mode}
                      type="button"
                      onClick={() => setTransportMode(t.mode)}
                      className="btn-secondary"
                      style={{
                        padding: '10px 6px',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(10, 15, 29, 0.7)',
                        borderColor: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                        color: isSelected ? '#38bdf8' : '#94a3b8'
                      }}
                    >
                      <Icon style={{ width: '18px', height: '18px' }} />
                      <span>{t.mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-3 gap-3">
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="input-glass"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="input-glass"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Duration</label>
                <div className="input-glass" style={{ color: '#38bdf8', fontWeight: 800 }}>
                  {durationDays} Days / {Math.max(1, durationDays - 1)} Nights
                </div>
              </div>
            </div>
          </div>

          {/* 3. Budget (Manual vs AI Suggestion) */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign style={{ width: '18px', height: '18px', color: '#34d399' }} />
                3. Budget Estimator
              </h3>
              <div style={{ display: 'flex', background: 'rgba(10, 15, 29, 0.9)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => setBudgetType('suggested')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: budgetType === 'suggested' ? '#38bdf8' : 'transparent',
                    color: budgetType === 'suggested' ? '#0f172a' : '#94a3b8'
                  }}
                >
                  AI Suggestion
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType('manual')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: budgetType === 'manual' ? '#38bdf8' : 'transparent',
                    color: budgetType === 'manual' ? '#0f172a' : '#94a3b8'
                  }}
                >
                  Manual
                </button>
              </div>
            </div>

            {budgetType === 'suggested' ? (
              <div style={{ padding: '16px', background: 'rgba(10, 15, 29, 0.85)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Estimated Total for {durationDays} Days:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>₹{totalSuggested.toLocaleString()}</span>
                </div>
                <div className="grid grid-5 gap-2" style={{ textAlign: 'center' }}>
                  <div style={{ padding: '8px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>Travel</span>
                    <strong style={{ fontSize: '0.8rem', color: '#38bdf8' }}>₹{suggestedBreakdown.travel}</strong>
                  </div>
                  <div style={{ padding: '8px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>Stay</span>
                    <strong style={{ fontSize: '0.8rem', color: '#38bdf8' }}>₹{suggestedBreakdown.stay}</strong>
                  </div>
                  <div style={{ padding: '8px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>Food</span>
                    <strong style={{ fontSize: '0.8rem', color: '#38bdf8' }}>₹{suggestedBreakdown.food}</strong>
                  </div>
                  <div style={{ padding: '8px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>Activities</span>
                    <strong style={{ fontSize: '0.8rem', color: '#38bdf8' }}>₹{suggestedBreakdown.activities}</strong>
                  </div>
                  <div style={{ padding: '8px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#fbbf24', display: 'block' }}>Buffer</span>
                    <strong style={{ fontSize: '0.8rem', color: '#fbbf24' }}>₹{suggestedBreakdown.buffer}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Enter Custom Budget (₹ INR)</label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={e => setBudgetAmount(parseInt(e.target.value) || 0)}
                  className="input-glass"
                  style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#34d399' }}
                />
              </div>
            )}
          </div>

          {/* 4. Spots & Attractions */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Hotel style={{ width: '18px', height: '18px', color: '#c084fc' }} />
              4. Spots & Attraction Suggestions (Planner)
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpotInput}
                onChange={e => setNewSpotInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSpot())}
                placeholder="Add attraction or spot..."
                className="input-glass"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddSpot}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                <Plus style={{ width: '16px', height: '16px' }} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedSpots.map(spot => (
                <span 
                  key={spot}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(10, 15, 29, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.78rem',
                    color: '#f8fafc',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MapPin style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                  {spot}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpot(spot)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', marginLeft: '4px' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Local Guide Reach & Saved Trips */}
        <div className="col-span-5 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Guide Profile Reach */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Local Guide Reach</h3>
              </div>
              <span className="badge badge-green">Verified Guides</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              Connect directly with authorized government & local heritage guides for your destination.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {LOCAL_GUIDES.map(guide => {
                const isSelected = selectedGuide?.id === guide.id;
                return (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(10, 15, 29, 0.75)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center justify-between">
                          <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{guide.name}</h4>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#34d399' }}>₹{guide.hourlyRate}/hr</span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{guide.location}</p>
                        
                        <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                          <span className="flex items-center gap-1" style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>
                            <Star style={{ width: '12px', height: '12px', fill: 'currentColor' }} /> {guide.rating}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            • {guide.languages.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontStyle: 'italic' }}>"{guide.specialty}"</span>
                        <a
                          href={`tel:${guide.phone}`}
                          onClick={e => e.stopPropagation()}
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#34d399' }}
                        >
                          <Phone style={{ width: '12px', height: '12px' }} /> Call Guide
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Trips Preview */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              Active & Upcoming Itineraries ({trips.length})
            </h3>
            {trips.map(trip => (
              <div key={trip.id} style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{trip.title}</h4>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {trip.boardingPoint} $\rightarrow$ {trip.destination}
                    </p>
                  </div>
                  <span className="badge badge-blue">{trip.durationDays} Days</span>
                </div>

                <div className="flex items-center justify-between" style={{ fontSize: '0.72rem', color: '#cbd5e1', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Budget: ₹{trip.budgetAmount.toLocaleString()}</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{trip.transportMode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
