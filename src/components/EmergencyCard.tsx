import React, { useState } from 'react';
import { 
  HeartPulse, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  PhoneCall, 
  Share2, 
  QrCode, 
  AlertTriangle, 
  Languages, 
  Check, 
  Info,
  Play
} from 'lucide-react';
import { UserProfile, EmergencyPhrase } from '../types';
import { EMERGENCY_PHRASES } from '../data/mockData';
import { speakPhrase, stopSpeech } from '../utils/speech';

interface EmergencyCardProps {
  userProfile: UserProfile;
  onOpenRegister: () => void;
  onTriggerSOS: () => void;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  userProfile,
  onOpenRegister,
  onTriggerSOS
}) => {
  const [selectedTargetLang, setSelectedTargetLang] = useState<'Tamil' | 'Hindi' | 'English' | 'French' | 'Spanish'>('Tamil');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePlayAudio = (phrase: EmergencyPhrase) => {
    stopSpeech();
    let textToSpeak = phrase.english;
    if (selectedTargetLang === 'Tamil') textToSpeak = phrase.tamil;
    else if (selectedTargetLang === 'Hindi') textToSpeak = phrase.hindi;
    else if (selectedTargetLang === 'French') textToSpeak = phrase.french;
    else if (selectedTargetLang === 'Spanish') textToSpeak = phrase.spanish;

    setCurrentlyPlayingId(phrase.id);
    speakPhrase(textToSpeak, selectedTargetLang, () => {
      setCurrentlyPlayingId(null);
    });
  };

  const handleStopAudio = () => {
    stopSpeech();
    setCurrentlyPlayingId(null);
  };

  const copyEmergencyInfo = () => {
    const text = `EMERGENCY TOURIST PASS - TRIPNOVA
Name: ${userProfile.name}
Blood Group: ${userProfile.bloodGroup}
Age: ${userProfile.age} | Gender: ${userProfile.gender}
Allergies: ${userProfile.allergies || 'None'}
Medical: ${userProfile.medicalConditions || 'None'}
Emergency Contacts:
${userProfile.trustedContacts.map((c, i) => `${i + 1}. ${c.name} (${c.relationship}): ${c.phone}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Notice */}
      <div className="glass-panel" style={{ 
        padding: '16px 20px', 
        background: 'linear-gradient(90deg, rgba(136, 19, 55, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderColor: 'rgba(244, 63, 94, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <HeartPulse style={{ width: '22px', height: '22px', color: '#f87171' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Digital Tourist Emergency Card & Voice Communicator
              <span className="badge badge-red">Offline Ready</span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              Show this pass to paramedics, police, or locals. Tap phrases below to play instant translated voice commands.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onTriggerSOS}
            className="btn-sos"
            style={{ padding: '7px 16px', fontSize: '0.78rem', fontWeight: 800 }}
          >
            <ShieldAlert style={{ width: '15px', height: '15px' }} />
            <span>🚨 Broadcast SOS</span>
          </button>
          <button
            onClick={copyEmergencyInfo}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.78rem' }}
          >
            {copied ? <Check style={{ width: '14px', height: '14px', color: '#34d399' }} /> : <Share2 style={{ width: '14px', height: '14px' }} />}
            <span>{copied ? 'Copied!' : 'Share Pass'}</span>
          </button>
          <button
            onClick={onOpenRegister}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.78rem', color: '#38bdf8' }}
          >
            Edit Medical Data
          </button>
        </div>
      </div>

      {/* Main Digital ID Badge & Audio Broadcaster */}
      <div className="grid grid-12 gap-5">
        {/* Left 7 cols: The Emergency ID Card */}
        <div className="col-span-7 lg-col-span-12">
          <div className="glass-panel" style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(88, 28, 28, 0.3) 100%)',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
          }}>
            {/* Header of Pass */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <div className="flex items-center gap-2">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: '#f87171', fontFamily: 'monospace' }}>
                    OFFICIAL TOURIST SAFETY PASS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
                  {userProfile.name || 'Tourist Guest'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  ID: <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>{userProfile.govtIdType} ({userProfile.govtIdNumber || 'TN-VERIFIED'})</span>
                </p>
              </div>

              <div style={{ padding: '8px', background: '#ffffff', borderRadius: '12px' }}>
                <div style={{ width: '56px', height: '56px', background: '#090e17', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode style={{ width: '32px', height: '32px', color: '#38bdf8' }} />
                  <span style={{ fontSize: '7px', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 700 }}>SCAN SOS</span>
                </div>
              </div>
            </div>

            {/* Key Vitals Grid */}
            <div className="grid grid-4 gap-2" style={{ marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#fca5a5', display: 'block' }}>Blood Group</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>{userProfile.bloodGroup}</span>
              </div>
              <div style={{ padding: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8', display: 'block' }}>Age / Gender</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>{userProfile.age} yrs • {userProfile.gender.charAt(0)}</span>
              </div>
              <div style={{ padding: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8', display: 'block' }}>Origin State</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {userProfile.govtIdState || 'Tamil Nadu'}
                </span>
              </div>
              <div style={{ padding: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: '#94a3b8', display: 'block' }}>Languages</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {userProfile.languagesKnown.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>

            {/* Medical Alerts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle style={{ width: '18px', height: '18px', color: '#fbbf24', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fef08a' }}>Allergies & Reactions: </span>
                  <span style={{ fontSize: '0.78rem', color: '#fef9c3', fontWeight: 600 }}>{userProfile.allergies || 'None reported'}</span>
                </div>
              </div>

              {userProfile.medicalConditions && (
                <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Info style={{ width: '18px', height: '18px', color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#bae6fd' }}>Medical Conditions: </span>
                    <span style={{ fontSize: '0.78rem', color: '#e0f2fe', fontWeight: 600 }}>{userProfile.medicalConditions}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 5 Trusted Contacts */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
                  Emergency Contacts Reachable:
                </span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
                  {userProfile.trustedContacts.length} Registered
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {userProfile.trustedContacts.map((contact, idx) => (
                  <div 
                    key={contact.id || idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(10, 15, 29, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1e293b', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '10px' }}>
                        {idx + 1}
                      </span>
                      <strong style={{ color: '#ffffff' }}>{contact.name}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>({contact.relationship})</span>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`}
                      style={{ color: '#34d399', fontWeight: 800, fontFamily: 'monospace', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <PhoneCall style={{ width: '13px', height: '13px' }} />
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Emergency Audio Broadcast Station */}
        <div className="col-span-5 lg-col-span-12">
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <div className="flex items-center gap-2">
                <Volume2 style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Emergency Voice Broadcaster</h3>
              </div>
              {currentlyPlayingId && (
                <button
                  onClick={handleStopAudio}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                >
                  <VolumeX style={{ width: '14px', height: '14px' }} /> Stop
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '14px' }}>
              Tap any emergency phrase below to immediately speak it aloud in the destination language.
            </p>

            {/* Destination Language Selector */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Languages style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                Target Broadcast Language:
              </label>
              <div className="grid grid-3 gap-1">
                {(['Tamil', 'Hindi', 'English', 'French', 'Spanish'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedTargetLang(lang)}
                    className="btn-secondary"
                    style={{
                      padding: '6px 8px',
                      fontSize: '0.75rem',
                      background: selectedTargetLang === lang ? 'rgba(56, 189, 248, 0.2)' : 'rgba(10, 15, 29, 0.7)',
                      borderColor: selectedTargetLang === lang ? '#38bdf8' : 'rgba(255,255,255,0.08)',
                      color: selectedTargetLang === lang ? '#38bdf8' : '#94a3b8'
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Phrases List with Voice Trigger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {EMERGENCY_PHRASES.map(phrase => {
                const isPlaying = currentlyPlayingId === phrase.id;
                let localizedText = phrase.english;
                if (selectedTargetLang === 'Tamil') localizedText = phrase.tamil;
                else if (selectedTargetLang === 'Hindi') localizedText = phrase.hindi;
                else if (selectedTargetLang === 'French') localizedText = phrase.french;
                else if (selectedTargetLang === 'Spanish') localizedText = phrase.spanish;

                return (
                  <div
                    key={phrase.id}
                    onClick={() => handlePlayAudio(phrase)}
                    style={{
                      padding: '12px',
                      borderRadius: '14px',
                      border: isPlaying ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                      background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(10, 15, 29, 0.75)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>{phrase.english}</p>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#38bdf8' }}>{localizedText}</p>
                    </div>
                    <button
                      type="button"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isPlaying ? '#ef4444' : 'rgba(56, 189, 248, 0.2)',
                        color: isPlaying ? '#ffffff' : '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}
                    >
                      {isPlaying ? <Volume2 style={{ width: '16px', height: '16px' }} /> : <Play style={{ width: '16px', height: '16px', fill: 'currentColor' }} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
