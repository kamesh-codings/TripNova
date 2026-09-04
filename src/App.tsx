import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';
import { TripPlanner } from './components/TripPlanner';
import { EmergencyCard } from './components/EmergencyCard';
import { SafetyHub } from './components/SafetyHub';
import { AntiScamEstimator } from './components/AntiScamEstimator';
import { TravelTools } from './components/TravelTools';
import { RegistrationModal } from './components/RegistrationModal';
import { ServiceProviderModal } from './components/ServiceProviderModal';
import { LoginModal } from './components/LoginModal';
import { ProfileView } from './components/ProfileView';
import { NovaAIBot } from './components/NovaAIBot';
import { WelcomeGateway } from './components/WelcomeGateway';
import { SpotsExplorer } from './components/SpotsExplorer';
import { UserProfile, TripPlan, ServiceProviderProfile, UserLocation } from './types';
import { DEFAULT_USER_PROFILE } from './data/mockData';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  deleteStoredProfile,
  getStoredProviderProfile,
  saveStoredProviderProfile,
  deleteStoredProviderProfile,
  getStoredTrips, 
  saveStoredTrips 
} from './utils/storage';
import { syncUserProfile, syncProviderProfile } from './utils/api';
import { Sparkles, UserPlus, CheckCircle, ShieldCheck } from 'lucide-react';

