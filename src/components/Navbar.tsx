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
  PhoneCall
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
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'planner', label: 'Trip Planner', icon: MapPin },
    { id: 'emergency-card', label: 'Emergency Card', icon: CreditCard, highlight: true },
    { id: 'safety-hub', label: 'Safety Hubs', icon: ShieldAlert },
    { id: 'anti-scam', label: 'Fare Guard', icon: Scale },
    { id: 'tools', label: 'Travel Tools', icon: Languages },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="navbar-wrapper">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div 
          className="brand-logo"
          onClick={() => setActiveTab('dashboard')}
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

        {/* Center Nav Links for Desktop */}
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
            style={{ padding: '7px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            title="Open Nova AI Travel Concierge"
          >
            <Sparkles style={{ width: '15px', height: '15px', color: '#c084fc' }} />
            <span>Nova AI</span>
          </button>

          {/* SOS Emergency Trigger */}
          <button
            onClick={onOpenSOS}
            className="btn-sos"
            style={{ padding: '7px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            title="Instant SOS to 5 Trusted Contacts"
          >
            <PhoneCall style={{ width: '15px', height: '15px' }} />
            <span>SOS</span>
          </button>

          {/* Profile / Register */}
          <button
            onClick={() => {
              if (userProfile.isRegistered) {
                setActiveTab('profile');
              } else {
                onOpenRegister();
              }
            }}
            className="btn-secondary"
            style={{ 
              padding: '5px 10px',
              borderColor: userProfile.isRegistered ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User style={{ width: '13px', height: '13px' }} />}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }} className="hide-mobile">
              <span style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block' }}>
                {userProfile.isRegistered ? (userProfile.name.split(' ')[0] || 'My Profile') : 'Register'}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                {userProfile.isRegistered ? `Blood: ${userProfile.bloodGroup}` : 'Tourist Form'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
