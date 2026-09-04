import React from 'react';
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
  Edit3
} from 'lucide-react';
import { UserProfile, TripPlan } from '../types';
import { TOP_PICKS_CATEGORIES, NEARBY_HOSPITALS } from '../data/mockData';

interface DashboardProps {
  userProfile: UserProfile;
  activeTrip?: TripPlan;
  onNavigateTab: (tab: string) => void;
  onOpenRegister: () => void;
  onOpenSOS: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  activeTrip,
  onNavigateTab,
  onOpenRegister,
  onOpenSOS
}) => {
  const filteredCategories = TOP_PICKS_CATEGORIES.filter(cat => {
    if (!userProfile.interestedTopPicks || userProfile.interestedTopPicks.length === 0) return true;
    return userProfile.interestedTopPicks.some(pick => cat.title.toLowerCase().includes(pick.toLowerCase().split(' ')[0]));
  });

  const displayPicks = filteredCategories.length > 0 ? filteredCategories : TOP_PICKS_CATEGORIES;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Welcome Card */}
      <div className="hero-card">
        <div style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge badge-blue">
              <Sparkles style={{ width: '13px', height: '13px' }} /> Next-Gen Tourist Guardian
            </span>
            <span className={`badge ${userProfile.isRegistered ? 'badge-green' : 'badge-amber'}`}>
              {userProfile.isRegistered ? `Active Tourist: ${userProfile.name}` : 'Explore Mode Active'}
            </span>
          </div>

          <h1 className="hero-title">
            Explore with Wonder. <br />
            <span className="text-gradient">Travel with Zero Fear.</span>
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Your all-in-one AI travel companion. Plan personalized itineraries, eliminate transport overcharging with Fare Guard, and carry an offline digital Emergency Card with instant voice translation.
          </p>

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
              <HeartPulse style={{ width: '18px', height: '18px', color: '#ef4444' }} /> View Tourist Emergency Card
            </button>

            {userProfile.isRegistered ? (
              <button
                onClick={() => onNavigateTab('profile')}
                className="btn-secondary"
                style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
              >
                <User style={{ width: '18px', height: '18px' }} /> View & Edit Profile
              </button>
            ) : (
              <button
                onClick={onOpenRegister}
                className="btn-secondary"
                style={{ color: '#38bdf8' }}
              >
                <User style={{ width: '18px', height: '18px' }} /> Complete Registration
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Overview Card (Problem 3) */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.5) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            fontSize: '18px',
            fontWeight: 800
          }}>
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User style={{ width: '20px', height: '20px' }} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                {userProfile.isRegistered ? userProfile.name : 'Guest Profile'}
              </h3>
              <span className={`badge ${userProfile.isRegistered ? 'badge-green' : 'badge-amber'}`}>
                {userProfile.isRegistered ? 'Registered' : 'Not Registered'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {userProfile.isRegistered 
                ? `Blood: ${userProfile.bloodGroup} • ${userProfile.trustedContacts.length} Emergency Contacts • ${userProfile.govtIdType}`
                : 'Register your personal & medical details for the offline emergency card.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          ) : (
            <button
              onClick={onOpenRegister}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.8rem' }}
            >
              <User style={{ width: '15px', height: '15px' }} /> Register Profile
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
              {activeTrip ? `${activeTrip.durationDays} Days • ${activeTrip.transportMode}` : '5 Days • Train & Cab'}
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
