import React from 'react';
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  CreditCard, 
  Scale, 
  Languages, 
  User, 
  Sparkles,
  PhoneCall,
  Landmark
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onOpenSOS: () => void;
  onOpenRegister: () => void;
  onOpenChatbot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSOS,
  onOpenRegister,
  onOpenChatbot
}) => {
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
          {/* AI Bot Button */}
          <button
            onClick={onOpenChatbot}
            className="btn-secondary hide-mobile"
            style={{ padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            title="Open Nova AI Travel Concierge"
          >
            <Sparkles style={{ width: '15px', height: '15px', color: '#c084fc' }} />
            <span>Nova AI</span>
          </button>

          {/* SOS Emergency Trigger */}
          <button
            onClick={onOpenSOS}
            className="btn-sos"
            style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            title="Instant SOS to 5 Trusted Contacts"
          >
            <PhoneCall style={{ width: '15px', height: '15px' }} />
            <span>SOS</span>
          </button>

          {/* Integrated Top-Right My Profile / Register Button */}
          <button
            onClick={() => {
              if (userProfile.isRegistered) {
                setActiveTab('profile');
              } else {
                onOpenRegister();
              }
            }}
            className={`navbar-profile-btn ${activeTab === 'profile' ? 'active' : ''}`}
            title={userProfile.isRegistered ? 'Open My Profile & Travel Documents' : 'Register Tourist Profile'}
          >
            {userProfile.avatarUrl ? (
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.name} 
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-initial">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User style={{ width: '14px', height: '14px' }} />}
              </div>
            )}
            <div className="profile-info-block hide-mobile">
              <span className="profile-name-text">
                {userProfile.isRegistered ? (userProfile.name.split(' ')[0] || 'My Profile') : 'Register'}
              </span>
              <span className="profile-sub-text">
                {userProfile.isRegistered 
                  ? (userProfile.nativeCurrency ? `${userProfile.nativeCurrency} • Profile` : 'My Profile') 
                  : 'Tourist Form'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
