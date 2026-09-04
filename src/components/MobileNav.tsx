import React from 'react';
import { 
  Compass, 
  MapPin, 
  CreditCard, 
  ShieldAlert, 
  Scale, 
  Languages,
  Landmark
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', label: 'Explore', icon: Compass },
    { id: 'spots', label: 'Spots', icon: Landmark },
    { id: 'planner', label: 'Planner', icon: MapPin },
    { id: 'emergency-card', label: 'E-Card', icon: CreditCard, highlight: true },
    { id: 'safety-hub', label: 'Safety', icon: ShieldAlert },
    { id: 'anti-scam', label: 'Fare Guard', icon: Scale },
    { id: 'tools', label: 'Tools', icon: Languages },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav style={{
      display: 'none',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'rgba(7, 11, 20, 0.96)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '6px',
      paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
      paddingLeft: '4px',
      paddingRight: '4px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
    }} className="mobile-only-nav">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                padding: '4px 6px',
                minWidth: '44px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon style={{ width: '18px', height: '18px', color: isActive ? '#38bdf8' : '#94a3b8' }} />
                {item.highlight && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ef4444'
                  }} />
                )}
              </div>
              <span style={{ fontSize: '9.5px', marginTop: '2px', lineHeight: 1 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
