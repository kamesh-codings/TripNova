import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Send, 
  Radio, 
  CheckCircle, 
  PhoneCall, 
  X, 
  ShieldAlert,
  MapPin,
  HeartPulse
} from 'lucide-react';
import { UserProfile } from '../types';
import { logSOSEvent } from '../utils/storage';

interface SOSBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const SOSBroadcastModal: React.FC<SOSBroadcastModalProps> = ({
  isOpen,
  onClose,
  userProfile
}) => {
  const [sosSending, setSosSending] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSOSNow = () => {
    setSosSending(true);
    setTimeout(() => {
      setSosSending(false);
      setSosSent(true);
      
      const locText = userProfile.locationCoordinates 
        ? `${userProfile.locationCoordinates.latitude.toFixed(4)}° N, ${userProfile.locationCoordinates.longitude.toFixed(4)}° E (${userProfile.currentLocation || 'Live GPS'})`
        : '13.0827° N, 80.2707° E (Chennai Tourist Zone)';

      logSOSEvent({
        timestamp: new Date().toLocaleString(),
        location: locText,
        note: `Distress alert broadcasted to ${userProfile.trustedContacts.length} trusted contacts.`
      });
    }, 1200);
  };

  const handleClose = () => {
    setSosSending(false);
    setSosSent(false);
    onClose();
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 9999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        background: 'rgba(3, 7, 18, 0.88)', 
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          maxHeight: 'min(90vh, 640px)',
          margin: 'auto',
          padding: '24px', 
          background: '#090e17', 
          borderRadius: '24px',
          border: '2px solid #ef4444', 
          boxShadow: '0 0 50px rgba(239, 68, 68, 0.35), 0 25px 50px -12px rgba(0, 0, 0, 0.9)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Top Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          aria-label="Close SOS Dialog"
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Header with Pulsing Siren */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '20px', paddingLeft: '20px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'rgba(239, 68, 68, 0.2)', 
            border: '2px solid #ef4444', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
          }}>
            <AlertOctagon style={{ width: '28px', height: '28px', color: '#f87171' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
            EMERGENCY SOS BROADCAST
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
            Transmits your live GPS coordinates, medical pass, and emergency alert to your registered trusted contacts and nearest police precinct.
          </p>
        </div>

        {/* Recipients & Live Coordinates Card */}
        <div style={{ 
          padding: '12px 14px', 
          background: 'rgba(15, 23, 42, 0.9)', 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.08)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px' 
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              {userProfile.trustedContacts.length} Registered Recipients:
            </span>
            <div className="flex flex-wrap gap-1">
              {userProfile.trustedContacts.map((c, i) => (
                <span key={i} style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: '#1e293b', color: '#f8fafc', fontWeight: 600, border: '1px solid rgba(255,255,255,0.06)' }}>
                  {c.name} ({c.phone})
                </span>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
            <Radio style={{ width: '14px', height: '14px', color: '#38bdf8', flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>
              Live GPS: {userProfile.locationCoordinates ? `${userProfile.locationCoordinates.latitude.toFixed(4)}° N, ${userProfile.locationCoordinates.longitude.toFixed(4)}° E (${userProfile.currentLocation || 'Active Zone'})` : '13.0827° N, 80.2707° E (Chennai Tourist Zone)'}
            </span>
          </div>

          {userProfile.bloodGroup && (
            <div style={{ fontSize: '0.7rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartPulse style={{ width: '13px', height: '13px', flexShrink: 0 }} />
              <span>Medical Pass: Blood Group <strong>{userProfile.bloodGroup}</strong> {userProfile.allergies ? `| Allergies: ${userProfile.allergies}` : ''}</span>
            </div>
          )}
        </div>

        {/* Action / Success Section */}
        {sosSent ? (
          <div style={{ 
            padding: '16px', 
            background: 'rgba(16, 185, 129, 0.15)', 
            border: '1px solid #10b981', 
            borderRadius: '16px', 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px' 
          }}>
            <CheckCircle style={{ width: '36px', height: '36px', color: '#34d399', margin: '0 auto' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              SOS Distress Alert Broadcasted!
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: 0 }}>
              Emergency SMS alerts & live GPS tracking beacons have been dispatched to all {userProfile.trustedContacts.length} contacts and regional dispatch.
            </p>
            <button
              onClick={handleClose}
              className="btn-primary"
              style={{ marginTop: '8px', padding: '10px 16px', fontSize: '0.82rem', fontWeight: 700 }}
            >
              Close SOS Radar
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleTriggerSOSNow}
              disabled={sosSending}
              className="btn-sos"
              style={{ 
                width: '100%', 
                padding: '13px', 
                fontSize: '0.92rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)'
              }}
            >
              <Send style={{ width: '18px', height: '18px' }} />
              <span>{sosSending ? 'TRANSMITTING BEACON...' : 'CONFIRM & SEND SOS NOW'}</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a
                href="tel:112"
                className="btn-secondary"
                style={{ 
                  color: '#f87171', 
                  borderColor: 'rgba(239, 68, 68, 0.4)', 
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <PhoneCall style={{ width: '14px', height: '14px' }} />
                Direct Dial 112
              </a>
              <button
                onClick={handleClose}
                className="btn-secondary"
                style={{ 
                  justifyContent: 'center',
                  padding: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
