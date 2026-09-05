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
  AlertCircle,
  Navigation,
  User,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Tag,
  Globe
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
import { detectUserCurrentLocation } from '../utils/geoLocator';

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

export const TOUR_GUIDE_SPECIALIZATIONS = [
  'Heritage & Ancient Temples / Monuments',
  'Hill Stations, Mountain Treks & Hiking',
  'Wildlife Safari, Birding & Eco-Tours',
  'Culinary, Food & Street Food Trails',
  'Beach, Coastal & Marine Exploration',
  'Spiritual, Meditation & Pilgrimage Circuits',
  'Photography & Bird Watching Expeditions',
  'Adventure Sports, Rock Climbing & Camping',
  'Village, Agricultural & Rural Handicrafts',
  'Architectural & Historical Walking Tours',
  'Cultural Festivals, Folk Art & Dance',
  'Forest Trail & Botanical Exploration',
  'River Rafting, Boating & Water Sports',
  'Night Sky Stargazing & Astronomy',
  'Other Specialization (Type Custom)'
];

export const POPULAR_SKILL_TAGS = [
  'Mountain Trekking',
  'Heritage History',
  'Temple Architecture',
  'Wildlife Tracking',
  'Local Street Food',
  'Bird Watching',
  'Photography Guidance',
  'First-Aid Safety',
  'Camping & Bonfire',
  'River Crossing',
  'Forest Botany',
  'Yoga & Meditation',
  'Tribal & Folk Art',
  'Scuba & Marine Life'
];

export const TOUR_GUIDE_LANGUAGES_LIST = [
  'English',
  'Tamil',
  'Hindi',
  'Malayalam',
  'Telugu',
  'Kannada',
  'Bengali',
  'Marathi',
  'Gujarati',
  'French',
  'German',
  'Spanish',
  'Russian',
  'Japanese',
  'Mandarin',
  'Arabic',
  'Italian'
];

export const TRANSPORT_VEHICLE_TYPES = [
  'Auto Rickshaw (3-Wheeler)',
  'Sedan Cab (Etios, Dzire, Amaze)',
  'Premium SUV (Innova Crysta, Ertiga, XUV700)',
  'Luxury Sedan (Camry, Mercedes, BMW)',
  'Tourist Minibus / Tempo Traveller (12-26 Pax)',
  'Large AC Tourist Coach / Bus (30-50 Pax)',
  'Two-Wheeler / Bike Taxi / Scooter',
  'Open Safari 4x4 Jeep / Gypsy',
  'Electric Vehicle / Eco Taxi (EV)',
  'Vintage / Classic Heritage Tour Car',
  'Other Vehicle / Transport Service (Type Custom)'
];

export const HOMESTAY_PROPERTY_TYPES = [
  'Heritage Cottage / Colonial Bungalow',
  'Mountain View Villa / Hillside Chalet',
  'Traditional Village Farmstay / Agri-Tourism',
  'Eco-Camp / Luxury Glamping Resort',
  'Coastal Beach House / Seaside Homestay',
  'Forest Treehouse / Jungle Lodge',
  'Riverfront / Lakeview Cottage',
  'Plantation Estate Stay (Tea/Coffee/Spice)',
  'Ayurvedic & Yoga Wellness Retreat',
  'Budget Backpacker Hostel / Guest Suite',
  'Other Property / Stay Type (Type Custom)'
];

export const EMERGENCY_SERVICE_TYPES = [
  '24/7 Advanced Life Support (ALS) Ambulance',
  'Basic Life Support (BLS) Ambulance Operator',
  '24/7 Urgent Care Clinic / Multi-Specialty Hospital',
  '24/7 Pharmacy & First-Aid Chemist',
  'Mountain, Forest & High-Altitude Rescue Unit',
  'Coastal & Marine Life-Saving / Water Rescue',
  'Air Ambulance / Heli-Rescue Coordinator',
  'Tourist First-Aid & Emergency Response Volunteer',
  'Other Emergency / Medical Service (Type Custom)'
];

