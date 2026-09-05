import React, { useState, useEffect, useMemo } from 'react';
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
  Minus,
  Check, 
  UserCheck, 
  Star, 
  Phone, 
  Clock,
  Users,
  Compass,
  Navigation,
  Globe,
  Layers,
  Landmark,
  ShieldCheck,
  Tag,
  Info,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { TripPlan, TransportMode, LocalGuide, ItineraryItem, ServiceProviderProfile } from '../types';
import { LOCAL_GUIDES } from '../data/mockData';
import { 
  fetchLocations, 
  fetchPlaces, 
  fetchProvidersFromAPI, 
  LocationItem, 
  PlaceItem 
} from '../utils/api';

interface TripPlannerProps {
  trips: TripPlan[];
  onSaveTrip: (trip: TripPlan) => void;
  providerProfile?: ServiceProviderProfile | null;
}

const getCurrencySymbol = (curr?: string) => {
  switch (curr) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'JPY': return '¥';
    case 'AED': return 'AED ';
    case 'CAD': return 'CA$';
    case 'AUD': return 'A$';
    case 'SGD': return 'S$';
    case 'INR':
    default: return '₹';
  }
};

// Accurate Haversine Distance Formula (in kilometers)
const calculateHaversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(15, Math.round(R * c));
};

