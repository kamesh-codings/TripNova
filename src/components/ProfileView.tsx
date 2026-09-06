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
  X,
  Car,
  Compass,
  Building2,
  ShoppingBag,
  MapPin,
  DollarSign,
  QrCode,
  Award,
  LogOut
} from 'lucide-react';
import { UserProfile, ServiceProviderProfile } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  providerProfile?: ServiceProviderProfile | null;
  onEditProfile: () => void;
  onEditProviderProfile?: () => void;
  onNavigateTab: (tab: string) => void;
  onDeleteProfile: () => void;
  onDeleteProviderProfile?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  providerProfile,
  onEditProfile,
  onEditProviderProfile,
  onNavigateTab,
  onDeleteProfile,
  onDeleteProviderProfile,
  onLogout
}) => {
  // If user has both, or only provider, set appropriate active profile tab
  const [activeProfileTab, setActiveProfileTab] = useState<'tourist' | 'provider'>(() => {
    if (providerProfile && !userProfile.isRegistered) return 'provider';
    return 'tourist';
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showProviderDeleteConfirm, setShowProviderDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getCategoryTitle = (cat?: string) => {
    switch(cat) {
      case 'transport': return 'Transport & Drivers';
      case 'tour_guide': return 'Tour Guides & Interpreters';
      case 'homestay': return 'Homestay & Hospitality';
      case 'emergency_medical': return 'Emergency & Medical Assistance';
      case 'rental_agency': return 'Travel Agency & Activity Rentals';
      default: return 'Service Provider';
    }
  };

  const getCategoryIcon = (cat?: string) => {
    switch(cat) {
      case 'transport': return Car;
      case 'tour_guide': return Compass;
      case 'homestay': return Building2;
      case 'emergency_medical': return HeartPulse;
      case 'rental_agency': return ShoppingBag;
      default: return ShieldCheck;
    }
  };

  const ProviderIcon = getCategoryIcon(providerProfile?.category);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1024px', margin: '0 auto' }}>
      
      {/* Dual Profile Switcher if both profiles exist */}
      {userProfile.isRegistered && providerProfile && (
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setActiveProfileTab('tourist')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeProfileTab === 'tourist' ? 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)' : 'transparent',
              color: activeProfileTab === 'tourist' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <User style={{ width: '16px', height: '16px' }} />
            <span>Tourist Safety Profile</span>
          </button>
          <button
            onClick={() => setActiveProfileTab('provider')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeProfileTab === 'provider' ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : 'transparent',
              color: activeProfileTab === 'provider' ? '#000000' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck style={{ width: '16px', height: '16px' }} />
            <span>Service Provider Partner Profile</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE PROVIDER PROFILE VIEW */}
      {/* ========================================================================= */}
      {(activeProfileTab === 'provider' || (!userProfile.isRegistered && providerProfile)) && providerProfile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade">
          {/* Provider Header Card */}
          <div className="glass-panel" style={{
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            borderColor: 'rgba(245, 158, 11, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div className="flex items-center gap-4">
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                padding: '3px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#090e17',
                  borderRadius: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24'
                }}>
                  <ProviderIcon style={{ width: '30px', height: '30px' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>
                    {providerProfile.businessName || providerProfile.providerName}
                  </h2>
                  <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck style={{ width: '13px', height: '13px' }} /> Verified Partner
                  </span>
                  <span className="badge badge-blue">
                    ID: {providerProfile.id}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '3px' }}>
                  Proprietor: <strong>{providerProfile.providerName}</strong> • {getCategoryTitle(providerProfile.category)}
                </p>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                  Operating in {providerProfile.operatingCity}, {providerProfile.operatingState} • Currency: {providerProfile.nativeCurrency}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {onEditProviderProfile && (
                <button
                  onClick={onEditProviderProfile}
                  className="btn-primary"
                  style={{ 
                    padding: '9px 18px', 
                    fontSize: '0.82rem', 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', 
                    color: '#000000', 
                    fontWeight: 800 
                  }}
                >
                  <Edit3 style={{ width: '15px', height: '15px' }} />
                  <span>Edit Partner Details</span>
                </button>
              )}
              {onLogout && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.82rem', color: '#cbd5e1' }}
                  title="Log Out of Session"
                >
                  <LogOut style={{ width: '15px', height: '15px' }} />
                  <span>Log Out</span>
                </button>
              )}
              <button
                onClick={() => setShowProviderDeleteConfirm(true)}
                className="btn-secondary"
                style={{ padding: '9px 14px', fontSize: '0.82rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' }}
                title="Delete Service Provider Profile"
              >
                <Trash2 style={{ width: '15px', height: '15px' }} />
                <span>Delete Profile</span>
              </button>
            </div>
          </div>

          {/* Service Provider Delete Confirmation Modal */}
          {showProviderDeleteConfirm && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
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
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>Delete Service Provider Profile?</h3>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.5 }}>
                    This will permanently de-register <strong>{providerProfile.businessName}</strong>, clear your verified digital ID credentials from this device, and reset your session.
                  </p>
                </div>

                <div className="grid grid-2 gap-3" style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProviderDeleteConfirm(false);
                      if (onDeleteProviderProfile) onDeleteProviderProfile();
                    }}
                    className="btn-sos"
                    style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                  >
                    Yes, Delete Provider
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProviderDeleteConfirm(false)}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Provider Details Grid */}
          <div className="grid grid-12 gap-5">
            {/* Left 7 cols: Category Role Details */}
            <div className="col-span-7 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ProviderIcon style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
                  {getCategoryTitle(providerProfile.category)} Credentials
                </h3>

                {/* Transport Details */}
                {providerProfile.category === 'transport' && providerProfile.transportDetails && (
                  <div className="grid grid-2 gap-3">
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Vehicle Type & Reg</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>
                        {providerProfile.transportDetails.vehicleType} • {providerProfile.transportDetails.vehicleRegNumber || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Commercial DL & Badge</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>
                        {providerProfile.transportDetails.driverLicenseNumber || 'N/A'} • {providerProfile.transportDetails.commercialBadgeNumber || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Operating Stand</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{providerProfile.transportDetails.operatingStand || 'N/A'}</strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Base Tariff & Features</span>
                      <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>
                        ₹{providerProfile.transportDetails.baseTariffPerKm}/km • {providerProfile.transportDetails.hasAC ? 'AC' : 'Non-AC'} • {providerProfile.transportDetails.seatingCapacity} Pax
                      </strong>
                    </div>
                  </div>
                )}

                {/* Tour Guide Details */}
                {providerProfile.category === 'tour_guide' && providerProfile.tourGuideDetails && (
                  <div className="grid grid-2 gap-3">
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>License Certification</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{providerProfile.tourGuideDetails.guideLicenseType}</strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Badge & Experience</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>
                        Badge: {providerProfile.tourGuideDetails.guideBadgeNumber || 'N/A'} • {providerProfile.tourGuideDetails.experienceYears} yrs
                      </strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Specialization</span>
                      <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{providerProfile.tourGuideDetails.specialization}</strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Standard Rates</span>
                      <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>
                        ₹{providerProfile.tourGuideDetails.hourlyRate}/hr • ₹{providerProfile.tourGuideDetails.dailyRate}/day
                      </strong>
                    </div>
                  </div>
                )}

                {/* Homestay Details */}
                {providerProfile.category === 'homestay' && providerProfile.homestayDetails && (
                  <div className="grid grid-2 gap-3">
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Property Type & Reg</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>
                        {providerProfile.homestayDetails.propertyType} • {providerProfile.homestayDetails.homestayRegNumber || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Total Rooms & Tariff</span>
                      <strong style={{ fontSize: '0.85rem', color: '#34d399' }}>
                        {providerProfile.homestayDetails.totalRooms} Rooms • ₹{providerProfile.homestayDetails.nightlyRateMin} - ₹{providerProfile.homestayDetails.nightlyRateMax}/night
                      </strong>
                    </div>
                    <div className="col-span-2" style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Property Address</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{providerProfile.homestayDetails.address || 'Address not specified'}</strong>
                    </div>
                  </div>
                )}

                {/* Emergency Medical Details */}
                {providerProfile.category === 'emergency_medical' && providerProfile.emergencyMedicalDetails && (
                  <div className="grid grid-2 gap-3">
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Service Type & License</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>
                        {providerProfile.emergencyMedicalDetails.serviceType} • {providerProfile.emergencyMedicalDetails.medicalLicenseNumber || 'N/A'}
                      </strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>24/7 Emergency Hotline</span>
                      <a href={`tel:${providerProfile.emergencyMedicalDetails.emergencyHotline}`} style={{ fontSize: '0.95rem', fontWeight: 900, color: '#f87171', textDecoration: 'none' }}>
                        {providerProfile.emergencyMedicalDetails.emergencyHotline || 'N/A'}
                      </a>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Fleet Units</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{providerProfile.emergencyMedicalDetails.availableVehiclesOrBeds} Units Available</strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Coverage Radius</span>
                      <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{providerProfile.emergencyMedicalDetails.serviceRadiusKm} km radius</strong>
                    </div>
                  </div>
                )}

                {/* Rental Agency Details */}
                {providerProfile.category === 'rental_agency' && providerProfile.rentalAgencyDetails && (
                  <div className="grid grid-2 gap-3">
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Agency Type</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{providerProfile.rentalAgencyDetails.agencyType}</strong>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>GST / MSME Number</span>
                      <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{providerProfile.rentalAgencyDetails.gstOrMsmeNumber || 'N/A'}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 cols: Verification & Fair-Fare Accreditation */}
            <div className="col-span-5 lg-col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award style={{ width: '18px', height: '18px' }} />
                  TripNova Safety Accreditation
                </h3>

                <div style={{ padding: '14px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <div className="flex items-center gap-2" style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.82rem' }}>
                    <CheckCircle style={{ width: '15px', height: '15px' }} />
                    <span>Fair-Fare Anti-Scam Pledge Active</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                    Committed to 0% tourist surcharge, emergency SOS coordination, and verified digital credentials.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                  <div style={{ padding: '10px 12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Contact Phone:</span>
                    <strong style={{ color: '#34d399' }}>{providerProfile.phone || 'N/A'}</strong>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Email:</span>
                    <strong style={{ color: '#ffffff' }}>{providerProfile.email || 'N/A'}</strong>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Member Since:</span>
                    <strong style={{ color: '#38bdf8' }}>{providerProfile.registeredAt}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (

        /* ========================================================================= */
        /* CONSUMER TOURIST PROFILE VIEW */
        /* ========================================================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade">
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
                  {userProfile.nativeCurrency && (
                    <span className="badge badge-blue">
                      Currency: {userProfile.nativeCurrency}
                    </span>
                  )}
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
              {onLogout && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.82rem', color: '#cbd5e1' }}
                  title="Log Out of Session"
                >
                  <LogOut style={{ width: '15px', height: '15px' }} />
                  <span>Log Out</span>
                </button>
              )}
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

          {/* Logout Confirmation Modal */}
          {showLogoutConfirm && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(12px)'
            }} className="animate-fade">
              <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '440px',
                padding: '24px',
                background: '#090e17',
                border: '2px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '2px solid #ef4444',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444'
                }}>
                  <LogOut style={{ width: '24px', height: '24px' }} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                    Confirm Log Out
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    Are you sure you want to log out of your session? You can sign back in or register a new profile at any time.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      if (onLogout) onLogout();
                    }}
                    className="btn-sos"
                    style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
                  >
                    Yes, Log Out
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>{userProfile.age || 0} yrs • {userProfile.gender || 'Male'}</strong>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '12px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>ID Document</span>
                    <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{userProfile.govtIdType || (userProfile as any).govt_id_type || 'Aadhaar Card'}</strong>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', background: 'rgba(10, 15, 29, 0.8)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Document Number & Jurisdiction:</span>
                  <div className="flex items-center justify-between" style={{ marginTop: '4px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                      {userProfile.govtIdNumber || (userProfile as any).govt_id_number || 'No ID Number entered'}
                    </span>
                    <span className="badge badge-blue">{userProfile.govtIdState || (userProfile as any).govt_id_state || 'Tamil Nadu, India'}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Languages Known:</span>
                  <div className="flex flex-wrap gap-1">
                    {(userProfile.languagesKnown || (userProfile as any).languages_known) && (userProfile.languagesKnown || (userProfile as any).languages_known).length > 0 ? (
                      (userProfile.languagesKnown || (userProfile as any).languages_known).map((lang: string) => (
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
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>{userProfile.bloodGroup || (userProfile as any).blood_group || 'O+'}</span>
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

                {(userProfile.medicalConditions || (userProfile as any).medical_conditions) && (
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Info style={{ width: '18px', height: '18px', color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.78rem', color: '#bae6fd', display: 'block' }}>Medical Conditions:</strong>
                      <span style={{ fontSize: '0.78rem', color: '#e0f2fe' }}>{userProfile.medicalConditions || (userProfile as any).medical_conditions}</span>
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
                          {c.email && (
                            <span style={{ color: '#38bdf8', fontSize: '0.68rem', display: 'block', marginTop: '2px' }}>
                              ✉️ {c.email}
                            </span>
                          )}
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
      )}
    </div>
  );
};