const GATEWAY_SHOWN_KEY = 'tripnova_gateway_dismissed';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredProfile);
  const [providerProfile, setProviderProfile] = useState<ServiceProviderProfile | null>(getStoredProviderProfile);
  const [trips, setTrips] = useState<TripPlan[]>(getStoredTrips);
  
  // Flash Toast Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gateway state
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(() => {
    const profile = getStoredProfile();
    const provider = getStoredProviderProfile();
    const dismissed = sessionStorage.getItem(GATEWAY_SHOWN_KEY);
    return (!profile.isRegistered && !provider && !dismissed);
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isProviderRegisterOpen, setIsProviderRegisterOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectRegisterFromGateway = () => {
    sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
    setIsGatewayOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSelectExploreFromGateway = () => {
    sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
    setIsGatewayOpen(false);
    setActiveTab('dashboard');
  };

  const handleSelectProviderRegisterFromGateway = () => {
    sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
    setIsGatewayOpen(false);
    setIsProviderRegisterOpen(true);
  };

  const handleLocationDetectedFromGateway = (loc: UserLocation) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        address: prev.address || loc.formattedAddress,
        currentLocation: `${loc.city}, ${loc.state}, ${loc.country}`,
        locationCoordinates: { latitude: loc.latitude, longitude: loc.longitude }
      };
      saveStoredProfile(updated);
      syncUserProfile(updated).catch(() => {});
      return updated;
    });
    showToast(`📍 Live Location Detected: ${loc.city}, ${loc.state}`);
  };

  const handleLanguageChangedFromGateway = (lang: string) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        preferredLanguage: lang
      };
      saveStoredProfile(updated);
      syncUserProfile(updated).catch(() => {});
      return updated;
    });
    showToast(`🌐 Webpage Language set to ${lang}`);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    syncUserProfile(updatedProfile).catch(() => {});
    sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
    showToast('Tourist Profile successfully registered and synced with database!');
  };

  const handleSaveProviderProfile = (newProviderProfile: ServiceProviderProfile) => {
    setProviderProfile(newProviderProfile);
    saveStoredProviderProfile(newProviderProfile);
    syncProviderProfile(newProviderProfile).catch(() => {});
    sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
    showToast(`Service Provider (${newProviderProfile.businessName}) successfully registered & verified!`);
  };

  const handleDeleteProfile = () => {
    deleteStoredProfile();
    setUserProfile({ ...DEFAULT_USER_PROFILE, isRegistered: false });
    sessionStorage.removeItem(GATEWAY_SHOWN_KEY);
    setActiveTab('dashboard');
    showToast('Tourist profile deleted. Switched back to Guest Explore Mode.');
  };

  const handleDeleteProviderProfile = () => {
    deleteStoredProviderProfile();
    setProviderProfile(null);
    sessionStorage.removeItem(GATEWAY_SHOWN_KEY);
    setActiveTab('dashboard');
    showToast('Service Provider profile successfully deleted.');
  };

  const handleLoginSuccess = (result: { type: 'tourist'; profile: UserProfile } | { type: 'provider'; profile: ServiceProviderProfile }) => {
    sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
    setIsGatewayOpen(false);
    setIsLoginOpen(false);

    if (result.type === 'tourist') {
      setUserProfile(result.profile);
      saveStoredProfile(result.profile);
      setActiveTab('dashboard');
      showToast(`Welcome back, ${result.profile.name}! Logged in as Tourist.`);
    } else {
      setProviderProfile(result.profile);
      saveStoredProviderProfile(result.profile);
      setActiveTab('dashboard');
      showToast(`Welcome back, ${result.profile.businessName || result.profile.providerName}! Logged in as Partner.`);
    }
  };

  const handleLogout = () => {
    deleteStoredProfile();
    deleteStoredProviderProfile();
    setUserProfile({ ...DEFAULT_USER_PROFILE, isRegistered: false });
    setProviderProfile(null);
    sessionStorage.removeItem(GATEWAY_SHOWN_KEY);
    setIsGatewayOpen(true);
    setActiveTab('dashboard');
    showToast('Logged out successfully. Welcome back to TripNova Gateway!');
  };

  const handleSaveTrip = (newTrip: TripPlan) => {
    if (!userProfile.isRegistered) {
      setIsRegisterOpen(true);
      return;
    }
    const updated = [newTrip, ...trips];
    setTrips(updated);
    saveStoredTrips(updated);
    showToast(`Trip plan "${newTrip.title}" saved successfully!`);
  };

  const activeTrip = trips.length > 0 ? trips[0] : undefined;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        providerProfile={providerProfile}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenProviderRegister={() => setIsProviderRegisterOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          fontSize: '0.82rem',
          fontWeight: 700
        }} className="animate-fade">
          <CheckCircle style={{ width: '18px', height: '18px', color: '#34d399' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Explore Mode Banner if not yet registered */}
      {!userProfile.isRegistered && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(88, 28, 135, 0.6) 0%, rgba(15, 23, 42, 0.95) 100%)',
          borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#e9d5ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <span>🔍 You are browsing in <strong>Explore Mode</strong>. Register your Tourist Profile to unlock your personalized Emergency Card & Itinerary Saving.</span>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
          >
            <UserPlus style={{ width: '12px', height: '12px' }} /> Register Now
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            providerProfile={providerProfile}
            activeTrip={activeTrip}
            onNavigateTab={setActiveTab}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenProviderRegister={() => setIsProviderRegisterOpen(true)}
            onOpenSOS={() => setIsSOSModalOpen(true)}
          />
        )}

        {activeTab === 'spots' && (
          <SpotsExplorer
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'planner' && (
          <TripPlanner
            trips={trips}
            onSaveTrip={handleSaveTrip}
            providerProfile={providerProfile}
          />
        )}

        {activeTab === 'emergency-card' && (
          <EmergencyCard
            userProfile={userProfile}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onTriggerSOS={() => setIsSOSModalOpen(true)}
          />
        )}

        {activeTab === 'safety-hub' && (
          <SafetyHub
            userProfile={userProfile}
            isSOSModalOpen={isSOSModalOpen}
            setIsSOSModalOpen={setIsSOSModalOpen}
          />
        )}

        {activeTab === 'anti-scam' && (
          <AntiScamEstimator />
        )}

        {activeTab === 'tools' && (
          <TravelTools />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            providerProfile={providerProfile}
            onEditProfile={() => setIsRegisterOpen(true)}
            onEditProviderProfile={() => setIsProviderRegisterOpen(true)}
            onNavigateTab={setActiveTab}
            onDeleteProfile={handleDeleteProfile}
            onDeleteProviderProfile={handleDeleteProviderProfile}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Floating AI Chatbot Button */}
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="floating-bot-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        title="Open Nova AI Travel Concierge"
      >
        <Sparkles style={{ width: '22px', height: '22px' }} />
      </button>

      {/* 1. Welcome Gateway: 3 Options + Login */}
      <WelcomeGateway
        isOpen={isGatewayOpen}
        onSelectRegister={handleSelectRegisterFromGateway}
        onSelectExplore={handleSelectExploreFromGateway}
        onSelectProviderRegister={handleSelectProviderRegisterFromGateway}
        onOpenLogin={() => {
          sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
          setIsGatewayOpen(false);
          setIsLoginOpen(true);
        }}
        onLocationDetected={handleLocationDetectedFromGateway}
        onLanguageChanged={handleLanguageChangedFromGateway}
      />

      {/* 2. Login & Password Reset Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenTouristRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onOpenProviderRegister={() => {
          setIsLoginOpen(false);
          setIsProviderRegisterOpen(true);
        }}
      />

      {/* 3. Consumer / Tourist Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* 4. Service Provider Registration Modal */}
      <ServiceProviderModal
        isOpen={isProviderRegisterOpen}
        onClose={() => setIsProviderRegisterOpen(false)}
        onSaveProviderProfile={handleSaveProviderProfile}
        existingProfile={providerProfile}
      />

      {/* 5. Nova AI Concierge */}
      <NovaAIBot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        userProfile={userProfile}
        activeTrip={activeTrip}
        onNavigateTab={setActiveTab}
      />

      {/* 6. Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
