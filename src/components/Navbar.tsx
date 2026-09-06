import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck,
  CreditCard, 
  Scale, 
  Languages, 
  User, 
  Sparkles, 
  PhoneCall, 
  Landmark,
  LogOut,
  Lock
} from 'lucide-react';
import { UserProfile, ServiceProviderProfile, UserLocation } from '../types';
import { getStoredLocation, detectUserCurrentLocation } from '../utils/geoLocator';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  providerProfile?: ServiceProviderProfile | null;
  onOpenSOS: () => void;
  onOpenRegister: () => void;
  onOpenGateway?: () => void;
  onOpenProviderRegister?: () => void;
  onOpenChatbot: () => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  providerProfile,
  onOpenSOS,
  onOpenRegister,
  onOpenGateway,
  onOpenProviderRegister,
  onOpenChatbot,
  onOpenLogin,
  onLogout
}) => {
  const [activeLocation, setActiveLocation] = useState<UserLocation | null>(() => getStoredLocation());
  const [isRefreshingLoc, setIsRefreshingLoc] = useState<boolean>(false);

  useEffect(() => {
    const handleLocUpdate = (e: any) => {
      if (e.detail) setActiveLocation(e.detail);
    };
    window.addEventListener('tripnova_location_updated', handleLocUpdate);
    return () => window.removeEventListener('tripnova_location_updated', handleLocUpdate);
  }, []);

  const handleRefreshLocation = async () => {
    if (isRefreshingLoc) return;
    setIsRefreshingLoc(true);
    try {
      const loc = await detectUserCurrentLocation();
      setActiveLocation(loc);
    } catch {
      // Handled silently by multi-tiered fallback
    } finally {
      setIsRefreshingLoc(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Explore', icon: Compass },
    { id: 'spots', label: 'Spots', icon: Landmark },
    { id: 'planner', label: 'Trip Planner', icon: MapPin },
    { id: 'emergency-card', label: 'Emergency Card', icon: CreditCard, highlight: true },
    { id: 'safety-hub', label: 'Safety Hub', icon: ShieldAlert },
    { id: 'anti-scam', label: 'Fare Guard', icon: Scale },
    { id: 'tools', label: 'Travel Tools', icon: Languages },
  ];

  return (
    <header className="navbar-wrapper">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div 
          className="brand-logo"
          onClick={() => setActiveTab('dashboard')}
          title="TripNova Home"
        >
          <div className="brand-icon-box">
            <div className="brand-icon-inner">
              <Compass style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="brand-title">TripNova</span>
              <span className="badge badge-blue hide-mobile" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>AI Safety</span>
            </div>
            <p className="brand-subtitle hide-mobile">Smart AI Travel Companion</p>
          </div>
        </div>

        {/* Center Nav Links for Desktop - Broad Spanning Layout */}
        <nav className="nav-links-box hide-mobile">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon style={{ 
                  width: '15px', 
                  height: '15px', 
                  color: isActive ? '#ffffff' : item.highlight ? '#f87171' : '#38bdf8',
                  flexShrink: 0
                }} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    display: 'inline-block',
                    flexShrink: 0
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions - Anchored and Protected */}
        <div className="navbar-actions">
          {/* Interactive Live Location Chip */}
          <div 
            className="navbar-gps-chip hide-mobile"
            onClick={handleRefreshLocation}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            title={
              activeLocation 
                ? `Live Location: ${activeLocation.formattedAddress} (Click to refresh)` 
                : 'Click to auto-detect live location'
            }
          >
            <MapPin style={{ 
              width: '13px', 
              height: '13px', 
              flexShrink: 0,
              color: isRefreshingLoc ? '#fbbf24' : '#34d399',
              animation: isRefreshingLoc ? 'spin 1s linear infinite' : 'none'
            }} />
            <span className="navbar-gps-text">
              {isRefreshingLoc 
                ? 'Detecting...' 
                : activeLocation 
                ? activeLocation.city 
                : 'Detect Location'}
            </span>
          </div>

          {/* SOS Emergency Trigger */}
          <button
            onClick={onOpenSOS}
            className="btn-sos"
            style={{ padding: '7px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap', fontWeight: 800 }}
            title="Instant SOS to 5 Trusted Contacts"
          >
            <PhoneCall style={{ width: '14px', height: '14px' }} />
            <span>SOS</span>
          </button>

          {/* Quick Log In Button for Unregistered Users */}
          {!userProfile.isRegistered && !providerProfile && onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="btn-secondary hide-mobile"
              style={{
                padding: '6px 11px',
                fontSize: '0.76rem',
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
              title="Sign in with Username & Password"
            >
              <Lock style={{ width: '13px', height: '13px' }} />
              <span>Log In</span>
            </button>
          )}

          {/* Integrated Top-Right My Profile / Register Button (Dual-Mode: Tourist or Provider) */}
          <button
            onClick={() => {
              if (userProfile.isRegistered || providerProfile) {
                setActiveTab('profile');
              } else if (onOpenGateway) {
                onOpenGateway();
              } else {
                onOpenRegister();
              }
            }}
            className={`navbar-profile-btn ${activeTab === 'profile' ? 'active' : ''}`}
            title={
              userProfile.isRegistered 
                ? `Tourist Profile: ${userProfile.name}` 
                : providerProfile 
                ? `Partner Profile: ${providerProfile.businessName}` 
                : 'Join TripNova: Choose Registration Mode'
            }
          >
            {userProfile.isRegistered && userProfile.avatarUrl ? (
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name} 
                className="profile-avatar-img"
              />
            ) : (
              <div 
                className="profile-avatar-initial"
                style={{
                  background: providerProfile && !userProfile.isRegistered ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : undefined,
                  color: providerProfile && !userProfile.isRegistered ? '#000000' : undefined
                }}
              >
                {userProfile.isRegistered ? (
                  userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User style={{ width: '13px', height: '13px' }} />
                ) : providerProfile ? (
                  providerProfile.businessName ? providerProfile.businessName.charAt(0).toUpperCase() : <ShieldCheck style={{ width: '13px', height: '13px' }} />
                ) : (
                  <User style={{ width: '13px', height: '13px' }} />
                )}
              </div>
            )}
            <div className="profile-info-block hide-mobile">
              <span className="profile-name-text">
                {userProfile.isRegistered 
                  ? (userProfile.name.split(' ')[0] || 'My Profile')
                  : providerProfile 
                  ? (providerProfile.businessName.length > 12 ? providerProfile.businessName.slice(0, 12) + '...' : providerProfile.businessName)
                  : 'Register'}
              </span>
              <span className="profile-sub-text">
                {userProfile.isRegistered 
                  ? (userProfile.nativeCurrency ? `${userProfile.nativeCurrency} • Profile` : 'Tourist Form') 
                  : providerProfile
                  ? `${providerProfile.nativeCurrency || 'INR'} • Partner`
                  : 'Get Started'}
              </span>
            </div>
          </button>

          {/* Logout Action Button (Active when registered as Tourist or Provider) */}
          {(userProfile.isRegistered || providerProfile) && onLogout && (
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{
                padding: '6px 10px',
                fontSize: '0.76rem',
                color: '#f87171',
                borderColor: 'rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
              title="Log Out of Session"
            >
              <LogOut style={{ width: '13px', height: '13px' }} />
              <span className="hide-mobile">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
