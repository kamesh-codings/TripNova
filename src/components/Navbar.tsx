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
    { id: 'profile', label: 'My Profile', icon: User },
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
              <span className="badge badge-blue">AI Safety</span>
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
              >
                <Icon style={{ 
                  width: '16px', 
                  height: '16px', 
                  color: isActive ? '#ffffff' : item.highlight ? '#f87171' : '#38bdf8' 
                }} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    display: 'inline-block'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* AI Bot Button */}
          <button
            onClick={onOpenChatbot}
            className="btn-secondary hide-mobile"
            style={{ padding: '8px 14px' }}
            title="Open Nova AI Travel Concierge"
          >
            <Sparkles style={{ width: '16px', height: '16px', color: '#c084fc' }} />
            <span>Nova AI</span>
          </button>

          {/* SOS Emergency Trigger */}
          <button
            onClick={onOpenSOS}
            className="btn-sos"
            title="Instant SOS to 5 Trusted Contacts"
          >
            <PhoneCall style={{ width: '16px', height: '16px' }} />
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
              padding: '6px 12px',
              borderColor: userProfile.isRegistered ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'
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
              color: '#38bdf8'
            }}>
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User style={{ width: '14px', height: '14px' }} />}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }} className="hide-mobile">
              <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block' }}>
                {userProfile.isRegistered ? (userProfile.name.split(' ')[0] || 'My Profile') : 'Register'}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                {userProfile.isRegistered ? `Blood: ${userProfile.bloodGroup}` : 'Tourist Form'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
