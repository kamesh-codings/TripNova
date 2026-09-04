import React, { useState } from 'react';
import { 
  User, 
  HeartPulse, 
  ShieldCheck, 
  PhoneCall, 
  Edit3, 
  CreditCard, 
  Sparkles, 
  Trash2, 
  AlertTriangle, 
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  onNavigateTab: (tab: string) => void;
  onDeleteProfile: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onEditProfile,
  onNavigateTab,
  onDeleteProfile
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1024px', margin: '0 auto' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div className="flex items-center gap-4">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--gradient-brand)',
            padding: '3px',
            boxShadow: '0 8px 24px rgba(56, 189, 248, 0.35)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#090e17',
              borderRadius: '17px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#38bdf8'
            }}>
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User style={{ width: '28px', height: '28px' }} />}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
                {userProfile.name || 'Unnamed Tourist'}
              </h2>
              <span className={`badge ${userProfile.isRegistered ? 'badge-green' : 'badge-amber'}`}>
                {userProfile.isRegistered ? 'Verified Profile' : 'Unregistered / Guest'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
              {userProfile.address || 'Address not specified'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onEditProfile}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.82rem' }}
          >
            <Edit3 style={{ width: '15px', height: '15px' }} />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => onNavigateTab('emergency-card')}
            className="btn-secondary"
            style={{ padding: '9px 14px', fontSize: '0.82rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <CreditCard style={{ width: '15px', height: '15px' }} />
            <span>Safety Pass</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-secondary"
            style={{ padding: '9px 14px', fontSize: '0.82rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}
            title="Delete Tourist Profile"
          >
            <Trash2 style={{ width: '15px', height: '15px' }} />
            <span>Delete Profile</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)'
        }} className="animate-fade">
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '460px',
            padding: '24px',
            background: '#090e17',
            border: '2px solid rgba(239, 68, 68, 0.6)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid #ef4444',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171'
            }}>
              <Trash2 style={{ width: '28px', height: '28px' }} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>Delete Tourist Profile?</h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.5 }}>
                This will permanently remove your personal records, registered medical allergies, government ID data, and 5 trusted contacts from this device and return you to Explore Mode.
              </p>
            </div>

            <div className="grid grid-2 gap-3" style={{ marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteProfile();
                }}
                className="btn-sos"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
              >
                Yes, Delete Profile
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid grid-12 gap-5">
        {/* Left 7 cols: Personal & Medical Information */}
        <div className="col-span-7 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Personal & ID Dossier */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              Personal & Identification Records
            </h3>

            <div className="grid grid-3 gap-3">
              <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Date of Birth</span>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{userProfile.dob || 'Not provided'}</strong>
              </div>
              <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Age / Gender</span>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{userProfile.age || 0} yrs • {userProfile.gender}</strong>
              </div>
              <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>ID Document</span>
                <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{userProfile.govtIdType}</strong>
              </div>
            </div>

            <div style={{ padding: '12px 14px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Document Number & Jurisdiction:</span>
              <div className="flex items-center justify-between" style={{ marginTop: '4px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                  {userProfile.govtIdNumber || 'No ID Number entered'}
                </span>
                <span className="badge badge-blue">{userProfile.govtIdState}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Languages Known:</span>
              <div className="flex flex-wrap gap-1">
                {userProfile.languagesKnown && userProfile.languagesKnown.length > 0 ? (
                  userProfile.languagesKnown.map(lang => (
                    <span key={lang} className="badge badge-blue">{lang}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>None selected</span>
                )}
              </div>
            </div>
          </div>

          {/* Medical & Allergies */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse style={{ width: '18px', height: '18px', color: '#f87171' }} />
              Medical Vitals & First Responder Triage
            </h3>

            <div className="grid grid-2 gap-3">
              <div style={{ padding: '14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 800, color: '#fca5a5', display: 'block' }}>Blood Group</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>{userProfile.bloodGroup}</span>
              </div>
              <div style={{ padding: '14px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Disability / Special Care</span>
                <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{userProfile.disability || 'None reported'}</strong>
              </div>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertTriangle style={{ width: '18px', height: '18px', color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.78rem', color: '#fef08a', display: 'block' }}>Allergies:</strong>
                <span style={{ fontSize: '0.78rem', color: '#fef9c3' }}>{userProfile.allergies || 'None reported'}</span>
              </div>
            </div>

            {userProfile.medicalConditions && (
              <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Info style={{ width: '18px', height: '18px', color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '0.78rem', color: '#bae6fd', display: 'block' }}>Medical Conditions:</strong>
                  <span style={{ fontSize: '0.78rem', color: '#e0f2fe' }}>{userProfile.medicalConditions}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 cols: 5 Emergency Contacts & Top Picks */}
        <div className="col-span-5 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 5 Trusted Contacts */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall style={{ width: '18px', height: '18px', color: '#f87171' }} />
                5 SOS Emergency Contacts
              </h3>
              <span className="badge badge-red">{userProfile.trustedContacts.length} Contacts</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userProfile.trustedContacts && userProfile.trustedContacts.length > 0 ? (
                userProfile.trustedContacts.map((c, i) => (
                  <div 
                    key={c.id || i}
                    style={{
                      padding: '10px 12px',
                      background: 'rgba(10, 15, 29, 0.8)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#ffffff', display: 'block' }}>{c.name || `Contact ${i + 1}`}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>({c.relationship || 'Emergency Contact'})</span>
                    </div>
                    {c.phone ? (
                      <a href={`tel:${c.phone}`} style={{ color: '#34d399', fontWeight: 800, textDecoration: 'none' }}>
                        {c.phone}
                      </a>
                    ) : (
                      <span style={{ color: '#64748b' }}>No phone</span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
                  No emergency contacts registered yet.
                </div>
              )}
            </div>

            <button
              onClick={onEditProfile}
              className="btn-secondary"
              style={{ width: '100%', padding: '8px', fontSize: '0.78rem', justifyContent: 'center' }}
            >
              <Edit3 style={{ width: '14px', height: '14px' }} /> Update Emergency Contacts
            </button>
          </div>

          {/* Travel Top Picks */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              Travel Preferences & Top Picks
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {userProfile.interestedTopPicks && userProfile.interestedTopPicks.length > 0 ? (
                userProfile.interestedTopPicks.map(pick => (
                  <span key={pick} className="badge badge-purple">{pick}</span>
                ))
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No preferences selected</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