export const TripPlanner: React.FC<TripPlannerProps> = ({
  trips,
  onSaveTrip,
  providerProfile
}) => {
  // Master Datasets from live database
  const [allLocations, setAllLocations] = useState<LocationItem[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceItem[]>([]);
  const [apiProviders, setApiProviders] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // 1. Boarding Hierarchical Filters (Country -> State -> City -> Specific Spot/Station)
  const [boardingCountry, setBoardingCountry] = useState<string>('India');
  const [boardingState, setBoardingState] = useState<string>('Tamil Nadu');
  const [boardingCityId, setBoardingCityId] = useState<string>('loc-chn');
  const [boardingSpotId, setBoardingSpotId] = useState<string>('plc-marina-beach');
  const [customBoardingText, setCustomBoardingText] = useState<string>('');

  // 2. Destination Hierarchical Filters (Country -> State -> City -> Main Spot/Attraction)
  const [destCountry, setDestCountry] = useState<string>('India');
  const [destState, setDestState] = useState<string>('Tamil Nadu');
  const [destCityId, setDestCityId] = useState<string>('loc-nlg');
  const [destSpotId, setDestSpotId] = useState<string>('plc-botanical-ooty');
  const [customDestText, setCustomDestText] = useState<string>('');

  // Travel Dates & Config
  const [transportMode, setTransportMode] = useState<TransportMode>('Train');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 11);
    return d.toISOString().split('T')[0];
  });
  const [travelerCount, setTravelerCount] = useState<number>(2);
  const [budgetType, setBudgetType] = useState<'suggested' | 'manual'>('suggested');
  const [customBudgetAmount, setCustomBudgetAmount] = useState<number>(0);
  
  // Selected spots list for the itinerary
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [newSpotInput, setNewSpotInput] = useState<string>('');
  const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Load database locations and places on component mount
  useEffect(() => {
    async function loadMasterData() {
      setIsDataLoading(true);
      try {
        const [locs, pls, provs] = await Promise.all([
          fetchLocations(),
          fetchPlaces(),
          fetchProvidersFromAPI('tour_guide')
        ]);
        setAllLocations(locs);
        setAllPlaces(pls);
        setApiProviders(provs);
      } catch (err) {
        console.warn('TripPlanner data fetch notice:', err);
      } finally {
        setIsDataLoading(false);
      }
    }
    loadMasterData();
  }, []);

  // Available unique States & UTs (Sorted with Tamil Nadu & Kerala prominent)
  const availableStates = useMemo(() => {
    if (!allLocations.length) return ['Tamil Nadu', 'Kerala', 'Karnataka', 'Rajasthan', 'Goa', 'Delhi', 'Uttar Pradesh'];
    const states = Array.from(new Set(allLocations.map(l => l.state))).sort((a, b) => {
      if (a === 'Tamil Nadu') return -1;
      if (b === 'Tamil Nadu') return 1;
      if (a === 'Kerala') return -1;
      if (b === 'Kerala') return 1;
      return a.localeCompare(b);
    });
    return states;
  }, [allLocations]);

  // Filtered Cities for Boarding
  const boardingCities = useMemo(() => {
    return allLocations.filter(l => l.state.toLowerCase() === boardingState.toLowerCase());
  }, [allLocations, boardingState]);

  // Filtered Spots for Boarding City
  const boardingCitySpots = useMemo(() => {
    return allPlaces.filter(p => p.location_id === boardingCityId);
  }, [allPlaces, boardingCityId]);

  // Filtered Cities for Destination
  const destCities = useMemo(() => {
    return allLocations.filter(l => l.state.toLowerCase() === destState.toLowerCase());
  }, [allLocations, destState]);

  // Filtered Spots for Destination City
  const destCitySpots = useMemo(() => {
    return allPlaces.filter(p => p.location_id === destCityId);
  }, [allPlaces, destCityId]);

  // Selected Boarding Object & Coordinates
  const currentBoardingCity = allLocations.find(l => l.id === boardingCityId) || boardingCities[0];
  const currentBoardingSpot = allPlaces.find(p => p.id === boardingSpotId);
  const boardingLat = currentBoardingSpot?.latitude || currentBoardingCity?.latitude || 13.0827;
  const boardingLng = currentBoardingSpot?.longitude || currentBoardingCity?.longitude || 80.2707;

  // Selected Destination Object & Coordinates
  const currentDestCity = allLocations.find(l => l.id === destCityId) || destCities[0];
  const currentDestSpot = allPlaces.find(p => p.id === destSpotId);
  const destLat = currentDestSpot?.latitude || currentDestCity?.latitude || 11.4102;
  const destLng = currentDestSpot?.longitude || currentDestCity?.longitude || 76.6950;

  // Format final Boarding and Destination strings
  const resolvedBoardingString = useMemo(() => {
    if (customBoardingText.trim()) return customBoardingText.trim();
    const spotName = currentBoardingSpot ? currentBoardingSpot.name : '';
    const cityName = currentBoardingCity ? currentBoardingCity.name : boardingState;
    return spotName ? `${spotName}, ${cityName}, ${boardingState}` : `${cityName}, ${boardingState}`;
  }, [customBoardingText, currentBoardingSpot, currentBoardingCity, boardingState]);

  const resolvedDestString = useMemo(() => {
    if (customDestText.trim()) return customDestText.trim();
    const spotName = currentDestSpot ? currentDestSpot.name : '';
    const cityName = currentDestCity ? currentDestCity.name : destState;
    return spotName ? `${spotName}, ${cityName}, ${destState}` : `${cityName}, ${destState}`;
  }, [customDestText, currentDestSpot, currentDestCity, destState]);

  // When destination city/state changes, auto-populate recommended spots from destination
  useEffect(() => {
    if (destCitySpots.length > 0) {
      // Pick top 4 spots
      const topSpots = destCitySpots.slice(0, 4).map(s => s.name);
      setSelectedSpots(topSpots);
    } else if (currentDestCity) {
      setSelectedSpots([`${currentDestCity.name} Central Sightseeing`, `${currentDestCity.name} Heritage & Culture Walk`]);
    }
  }, [destCityId, destCitySpots.length]);

  // Calculate Duration in Days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
    return Math.max(1, diff || 1);
  };

  const durationDays = calculateDays();
  const safeTravelers = Math.max(1, travelerCount || 1);
  const roomsCount = Math.ceil(safeTravelers / 2);

  // Accurate Geodesic Route Distance (One-way and Round-trip)
  const oneWayDistanceKm = useMemo(() => {
    if (boardingCityId === destCityId && !customBoardingText && !customDestText) {
      return 35; // Local city sightseeing circuit
    }
    return calculateHaversineKm(boardingLat, boardingLng, destLat, destLng);
  }, [boardingLat, boardingLng, destLat, destLng, boardingCityId, destCityId, customBoardingText, customDestText]);

  const roundTripDistanceKm = oneWayDistanceKm * 2;

  // ===========================================================================
  // 3. Accurate Budget Calculation Engine
  // ===========================================================================
  const accurateBudget = useMemo(() => {
    // 1. Inter-city Transport Cost (Round-trip)
    let travelCost = 0;
    switch (transportMode) {
      case 'Flight':
        // Flight tariff: ₹3,200 base + ₹3.60/km per passenger round-trip
        travelCost = Math.round((3200 + oneWayDistanceKm * 3.6) * 2 * safeTravelers);
        break;
      case 'Train':
        // Train tariff: ₹180 base + ₹1.15/km per passenger round-trip (AC 3-Tier/Chair benchmark)
        travelCost = Math.round((180 + oneWayDistanceKm * 1.15) * 2 * safeTravelers);
        break;
      case 'Bus':
        // Bus tariff: ₹140 base + ₹1.45/km per passenger round-trip (AC Sleeper/Volvo benchmark)
        travelCost = Math.round((140 + oneWayDistanceKm * 1.45) * 2 * safeTravelers);
        break;
      case 'Cab / Taxi':
        // Outstation Cab tariff: ₹14/km + ₹450/day driver allowance (shared among up to 4 travelers per vehicle)
        {
          const cabsNeeded = Math.ceil(safeTravelers / 4);
          const mileageCost = roundTripDistanceKm * 14;
          const driverAllowance = durationDays * 450;
          travelCost = Math.round((mileageCost + driverAllowance) * cabsNeeded);
        }
        break;
      case 'Self-Drive / Rental':
        // Self-drive rental: ₹1,600/day + ₹8.50/km fuel (shared among up to 5 travelers per vehicle)
        {
          const carsNeeded = Math.ceil(safeTravelers / 5);
          const rentalCost = durationDays * 1600;
          const fuelCost = roundTripDistanceKm * 8.5;
          travelCost = Math.round((rentalCost + fuelCost) * carsNeeded);
        }
        break;
      default:
        travelCost = Math.round(durationDays * 1200 * safeTravelers);
    }

    // 2. Stay & Accommodation Cost (₹2,100 per room per night)
    const nights = Math.max(1, durationDays - 1);
    const stayCost = Math.round(nights * 2100 * roomsCount);

    // 3. Food & Dining Cost (₹700 per person per day: breakfast, lunch, authentic regional dinner)
    const foodCost = Math.round(durationDays * 700 * safeTravelers);

    // 4. Activities & Sightseeing Entry Fees
    // Calculate exact entry fees from chosen spots + ₹200/day local guide/camera/toll fees
    let spotsTotalFee = 0;
    for (const sName of selectedSpots) {
      const match = allPlaces.find(p => p.name.toLowerCase() === sName.toLowerCase());
      spotsTotalFee += match?.entry_fee ? match.entry_fee : 40;
    }
    const activitiesCost = Math.round((spotsTotalFee * safeTravelers) + (durationDays * 200 * safeTravelers));

    // 5. Local Destination Transit (₹250/person/day for auto/taxis at destination)
    const localTransitCost = Math.round(durationDays * 250 * safeTravelers);

    // 6. Safety Emergency & Buffer Reserve (8% of subtotal)
    const subtotal = travelCost + stayCost + foodCost + activitiesCost + localTransitCost;
    const bufferCost = Math.round(subtotal * 0.08);

    const breakdown = {
      travel: travelCost,
      stay: stayCost,
      food: foodCost,
      activities: activitiesCost,
      localTransit: localTransitCost,
      buffer: bufferCost
    };

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    return {
      breakdown,
      total,
      perPerson: Math.round(total / safeTravelers),
      nights
    };
  }, [transportMode, oneWayDistanceKm, roundTripDistanceKm, durationDays, safeTravelers, roomsCount, selectedSpots, allPlaces]);

  // Effective Budget
  const effectiveBudget = budgetType === 'suggested' ? accurateBudget.total : (customBudgetAmount || accurateBudget.total);
  const perPersonBudget = Math.round(effectiveBudget / safeTravelers);

  // Spot addition/removal
  const handleAddSpot = () => {
    if (newSpotInput.trim() && !selectedSpots.includes(newSpotInput.trim())) {
      setSelectedSpots(prev => [...prev, newSpotInput.trim()]);
      setNewSpotInput('');
    }
  };

  const handleToggleSuggestedSpot = (spotName: string) => {
    if (selectedSpots.includes(spotName)) {
      setSelectedSpots(prev => prev.filter(s => s !== spotName));
    } else {
      setSelectedSpots(prev => [...prev, spotName]);
    }
  };

  const handleRemoveSpot = (spot: string) => {
    setSelectedSpots(prev => prev.filter(s => s !== spot));
  };

  // ===========================================================================
  // 5. Local Guide Reach Engine (Filtered relevant to selected destination)
  // ===========================================================================
  const relevantGuides = useMemo(() => {
    const destCityName = currentDestCity ? currentDestCity.name.toLowerCase() : '';
    const destStateName = destState.toLowerCase();

    // 1. Check if user's own registered provider profile matches
    const registeredGuide: (LocalGuide & { isPartner?: boolean; badgeNumber?: string; currency?: string }) | null = 
      providerProfile && providerProfile.category === 'tour_guide'
        ? {
            id: providerProfile.id || 'reg_partner_guide',
            name: `${providerProfile.providerName}`,
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            location: `${providerProfile.operatingCity || destCityName}, ${providerProfile.operatingState || destState}`,
            languages: providerProfile.tourGuideDetails?.languagesSpoken?.length ? providerProfile.tourGuideDetails.languagesSpoken : ['English', 'Tamil'],
            rating: 5.0,
            reviewsCount: 28,
            specialty: providerProfile.tourGuideDetails?.specialization || 'Certified Local Heritage & Tour Guide',
            hourlyRate: providerProfile.tourGuideDetails?.hourlyRate || 450,
            phone: providerProfile.phone || '+91 90000 00000',
            verified: true,
            bio: `Verified Partner Guide. Badge: ${providerProfile.tourGuideDetails?.guideBadgeNumber || 'GOVT-PARTNER'} • ${providerProfile.tourGuideDetails?.experienceYears || 3} yrs experience. ${providerProfile.tourGuideDetails?.hasFirstAidCert ? 'First-Aid Certified.' : ''}`,
            isPartner: true,
            badgeNumber: providerProfile.tourGuideDetails?.guideBadgeNumber,
            currency: providerProfile.nativeCurrency || 'INR'
          }
        : null;

    // Combine static verified guides + API registered guides
    const apiGuidesFormatted: LocalGuide[] = apiProviders.map((p, idx) => ({
      id: p.id || `api_guide_${idx}`,
      name: p.providerName,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      location: `${p.operatingCity || ''}, ${p.operatingState || ''}`,
      languages: p.tourGuideDetails?.languagesSpoken || ['English', 'Hindi'],
      rating: 4.9,
      reviewsCount: 15,
      specialty: p.tourGuideDetails?.specialization || 'Registered Local Guide',
      hourlyRate: p.tourGuideDetails?.hourlyRate || 500,
      phone: p.phone || '',
      verified: true,
      bio: `Registered Travel Guide operating in ${p.operatingCity || 'regional sector'}.`
    }));

    const pool = [...(registeredGuide ? [registeredGuide] : []), ...apiGuidesFormatted, ...LOCAL_GUIDES];

    // Deduplicate by ID
    const uniquePool = Array.from(new Map(pool.map(g => [g.id, g])).values());

    // Sort by relevance to destination
    const scored = uniquePool.map(guide => {
      const gLoc = guide.location.toLowerCase();
      let score = 0;
      if (destCityName && gLoc.includes(destCityName)) score += 100;
      if (destStateName && gLoc.includes(destStateName)) score += 50;
      if (guide.isPartner) score += 20;
      return { guide, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.guide);
  }, [currentDestCity, destState, providerProfile, apiProviders]);

  // Set default guide when relevantGuides updates
  useEffect(() => {
    if (relevantGuides.length > 0 && (!selectedGuide || !relevantGuides.some(g => g.id === selectedGuide.id))) {
      setSelectedGuide(relevantGuides[0]);
    }
  }, [relevantGuides]);

  // Create and Save Itinerary
  const handleCreateTripPlan = () => {
    const generatedItinerary: ItineraryItem[] = [];
    for (let day = 1; day <= durationDays; day++) {
      const spotForDay = selectedSpots[(day - 1) % selectedSpots.length] || `${currentDestCity?.name || 'Destination'} Sightseeing`;
      generatedItinerary.push({
        id: `it_gen_${Date.now()}_${day}`,
        day,
        time: day === 1 ? '07:30 AM' : '09:00 AM',
        title: `Day ${day}: Explore ${spotForDay} (${safeTravelers} Traveler${safeTravelers > 1 ? 's' : ''})`,
        description: `Scheduled discovery of ${spotForDay} for ${safeTravelers} traveler(s) from ${resolvedBoardingString} to ${resolvedDestString} with certified local guidance.`,
        spotName: spotForDay,
        residencyName: day === 1 ? `Verified Heritage Residency (${roomsCount} Room${roomsCount > 1 ? 's' : ''})` : `Highland View Boutique Lodge (${roomsCount} Room${roomsCount > 1 ? 's' : ''})`,
        transportNotes: transportMode === 'Train' ? `Reserved Rail Transit (${safeTravelers} Seats)` : `${transportMode} Booking (${oneWayDistanceKm} km route)`,
        estimatedCost: Math.round(effectiveBudget / durationDays),
        weatherForecast: day === 2 
          ? { temp: '19°C', condition: 'Pleasant & Breezy', alert: '☀️ Great Sightseeing Weather' }
          : { temp: '22°C', condition: 'Sunny & Clear' }
      });
    }

    const newTrip: TripPlan = {
      id: `trip_${Date.now()}`,
      title: `${(currentDestCity?.name || destState)} Expedition`,
      boardingPoint: resolvedBoardingString,
      destination: resolvedDestString,
      transportMode,
      startDate,
      endDate,
      durationDays,
      travelerCount: safeTravelers,
      roomsCount,
      budgetType,
      budgetAmount: effectiveBudget,
      suggestedBudgetBreakdown: accurateBudget.breakdown,
      selectedSpots,
      selectedResidencies: [`Verified Heritage Residency (${roomsCount} Room${roomsCount > 1 ? 's' : ''})`, `Highland View Boutique Lodge (${roomsCount} Room${roomsCount > 1 ? 's' : ''})`],
      itinerary: generatedItinerary,
      assignedGuide: selectedGuide || undefined,
      createdAt: new Date().toISOString(),
      status: 'ongoing'
    };

    onSaveTrip(newTrip);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2800);
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(90deg, rgba(49, 46, 129, 0.45) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Compass style={{ width: '12px', height: '12px' }} /> Smart India Trip Planner
            </span>
            <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
              🛣️ Route Distance: ~{oneWayDistanceKm} km ({roundTripDistanceKm} km round-trip)
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '6px', margin: 0 }}>
            Design Your Tailored Itinerary
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px', maxWidth: '750px' }}>
            Plan routes across all 28 Indian States & 8 Union Territories with hierarchical destination pickers, live spot recommendations, accurate fare budgets, and authorized local guides.
          </p>
        </div>

        <button
          onClick={handleCreateTripPlan}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 800 }}
        >
          {savedSuccess ? (
            <span className="flex items-center gap-2" style={{ color: '#6ee7b7' }}>
              <Check style={{ width: '18px', height: '18px' }} /> Itinerary Generated & Saved!
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
          
          {/* ================================================================= */}
          {/* 1. Boarding Point & Destination Hierarchical Selectors */}
          {/* ================================================================= */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <MapPin style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
                1. Boarding Point & Destination (Hierarchical Filter)
              </h3>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                Country ➔ State ➔ City ➔ Place
              </span>
            </div>

            {/* A. Boarding Location Section */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🛫 Origin / Boarding Point
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  GPS: {boardingLat.toFixed(2)}° N, {boardingLng.toFixed(2)}° E
                </span>
              </div>

              {/* 4-Tier Hierarchical Selector for Boarding */}
              <div className="grid grid-4 gap-2">
                {/* 1. Country */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    1. Country
                  </label>
                  <select
                    value={boardingCountry}
                    onChange={e => setBoardingCountry(e.target.value)}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    <option value="India">🇮🇳 India</option>
                  </select>
                </div>

                {/* 2. State */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    2. State / UT
                  </label>
                  <select
                    value={boardingState}
                    onChange={e => {
                      const newState = e.target.value;
                      setBoardingState(newState);
                      const matchingCities = allLocations.filter(l => l.state.toLowerCase() === newState.toLowerCase());
                      if (matchingCities.length > 0) {
                        setBoardingCityId(matchingCities[0].id);
                        const matchingSpots = allPlaces.filter(p => p.location_id === matchingCities[0].id);
                        if (matchingSpots.length > 0) setBoardingSpotId(matchingSpots[0].id);
                      }
                    }}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    {availableStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* 3. City / District */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    3. City / District
                  </label>
                  <select
                    value={boardingCityId}
                    onChange={e => {
                      const newCityId = e.target.value;
                      setBoardingCityId(newCityId);
                      const matchingSpots = allPlaces.filter(p => p.location_id === newCityId);
                      if (matchingSpots.length > 0) setBoardingSpotId(matchingSpots[0].id);
                    }}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    {boardingCities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Specific Spot / Station */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    4. Spot / Station
                  </label>
                  <select
                    value={boardingSpotId}
                    onChange={e => setBoardingSpotId(e.target.value)}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    <option value="">{currentBoardingCity?.name || 'City'} Central Hub</option>
                    {boardingCitySpots.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom boarding point override */}
              <div>
                <input
                  type="text"
                  value={customBoardingText}
                  onChange={e => setCustomBoardingText(e.target.value)}
                  placeholder="Or enter custom pickup / railway station / airport name..."
                  className="input-glass"
                  style={{ fontSize: '0.78rem', padding: '8px 12px' }}
                />
              </div>

              <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
                📍 <strong>Selected Boarding:</strong> {resolvedBoardingString}
              </div>
            </div>

            {/* B. Destination Location Section */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🎯 Destination / Target Region
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  GPS: {destLat.toFixed(2)}° N, {destLng.toFixed(2)}° E
                </span>
              </div>

              {/* 4-Tier Hierarchical Selector for Destination */}
              <div className="grid grid-4 gap-2">
                {/* 1. Country */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    1. Country
                  </label>
                  <select
                    value={destCountry}
                    onChange={e => setDestCountry(e.target.value)}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    <option value="India">🇮🇳 India</option>
                  </select>
                </div>

                {/* 2. State */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    2. State / UT
                  </label>
                  <select
                    value={destState}
                    onChange={e => {
                      const newState = e.target.value;
                      setDestState(newState);
                      const matchingCities = allLocations.filter(l => l.state.toLowerCase() === newState.toLowerCase());
                      if (matchingCities.length > 0) {
                        setDestCityId(matchingCities[0].id);
                        const matchingSpots = allPlaces.filter(p => p.location_id === matchingCities[0].id);
                        if (matchingSpots.length > 0) setDestSpotId(matchingSpots[0].id);
                      }
                    }}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    {availableStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* 3. City / District */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    3. City / District
                  </label>
                  <select
                    value={destCityId}
                    onChange={e => {
                      const newCityId = e.target.value;
                      setDestCityId(newCityId);
                      const matchingSpots = allPlaces.filter(p => p.location_id === newCityId);
                      if (matchingSpots.length > 0) setDestSpotId(matchingSpots[0].id);
                    }}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    {destCities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Highlight Spot / Attraction */}
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    4. Main Spot
                  </label>
                  <select
                    value={destSpotId}
                    onChange={e => setDestSpotId(e.target.value)}
                    className="input-field"
                    style={{ padding: '8px', fontSize: '0.78rem', background: '#090e17', color: '#ffffff' }}
                  >
                    <option value="">{currentDestCity?.name || 'Destination'} Main Attraction</option>
                    {destCitySpots.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom destination override */}
              <div>
                <input
                  type="text"
                  value={customDestText}
                  onChange={e => setCustomDestText(e.target.value)}
                  placeholder="Or enter custom destination / landmark name..."
                  className="input-glass"
                  style={{ fontSize: '0.78rem', padding: '8px 12px' }}
                />
              </div>

              <div style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 600 }}>
                🎯 <strong>Selected Destination:</strong> {resolvedDestString}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. Mode of Transport & Travel Dates */}
          {/* ================================================================= */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Calendar style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              2. Mode of Transport & Travel Dates
            </h3>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Preferred Mode of Transport (~{oneWayDistanceKm} km One-Way)
              </label>
              <div className="grid grid-5 gap-2">
                {[
                  { mode: 'Flight' as TransportMode, icon: Plane, rateLabel: 'Fastest' },
                  { mode: 'Train' as TransportMode, icon: Train, rateLabel: 'Economical' },
                  { mode: 'Bus' as TransportMode, icon: Bus, rateLabel: 'Direct' },
                  { mode: 'Cab / Taxi' as TransportMode, icon: Car, rateLabel: 'Private Door-to-Door' },
                  { mode: 'Self-Drive / Rental' as TransportMode, icon: Car, rateLabel: 'Flexible' }
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
                        gap: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(10, 15, 29, 0.7)',
                        borderColor: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                        color: isSelected ? '#38bdf8' : '#94a3b8'
                      }}
                    >
                      <Icon style={{ width: '18px', height: '18px' }} />
                      <span>{t.mode}</span>
                      <span style={{ fontSize: '0.62rem', color: isSelected ? '#7dd3fc' : '#64748b' }}>{t.rateLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group Size / Traveler Count Selector */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                  Travelers & Group Size
                </label>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                  {safeTravelers} {safeTravelers === 1 ? 'Traveler' : 'Travelers'} • {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Stepper Control */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(10, 15, 29, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '4px 6px',
                  gap: '8px'
                }}>
                  <button
                    type="button"
                    onClick={() => setTravelerCount(Math.max(1, safeTravelers - 1))}
                    disabled={safeTravelers <= 1}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: 'none',
                      background: safeTravelers <= 1 ? 'rgba(255,255,255,0.05)' : 'rgba(56, 189, 248, 0.2)',
                      color: safeTravelers <= 1 ? '#64748b' : '#38bdf8',
                      cursor: safeTravelers <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}
                    title="Decrease Travelers"
                  >
                    <Minus style={{ width: '14px', height: '14px' }} />
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={travelerCount}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setTravelerCount(isNaN(val) ? 1 : Math.max(1, val));
                    }}
                    style={{
                      width: '52px',
                      textAlign: 'center',
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '1rem',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setTravelerCount(safeTravelers + 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}
                    title="Increase Travelers"
                  >
                    <Plus style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { count: 1, label: 'Solo (1)' },
                    { count: 2, label: 'Couple (2)' },
                    { count: 4, label: 'Small Group (4)' },
                    { count: 6, label: 'Family (6)' },
                    { count: 10, label: 'Large Group (10)' }
                  ].map(preset => (
                    <button
                      key={preset.count}
                      type="button"
                      onClick={() => setTravelerCount(preset.count)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: safeTravelers === preset.count ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                        background: safeTravelers === preset.count ? 'rgba(56, 189, 248, 0.25)' : 'rgba(10, 15, 29, 0.65)',
                        color: safeTravelers === preset.count ? '#38bdf8' : '#94a3b8'
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-3 gap-3">
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Departure Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="input-glass"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Return Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="input-glass"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Total Duration
                </label>
                <div className="input-glass" style={{ color: '#38bdf8', fontWeight: 800 }}>
                  {durationDays} Days / {accurateBudget.nights} Nights
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3. Budget Estimator (Accurate Cost Vectors) */}
          {/* ================================================================= */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <DollarSign style={{ width: '18px', height: '18px', color: '#34d399' }} />
                3. Accurate Budget Estimator
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
                  Accurate AI Model
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
                  Custom
                </button>
              </div>
            </div>

            {budgetType === 'suggested' ? (
              <div style={{ padding: '16px', background: 'rgba(10, 15, 29, 0.85)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block' }}>
                      Accurate Estimated Total ({safeTravelers} {safeTravelers === 1 ? 'Person' : 'People'} • {durationDays} Days • {roundTripDistanceKm} km round-trip):
                    </span>
                    <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>
                      ₹{accurateBudget.total.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
                      ₹{accurateBudget.perPerson.toLocaleString()} / traveler
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '3px' }}>
                      🏨 {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'} ({safeTravelers > 1 ? 'shared twin' : 'single'})
                    </span>
                  </div>
                </div>

                {/* 6 Cost Vectors Grid */}
                <div className="grid grid-3 gap-2" style={{ textAlign: 'left' }}>
                  <div style={{ padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>1. Inter-city Transport</span>
                    <strong style={{ fontSize: '0.88rem', color: '#38bdf8', display: 'block' }}>₹{accurateBudget.breakdown.travel.toLocaleString()}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#64748b' }}>{transportMode} ({roundTripDistanceKm} km)</span>
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>2. Hotel & Accommodation</span>
                    <strong style={{ fontSize: '0.88rem', color: '#38bdf8', display: 'block' }}>₹{accurateBudget.breakdown.stay.toLocaleString()}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#64748b' }}>{roomsCount} Room(s) × {accurateBudget.nights} Nights</span>
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>3. Food & Dining</span>
                    <strong style={{ fontSize: '0.88rem', color: '#38bdf8', display: 'block' }}>₹{accurateBudget.breakdown.food.toLocaleString()}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#64748b' }}>₹700/day × {safeTravelers} Persons</span>
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>4. Spots Entry & Activities</span>
                    <strong style={{ fontSize: '0.88rem', color: '#38bdf8', display: 'block' }}>₹{accurateBudget.breakdown.activities.toLocaleString()}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#64748b' }}>{selectedSpots.length} Spots + Monument passes</span>
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>5. Local Destination Transit</span>
                    <strong style={{ fontSize: '0.88rem', color: '#38bdf8', display: 'block' }}>₹{accurateBudget.breakdown.localTransit.toLocaleString()}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#64748b' }}>City auto/cabs allowance</span>
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#fbbf24', display: 'block' }}>6. Emergency & Buffer</span>
                    <strong style={{ fontSize: '0.88rem', color: '#fbbf24', display: 'block' }}>₹{accurateBudget.breakdown.buffer.toLocaleString()}</strong>
                    <span style={{ fontSize: '0.64rem', color: '#fbbf24' }}>8% Contingency Fund</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block' }}>
                  Enter Total Custom Budget (₹ INR for {safeTravelers} Travelers)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={customBudgetAmount || ''}
                    onChange={e => setCustomBudgetAmount(parseInt(e.target.value) || 0)}
                    placeholder="Enter custom budget amount in ₹..."
                    className="input-glass"
                    style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#34d399', flex: 1 }}
                  />
                  <span className="badge badge-purple" style={{ padding: '8px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    ≈ ₹{Math.round((customBudgetAmount || accurateBudget.total) / safeTravelers).toLocaleString()} / person
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 4. Spots & Attraction Suggestions (Planner) */}
          {/* ================================================================= */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Hotel style={{ width: '18px', height: '18px', color: '#c084fc' }} />
                4. Spots & Attraction Suggestions ({destState} • {currentDestCity?.name || 'Destination'})
              </h3>
              <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                {selectedSpots.length} Selected
              </span>
            </div>

            {/* Dynamic Suggestions from selected Destination */}
            {destCitySpots.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>
                  Top Recommended Spots in {currentDestCity?.name}:
                </span>
                <div className="grid grid-2 gap-2">
                  {destCitySpots.slice(0, 6).map(spot => {
                    const isAdded = selectedSpots.includes(spot.name);
                    return (
                      <div
                        key={spot.id}
                        onClick={() => handleToggleSuggestedSpot(spot.name)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: isAdded ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                          background: isAdded ? 'rgba(56, 189, 248, 0.15)' : 'rgba(10, 15, 29, 0.75)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isAdded ? '#ffffff' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {spot.name}
                          </div>
                          <div className="flex items-center gap-2" style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>
                            <span className="badge badge-purple" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>{spot.category}</span>
                            <span style={{ color: '#fbbf24' }}>★ {spot.avg_rating || '4.8'}</span>
                            <span>{spot.entry_fee ? `₹${spot.entry_fee}` : 'Free'}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            border: 'none',
                            background: isAdded ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                            color: isAdded ? '#090e17' : '#cbd5e1',
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          {isAdded ? '✓ Added' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Spot Addition */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpotInput}
                onChange={e => setNewSpotInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSpot())}
                placeholder="Type custom spot or landmark name..."
                className="input-glass"
                style={{ flex: 1, fontSize: '0.8rem' }}
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

            {/* Selected Spots Badges */}
            <div className="flex flex-wrap gap-2">
              {selectedSpots.map(spot => (
                <span 
                  key={spot}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(10, 15, 29, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    fontSize: '0.78rem',
                    color: '#f8fafc',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MapPin style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                  {spot}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpot(spot)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', marginLeft: '4px' }}
                    title="Remove Spot"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Local Guide Reach Relevant to Destination */}
        <div className="col-span-5 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ================================================================= */}
          {/* 5. Local Guide Reach (Filtered by Destination) */}
          {/* ================================================================= */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Local Guide Reach
                </h3>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
                Verified for {currentDestCity?.name || destState}
              </span>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0 }}>
              Authorized government & regional heritage guides operating in <strong>{currentDestCity?.name || destState}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {relevantGuides.map(guide => {
                const isSelected = selectedGuide?.id === guide.id;
                const isPartner = guide.isPartner;
                const currSymbol = getCurrencySymbol(guide.currency);
                return (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      border: isSelected 
                        ? (isPartner ? '1.5px solid #fbbf24' : '1px solid #38bdf8') 
                        : (isPartner ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255,255,255,0.06)'),
                      background: isSelected 
                        ? (isPartner ? 'rgba(251, 191, 36, 0.16)' : 'rgba(56, 189, 248, 0.15)') 
                        : (isPartner ? 'rgba(245, 158, 11, 0.08)' : 'rgba(10, 15, 29, 0.75)'),
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isPartner ? '0 4px 18px rgba(245, 158, 11, 0.12)' : 'none'
                    }}
                  >
                    {isPartner && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="badge badge-amber" style={{ fontSize: '0.66rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles style={{ width: '10px', height: '10px' }} /> Registered Partner Guide
                        </span>
                        {guide.badgeNumber && (
                          <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700 }}>
                            ID: {guide.badgeNumber}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '12px', 
                          objectFit: 'cover', 
                          border: isPartner ? '1.5px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255,255,255,0.1)' 
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center justify-between gap-1">
                          <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                            {guide.name}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Star style={{ width: '12px', height: '12px', fill: '#fbbf24' }} /> {guide.rating}
                          </span>
                        </div>

                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'block', marginTop: '2px' }}>
                          📍 {guide.location}
                        </span>

                        <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0', lineHeight: 1.3 }}>
                          {guide.specialty}
                        </p>

                        <div className="flex items-center justify-between gap-2" style={{ marginTop: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399' }}>
                            {currSymbol}{guide.hourlyRate} / hr
                          </span>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${guide.phone}`}
                              onClick={e => e.stopPropagation()}
                              className="btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.7rem', textDecoration: 'none' }}
                            >
                              <Phone style={{ width: '11px', height: '11px' }} /> Call
                            </a>
                            <span 
                              style={{ 
                                fontSize: '0.7rem', 
                                fontWeight: 700, 
                                color: isSelected ? '#38bdf8' : '#64748b' 
                              }}
                            >
                              {isSelected ? '✓ Assigned' : 'Select'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Trips Quick Access */}
          {trips.length > 0 && (
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Landmark style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                Your Saved Itineraries ({trips.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {trips.map(trip => (
                  <div
                    key={trip.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: 'rgba(10, 15, 29, 0.7)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                        {trip.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        {trip.startDate} ➔ {trip.endDate} • {trip.travelerCount} Travelers • ₹{trip.budgetAmount.toLocaleString()}
                      </span>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
