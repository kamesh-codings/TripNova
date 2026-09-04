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
import { ProfileView } from './components/ProfileView';
import { NovaAIBot } from './components/NovaAIBot';
import { WelcomeGateway } from './components/WelcomeGateway';
import { UserProfile, TripPlan } from './types';
import { DEFAULT_USER_PROFILE } from './data/mockData';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  deleteStoredProfile,
  getStoredTrips, 
  saveStoredTrips 
} from './utils/storage';
import { Sparkles, UserPlus, CheckCircle } from 'lucide-react';

const GATEWAY_SHOWN_KEY = 'tripnova_gateway_dismissed';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredProfile);
  const [trips, setTrips] = useState<TripPlan[]>(getStoredTrips);
  
  // Flash Toast Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gateway state
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(() => {
    const profile = getStoredProfile();
    if (profile && profile.isRegistered) return false;
    const dismissed = sessionStorage.getItem(GATEWAY_SHOWN_KEY);
    return !dismissed;
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
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

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    sessionStorage.setItem(GATEWAY_SHOWN_KEY, 'true');
    showToast('Tourist Profile successfully registered and activated!');
  };

  const handleDeleteProfile = () => {
    deleteStoredProfile();
    setUserProfile({ ...DEFAULT_USER_PROFILE, isRegistered: false });
    sessionStorage.removeItem(GATEWAY_SHOWN_KEY);
    setActiveTab('dashboard');
    showToast('Tourist profile deleted. Switched back to Guest Explore Mode.');
  };

  const handleSaveTrip = (newTrip: TripPlan) => {
    if (!userProfile.isRegistered) {
      setIsRegisterOpen(true);
      return;
    }
    const updated = [newTrip, ...trips];
    setTrips(updated);
    saveStoredTrips(updated);
    setActiveTab('planner');
    showToast('Itinerary plan saved successfully!');
  };

  const activeTrip = trips.length > 0 ? trips[0] : undefined;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
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
            activeTrip={activeTrip}
            onNavigateTab={setActiveTab}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenSOS={() => setIsSOSModalOpen(true)}
          />
        )}

        {activeTab === 'planner' && (
          <TripPlanner
            trips={trips}
            onSaveTrip={handleSaveTrip}
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
            onEditProfile={() => setIsRegisterOpen(true)}
            onNavigateTab={setActiveTab}
            onDeleteProfile={handleDeleteProfile}
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

      {/* 1. Welcome Gateway: Register vs Explore on Start */}
      <WelcomeGateway
        isOpen={isGatewayOpen}
        onSelectRegister={handleSelectRegisterFromGateway}
        onSelectExplore={handleSelectExploreFromGateway}
      />

      {/* 2. Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* 3. Nova AI Concierge */}
      <NovaAIBot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        userProfile={userProfile}
        activeTrip={activeTrip}
        onNavigateTab={setActiveTab}
      />

      {/* 4. Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
