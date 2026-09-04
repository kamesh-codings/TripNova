import React from 'react';
import { 
  Compass, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  Languages, 
  HeartPulse, 
  ArrowRight,
  Bot
} from 'lucide-react';

interface WelcomeGatewayProps {
  isOpen: boolean;
  onSelectRegister: () => void;
  onSelectExplore: () => void;
}

export const WelcomeGateway: React.FC<WelcomeGatewayProps> = ({
  isOpen,
  onSelectRegister,
  onSelectExplore
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
        maxWidth: '820px',
        padding: '36px 28px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: '28px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--gradient-brand)',
            padding: '3px',
            boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#090e17',
              borderRadius: '17px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass style={{ width: '32px', height: '32px', color: '#38bdf8' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Welcome to <span className="text-gradient">TripNova</span>
              </h1>
              <span className="badge badge-blue">AI Travel Companion</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '520px', margin: '6px auto 0' }}>
              How would you like to begin your journey today?
            </p>
          </div>
        </div>

        {/* 2 Main Choice Cards: Register vs Explore */}
        <div className="grid grid-2 gap-5" style={{ textAlign: 'left' }}>
          {/* Choice 1: Register Tourist Profile */}
          <div 
            onClick={onSelectRegister}
            style={{
              padding: '24px',
              borderRadius: '22px',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '2px solid #38bdf8',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px',
              boxShadow: '0 12px 30px rgba(56, 189, 248, 0.2)',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <UserPlus style={{ width: '24px', height: '24px' }} />
                </div>
                <span className="badge badge-green">Recommended</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Register Tourist Profile
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Enter your personal details, blood group, allergies, government ID, and 5 trusted emergency contacts.
              </p>

              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <CreditCard style={{ width: '14px', height: '14px' }} /> Unlocks Digital Emergency Card
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <ShieldCheck style={{ width: '14px', height: '14px' }} /> 5 SOS Emergency Contact Dispatch
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <Sparkles style={{ width: '14px', height: '14px' }} /> Personalized Itinerary Planner
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
            >
              <span>Create Tourist ID & Register</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Choice 2: Explore Mode */}
          <div 
            onClick={onSelectExplore}
            style={{
              padding: '24px',
              borderRadius: '22px',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px',
              transition: 'all 0.25s'
            }}
            className="glass-panel-hover"
          >
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc'
                }}>
                  <Compass style={{ width: '24px', height: '24px' }} />
                </div>
                <span className="badge badge-purple">Guest Mode</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
                Navigation to Explore
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Browse the application freely. Test travel tools, Fare Guard, weather reports, and chat with Nova AI.
              </p>

              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign style={{ width: '14px', height: '14px', color: '#34d399' }} /> Live Currency Converter & Timezones
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Languages style={{ width: '14px', height: '14px', color: '#38bdf8' }} /> Voice-to-Text Translator & Rules
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bot style={{ width: '14px', height: '14px', color: '#c084fc' }} /> 24/7 Nova AI Travel Concierge
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', padding: '12px', fontSize: '0.88rem', color: '#c084fc' }}
            >
              <span>Explore As Guest</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 auto' }}>
          * You can switch between Explore Mode and Full Tourist Registration at any time from the top bar.
        </p>
      </div>
    </div>
  );
};
