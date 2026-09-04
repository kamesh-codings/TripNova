import React from 'react';
import { 
  Compass, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  Languages, 
  ArrowRight,
  Bot,
  Car,
  Building2,
  HeartPulse
} from 'lucide-react';

interface WelcomeGatewayProps {
  isOpen: boolean;
  onSelectRegister: () => void;
  onSelectExplore: () => void;
  onSelectProviderRegister: () => void;
}

export const WelcomeGateway: React.FC<WelcomeGatewayProps> = ({
  isOpen,
  onSelectRegister,
  onSelectExplore,
  onSelectProviderRegister
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(circle at 50% 30%, rgba(30, 27, 75, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)',
      backdropFilter: 'blur(20px)'
    }} className="animate-fade">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1080px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '32px 28px',
        background: 'rgba(15, 23, 42, 0.96)',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '18px',
            background: 'var(--gradient-brand)',
            padding: '2.5px',
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#090e17',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass style={{ width: '28px', height: '28px', color: '#38bdf8' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Welcome to <span className="text-gradient">TripNova</span>
              </h1>
              <span className="badge badge-blue">Smart AI Guardian</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '560px', margin: '4px auto 0' }}>
              Select how you would like to proceed with your journey today:
            </p>
          </div>
        </div>

        {/* 3 Choice Cards: Consumer Register vs Explore Mode vs Service Provider Register */}
        <div className="grid grid-3 gap-4" style={{ textAlign: 'left' }}>
          {/* Choice 1: Consumer / Tourist Registration */}
          <div 
            onClick={onSelectRegister}
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.92) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '2px solid #38bdf8',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 12px 30px rgba(56, 189, 248, 0.2)',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <UserPlus style={{ width: '22px', height: '22px' }} />
                </div>
                <span className="badge badge-blue">Tourist ID</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Tourist / Consumer Registration
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                Enter personal details, Google Email, Native Currency, blood group, and 5 trusted SOS contacts.
              </p>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <CreditCard style={{ width: '13px', height: '13px' }} /> Offline Emergency Voice Card
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <ShieldCheck style={{ width: '13px', height: '13px' }} /> 5 SOS Emergency Dispatch
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Sparkles style={{ width: '13px', height: '13px' }} /> Personalized Itinerary Planner
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.82rem' }}
            >
              <span>Register Tourist Profile</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {/* Choice 2: Explore Mode */}
          <div 
            onClick={onSelectExplore}
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc'
                }}>
                  <Compass style={{ width: '22px', height: '22px' }} />
                </div>
                <span className="badge badge-purple">Guest Mode</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Navigation to Explore
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                Browse the application freely. Test travel tools, Fare Guard, 195 world clocks, weather, and Nova AI.
              </p>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign style={{ width: '13px', height: '13px', color: '#34d399' }} /> Live Currency & 195 Clocks
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Languages style={{ width: '13px', height: '13px', color: '#38bdf8' }} /> Smart Voice Translator
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bot style={{ width: '13px', height: '13px', color: '#c084fc' }} /> 24/7 Nova AI Concierge
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.82rem', color: '#c084fc' }}
            >
              <span>Explore As Guest</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {/* Choice 3: Service Provider Registration */}
          <div 
            onClick={onSelectProviderRegister}
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.98) 100%)',
              border: '2px solid #fbbf24',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 12px 30px rgba(245, 158, 11, 0.15)',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24'
                }}>
                  <ShieldCheck style={{ width: '22px', height: '22px' }} />
                </div>
                <span className="badge badge-amber">Partner Portal</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Service Provider Register
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                For Drivers, Tour Guides, Homestay Hosts, Medical Responders & Rental Agencies.
              </p>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Car style={{ width: '13px', height: '13px' }} /> Role-Based Category Forms
                </span>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <ShieldCheck style={{ width: '13px', height: '13px' }} /> Verified Provider Badge & ID
                </span>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <DollarSign style={{ width: '13px', height: '13px' }} /> Anti-Overcharging Fair-Fare Seal
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.82rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.5)' }}
            >
              <span>Onboard Your Services</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 auto' }}>
          * You can register, update profiles, or switch modes at any time from the top navigation bar.
        </p>
      </div>
    </div>
  );
};
