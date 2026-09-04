import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Car, 
  Compass, 
  Building2, 
  HeartPulse, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  PhoneCall, 
  FileText, 
  Sparkles,
  QrCode,
  MapPin,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { 
  ServiceProviderProfile, 
  ProviderCategory, 
  TransportProviderDetails, 
  TourGuideDetails, 
  HomestayDetails, 
  EmergencyMedicalDetails, 
  RentalAgencyDetails 
} from '../types';

interface ServiceProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProviderProfile: (profile: ServiceProviderProfile) => void;
  existingProfile?: ServiceProviderProfile | null;
}

const CATEGORIES: { id: ProviderCategory; title: string; subtitle: string; icon: any; color: string; badge: string }[] = [
  {
    id: 'transport',
    title: 'Transport & Drivers',
    subtitle: 'Auto Rickshaws, Taxi/Cabs, Tourist Vans, Bus & Bike Taxi',
    icon: Car,
    color: '#fbbf24',
    badge: 'Fair Fare Verified'
  },
  {
    id: 'tour_guide',
    title: 'Tour Guides & Interpreters',
    subtitle: 'Certified Heritage, Trekking, Wildlife & Multilingual Guides',
    icon: Compass,
    color: '#38bdf8',
    badge: 'Govt Certified'
  },
  {
    id: 'homestay',
    title: 'Homestay & Hospitality',
    subtitle: 'Heritage Cottages, Mountain Villas, Homestays & Eco-Resorts',
    icon: Building2,
    color: '#a855f7',
    badge: 'Safe Stay Approved'
  },
  {
    id: 'emergency_medical',
    title: 'Emergency & Medical Assistance',
    subtitle: 'Ambulance Operators, 24/7 Clinics, Pharmacies & Rescue Units',
    icon: HeartPulse,
    color: '#ef4444',
    badge: '24/7 SOS Network'
  },
  {
    id: 'rental_agency',
    title: 'Travel Agency & Activity Rentals',
    subtitle: 'Trekking/Camping Gear, Bike/Scooter Rentals & Safari Agents',
    icon: ShoppingBag,
    color: '#34d399',
    badge: 'Verified Equipment'
  }
];

