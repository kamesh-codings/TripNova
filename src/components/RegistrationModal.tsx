import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  HeartPulse, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2
} from 'lucide-react';
import { UserProfile, BloodGroup, TrustedContact } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const ALL_TOP_PICKS = [
  'Heritage & Temples',
  'Hill Stations',
  'Beaches & Coastal Drives',
  'Nature & Waterfalls',
  'Food & Culinary Trails',
  'Adventure & Treks',
  'Wildlife Safaris',
  'Spiritual & Yoga Retreats'
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<UserProfile>(() => ({
    id: userProfile.id || `usr_${Date.now()}`,
    name: userProfile.name || '',
    email: userProfile.email || '',
    googleId: userProfile.googleId || '',
    avatarUrl: userProfile.avatarUrl || '',
    nativeCurrency: userProfile.nativeCurrency || 'INR',
    dob: userProfile.dob || '',
    age: userProfile.age || 0,
    gender: userProfile.gender || 'Male',
    bloodGroup: userProfile.bloodGroup || 'O+',
    allergies: userProfile.allergies || '',
    medicalConditions: userProfile.medicalConditions || '',
    disability: userProfile.disability || '',
    address: userProfile.address || '',
    govtIdType: userProfile.govtIdType || 'Aadhaar Card',
    govtIdNumber: userProfile.govtIdNumber || '',
    govtIdState: userProfile.govtIdState || 'Tamil Nadu (TN), India',
    languagesKnown: userProfile.languagesKnown?.length ? userProfile.languagesKnown : ['English', 'Tamil'],
    trustedContacts: userProfile.trustedContacts?.length ? userProfile.trustedContacts : [
      { id: 'tc1', name: '', relationship: 'Family', phone: '', isPrimary: true }
    ],
    interestedTopPicks: userProfile.interestedTopPicks?.length ? userProfile.interestedTopPicks : ['Heritage & Temples', 'Hill Stations'],
    isRegistered: userProfile.isRegistered || false
  }));

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state whenever modal opens with latest profile
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: userProfile.id || `usr_${Date.now()}`,
        name: userProfile.name || '',
        email: userProfile.email || '',
        googleId: userProfile.googleId || '',
        avatarUrl: userProfile.avatarUrl || '',
        nativeCurrency: userProfile.nativeCurrency || 'INR',
        dob: userProfile.dob || '',
        age: userProfile.age || 0,
        gender: userProfile.gender || 'Male',
        bloodGroup: userProfile.bloodGroup || 'O+',
        allergies: userProfile.allergies || '',
        medicalConditions: userProfile.medicalConditions || '',
        disability: userProfile.disability || '',
        address: userProfile.address || '',
        govtIdType: userProfile.govtIdType || 'Aadhaar Card',
        govtIdNumber: userProfile.govtIdNumber || '',
        govtIdState: userProfile.govtIdState || 'Tamil Nadu (TN), India',
        languagesKnown: userProfile.languagesKnown?.length ? userProfile.languagesKnown : ['English', 'Tamil'],
        trustedContacts: userProfile.trustedContacts?.length ? userProfile.trustedContacts : [
          { id: 'tc1', name: '', relationship: 'Family', phone: '', isPrimary: true }
        ],
        interestedTopPicks: userProfile.interestedTopPicks?.length ? userProfile.interestedTopPicks : ['Heritage & Temples', 'Hill Stations'],
        isRegistered: userProfile.isRegistered || false
      });
      setActiveStep(1);
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleDOBChange = (dob: string) => {
    let calculatedAge = formData.age;
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = Math.max(0, age);
    }
    setFormData(prev => ({ ...prev, dob, age: calculatedAge }));
  };

  const handleContactChange = (index: number, field: keyof TrustedContact, value: any) => {
    const updated = [...formData.trustedContacts];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, trustedContacts: updated }));
  };

  const addContact = () => {
    if (formData.trustedContacts.length < 5) {
      const newContact: TrustedContact = {
        id: `tc_${Date.now()}`,
        name: '',
        relationship: 'Friend',
        phone: ''
      };
      setFormData(prev => ({ ...prev, trustedContacts: [...prev.trustedContacts, newContact] }));
    }
  };

  const removeContact = (index: number) => {
    if (formData.trustedContacts.length > 1) {
      const updated = formData.trustedContacts.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, trustedContacts: updated }));
    }
  };

  const toggleTopPick = (pick: string) => {
    const current = [...formData.interestedTopPicks];
    if (current.includes(pick)) {
      setFormData(prev => ({ ...prev, interestedTopPicks: current.filter(p => p !== pick) }));
    } else {
      setFormData(prev => ({ ...prev, interestedTopPicks: [...current, pick] }));
    }
  };

  const handleLanguageToggle = (lang: string) => {
    const current = [...formData.languagesKnown];
    if (current.includes(lang)) {
      setFormData(prev => ({ ...prev, languagesKnown: current.filter(l => l !== lang) }));
    } else {
      setFormData(prev => ({ ...prev, languagesKnown: [...current, lang] }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...formData, isRegistered: true };
    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', overflowY: 'auto' }}>
      <div className="glass-panel animate-fade" style={{ width: '100%', maxWidth: '720px', background: '#090e17', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Modal Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <User style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Tourist Profile & Safety Registration</h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Essential for your digital Emergency Card and personalized travel picks</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-4" style={{ background: 'rgba(10, 15, 29, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { step: 1, label: '1. Personal Info', icon: User },
            { step: 2, label: '2. Medical & ID', icon: HeartPulse },
            { step: 3, label: '3. 5 Trusted Contacts', icon: PhoneCall },
            { step: 4, label: '4. Top Picks & Language', icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.step}
              type="button"
              onClick={() => setActiveStep(tab.step as any)}
              style={{
                padding: '12px 6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: activeStep === tab.step ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: activeStep === tab.step ? '#38bdf8' : '#94a3b8',
                borderBottom: activeStep === tab.step ? '2px solid #38bdf8' : 'none'
              }}
            >
              <tab.icon style={{ width: '14px', height: '14px' }} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeStep === 1 && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="input-glass"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="input-glass"
                  >
                    <option value="Male" style={{ background: '#090e17' }}>Male</option>
                    <option value="Female" style={{ background: '#090e17' }}>Female</option>
                    <option value="Non-Binary" style={{ background: '#090e17' }}>Non-Binary</option>
                    <option value="Prefer not to say" style={{ background: '#090e17' }}>Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Google Email & Native Currency */}
              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Google / Primary Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. kamesh.travel@gmail.com"
                    className="input-glass"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Native Currency *
                  </label>
                  <select
                    value={formData.nativeCurrency}
                    onChange={e => setFormData({ ...formData, nativeCurrency: e.target.value })}
                    className="input-glass"
                  >
                    <option value="INR" style={{ background: '#090e17' }}>INR - Indian Rupee (₹)</option>
                    <option value="USD" style={{ background: '#090e17' }}>USD - US Dollar ($)</option>
                    <option value="EUR" style={{ background: '#090e17' }}>EUR - Euro (€)</option>
                    <option value="GBP" style={{ background: '#090e17' }}>GBP - British Pound (£)</option>
                    <option value="AED" style={{ background: '#090e17' }}>AED - UAE Dirham (د.إ)</option>
                    <option value="SGD" style={{ background: '#090e17' }}>SGD - Singapore Dollar (S$)</option>
                    <option value="JPY" style={{ background: '#090e17' }}>JPY - Japanese Yen (¥)</option>
                    <option value="AUD" style={{ background: '#090e17' }}>AUD - Australian Dollar (A$)</option>
                    <option value="CAD" style={{ background: '#090e17' }}>CAD - Canadian Dollar (C$)</option>
                    <option value="CHF" style={{ background: '#090e17' }}>CHF - Swiss Franc (Fr)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Date of Birth (DOB) *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={e => handleDOBChange(e.target.value)}
                    className="input-glass"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Calculated Age</label>
                  <input
                    type="number"
                    readOnly
                    value={formData.age || 0}
                    className="input-glass"
                    style={{ background: 'rgba(30, 41, 59, 0.6)', color: '#38bdf8', fontWeight: 800 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Permanent / Hotel Address *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter residential or staying address"
                  className="input-glass"
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Blood Group *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                    className="input-glass"
                    style={{ fontWeight: 800, color: '#f87171' }}
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg} style={{ background: '#090e17' }}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Disability / Special Accommodations</label>
                  <input
                    type="text"
                    value={formData.disability}
                    onChange={e => setFormData({ ...formData, disability: e.target.value })}
                    placeholder="e.g. Wheelchair assistance (or leave blank)"
                    className="input-glass"
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Allergies (Skin, Food, Medication)</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Peanuts, Seafood"
                    className="input-glass"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Pre-existing Medical Conditions</label>
                  <input
                    type="text"
                    value={formData.medicalConditions}
                    onChange={e => setFormData({ ...formData, medicalConditions: e.target.value })}
                    placeholder="e.g. Asthma, Diabetes"
                    className="input-glass"
                  />
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(10, 15, 29, 0.85)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px' }} /> Government-Issued ID Verification
                </span>
                <div className="grid grid-3 gap-2">
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>ID Type</label>
                    <select
                      value={formData.govtIdType}
                      onChange={e => setFormData({ ...formData, govtIdType: e.target.value as any })}
                      className="input-glass"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <option value="Aadhaar Card" style={{ background: '#090e17' }}>Aadhaar Card</option>
                      <option value="Passport" style={{ background: '#090e17' }}>Passport</option>
                      <option value="Driving License" style={{ background: '#090e17' }}>Driving License</option>
                      <option value="Voter ID" style={{ background: '#090e17' }}>Voter ID</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>ID Proof Number</label>
                    <input
                      type="text"
                      value={formData.govtIdNumber}
                      onChange={e => setFormData({ ...formData, govtIdNumber: e.target.value })}
                      placeholder="Enter ID number"
                      className="input-glass"
                      style={{ fontSize: '0.75rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>State / Jurisdiction</label>
                    <input
                      type="text"
                      value={formData.govtIdState}
                      onChange={e => setFormData({ ...formData, govtIdState: e.target.value })}
                      placeholder="Tamil Nadu (TN), India"
                      className="input-glass"
                      style={{ fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <PhoneCall style={{ width: '16px', height: '16px', color: '#f87171' }} />
                    5 Trusted SOS Contacts
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>These beloved contacts will receive your instant GPS SOS alert.</p>
                </div>
                {formData.trustedContacts.length < 5 && (
                  <button
                    type="button"
                    onClick={addContact}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.72rem', color: '#38bdf8' }}
                  >
                    <Plus style={{ width: '14px', height: '14px' }} /> Add Contact ({formData.trustedContacts.length}/5)
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {formData.trustedContacts.map((contact, idx) => (
                  <div key={contact.id || idx} style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.85)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#1e293b', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
                      {idx + 1}
                    </span>
                    <div className="grid grid-3 gap-2" style={{ flex: 1 }}>
                      <input
                        type="text"
                        required
                        value={contact.name}
                        onChange={e => handleContactChange(idx, 'name', e.target.value)}
                        placeholder="Contact Name (e.g. Father/Friend)"
                        className="input-glass"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                      />
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={e => handleContactChange(idx, 'relationship', e.target.value)}
                        placeholder="Relationship (e.g. Sister, Colleague)"
                        className="input-glass"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                      />
                      <input
                        type="tel"
                        required
                        value={contact.phone}
                        onChange={e => handleContactChange(idx, 'phone', e.target.value)}
                        placeholder="Phone Number (+91 ...)"
                        className="input-glass"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                      />
                    </div>
                    {formData.trustedContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(idx)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '6px' }}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', display: 'block', marginBottom: '8px' }}>Languages Known</label>
                <div className="flex flex-wrap gap-1">
                  {['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'French', 'Spanish', 'German', 'Japanese'].map(lang => {
                    const isSelected = formData.languagesKnown.includes(lang);
                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => handleLanguageToggle(lang)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(10, 15, 29, 0.7)',
                          color: isSelected ? '#38bdf8' : '#94a3b8'
                        }}
                      >
                        {isSelected && '✓ '} {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>
                    Interested Top Picks (For Home Page Slides)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{formData.interestedTopPicks.length} Selected</span>
                </div>
                <div className="grid grid-3 gap-2">
                  {ALL_TOP_PICKS.map(pick => {
                    const active = formData.interestedTopPicks.includes(pick);
                    return (
                      <div
                        key={pick}
                        onClick={() => toggleTopPick(pick)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          border: active ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.06)',
                          background: active ? 'rgba(99, 102, 241, 0.2)' : 'rgba(10, 15, 29, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: active ? '#ffffff' : '#94a3b8'
                        }}
                      >
                        <span>{pick}</span>
                        {active && <Check style={{ width: '14px', height: '14px', color: '#38bdf8' }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep((activeStep - 1) as any)}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Back
              </button>
            ) : <div />}

            <div>
              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((activeStep + 1) as any)}
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 24px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
                >
                  {saveSuccess ? (
                    <span className="flex items-center gap-2">
                      <Check style={{ width: '16px', height: '16px' }} /> Profile Saved!
                    </span>
                  ) : (
                    'Save & Activate Profile'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