export const RENTAL_AGENCY_TYPES = [
  'Trekking, Camping & Mountaineering Gear',
  'Two-Wheeler, Superbike & Scooter Rental',
  'Bicycle / E-Bike Rentals & Guided Cycles',
  'Boating, Kayaking & Water Sports Equipment',
  'Wildlife Safari Jeep & Off-Road Rentals',
  'Scuba Diving & Snorkeling Gear Rentals',
  'Photography & Drone Gear Rental',
  'Traditional Costumes & Cultural Props',
  'Other Rental / Adventure Gear (Type Custom)'
];

export const POPULAR_OPERATING_REGIONS = [
  { name: 'Ooty & Nilgiris', city: 'Ooty, Nilgiris', state: 'Tamil Nadu, India' },
  { name: 'Kodaikanal Hills', city: 'Kodaikanal', state: 'Tamil Nadu, India' },
  { name: 'Madurai & Thanjavur Heritage', city: 'Madurai', state: 'Tamil Nadu, India' },
  { name: 'Chennai & Mahabalipuram ECR', city: 'Chennai', state: 'Tamil Nadu, India' },
  { name: 'Rameshwaram Coast', city: 'Rameshwaram', state: 'Tamil Nadu, India' },
  { name: 'Kanyakumari Confluence', city: 'Kanyakumari', state: 'Tamil Nadu, India' },
  { name: 'Puducherry & Auroville', city: 'Puducherry', state: 'Puducherry, India' },
  { name: 'Munnar & Idukki Highlands', city: 'Munnar', state: 'Kerala, India' },
  { name: 'Coorg & Wayanad', city: 'Coorg', state: 'Karnataka, India' },
  { name: 'Gokarna & Hampi Ruins', city: 'Hampi', state: 'Karnataka, India' },
  { name: 'Goa Coastal Belt', city: 'Goa', state: 'Goa, India' },
  { name: 'Jaipur & Udaipur', city: 'Jaipur', state: 'Rajasthan, India' },
  { name: 'Varanasi & Agra', city: 'Varanasi', state: 'Uttar Pradesh, India' },
  { name: 'Manali & Shimla', city: 'Manali', state: 'Himachal Pradesh, India' },
  { name: 'Leh & Ladakh', city: 'Leh', state: 'Ladakh, India' },
  { name: 'Rishikesh & Haridwar', city: 'Rishikesh', state: 'Uttarakhand, India' }
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
    existingProfile?.category || 'tour_guide'
  );

  // Common Info
  const [providerName, setProviderName] = useState(existingProfile?.providerName || '');
  const [businessName, setBusinessName] = useState(existingProfile?.businessName || '');
  const [username, setUsername] = useState(existingProfile?.username || '');
  const [password, setPassword] = useState(existingProfile?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(existingProfile?.email || '');
  const [phone, setPhone] = useState(existingProfile?.phone || '');
  const [operatingCity, setOperatingCity] = useState(existingProfile?.operatingCity || '');
  const [operatingState, setOperatingState] = useState(existingProfile?.operatingState || '');
  const [nativeCurrency, setNativeCurrency] = useState(existingProfile?.nativeCurrency || 'INR');

  // Custom type-in fields
  const [customVehicleInput, setCustomVehicleInput] = useState(existingProfile?.transportDetails?.customVehicleType || '');
  const [customSpecializationInput, setCustomSpecializationInput] = useState(existingProfile?.tourGuideDetails?.customSpecialization || '');
  const [secondarySkills, setSecondarySkills] = useState<string[]>(
    existingProfile?.tourGuideDetails?.secondarySkills || []
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newLanguageInput, setNewLanguageInput] = useState('');
  const [customPropertyInput, setCustomPropertyInput] = useState(existingProfile?.homestayDetails?.customPropertyType || '');
  const [customEmergencyInput, setCustomEmergencyInput] = useState(existingProfile?.emergencyMedicalDetails?.customServiceType || '');
  const [customRentalInput, setCustomRentalInput] = useState(existingProfile?.rentalAgencyDetails?.customAgencyType || '');

  // 1. Transport Details State
  const [transportData, setTransportData] = useState<TransportProviderDetails>(() => ({
    vehicleType: existingProfile?.transportDetails?.vehicleType || TRANSPORT_VEHICLE_TYPES[0],
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
    guideLicenseType: existingProfile?.tourGuideDetails?.guideLicenseType || 'Govt Certified National Guide',
    guideBadgeNumber: existingProfile?.tourGuideDetails?.guideBadgeNumber || '',
    specialization: existingProfile?.tourGuideDetails?.specialization || TOUR_GUIDE_SPECIALIZATIONS[0],
    languagesSpoken: existingProfile?.tourGuideDetails?.languagesSpoken || [],
    experienceYears: existingProfile?.tourGuideDetails?.experienceYears || 0,
    hourlyRate: existingProfile?.tourGuideDetails?.hourlyRate || 0,
    dailyRate: existingProfile?.tourGuideDetails?.dailyRate || 0,
    hasFirstAidCert: existingProfile?.tourGuideDetails?.hasFirstAidCert ?? false
  }));

  // 3. Homestay Details State
  const [homestayData, setHomestayData] = useState<HomestayDetails>(() => ({
    propertyType: existingProfile?.homestayDetails?.propertyType || HOMESTAY_PROPERTY_TYPES[0],
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
    serviceType: existingProfile?.emergencyMedicalDetails?.serviceType || EMERGENCY_SERVICE_TYPES[0],
    medicalLicenseNumber: existingProfile?.emergencyMedicalDetails?.medicalLicenseNumber || '',
    emergencyHotline: existingProfile?.emergencyMedicalDetails?.emergencyHotline || '',
    availableVehiclesOrBeds: existingProfile?.emergencyMedicalDetails?.availableVehiclesOrBeds || 0,
    serviceRadiusKm: existingProfile?.emergencyMedicalDetails?.serviceRadiusKm || 0,
    equipmentSupported: existingProfile?.emergencyMedicalDetails?.equipmentSupported || []
  }));

  // 5. Rental Agency State
  const [rentalData, setRentalData] = useState<RentalAgencyDetails>(() => ({
    agencyType: existingProfile?.rentalAgencyDetails?.agencyType || RENTAL_AGENCY_TYPES[0],
    gstOrMsmeNumber: existingProfile?.rentalAgencyDetails?.gstOrMsmeNumber || '',
    itemsOffered: existingProfile?.rentalAgencyDetails?.itemsOffered || [],
    insuranceIncluded: existingProfile?.rentalAgencyDetails?.insuranceIncluded ?? false
  }));

  // Fair-Fare & Safety Commitment Checkbox (unclicked by default)
  const [hasAgreedCommitment, setHasAgreedCommitment] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<ServiceProviderProfile | null>(existingProfile || null);

  if (!isOpen) return null;

  // Language toggle helper
  const toggleLanguage = (lang: string) => {
    const current = guideData.languagesSpoken || [];
    if (current.includes(lang)) {
      if (current.length > 1) {
        setGuideData({ ...guideData, languagesSpoken: current.filter(l => l !== lang) });
      }
    } else {
      setGuideData({ ...guideData, languagesSpoken: [...current, lang] });
    }
  };

  const handleAddCustomLanguage = () => {
    if (newLanguageInput.trim() && !guideData.languagesSpoken.includes(newLanguageInput.trim())) {
      setGuideData({ ...guideData, languagesSpoken: [...guideData.languagesSpoken, newLanguageInput.trim()] });
      setNewLanguageInput('');
    }
  };

  // Skill tags helper
  const toggleSkillTag = (skill: string) => {
    if (secondarySkills.includes(skill)) {
      setSecondarySkills(secondarySkills.filter(s => s !== skill));
    } else {
      setSecondarySkills([...secondarySkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    if (newSkillInput.trim() && !secondarySkills.includes(newSkillInput.trim())) {
      setSecondarySkills([...secondarySkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAgreedCommitment) {
      alert('Please agree to the TripNova Fair-Fare & Tourist Safety commitment.');
      return;
    }

    const providerId = existingProfile?.id || `PRV_${Date.now()}`;
    
    // Resolve custom type-in values
    const effectiveSpecialization = guideData.specialization === 'Other Specialization (Type Custom)'
      ? (customSpecializationInput.trim() || 'Custom Heritage & Tourism Guide')
      : guideData.specialization;

    const effectiveVehicleType = transportData.vehicleType === 'Other Vehicle / Transport Service (Type Custom)'
      ? (customVehicleInput.trim() || 'Custom Transport Vehicle')
      : transportData.vehicleType;

    const effectivePropertyType = homestayData.propertyType === 'Other Property / Stay Type (Type Custom)'
      ? (customPropertyInput.trim() || 'Custom Homestay / Accommodation')
      : homestayData.propertyType;

    const effectiveServiceType = emergencyData.serviceType === 'Other Emergency / Medical Service (Type Custom)'
      ? (customEmergencyInput.trim() || 'Custom Emergency / Medical Unit')
      : emergencyData.serviceType;

    const effectiveAgencyType = rentalData.agencyType === 'Other Rental / Adventure Gear (Type Custom)'
      ? (customRentalInput.trim() || 'Custom Rental Agency')
      : rentalData.agencyType;

    const newProfile: ServiceProviderProfile = {
      id: providerId,
      providerName: providerName.trim() || 'Verified Partner',
      businessName: businessName.trim() || providerName.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category: selectedCategory,
      operatingCity: operatingCity.trim() || 'Ooty, Nilgiris',
      operatingState: operatingState.trim() || 'Tamil Nadu, India',
      nativeCurrency,
      isVerified: true,
      registeredAt: existingProfile?.registeredAt || new Date().toISOString().split('T')[0],
      transportDetails: selectedCategory === 'transport' ? {
        ...transportData,
        vehicleType: effectiveVehicleType,
        customVehicleType: transportData.vehicleType === 'Other Vehicle / Transport Service (Type Custom)' ? customVehicleInput.trim() : undefined
      } : undefined,
      tourGuideDetails: selectedCategory === 'tour_guide' ? {
        ...guideData,
        specialization: effectiveSpecialization,
        customSpecialization: guideData.specialization === 'Other Specialization (Type Custom)' ? customSpecializationInput.trim() : undefined,
        secondarySkills
      } : undefined,
      homestayDetails: selectedCategory === 'homestay' ? {
        ...homestayData,
        propertyType: effectivePropertyType,
        customPropertyType: homestayData.propertyType === 'Other Property / Stay Type (Type Custom)' ? customPropertyInput.trim() : undefined
      } : undefined,
      emergencyMedicalDetails: selectedCategory === 'emergency_medical' ? {
        ...emergencyData,
        serviceType: effectiveServiceType,
        customServiceType: emergencyData.serviceType === 'Other Emergency / Medical Service (Type Custom)' ? customEmergencyInput.trim() : undefined
      } : undefined,
      rentalAgencyDetails: selectedCategory === 'rental_agency' ? {
        ...rentalData,
        agencyType: effectiveAgencyType,
        customAgencyType: rentalData.agencyType === 'Other Rental / Adventure Gear (Type Custom)' ? customRentalInput.trim() : undefined
      } : undefined
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

              {/* Native Currency Selector in Step 2 */}
              <div style={{
                padding: '14px 18px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(251, 191, 36, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fbbf24'
                  }}>
                    <DollarSign style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>
                      Native Billing Currency *
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Specify the primary currency in which you charge and quote for your services.
                    </span>
                  </div>
                </div>

                <div style={{ minWidth: '220px' }}>
                  <select
                    value={nativeCurrency}
                    onChange={e => setNativeCurrency(e.target.value)}
                    className="input-glass"
                    style={{ fontWeight: 700, borderColor: 'rgba(251, 191, 36, 0.4)' }}
                  >
                    <option value="INR" style={{ background: '#090e17' }}>INR - Indian Rupee (₹)</option>
                    <option value="USD" style={{ background: '#090e17' }}>USD - US Dollar ($)</option>
                    <option value="EUR" style={{ background: '#090e17' }}>EUR - Euro (€)</option>
                    <option value="GBP" style={{ background: '#090e17' }}>GBP - British Pound (£)</option>
                    <option value="AUD" style={{ background: '#090e17' }}>AUD - Australian Dollar (A$)</option>
                    <option value="CAD" style={{ background: '#090e17' }}>CAD - Canadian Dollar (C$)</option>
                    <option value="SGD" style={{ background: '#090e17' }}>SGD - Singapore Dollar (S$)</option>
                    <option value="AED" style={{ background: '#090e17' }}>AED - UAE Dirham (د.إ)</option>
                    <option value="JPY" style={{ background: '#090e17' }}>JPY - Japanese Yen (¥)</option>
                  </select>
                </div>
              </div>

              {/* 1. TRANSPORT & DRIVERS FORM */}
              {selectedCategory === 'transport' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Vehicle & Fleet Category *
                      </label>
                      <select
                        value={transportData.vehicleType || ''}
                        onChange={e => setTransportData({ ...transportData, vehicleType: e.target.value })}
                        className="input-glass"
                      >
                        {TRANSPORT_VEHICLE_TYPES.map(vt => (
                          <option key={vt} value={vt} style={{ background: '#090e17' }}>{vt}</option>
                        ))}
                      </select>

                      {transportData.vehicleType === 'Other Vehicle / Transport Service (Type Custom)' && (
                        <div style={{ marginTop: '8px' }} className="animate-fade">
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', display: 'block', marginBottom: '4px' }}>
                            Specify Custom Vehicle / Transport Service *
                          </label>
                          <input
                            type="text"
                            required
                            value={customVehicleInput}
                            onChange={e => setCustomVehicleInput(e.target.value)}
                            placeholder="e.g. Vintage 1968 Ambassador Heritage Cab or Luxury Caravan"
                            className="input-glass"
                            style={{ borderColor: 'rgba(251, 191, 36, 0.4)' }}
                          />
                        </div>
                      )}
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

              {/* 2. TOUR GUIDES & INTERPRETERS FORM */}
              {selectedCategory === 'tour_guide' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Guide License Certification *
                      </label>
                      <select
                        value={guideData.guideLicenseType || ''}
                        onChange={e => setGuideData({ ...guideData, guideLicenseType: e.target.value })}
                        className="input-glass"
                      >
                        <option value="Govt Certified National Guide" style={{ background: '#090e17' }}>Govt Certified National Guide</option>
                        <option value="State Tourism Board Certified Guide" style={{ background: '#090e17' }}>State Tourism Board Certified Guide</option>
                        <option value="Local Heritage & Culture Expert" style={{ background: '#090e17' }}>Local Heritage & Culture Expert</option>
                        <option value="Certified Adventure & Trekking Leader" style={{ background: '#090e17' }}>Certified Adventure & Trekking Leader</option>
                        <option value="Wildlife Naturalist & Forest Escort" style={{ background: '#090e17' }}>Wildlife Naturalist & Forest Escort</option>
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

                  {/* Primary Specialization with Custom Type-in */}
                  <div className="grid grid-2 gap-3">
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Primary Specialization / Main Skill *
                      </label>
                      <select
                        value={guideData.specialization || ''}
                        onChange={e => setGuideData({ ...guideData, specialization: e.target.value })}
                        className="input-glass"
                        style={{ color: '#38bdf8', fontWeight: 700 }}
                      >
                        {TOUR_GUIDE_SPECIALIZATIONS.map(spec => (
                          <option key={spec} value={spec} style={{ background: '#090e17', color: '#ffffff' }}>{spec}</option>
                        ))}
                      </select>

                      {guideData.specialization === 'Other Specialization (Type Custom)' && (
                        <div style={{ marginTop: '8px' }} className="animate-fade">
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '4px' }}>
                            Specify Custom Skill / Specialization *
                          </label>
                          <input
                            type="text"
                            required
                            value={customSpecializationInput}
                            onChange={e => setCustomSpecializationInput(e.target.value)}
                            placeholder="e.g. Night Sky Stargazing & Astrophotography Guide"
                            className="input-glass"
                            style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}
                          />
                        </div>
                      )}
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

                  {/* Additional Skills Tagging Section */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="flex items-center justify-between">
                      <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Tag style={{ width: '13px', height: '13px', color: '#38bdf8' }} />
                        Skills & Areas of Expertise (Select or Add Any Skill)
                      </label>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{secondarySkills.length} selected</span>
                    </div>

                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {secondarySkills.map(skill => (
                        <span
                          key={skill}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(56, 189, 248, 0.2)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: '#38bdf8',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          ✓ {skill}
                          <button
                            type="button"
                            onClick={() => toggleSkillTag(skill)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Popular Preset Skill Pills */}
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Quick Skill Presets:</span>
                      <div className="flex flex-wrap gap-1">
                        {POPULAR_SKILL_TAGS.filter(s => !secondarySkills.includes(s)).map(preset => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => toggleSkillTag(preset)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              background: 'rgba(30, 41, 59, 0.7)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              color: '#cbd5e1',
                              cursor: 'pointer'
                            }}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Skill Self-Type Input */}
                    <div className="flex items-center gap-2" style={{ marginTop: '4px' }}>
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={e => setNewSkillInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
                        placeholder="Type custom skill e.g. Cave Exploration & Rappelling..."
                        className="input-glass"
                        style={{ flex: 1, padding: '6px 12px', fontSize: '0.75rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.74rem', color: '#38bdf8' }}
                      >
                        <Plus style={{ width: '13px', height: '13px' }} /> Add Custom Skill
                      </button>
                    </div>
                  </div>

                  {/* Languages Spoken Multi-Select & Custom Language */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="flex items-center justify-between">
                      <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Globe style={{ width: '13px', height: '13px', color: '#34d399' }} />
                        Languages Spoken & Interpretation (Select All That Apply)
                      </label>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{guideData.languagesSpoken.length} selected</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {TOUR_GUIDE_LANGUAGES_LIST.map(lang => {
                        const isSelected = guideData.languagesSpoken.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: isSelected ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.08)',
                              background: isSelected ? 'rgba(52, 211, 153, 0.2)' : 'rgba(10, 15, 29, 0.6)',
                              color: isSelected ? '#34d399' : '#94a3b8'
                            }}
                          >
                            {isSelected ? '✓ ' : ''}{lang}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Language Input */}
                    <div className="flex items-center gap-2" style={{ marginTop: '2px' }}>
                      <input
                        type="text"
                        value={newLanguageInput}
                        onChange={e => setNewLanguageInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomLanguage())}
                        placeholder="Type other language e.g. Portuguese, Korean, Dutch..."
                        className="input-glass"
                        style={{ flex: 1, padding: '6px 12px', fontSize: '0.75rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomLanguage}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.74rem', color: '#34d399' }}
                      >
                        <Plus style={{ width: '13px', height: '13px' }} /> Add Language
                      </button>
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
                        onChange={e => setHomestayData({ ...homestayData, propertyType: e.target.value })}
                        className="input-glass"
                      >
                        {HOMESTAY_PROPERTY_TYPES.map(pt => (
                          <option key={pt} value={pt} style={{ background: '#090e17' }}>{pt}</option>
                        ))}
                      </select>

                      {homestayData.propertyType === 'Other Property / Stay Type (Type Custom)' && (
                        <div style={{ marginTop: '8px' }} className="animate-fade">
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a855f7', display: 'block', marginBottom: '4px' }}>
                            Specify Custom Property / Stay Type *
                          </label>
                          <input
                            type="text"
                            required
                            value={customPropertyInput}
                            onChange={e => setCustomPropertyInput(e.target.value)}
                            placeholder="e.g. Floating Houseboat & Backwater Heritage Stay"
                            className="input-glass"
                            style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}
                          />
                        </div>
                      )}
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
                        onChange={e => setEmergencyData({ ...emergencyData, serviceType: e.target.value })}
                        className="input-glass"
                      >
                        {EMERGENCY_SERVICE_TYPES.map(est => (
                          <option key={est} value={est} style={{ background: '#090e17' }}>{est}</option>
                        ))}
                      </select>

                      {emergencyData.serviceType === 'Other Emergency / Medical Service (Type Custom)' && (
                        <div style={{ marginTop: '8px' }} className="animate-fade">
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', display: 'block', marginBottom: '4px' }}>
                            Specify Custom Emergency / Medical Service *
                          </label>
                          <input
                            type="text"
                            required
                            value={customEmergencyInput}
                            onChange={e => setCustomEmergencyInput(e.target.value)}
                            placeholder="e.g. High Altitude Hyperbaric & Mountain Rescue Escort"
                            className="input-glass"
                            style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
                          />
                        </div>
                      )}
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
                        Agency & Rental Category *
                      </label>
                      <select
                        value={rentalData.agencyType || ''}
                        onChange={e => setRentalData({ ...rentalData, agencyType: e.target.value })}
                        className="input-glass"
                      >
                        {RENTAL_AGENCY_TYPES.map(rat => (
                          <option key={rat} value={rat} style={{ background: '#090e17' }}>{rat}</option>
                        ))}
                      </select>

                      {rentalData.agencyType === 'Other Rental / Adventure Gear (Type Custom)' && (
                        <div style={{ marginTop: '8px' }} className="animate-fade">
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', display: 'block', marginBottom: '4px' }}>
                            Specify Custom Rental / Adventure Equipment *
                          </label>
                          <input
                            type="text"
                            required
                            value={customRentalInput}
                            onChange={e => setCustomRentalInput(e.target.value)}
                            placeholder="e.g. Paragliding, Skydiving & Mountain Rappelling Equipment"
                            className="input-glass"
                            style={{ borderColor: 'rgba(52, 211, 153, 0.4)' }}
                          />
                        </div>
                      )}
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

              {/* Partner Account Credentials */}
              <div className="grid grid-2 gap-3" style={{ background: 'rgba(251, 191, 36, 0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <User style={{ width: '12px', height: '12px' }} />
                    Partner Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value.trim().toLowerCase())}
                    placeholder="e.g. murugan_travels"
                    className="input-glass"
                  />
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>Used for partner portal login</span>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Lock style={{ width: '12px', height: '12px' }} />
                    Partner Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter partner password"
                      className="input-glass"
                      style={{ paddingRight: '36px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff style={{ width: '14px', height: '14px' }} /> : <Eye style={{ width: '14px', height: '14px' }} />}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>Required to manage listings & profile</span>
                </div>
              </div>

              <div className="grid grid-2 gap-3">
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Google / Business Email ID * (For Password Reset)
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

              {/* Operating Jurisdiction & Base Region with Quick Presets & Custom Type-in */}
              <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
                      Operating Jurisdiction & Base Region *
                    </label>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Select a popular tourist circuit or type any custom city/district and state worldwide.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const loc = await detectUserCurrentLocation();
                        setOperatingCity(loc.city);
                        setOperatingState(loc.state ? `${loc.state}, ${loc.country}` : loc.country);
                      } catch (err: any) {
                        alert(err.message || 'Unable to detect location');
                      }
                    }}
                    className="btn-secondary"
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#34d399',
                      borderColor: 'rgba(52, 211, 153, 0.4)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Navigation style={{ width: '12px', height: '12px' }} />
                    <span>📍 Auto-Detect Location</span>
                  </button>
                </div>

                {/* Popular Circuit Presets */}
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    Popular Tourism Circuits & Operating Hubs (Click to Pre-fill):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_OPERATING_REGIONS.map(reg => {
                      const isSelected = operatingCity === reg.city;
                      return (
                        <button
                          key={reg.name}
                          type="button"
                          onClick={() => {
                            setOperatingCity(reg.city);
                            setOperatingState(reg.state);
                          }}
                          style={{
                            padding: '4px 9px',
                            borderRadius: '8px',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                            background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.7)',
                            color: isSelected ? '#38bdf8' : '#cbd5e1'
                          }}
                        >
                          {isSelected ? '✓ ' : ''}{reg.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Free Type-in City / District & State / Region */}
                <div className="grid grid-2 gap-3" style={{ marginTop: '4px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Operating City / District / Town * (Self-Type or Edit)
                    </label>
                    <input
                      type="text"
                      required
                      value={operatingCity}
                      onChange={e => setOperatingCity(e.target.value)}
                      placeholder="e.g. Ooty, Nilgiris (or any custom place)"
                      className="input-glass"
                      style={{ fontWeight: 700, color: '#38bdf8' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      State / Region / Country * (Self-Type or Edit)
                    </label>
                    <input
                      type="text"
                      required
                      value={operatingState}
                      onChange={e => setOperatingState(e.target.value)}
                      placeholder="e.g. Tamil Nadu, India"
                      className="input-glass"
                      style={{ fontWeight: 700 }}
                    />
                  </div>
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
                maxWidth: '540px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                border: '2px solid #fbbf24',
                padding: '24px',
                textAlign: 'left',
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
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

                  {createdProfile.tourGuideDetails && (
                    <div className="col-span-2" style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      <span style={{ color: '#38bdf8', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>SPECIALIZATION & EXPERTISE</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.82rem' }}>{createdProfile.tourGuideDetails.specialization}</strong>
                      {createdProfile.tourGuideDetails.secondarySkills && createdProfile.tourGuideDetails.secondarySkills.length > 0 && (
                        <div className="flex flex-wrap gap-1" style={{ marginTop: '4px' }}>
                          {createdProfile.tourGuideDetails.secondarySkills.map(s => (
                            <span key={s} style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
                              • {s}
                            </span>
                          ))}
                        </div>
                      )}
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                        🗣️ Languages: {createdProfile.tourGuideDetails.languagesSpoken.join(', ')}
                      </span>
                    </div>
                  )}

                  {createdProfile.transportDetails && (
                    <div className="col-span-2" style={{ background: 'rgba(251, 191, 36, 0.08)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                      <span style={{ color: '#fbbf24', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>VEHICLE / FLEET</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.82rem' }}>{createdProfile.transportDetails.vehicleType}</strong>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                        Reg: {createdProfile.transportDetails.vehicleRegNumber} • Stand: {createdProfile.transportDetails.operatingStand}
                      </span>
                    </div>
                  )}

                  {createdProfile.homestayDetails && (
                    <div className="col-span-2" style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                      <span style={{ color: '#c084fc', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>ACCOMMODATION TYPE</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.82rem' }}>{createdProfile.homestayDetails.propertyType}</strong>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                        {createdProfile.homestayDetails.totalRooms} Rooms Available • Address: {createdProfile.homestayDetails.address}
                      </span>
                    </div>
                  )}

                  {createdProfile.emergencyMedicalDetails && (
                    <div className="col-span-2" style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <span style={{ color: '#f87171', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>EMERGENCY SERVICE</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.82rem' }}>{createdProfile.emergencyMedicalDetails.serviceType}</strong>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                        Hotline: {createdProfile.emergencyMedicalDetails.emergencyHotline} • Radius: {createdProfile.emergencyMedicalDetails.serviceRadiusKm} km
                      </span>
                    </div>
                  )}

                  {createdProfile.rentalAgencyDetails && (
                    <div className="col-span-2" style={{ background: 'rgba(52, 211, 153, 0.08)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                      <span style={{ color: '#34d399', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>RENTAL SERVICE</span>
                      <strong style={{ color: '#ffffff', fontSize: '0.82rem' }}>{createdProfile.rentalAgencyDetails.agencyType}</strong>
                    </div>
                  )}

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