export const ServiceProviderModal: React.FC<ServiceProviderModalProps> = ({
  isOpen,
  onClose,
  onSaveProviderProfile,
  existingProfile
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1); // 1: Category, 2: Role Details, 3: Contact & Identity, 4: Commitment, 5: Success ID
  
  // Category State
  const [selectedCategory, setSelectedCategory] = useState<ProviderCategory>(
    existingProfile?.category || 'transport'
  );

  // Common Info
  const [providerName, setProviderName] = useState(existingProfile?.providerName || '');
  const [businessName, setBusinessName] = useState(existingProfile?.businessName || '');
  const [email, setEmail] = useState(existingProfile?.email || '');
  const [phone, setPhone] = useState(existingProfile?.phone || '');
  const [operatingCity, setOperatingCity] = useState(existingProfile?.operatingCity || '');
  const [operatingState, setOperatingState] = useState(existingProfile?.operatingState || '');
  const [nativeCurrency, setNativeCurrency] = useState(existingProfile?.nativeCurrency || 'INR');

  // 1. Transport Details State
  const [transportData, setTransportData] = useState<TransportProviderDetails>(() => ({
    vehicleType: existingProfile?.transportDetails?.vehicleType || ('' as any),
    vehicleRegNumber: existingProfile?.transportDetails?.vehicleRegNumber || '',
    driverLicenseNumber: existingProfile?.transportDetails?.driverLicenseNumber || '',
    commercialBadgeNumber: existingProfile?.transportDetails?.commercialBadgeNumber || '',
    operatingStand: existingProfile?.transportDetails?.operatingStand || '',
    baseTariffPerKm: existingProfile?.transportDetails?.baseTariffPerKm || 0,
    hasAC: existingProfile?.transportDetails?.hasAC ?? false,
    seatingCapacity: existingProfile?.transportDetails?.seatingCapacity || 0
  }));

  // 2. Tour Guide Details State
  const [guideData, setGuideData] = useState<TourGuideDetails>(() => ({
    guideLicenseType: existingProfile?.tourGuideDetails?.guideLicenseType || ('' as any),
    guideBadgeNumber: existingProfile?.tourGuideDetails?.guideBadgeNumber || '',
    specialization: existingProfile?.tourGuideDetails?.specialization || ('' as any),
    languagesSpoken: existingProfile?.tourGuideDetails?.languagesSpoken || [],
    experienceYears: existingProfile?.tourGuideDetails?.experienceYears || 0,
    hourlyRate: existingProfile?.tourGuideDetails?.hourlyRate || 0,
    dailyRate: existingProfile?.tourGuideDetails?.dailyRate || 0,
    hasFirstAidCert: existingProfile?.tourGuideDetails?.hasFirstAidCert ?? false
  }));

  // 3. Homestay Details State
  const [homestayData, setHomestayData] = useState<HomestayDetails>(() => ({
    propertyType: existingProfile?.homestayDetails?.propertyType || ('' as any),
    homestayRegNumber: existingProfile?.homestayDetails?.homestayRegNumber || '',
    totalRooms: existingProfile?.homestayDetails?.totalRooms || 0,
    amenities: existingProfile?.homestayDetails?.amenities || [],
    nightlyRateMin: existingProfile?.homestayDetails?.nightlyRateMin || 0,
    nightlyRateMax: existingProfile?.homestayDetails?.nightlyRateMax || 0,
    address: existingProfile?.homestayDetails?.address || '',
    fssaiLicense: existingProfile?.homestayDetails?.fssaiLicense || ''
  }));

  // 4. Emergency Medical State
  const [emergencyData, setEmergencyData] = useState<EmergencyMedicalDetails>(() => ({
    serviceType: existingProfile?.emergencyMedicalDetails?.serviceType || ('' as any),
    medicalLicenseNumber: existingProfile?.emergencyMedicalDetails?.medicalLicenseNumber || '',
    emergencyHotline: existingProfile?.emergencyMedicalDetails?.emergencyHotline || '',
    availableVehiclesOrBeds: existingProfile?.emergencyMedicalDetails?.availableVehiclesOrBeds || 0,
    serviceRadiusKm: existingProfile?.emergencyMedicalDetails?.serviceRadiusKm || 0,
    equipmentSupported: existingProfile?.emergencyMedicalDetails?.equipmentSupported || []
  }));

  // 5. Rental Agency State
  const [rentalData, setRentalData] = useState<RentalAgencyDetails>(() => ({
    agencyType: existingProfile?.rentalAgencyDetails?.agencyType || ('' as any),
    gstOrMsmeNumber: existingProfile?.rentalAgencyDetails?.gstOrMsmeNumber || '',
    itemsOffered: existingProfile?.rentalAgencyDetails?.itemsOffered || [],
    insuranceIncluded: existingProfile?.rentalAgencyDetails?.insuranceIncluded ?? false
  }));

  // Fair-Fare & Safety Commitment Checkbox (unclicked by default)
  const [hasAgreedCommitment, setHasAgreedCommitment] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<ServiceProviderProfile | null>(existingProfile || null);

  if (!isOpen) return null;

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedCommitment) {
      alert('Please agree to the TripNova Fair-Fare & Tourist Safety commitment.');
      return;
    }

    const providerId = existingProfile?.id || `PRV_${Date.now()}`;
    const newProfile: ServiceProviderProfile = {
      id: providerId,
      providerName: providerName.trim() || 'Verified Partner',
      businessName: businessName.trim() || providerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category: selectedCategory,
      operatingCity,
      operatingState,
      nativeCurrency,
      isVerified: true,
      registeredAt: existingProfile?.registeredAt || new Date().toISOString().split('T')[0],
      transportDetails: selectedCategory === 'transport' ? transportData : undefined,
      tourGuideDetails: selectedCategory === 'tour_guide' ? guideData : undefined,
      homestayDetails: selectedCategory === 'homestay' ? homestayData : undefined,
      emergencyMedicalDetails: selectedCategory === 'emergency_medical' ? emergencyData : undefined,
      rentalAgencyDetails: selectedCategory === 'rental_agency' ? rentalData : undefined
    };

    setCreatedProfile(newProfile);
    onSaveProviderProfile(newProfile);
    setActiveStep(5); // Show Success ID Card
  };

  const getCategoryTitle = (cat: ProviderCategory) => {
    return CATEGORIES.find(c => c.id === cat)?.title || 'Service Provider';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(7, 11, 20, 0.9)',
      backdropFilter: 'blur(20px)'
    }} className="animate-fade">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '840px',
        maxHeight: '92vh',
        background: '#090e17',
        borderRadius: '24px',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.8) 100%)'
        }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
            }}>
              <ShieldCheck style={{ width: '24px', height: '24px' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  TripNova Service Provider Onboarding
                </h2>
                <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>Verified Partner</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Register your tourism services, verify your commercial credentials, and pledge to transparent fair fares.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Multi-Step Header Indicator */}
        {activeStep < 5 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'rgba(10, 15, 29, 0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            {[
              { step: 1, label: '1. Choose Category', icon: Sparkles },
              { step: 2, label: '2. Role-Based Info', icon: FileText },
              { step: 3, label: '3. Identity & Contact', icon: MapPin },
              { step: 4, label: '4. Fair-Fare Pledge', icon: ShieldCheck }
            ].map(tab => (
              <button
                key={tab.step}
                type="button"
                onClick={() => {
                  if (tab.step < activeStep || (tab.step === 2 && selectedCategory)) {
                    setActiveStep(tab.step as any);
                  }
                }}
                style={{
                  padding: '12px 6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: activeStep === tab.step ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: activeStep === tab.step ? '#fbbf24' : activeStep > tab.step ? '#34d399' : '#94a3b8',
                  borderBottom: activeStep === tab.step ? '2px solid #fbbf24' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon style={{ width: '14px', height: '14px' }} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Modal Content */}
        <div style={{ padding: '24px', flex: 1 }}>
          {/* ============================================================ */}
          {/* STEP 1: CATEGORY SELECTION */}
          {/* ============================================================ */}
          {activeStep === 1 && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  Select Your Service Category
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Choose the category that matches your tourism service. The next step will display your role-specific information collecting form.
                </p>
              </div>

              <div className="grid grid-2 gap-4">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '18px',
                        borderRadius: '16px',
                        background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.7)',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? `0 8px 24px -4px ${cat.color}40` : 'none'
                      }}
                      className="glass-panel-hover"
                    >
                      <div>
                        <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: `${cat.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: cat.color
                          }}>
                            <Icon style={{ width: '22px', height: '22px' }} />
                          </div>
                          <span className="badge" style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}35`, fontSize: '0.68rem' }}>
                            {cat.badge}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                          {cat.title}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                          {cat.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                        <span style={{ fontSize: '0.72rem', color: isSelected ? cat.color : '#94a3b8', fontWeight: 700 }}>
                          {isSelected ? '✓ Category Selected' : 'Tap to Select'}
                        </span>
                        <ArrowRight style={{ width: '14px', height: '14px', color: isSelected ? cat.color : '#94a3b8' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '0.88rem' }}
                >
                  <span>Continue to Role-Based Form</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: DYNAMIC ROLE-BASED INFORMATION FORM */}
          {/* ============================================================ */}
          {activeStep === 2 && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-amber">{getCategoryTitle(selectedCategory)}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                      Role-Specific Information
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                    Fields specifically tailored for your selected service category.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.76rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  Change Category
                </button>
              </div>

              {/* 1. TRANSPORT & DRIVERS FORM */}
              {selectedCategory === 'transport' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Vehicle Type *
                      </label>
                      <select
                        value={transportData.vehicleType || ''}
                        onChange={e => setTransportData({ ...transportData, vehicleType: e.target.value as any })}
                        className="input-glass"
                      >
                        <option value="" disabled style={{ background: '#090e17' }}>-- Select Vehicle Type --</option>
                        <option value="Auto Rickshaw" style={{ background: '#090e17' }}>Auto Rickshaw (3-Wheeler)</option>
                        <option value="Sedan Cab" style={{ background: '#090e17' }}>Sedan Cab (Etios, Dzire)</option>
                        <option value="SUV" style={{ background: '#090e17' }}>SUV (Innova, Ertiga)</option>
                        <option value="Tourist Van / Bus" style={{ background: '#090e17' }}>Tourist Van / Minibus</option>
                        <option value="Bike Taxi" style={{ background: '#090e17' }}>Two-Wheeler / Bike Taxi</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Vehicle Registration Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={transportData.vehicleRegNumber}
                        onChange={e => setTransportData({ ...transportData, vehicleRegNumber: e.target.value })}
                        placeholder="e.g. TN 43 B 8892"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Commercial Driving License Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={transportData.driverLicenseNumber}
                        onChange={e => setTransportData({ ...transportData, driverLicenseNumber: e.target.value })}
                        placeholder="e.g. DL-TN43-2018002931"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Driver Commercial Badge / ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={transportData.commercialBadgeNumber}
                        onChange={e => setTransportData({ ...transportData, commercialBadgeNumber: e.target.value })}
                        placeholder="e.g. BDG-43920"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-3 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Base Stand / Operating Hub *
                      </label>
                      <input
                        type="text"
                        required
                        value={transportData.operatingStand}
                        onChange={e => setTransportData({ ...transportData, operatingStand: e.target.value })}
                        placeholder="e.g. Central Railway Station Stand"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Base Tariff Rate (₹ per km) *
                      </label>
                      <input
                        type="number"
                        required
                        min={10}
                        max={100}
                        value={transportData.baseTariffPerKm || ''}
                        onChange={e => setTransportData({ ...transportData, baseTariffPerKm: Number(e.target.value) })}
                        placeholder="e.g. 18"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Seating Capacity & AC
                      </label>
                      <div className="flex items-center gap-3" style={{ height: '42px' }}>
                        <select
                          value={transportData.seatingCapacity || 0}
                          onChange={e => setTransportData({ ...transportData, seatingCapacity: Number(e.target.value) })}
                          className="input-glass"
                          style={{ flex: 1 }}
                        >
                          <option value={0} disabled style={{ background: '#090e17' }}>-- Select Seating --</option>
                          <option value={1} style={{ background: '#090e17' }}>1 Pax (Bike)</option>
                          <option value={3} style={{ background: '#090e17' }}>3 Pax (Auto)</option>
                          <option value={4} style={{ background: '#090e17' }}>4 Pax (Sedan)</option>
                          <option value={6} style={{ background: '#090e17' }}>6-7 Pax (SUV)</option>
                          <option value={12} style={{ background: '#090e17' }}>12+ Pax (Bus)</option>
                        </select>
                        <label className="flex items-center gap-1.5" style={{ fontSize: '0.74rem', color: '#cbd5e1', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={transportData.hasAC}
                            onChange={e => setTransportData({ ...transportData, hasAC: e.target.checked })}
                          />
                          <span>AC</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. TOUR GUIDES FORM */}
              {selectedCategory === 'tour_guide' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Guide License Certification *
                      </label>
                      <select
                        value={guideData.guideLicenseType || ''}
                        onChange={e => setGuideData({ ...guideData, guideLicenseType: e.target.value as any })}
                        className="input-glass"
                      >
                        <option value="" disabled style={{ background: '#090e17' }}>-- Select Certification --</option>
                        <option value="Govt Certified National Guide" style={{ background: '#090e17' }}>Govt Certified National Guide</option>
                        <option value="State Tourism Guide" style={{ background: '#090e17' }}>State Tourism Board Certified Guide</option>
                        <option value="Local Heritage Expert" style={{ background: '#090e17' }}>Local Heritage & Culture Expert</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Guide License / Badge Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={guideData.guideBadgeNumber}
                        onChange={e => setGuideData({ ...guideData, guideBadgeNumber: e.target.value })}
                        placeholder="e.g. IN-GUIDE-TN-8492"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Primary Specialization *
                      </label>
                      <select
                        value={guideData.specialization || ''}
                        onChange={e => setGuideData({ ...guideData, specialization: e.target.value as any })}
                        className="input-glass"
                      >
                        <option value="" disabled style={{ background: '#090e17' }}>-- Select Specialization --</option>
                        <option value="Heritage & Temples" style={{ background: '#090e17' }}>Heritage & Temples</option>
                        <option value="Hill Stations & Treks" style={{ background: '#090e17' }}>Hill Stations & Mountain Treks</option>
                        <option value="Wildlife & Eco-Tour" style={{ background: '#090e17' }}>Wildlife Safari & Eco-Tours</option>
                        <option value="Food & Culture" style={{ background: '#090e17' }}>Culinary & Cultural Trails</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={40}
                        value={guideData.experienceYears || ''}
                        onChange={e => setGuideData({ ...guideData, experienceYears: Number(e.target.value) })}
                        placeholder="e.g. 5"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-3 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={guideData.hourlyRate || ''}
                        onChange={e => setGuideData({ ...guideData, hourlyRate: Number(e.target.value) })}
                        placeholder="e.g. 350"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Full Day Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={guideData.dailyRate || ''}
                        onChange={e => setGuideData({ ...guideData, dailyRate: Number(e.target.value) })}
                        placeholder="e.g. 2200"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        First Aid Certified
                      </label>
                      <div className="flex items-center" style={{ height: '42px' }}>
                        <label className="flex items-center gap-2" style={{ fontSize: '0.76rem', color: '#cbd5e1', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={guideData.hasFirstAidCert}
                            onChange={e => setGuideData({ ...guideData, hasFirstAidCert: e.target.checked })}
                          />
                          <span>Certified in Medical First Aid</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. HOMESTAY & HOSPITALITY FORM */}
              {selectedCategory === 'homestay' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Property Type *
                      </label>
                      <select
                        value={homestayData.propertyType || ''}
                        onChange={e => setHomestayData({ ...homestayData, propertyType: e.target.value as any })}
                        className="input-glass"
                      >
                        <option value="" disabled style={{ background: '#090e17' }}>-- Select Property Type --</option>
                        <option value="Heritage Cottage" style={{ background: '#090e17' }}>Heritage Cottage / Bungalow</option>
                        <option value="Mountain Villa" style={{ background: '#090e17' }}>Mountain View Villa</option>
                        <option value="Traditional Homestay" style={{ background: '#090e17' }}>Traditional Village Homestay</option>
                        <option value="Eco-Camp / Resort" style={{ background: '#090e17' }}>Eco-Camp / Nature Resort</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Tourism / Municipal Homestay Reg No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={homestayData.homestayRegNumber}
                        onChange={e => setHomestayData({ ...homestayData, homestayRegNumber: e.target.value })}
                        placeholder="e.g. TN-HOMESTAY-2024-88"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-3 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Total Rooms Available
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={homestayData.totalRooms || ''}
                        onChange={e => setHomestayData({ ...homestayData, totalRooms: Number(e.target.value) })}
                        placeholder="e.g. 4"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Nightly Rate Min (₹)
                      </label>
                      <input
                        type="number"
                        value={homestayData.nightlyRateMin || ''}
                        onChange={e => setHomestayData({ ...homestayData, nightlyRateMin: Number(e.target.value) })}
                        placeholder="e.g. 1800"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Nightly Rate Max (₹)
                      </label>
                      <input
                        type="number"
                        value={homestayData.nightlyRateMax || ''}
                        onChange={e => setHomestayData({ ...homestayData, nightlyRateMax: Number(e.target.value) })}
                        placeholder="e.g. 4500"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Property Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={homestayData.address}
                      onChange={e => setHomestayData({ ...homestayData, address: e.target.value })}
                      placeholder="e.g. 14 Upper Lake Road, Ooty"
                      className="input-glass"
                    />
                  </div>
                </div>
              )}

              {/* 4. EMERGENCY & MEDICAL ASSISTANCE FORM */}
              {selectedCategory === 'emergency_medical' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Medical / Emergency Service Type *
                      </label>
                      <select
                        value={emergencyData.serviceType || ''}
                        onChange={e => setEmergencyData({ ...emergencyData, serviceType: e.target.value as any })}
                        className="input-glass"
                      >
                        <option value="" disabled style={{ background: '#090e17' }}>-- Select Service Type --</option>
                        <option value="Private Ambulance Operator" style={{ background: '#090e17' }}>Private Ambulance Operator</option>
                        <option value="24/7 Urgent Clinic / Hospital" style={{ background: '#090e17' }}>24/7 Urgent Clinic / Hospital</option>
                        <option value="24/7 Pharmacy" style={{ background: '#090e17' }}>24/7 Pharmacy / Chemist</option>
                        <option value="Emergency Rescue Unit" style={{ background: '#090e17' }}>Mountain / Forest Emergency Rescue Unit</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Medical License / Reg Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={emergencyData.medicalLicenseNumber}
                        onChange={e => setEmergencyData({ ...emergencyData, medicalLicenseNumber: e.target.value })}
                        placeholder="e.g. TN-MED-AMB-4819"
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <div className="grid grid-3 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        24/7 Emergency Hotline *
                      </label>
                      <input
                        type="tel"
                        required
                        value={emergencyData.emergencyHotline}
                        onChange={e => setEmergencyData({ ...emergencyData, emergencyHotline: e.target.value })}
                        placeholder="e.g. +91 94432 99911"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Available Units / Ambulances
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={emergencyData.availableVehiclesOrBeds || ''}
                        onChange={e => setEmergencyData({ ...emergencyData, availableVehiclesOrBeds: Number(e.target.value) })}
                        placeholder="e.g. 2"
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Coverage Radius (km)
                      </label>
                      <input
                        type="number"
                        value={emergencyData.serviceRadiusKm || ''}
                        onChange={e => setEmergencyData({ ...emergencyData, serviceRadiusKm: Number(e.target.value) })}
                        placeholder="e.g. 35"
                        className="input-glass"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. RENTAL & ACTIVITY AGENCY FORM */}
              {selectedCategory === 'rental_agency' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Agency Type *
                      </label>
                      <select
                        value={rentalData.agencyType || ''}
                        onChange={e => setRentalData({ ...rentalData, agencyType: e.target.value as any })}
                        className="input-glass"
                      >
                        <option value="" disabled style={{ background: '#090e17' }}>-- Select Agency Type --</option>
                        <option value="Two-Wheeler & Bicycle Rental" style={{ background: '#090e17' }}>Two-Wheeler & Bicycle Rental</option>
                        <option value="Trekking & Camping Gear" style={{ background: '#090e17' }}>Trekking & Camping Gear Rentals</option>
                        <option value="Boating & Safari Agency" style={{ background: '#090e17' }}>Boating & Safari Agency</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        GST / MSME / Business Reg No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={rentalData.gstOrMsmeNumber}
                        onChange={e => setRentalData({ ...rentalData, gstOrMsmeNumber: e.target.value })}
                        placeholder="e.g. 33AAAAA0000A1Z5"
                        className="input-glass"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.84rem' }}
                >
                  <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back to Category
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.84rem' }}
                >
                  <span>Continue to Identity & Contact</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: IDENTITY, CONTACT & NATIVE CURRENCY */}
          {/* ============================================================ */}
          {activeStep === 3 && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  Provider Contact & Region Details
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Provide your primary contact and operating location details for tourist verification.
                </p>
              </div>

              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Provider Full Name (Individual or Proprietor) *
                  </label>
                  <input
                    type="text"
                    required
                    value={providerName}
                    onChange={e => setProviderName(e.target.value)}
                    placeholder="e.g. S. Murugan"
                    className="input-glass"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Business / Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Nilgiri Mountain Tourist Travels"
                    className="input-glass"
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Google / Business Email ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. murugan.travels@gmail.com"
                    className="input-glass"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +91 98421 88492"
                    className="input-glass"
                  />
                </div>
              </div>

              <div className="grid grid-3 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Operating City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={operatingCity}
                    onChange={e => setOperatingCity(e.target.value)}
                    placeholder="e.g. Ooty, Nilgiris"
                    className="input-glass"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    State / Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={operatingState}
                    onChange={e => setOperatingState(e.target.value)}
                    placeholder="e.g. Tamil Nadu, India"
                    className="input-glass"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Native Currency *
                  </label>
                  <select
                    value={nativeCurrency}
                    onChange={e => setNativeCurrency(e.target.value)}
                    className="input-glass"
                  >
                    <option value="INR" style={{ background: '#090e17' }}>INR - Indian Rupee (₹)</option>
                    <option value="USD" style={{ background: '#090e17' }}>USD - US Dollar ($)</option>
                    <option value="EUR" style={{ background: '#090e17' }}>EUR - Euro (€)</option>
                    <option value="GBP" style={{ background: '#090e17' }}>GBP - British Pound (£)</option>
                    <option value="AED" style={{ background: '#090e17' }}>AED - UAE Dirham (د.إ)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.84rem' }}
                >
                  <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.84rem' }}
                >
                  <span>Review & Safety Pledge</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: FAIR-FARE COMMITMENT & TERMS */}
          {/* ============================================================ */}
          {activeStep === 4 && (
            <form onSubmit={handleFinalSubmit} className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                  TripNova Fair-Fare & Tourist Safety Pledge
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  All registered TripNova service providers must commit to standard pricing and anti-scam integrity.
                </p>
              </div>

              <div style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div className="flex items-center gap-2" style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.92rem' }}>
                  <ShieldCheck style={{ width: '18px', height: '18px' }} />
                  <span>TripNova Code of Conduct for Providers:</span>
                </div>

                <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li><strong>Zero Overcharging Guarantee:</strong> Never demand unfair 3x-6x tourist markups; adhere to standard metered or published rates.</li>
                  <li><strong>Emergency Cooperation:</strong> Cooperate immediately with local tourist police, 112 emergency hotlines, and TripNova SOS alerts.</li>
                  <li><strong>Verified Credentials:</strong> Maintain valid commercial licenses, vehicle fitness certificates, and guide badges at all times.</li>
                  <li><strong>Respectful Conduct:</strong> Ensure tourist safety, medical assistance cooperation, and transparent communication in native language translation.</li>
                </ul>

                <label className="flex items-start gap-3" style={{ marginTop: '10px', cursor: 'pointer', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <input
                    type="checkbox"
                    required
                    checked={hasAgreedCommitment}
                    onChange={e => setHasAgreedCommitment(e.target.checked)}
                    style={{ marginTop: '3px' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700 }}>
                    I hereby certify that all submitted business and license details are authentic, and I agree to strictly uphold the TripNova Fair-Fare & Tourist Safety Guarantee.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.84rem' }}
                >
                  <ArrowLeft style={{ width: '14px', height: '14px' }} /> Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '0.88rem', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#000000', fontWeight: 800 }}
                >
                  <ShieldCheck style={{ width: '18px', height: '18px' }} />
                  <span>Submit & Generate Provider ID</span>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 5: SUCCESS & VERIFIED PROVIDER ID CARD */}
          {/* ============================================================ */}
          {activeStep === 5 && createdProfile && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
              }}>
                <Check style={{ width: '32px', height: '32px' }} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
                  Provider Profile Registered & Verified!
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', maxWidth: '500px', margin: '6px auto 0' }}>
                  Your services are now active on the TripNova Network. Tourists in {createdProfile.operatingCity} can discover your verified services.
                </p>
              </div>

              {/* Digital Verified ID Card */}
              <div style={{
                width: '100%',
                maxWidth: '520px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '2px solid #fbbf24',
                padding: '24px',
                textAlign: 'left',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>{createdProfile.businessName}</span>
                      <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Verified Partner</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Operated by: {createdProfile.providerName}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 800, display: 'block' }}>ID: {createdProfile.id}</span>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Reg: {createdProfile.registeredAt}</span>
                  </div>
                </div>

                <div className="grid grid-2 gap-3" style={{ fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>SERVICE CATEGORY</span>
                    <strong style={{ color: '#ffffff' }}>{getCategoryTitle(createdProfile.category)}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>OPERATING REGION</span>
                    <strong style={{ color: '#ffffff' }}>{createdProfile.operatingCity}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>PHONE / HOTLINE</span>
                    <strong style={{ color: '#38bdf8' }}>{createdProfile.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>VERIFICATION STATUS</span>
                    <span style={{ color: '#34d399', fontWeight: 800 }}>✓ Verified & Protected</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  <span>🛡️ TripNova Fair-Fare & Anti-Scam Shield Armed</span>
                  <QrCode style={{ width: '22px', height: '22px', color: '#fbbf24' }} />
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
                style={{ padding: '12px 32px', fontSize: '0.88rem' }}
              >
                <span>Done & Return to Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
