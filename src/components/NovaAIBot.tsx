import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Compass
} from 'lucide-react';
import { UserProfile, TripPlan } from '../types';

interface NovaAIBotProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  activeTrip?: TripPlan;
  onNavigateTab: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionTab?: string;
  actionLabel?: string;
}

export const NovaAIBot: React.FC<NovaAIBotProps> = ({
  isOpen,
  onClose,
  userProfile,
  onNavigateTab
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Vanakkam ${userProfile.name ? userProfile.name.split(' ')[0] : 'Traveler'}! 🌟 I am Nova, your 24/7 AI Travel & Safety Concierge. How can I assist your trip today?`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend: string = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let reply = "I'm on it! Let me help you optimize that travel plan.";
      let actionTab: string | undefined = undefined;
      let actionLabel: string | undefined = undefined;

      if (lower.includes('emergency') || lower.includes('help') || lower.includes('doctor') || lower.includes('hospital')) {
        reply = `🚨 In case of medical emergency, your Blood Group is registered as ${userProfile.bloodGroup}. You can open your Digital Emergency Card or view nearest verified hospitals immediately.`;
        actionTab = 'emergency-card';
        actionLabel = 'Open Emergency Card';
      } else if (lower.includes('scam') || lower.includes('auto') || lower.includes('fare') || lower.includes('cab') || lower.includes('price')) {
        reply = `💡 For city trips in Tamil Nadu, standard auto-rickshaw fare is ₹35 base (first 1.5km) + ₹18/km. Use our Fare Guard calculator to check if you're being overcharged!`;
        actionTab = 'anti-scam';
        actionLabel = 'Check Fair Fare';
      } else if (lower.includes('translate') || lower.includes('language') || lower.includes('speak') || lower.includes('tamil')) {
        reply = `🗣️ You can translate voice or text instantly into Tamil, Hindi, or French in the Travel Tools tab.`;
        actionTab = 'tools';
        actionLabel = 'Open Translator';
      } else if (lower.includes('plan') || lower.includes('ooty') || lower.includes('itinerary') || lower.includes('trip')) {
        reply = `🏔️ Morning hours (8 AM - 11 AM) are optimal for visiting tea gardens and mountain train rides in Ooty. Carry a light jacket!`;
        actionTab = 'planner';
        actionLabel = 'View Trip Planner';
      } else {
        reply = `Great travel query! I have matched this with your preferences (${userProfile.interestedTopPicks.slice(0, 2).join(', ')}). Always ensure you verify local tariffs and keep your emergency pass handy.`;
      }

      const botMsg: Message = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: 'Now',
        actionTab,
        actionLabel
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  const QUICK_PROMPTS = [
    'How to avoid auto rickshaw scams?',
    'What is the fair fare for 5km?',
    'Where is the nearest hospital?',
    'Translate vegetarian food request to Tamil'
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 60,
      width: '100%',
      maxWidth: '420px',
      height: '520px',
      background: '#090e17',
      borderRadius: '24px',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backdropFilter: 'blur(16px)'
    }} className="animate-fade">
      {/* Bot Header */}
      <div style={{ padding: '16px', background: 'linear-gradient(90deg, rgba(88, 28, 135, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
            <Sparkles style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Nova AI Travel Concierge
              <span className="badge badge-purple">24/7 AI</span>
            </h3>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Intelligent tourist guide & safety advisor</p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '16px',
                maxWidth: '85%',
                fontSize: '0.78rem',
                lineHeight: 1.5,
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)' : 'rgba(15, 23, 42, 0.9)',
                color: '#ffffff',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <p>{msg.text}</p>
              {msg.actionTab && (
                <button
                  onClick={() => {
                    onNavigateTab(msg.actionTab!);
                    onClose();
                  }}
                  className="btn-secondary"
                  style={{ marginTop: '8px', padding: '4px 10px', fontSize: '0.72rem', color: '#38bdf8', width: '100%', justifyContent: 'center' }}
                >
                  <Compass style={{ width: '14px', height: '14px' }} /> {msg.actionLabel}
                </button>
              )}
            </div>
            <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px', paddingInline: '4px' }}>{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '8px 12px', background: 'rgba(10, 15, 29, 0.7)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 600,
              background: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        style={{ padding: '12px', background: '#090e17', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask Nova anything about your trip..."
          className="input-glass"
          style={{ paddingBlock: '8px', fontSize: '0.78rem', flex: 1 }}
        />
        <button
          type="submit"
          style={{
            padding: '8px',
            background: '#9333ea',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Send style={{ width: '16px', height: '16px' }} />
        </button>
      </form>
    </div>
  );
};
