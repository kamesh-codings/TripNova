import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Send, 
  Radio, 
  CheckCircle, 
  PhoneCall, 
  X, 
  ShieldAlert,
  MapPin,
  HeartPulse,
  Mail,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Share2
} from 'lucide-react';
import { UserProfile, TrustedContact } from '../types';
import { logSOSEvent } from '../utils/storage';
import { sendSOSEmailAlert, SOSEmergencyResponse } from '../utils/api';
import { reverseGeocodeCoordinates, detectUserCurrentLocation } from '../utils/geoLocator';

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
  const [sosResponse, setSosResponse] = useState<SOSEmergencyResponse | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [liveLocation, setLiveLocation] = useState<{
    latitude?: number | null;
    longitude?: number | null;
    address?: string;
  }>({
    latitude: userProfile.locationCoordinates?.latitude || 13.0827,
    longitude: userProfile.locationCoordinates?.longitude || 80.2707,
    address: userProfile.currentLocation || 'Chennai Tourist Safety Zone, Tamil Nadu'
  });

  // Local editable copy of contacts (up to 5)
  const [editableContacts, setEditableContacts] = useState<TrustedContact[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);
  const [manualLocationText, setManualLocationText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSosSending(false);
      setSosResponse(null);
      setIsEditingLocation(false);
      setManualLocationText('');
      
      // Initialize contacts faithfully from user profile trusted contacts without overwriting
      let contactsList: TrustedContact[] = [];

      if (userProfile.trustedContacts && userProfile.trustedContacts.length > 0) {
        contactsList = userProfile.trustedContacts.slice(0, 5).map((c) => ({
          ...c,
          name: c.name || '',
          relationship: c.relationship || 'Emergency Contact',
          phone: c.phone || '',
          email: c.email && c.email.includes('@') ? c.email.trim() : (c.email || '')
        }));
      } else {
        contactsList = [
          {
            id: 'tc1',
            name: 'Emergency Contact 1',
            relationship: 'Primary Contact',
            phone: '',
            email: '',
            isPrimary: true
          }
        ];
      }

      setEditableContacts(contactsList);

      // Attempt high-accuracy live GPS position grab with real-time reverse geocoding
      const refreshLiveGps = async () => {
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
          setIsDetectingGps(true);
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0 // Force fresh satellite/Wi-Fi fix
              });
            });

            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const geo = await reverseGeocodeCoordinates(lat, lng);

            setLiveLocation({
              latitude: lat,
              longitude: lng,
              address: geo.formattedAddress || `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E (${geo.city})`
            });
          } catch {
            // If GPS is denied or unavailable, use resilient fallback
            try {
              const fallbackLoc = await detectUserCurrentLocation();
              setLiveLocation({
                latitude: fallbackLoc.latitude,
                longitude: fallbackLoc.longitude,
                address: fallbackLoc.formattedAddress
              });
            } catch {
              // keep existing state
            }
          } finally {
            setIsDetectingGps(false);
          }
        }
      };

      refreshLiveGps();
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleContactUpdate = (idx: number, field: keyof TrustedContact, value: string) => {
    const updated = [...editableContacts];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableContacts(updated);
  };

  const handleAddContact = () => {
    if (editableContacts.length < 5) {
      setEditableContacts([
        ...editableContacts,
        {
          id: `tc_${Date.now()}`,
          name: `Contact ${editableContacts.length + 1}`,
          relationship: 'Emergency Contact',
          phone: '',
          email: userProfile.email || ''
        }
      ]);
      setEditingIndex(editableContacts.length);
    }
  };

  const handleRemoveContact = (idx: number) => {
    if (editableContacts.length > 1) {
      setEditableContacts(editableContacts.filter((_, i) => i !== idx));
    }
  };

  // Build direct client mailto URI for instant 1-click sending to trusted contacts only
  const getEmailContent = () => {
    const emailRecipients = editableContacts
      .map(c => c.email?.trim())
      .filter((e): e is string => !!e && e.includes('@'));

    const toStr = emailRecipients.join(',');
    const subject = `🚨 TRIPNOVA EMERGENCY SOS: Immediate Assistance Required for ${userProfile.name || 'Traveler'}`;
    
    // Dynamic Google Maps link: Uses exact typed address/place name or GPS coordinates
    const mapQuery = liveLocation.address && liveLocation.address.trim()
      ? encodeURIComponent(liveLocation.address.trim())
      : (liveLocation.latitude && liveLocation.longitude ? `${liveLocation.latitude},${liveLocation.longitude}` : '');

    const mapLink = mapQuery
      ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
      : 'Location unavailable';

    const bodyText = `🚨 TRIPNOVA EMERGENCY SOS DISTRESS ALERT 🚨
====================================================

${customMessage ? `🚨 EMERGENCY DISTRESS NOTE:
"${customMessage}"
====================================================

` : ''}Hello Emergency Contacts,

Traveler ${userProfile.name || 'A registered user'} has activated an emergency SOS alert and requires immediate assistance.

TRAVELER DETAILS:
- Name: ${userProfile.name || 'Not specified'}
- Registered Email: ${userProfile.email || 'Not specified'}
- Blood Group: ${userProfile.bloodGroup || 'Unknown'}
- Known Allergies: ${userProfile.allergies || 'None'}
- Medical Conditions: ${userProfile.medicalConditions || 'None'}
- Timestamp: ${new Date().toLocaleString()}

LIVE GPS LOCATION:
- Location / Zone: ${liveLocation.address || 'Active Zone'}
${liveLocation.latitude && liveLocation.longitude ? `- Coordinates: ${liveLocation.latitude.toFixed(5)}° N, ${liveLocation.longitude.toFixed(5)}° E\n` : ''}- Google Maps Link: ${mapLink}

NATIONAL EMERGENCY HELPLINES (INDIA):
- National Emergency: 112
- Police: 100
- Ambulance: 108
- Women Safety: 1091

====================================================
TripNova Tourism Safety & Navigation Platform`;

    return { toStr, subject, bodyText };
  };

  const buildMailtoUri = () => {
    const { toStr, subject, bodyText } = getEmailContent();
    return `mailto:${toStr}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };

  const buildGmailWebUri = () => {
    const { toStr, subject, bodyText } = getEmailContent();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toStr)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };

  const handleTriggerSOSNow = async () => {
    setSosSending(true);
    setSosResponse(null);

    const payload = {
      user_id: userProfile.id || 'usr_guest_01',
      traveler: {
        id: userProfile.id,
        name: userProfile.name || 'Registered Traveler',
        phone: userProfile.govtIdNumber ? `${userProfile.name} (Traveler)` : '',
        email: userProfile.email || '',
        bloodGroup: userProfile.bloodGroup || 'Unknown',
        allergies: userProfile.allergies || 'None reported',
        medicalConditions: userProfile.medicalConditions || 'None reported'
      },
      location: {
        latitude: liveLocation.latitude,
        longitude: liveLocation.longitude,
        address: liveLocation.address
      },
      contacts: editableContacts.map(c => ({
        name: c.name || 'Emergency Contact',
        email: c.email || '',
        phone: c.phone || '',
        relationship: c.relationship || 'Contact'
      })),
      customMessage: customMessage.trim() || 'Urgent distress beacon activated from TripNova.'
    };

    const response = await sendSOSEmailAlert(payload);
    
    setSosSending(false);
    setSosResponse(response);

    // Record local storage audit log
    logSOSEvent({
      timestamp: new Date().toLocaleString(),
      location: liveLocation.address || `${liveLocation.latitude}° N, ${liveLocation.longitude}° E`,
      note: `Distress alert broadcasted to ${response.totalContacts} contacts. Sent: ${response.successfulSends}, Failed: ${response.failedSends}.`
    });
  };

  const handleClose = () => {
    setSosSending(false);
    setSosResponse(null);
    setEditingIndex(null);
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
        if (e.target === e.currentTarget && !sosSending) handleClose();
      }}
    >
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '560px', 
          maxHeight: 'min(94vh, 740px)',
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
          disabled={sosSending}
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
            EMERGENCY SOS EMAIL BROADCAST
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
            Sends your live GPS coordinates, medical pass, and emergency distress beacon directly to your registered email and trusted contacts.
          </p>
        </div>

        {/* Traveler Summary Notice */}
        {userProfile.email && (
          <div style={{
            padding: '8px 12px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem'
          }}>
            <span style={{ color: '#94a3b8' }}>Registered User Email:</span>
            <span style={{ color: '#38bdf8', fontWeight: 800 }}>{userProfile.email}</span>
          </div>
        )}

        {/* RECIPIENTS SECTION */}
        <div style={{ 
          padding: '14px', 
          background: 'rgba(15, 23, 42, 0.9)', 
          borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.08)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px' 
        }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail style={{ width: '13px', height: '13px' }} />
              {editableContacts.length} Trusted Email Recipients (Max 5):
            </span>
            {editableContacts.length < 5 && !sosResponse && (
              <button
                type="button"
                onClick={handleAddContact}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus style={{ width: '12px', height: '12px' }} /> Add Contact
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {editableContacts.map((c, i) => (
              <div 
                key={c.id || i}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: '#1e293b',
                  border: i === 0 ? '1px solid rgba(248, 113, 113, 0.4)' : '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: i === 0 ? '#f87171' : '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                      #{i + 1} {i === 0 ? 'Primary' : ''}
                    </span>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#ffffff' }}>
                      {c.name || `Contact ${i + 1}`}
                    </span>
                    {c.phone && <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({c.phone})</span>}
                  </div>
                  {!sosResponse && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingIndex(editingIndex === i ? null : i)}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                        title="Edit email"
                      >
                        <Edit2 style={{ width: '12px', height: '12px' }} />
                      </button>
                      {editableContacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(i)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                          title="Remove"
                        >
                          <Trash2 style={{ width: '12px', height: '12px' }} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {editingIndex === i && !sosResponse ? (
                  <div className="grid grid-2 gap-2" style={{ marginTop: '4px' }}>
                    <input
                      type="text"
                      value={c.name}
                      onChange={e => handleContactUpdate(i, 'name', e.target.value)}
                      placeholder="Contact Name"
                      className="input-glass"
                      style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                    />
                    <input
                      type="email"
                      value={c.email || ''}
                      onChange={e => handleContactUpdate(i, 'email', e.target.value)}
                      placeholder="email@example.com"
                      className="input-glass"
                      style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                    />
                  </div>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: c.email ? '#38bdf8' : '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail style={{ width: '11px', height: '11px' }} />
                    <span>{c.email || '⚠️ No email specified (click edit to add)'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live Coordinates & Manual Place Bar */}
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#38bdf8' }}>
                <Radio style={{ width: '14px', height: '14px', color: '#38bdf8', flexShrink: 0 }} />
                <span>{isDetectingGps ? '🛰️ Acquiring Satellites...' : isEditingLocation ? '✏️ Custom Location Mode' : '📍 Live Location / Zone'}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!isEditingLocation) {
                      setManualLocationText(liveLocation.address || '');
                    }
                    setIsEditingLocation(!isEditingLocation);
                  }}
                  style={{
                    background: isEditingLocation ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: '6px',
                    color: '#fbbf24',
                    padding: '2px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Type your location or landmark manually"
                >
                  <Edit2 style={{ width: '10px', height: '10px' }} />
                  <span>{isEditingLocation ? 'Done Editing' : '✏️ Type Location'}</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
                      setIsDetectingGps(true);
                      try {
                        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                          navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                          });
                        });
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        const geo = await reverseGeocodeCoordinates(lat, lng);
                        setLiveLocation({
                          latitude: lat,
                          longitude: lng,
                          address: geo.formattedAddress || `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`
                        });
                        setIsEditingLocation(false);
                      } catch {
                        // ignore
                      } finally {
                        setIsDetectingGps(false);
                      }
                    }
                  }}
                  disabled={isDetectingGps}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '6px',
                    color: '#38bdf8',
                    padding: '2px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Force fresh GPS detection"
                >
                  <MapPin style={{ width: '10px', height: '10px' }} />
                  <span>{isDetectingGps ? 'Acquiring...' : '🎯 Re-Detect GPS'}</span>
                </button>
              </div>
            </div>
            
            {isEditingLocation ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <label style={{ fontSize: '0.66rem', color: '#fbbf24', fontWeight: 700 }}>
                  Enter Exact Landmark, Street, or City for Google Maps Link:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={manualLocationText}
                    onChange={(e) => {
                      setManualLocationText(e.target.value);
                      setLiveLocation(prev => ({
                        ...prev,
                        address: e.target.value
                      }));
                    }}
                    placeholder="e.g. Marina Beach Light House / Hotel Green Park, Vadapalani / Ooty Lake"
                    className="input-glass"
                    style={{ fontSize: '0.74rem', padding: '5px 8px', flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingLocation(false)}
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.7rem', fontWeight: 800 }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: '#ffffff', background: 'rgba(0,0,0,0.3)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.74rem' }}>
                  📍 {liveLocation.address || 'Resolving location...'}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.68rem', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    {liveLocation.latitude && liveLocation.longitude 
                      ? `Coordinates: ${liveLocation.latitude.toFixed(5)}° N, ${liveLocation.longitude.toFixed(5)}° E` 
                      : 'Place: Manually Specified'}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(liveLocation.address || `${liveLocation.latitude},${liveLocation.longitude}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#34d399', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <span>Google Maps Link</span>
                    <ExternalLink style={{ width: '9px', height: '9px' }} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {userProfile.bloodGroup && (
            <div style={{ fontSize: '0.7rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HeartPulse style={{ width: '13px', height: '13px', flexShrink: 0 }} />
              <span>Medical Pass: Blood Group <strong>{userProfile.bloodGroup}</strong> {userProfile.allergies ? `| Allergies: ${userProfile.allergies}` : ''}</span>
            </div>
          )}
        </div>

        {/* Custom Emergency Note Input (Optional) */}
        {!sosResponse && (
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Emergency Distress Note (Optional):
            </label>
            <input
              type="text"
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              placeholder="e.g. Lost in forest trail / medical emergency / immediate pickup needed"
              className="input-glass"
              style={{ fontSize: '0.78rem', padding: '8px 12px' }}
            />
          </div>
        )}

        {/* RESPONSE & OUTCOME REPORT SECTION */}
        {sosResponse ? (
          <div style={{ 
            padding: '16px', 
            background: sosResponse.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
            border: sosResponse.success ? '1px solid #10b981' : '1px solid #ef4444', 
            borderRadius: '16px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}>
            <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
              {sosResponse.success ? (
                <CheckCircle style={{ width: '28px', height: '28px', color: '#34d399' }} />
              ) : (
                <AlertTriangle style={{ width: '28px', height: '28px', color: '#f87171' }} />
              )}
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {sosResponse.success ? 'SOS Emergency Email Alerts Dispatched!' : 'SOS Broadcast Notice'}
              </h4>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, textAlign: 'center', lineHeight: 1.4 }}>
              {sosResponse.message}
            </p>

            {/* Individual Delivery Breakdown */}
            {sosResponse.results && sosResponse.results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Delivery Status ({sosResponse.successfulSends}/{sosResponse.totalContacts} Sent):
                </span>
                {sosResponse.results.map((r, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: '8px 10px', 
                      borderRadius: '8px', 
                      background: 'rgba(0,0,0,0.4)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      fontSize: '0.72rem' 
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>{r.name}</span>
                      <span style={{ color: '#94a3b8', marginLeft: '6px' }}>({r.email})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {r.status === 'sent' ? (
                        <span style={{ color: '#34d399', fontWeight: 800 }}>✓ Sent</span>
                      ) : (
                        <span style={{ color: '#f87171', fontWeight: 800 }}>✗ {r.error || 'Failed'}</span>
                      )}

                      {r.previewUrl && (
                        <a
                          href={r.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: '#0284c7',
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}
                        >
                          <span>Preview Mail</span>
                          <ExternalLink style={{ width: '10px', height: '10px' }} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Direct 1-Click Native Send via User's Email App */}
            <div style={{ padding: '12px', background: 'rgba(2, 132, 199, 0.2)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)', marginTop: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#bae6fd', display: 'block', marginBottom: '8px', textAlign: 'center', fontWeight: 600 }}>
                Also send directly from your personal Gmail or local Mail app:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <a
                  href={buildGmailWebUri()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    padding: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #ea4335 0%, #c5221f 100%)'
                  }}
                >
                  <Mail style={{ width: '13px', height: '13px' }} />
                  <span>🌐 Open in Web Gmail</span>
                </a>

                <a
                  href={buildMailtoUri()}
                  className="btn-primary"
                  style={{
                    padding: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)'
                  }}
                >
                  <Mail style={{ width: '13px', height: '13px' }} />
                  <span>📱 Open in Mail App</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2" style={{ marginTop: '8px' }}>
              <a
                href="tel:112"
                className="btn-sos"
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
                }}
              >
                <PhoneCall style={{ width: '14px', height: '14px' }} />
                Direct Dial 112
              </a>

              <button
                onClick={handleClose}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.82rem', fontWeight: 700, justifyContent: 'center' }}
              >
                Close SOS Radar
              </button>
            </div>
          </div>
        ) : (
          /* ACTION SECTION (CONFIRM / TRANSMITTING) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleTriggerSOSNow}
              disabled={sosSending}
              className="btn-sos"
              style={{ 
                width: '100%', 
                padding: '14px', 
                fontSize: '0.94rem',
                fontWeight: 900,
                letterSpacing: '0.02em',
                boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {sosSending ? (
                <>
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  <span>TRANSMITTING SOS TO {editableContacts.length} CONTACTS...</span>
                </>
              ) : (
                <>
                  <Send style={{ width: '18px', height: '18px' }} />
                  <span>CONFIRM & BROADCAST SOS VIA SERVER</span>
                </>
              )}
            </button>

            {/* Direct One-Click Send via User's Email Client */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a
                href={buildGmailWebUri()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ 
                  padding: '10px 8px', 
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #ea4335 0%, #c5221f 100%)',
                  borderColor: '#fca5a5'
                }}
              >
                <Mail style={{ width: '15px', height: '15px' }} />
                <span>🌐 Open in Web Gmail</span>
              </a>

              <a
                href={buildMailtoUri()}
                className="btn-primary"
                style={{ 
                  padding: '10px 8px', 
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
                  borderColor: '#38bdf8'
                }}
              >
                <Mail style={{ width: '15px', height: '15px' }} />
                <span>📱 Open in Mail App</span>
              </a>
            </div>

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
                disabled={sosSending}
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
