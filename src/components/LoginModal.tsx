import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Building2
} from 'lucide-react';
import { 
  UserProfile, 
  ServiceProviderProfile 
} from '../types';
import { 
  authenticateAccount, 
  findAccountByEmail, 
  updateAccountPassword 
} from '../utils/storage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (result: { type: 'tourist'; profile: UserProfile } | { type: 'provider'; profile: ServiceProviderProfile }) => void;
  onOpenTouristRegister: () => void;
  onOpenProviderRegister: () => void;
}

type ModalView = 'login' | 'forgot_email' | 'reset_otp_password' | 'reset_success';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenTouristRegister,
  onOpenProviderRegister
}) => {
  const [view, setView] = useState<ModalView>('login');
  const [roleType, setRoleType] = useState<'tourist' | 'provider'>('tourist');

  // Login form state
  const [identifier, setIdentifier] = useState(''); // username or email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password flow state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailSentNotice, setEmailSentNotice] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = authenticateAccount(identifier, password);
      setIsSubmitting(false);

      if (result) {
        onLoginSuccess(result);
        onClose();
        // Reset state
        setIdentifier('');
        setPassword('');
      } else {
        setLoginError('Invalid Username/Email or Password. Please check credentials or use Forgot Password.');
      }
    }, 400);
  };

  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    const cleanEmail = recoveryEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setResetError('Please enter your registered email address.');
      return;
    }

    const found = findAccountByEmail(cleanEmail);
    if (!found) {
      setResetError(`No account registered with email "${cleanEmail}". Please check your email or register a new account.`);
      return;
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setEmailSentNotice(`A password reset verification code has been dispatched to ${cleanEmail}. (Code: ${code})`);
    setView('reset_otp_password');
  };

  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (resetCodeInput.trim() !== generatedCode.trim()) {
      setResetError('Invalid verification code. Please enter the 6-digit code sent to your email.');
      return;
    }

    if (newPassword.length < 4) {
      setResetError('New password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please verify.');
      return;
    }

    const updated = updateAccountPassword(recoveryEmail.trim().toLowerCase(), newPassword);
    if (updated) {
      setView('reset_success');
    } else {
      setResetError('Failed to update password. Please try again.');
    }
  };

  const handleSuccessLoginNow = () => {
    const result = authenticateAccount(recoveryEmail.trim().toLowerCase(), newPassword);
    if (result) {
      onLoginSuccess(result);
      onClose();
    } else {
      setView('login');
      setIdentifier(recoveryEmail);
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 120, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        background: 'rgba(5, 8, 16, 0.88)', 
        backdropFilter: 'blur(16px)' 
      }}
      className="animate-fade"
    >
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          background: '#090e17', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
        }}
      >
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
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: roleType === 'provider' 
                ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: roleType === 'provider' ? '#000' : '#fff',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.25)'
            }}>
              {view === 'login' ? <Lock style={{ width: '20px', height: '20px' }} /> : <KeyRound style={{ width: '20px', height: '20px' }} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                {view === 'login' && 'Account Login'}
                {view === 'forgot_email' && 'Reset Your Password'}
                {view === 'reset_otp_password' && 'Enter Verification Code'}
                {view === 'reset_success' && 'Password Updated!'}
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {view === 'login' && 'Sign in to access your travel safety profile & tools'}
                {view === 'forgot_email' && 'We will send a reset code to your registered email'}
                {view === 'reset_otp_password' && 'Set a new password for your account'}
                {view === 'reset_success' && 'Your account is secured with the new password'}
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

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* ============================================================ */}
          {/* 1. LOGIN VIEW */}
          {/* ============================================================ */}
          {view === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade">
              {/* Role Indicator / Switcher */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRoleType('tourist')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: roleType === 'tourist' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    color: roleType === 'tourist' ? '#38bdf8' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <User style={{ width: '14px', height: '14px' }} />
                  <span>Tourist User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoleType('provider')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: roleType === 'provider' ? 'rgba(251, 191, 36, 0.2)' : 'transparent',
                    color: roleType === 'provider' ? '#fbbf24' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Building2 style={{ width: '14px', height: '14px' }} />
                  <span>Service Provider</span>
                </button>
              </div>

              {loginError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Username or Registered Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={roleType === 'tourist' ? 'e.g. kamesh_traveler or email' : 'e.g. murugan_travels or email'}
                    className="input-glass"
                    style={{ paddingLeft: '38px' }}
                    autoFocus
                  />
                  <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8' }}>
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginError(null);
                      setRecoveryEmail(identifier.includes('@') ? identifier : '');
                      setView('forgot_email');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="input-glass"
                    style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  />
                  <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  background: roleType === 'provider' ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' : undefined,
                  color: roleType === 'provider' ? '#000000' : undefined
                }}
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Account'}</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>

              {/* Registration Options Footer */}
              <div style={{
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Don't have an account yet?
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTouristRegister();
                    }}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem', color: '#38bdf8' }}
                  >
                    Register as Tourist
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenProviderRegister();
                    }}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.74rem', color: '#fbbf24' }}
                  >
                    Register as Partner
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* 2. FORGOT PASSWORD - EMAIL INPUT VIEW */}
          {/* ============================================================ */}
          {view === 'forgot_email' && (
            <form onSubmit={handleSendResetEmail} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade">
              <div style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                fontSize: '0.78rem',
                color: '#93c5fd',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <Mail style={{ width: '18px', height: '18px', flexShrink: 0, color: '#38bdf8' }} />
                <span>Enter the email address used during your Tourist or Service Provider registration. We will send a secure reset verification code.</span>
              </div>

              {resetError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>{resetError}</span>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Registered Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={e => setRecoveryEmail(e.target.value)}
                    placeholder="e.g. kamesh.travel@gmail.com"
                    className="input-glass"
                    style={{ paddingLeft: '38px' }}
                    autoFocus
                  />
                  <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }}
                >
                  <ArrowLeft style={{ width: '14px', height: '14px' }} />
                  <span>Back to Login</span>
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1.5, padding: '10px', fontSize: '0.84rem' }}
                >
                  <span>Send Reset Code</span>
                  <ArrowRight style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* 3. RESET OTP & NEW PASSWORD VIEW */}
          {/* ============================================================ */}
          {view === 'reset_otp_password' && (
            <form onSubmit={handleCompleteReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade">
              {emailSentNotice && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  fontSize: '0.78rem',
                  color: '#34d399',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <CheckCircle2 style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  <span>{emailSentNotice}</span>
                </div>
              )}

              {resetError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>{resetError}</span>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  6-Digit Verification Code (Sent to Email) *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={resetCodeInput}
                  onChange={e => setResetCodeInput(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="input-glass"
                  style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  New Secure Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="input-glass"
                    style={{ paddingRight: '38px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showNewPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Confirm New Password *
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="input-glass"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView('forgot_email')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }}
                >
                  <ArrowLeft style={{ width: '14px', height: '14px' }} />
                  <span>Resend</span>
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1.5, padding: '10px', fontSize: '0.84rem' }}
                >
                  <span>Update & Reset</span>
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* 4. RESET SUCCESS CELEBRATION VIEW */}
          {/* ============================================================ */}
          {view === 'reset_success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '12px 0' }} className="animate-fade">
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(52, 211, 153, 0.15)',
                border: '2px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <CheckCircle2 style={{ width: '36px', height: '36px' }} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  Password Reset Successfully!
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '340px' }}>
                  Your password for <strong style={{ color: '#38bdf8' }}>{recoveryEmail}</strong> has been updated. You can now sign in immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSuccessLoginNow}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
                <span>Sign In Automatically Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
