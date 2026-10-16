import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  KeyRound,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AdaahLogo } from './AdaahLogo';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginCustomer,
    registerCustomer,
    sendPasswordResetOtp,
    resetCustomerPassword,
    authNoticeMessage,
    setAuthNoticeMessage,
  } = useStore();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('Rajasthan');
  const [regPincode, setRegPincode] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot Password / OTP state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [otpTargetMasked, setOtpTargetMasked] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setAuthNoticeMessage(null);
    setLoginError(null);
    setLoginSuccessMsg(null);
    setRegError(null);
    setForgotError(null);
    setForgotSuccess(null);
  };

  // 1. LOGIN SUBMIT
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMsg(null);

    const cleanId = loginIdentifier.trim();
    if (!cleanId) {
      setLoginError('Please enter your registered email address or 10-digit mobile number');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your account password');
      return;
    }

    const res = loginCustomer(cleanId, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  // 2. CREATE ACCOUNT (REGISTER) SUBMIT
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const cleanName = regName.trim();
    const cleanEmail = regEmail.trim();
    const cleanPhoneDigits = regPhone.replace(/\D/g, '');

    if (!cleanName) {
      setRegError('Full name is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setRegError('Please enter a valid email address');
      return;
    }
    if (!/^\d{10}$/.test(cleanPhoneDigits)) {
      setRegError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      return;
    }

    const res = registerCustomer({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhoneDigits,
      password: regPassword,
      addressLine: regAddress,
      city: regCity,
      state: regState,
      pincode: regPincode,
    });

    if (!res.success) {
      setRegError(res.message);
    } else {
      // Clear registration inputs
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegAddress('');
      setRegCity('');
      setRegPincode('');

      // Guide user to login with their new credentials
      setLoginIdentifier(cleanEmail);
      setLoginPassword('');
      setLoginSuccessMsg('Account created successfully! Please sign in with your password to continue.');
      setAuthModalMode('login');
    }
  };

  // 3. FORGOT PASSWORD: SEND OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const cleanId = forgotIdentifier.trim();
    if (!cleanId) {
      setForgotError('Please enter your registered mobile number or email address');
      return;
    }

    const res = sendPasswordResetOtp(cleanId);
    if (!res.success || !res.otp || !res.targetUser) {
      setForgotError(res.message);
      return;
    }

    setGeneratedOtp(res.otp);
    setEnteredOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotStep('verify');
    setResendCooldown(30);

    const isEmail = cleanId.includes('@');
    if (isEmail) {
      const parts = res.targetUser.email.split('@');
      const masked = `${parts[0].slice(0, 2)}***@${parts[1]}`;
      setOtpTargetMasked(masked);
    } else {
      const phoneDigits = res.targetUser.phone.replace(/\D/g, '');
      setOtpTargetMasked(`+91 ******${phoneDigits.slice(-4)}`);
    }

    setForgotSuccess(`OTP sent to ${isEmail ? res.targetUser.email : res.targetUser.phone}`);
  };

  // 4. FORGOT PASSWORD: RESET WITH OTP
  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (enteredOtp.trim() !== generatedOtp) {
      setForgotError('Invalid verification OTP. Please enter the 6-digit code shown or request a new OTP.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    const res = resetCustomerPassword(forgotIdentifier, newPassword);
    if (!res.success) {
      setForgotError(res.message);
      return;
    }

    // Success -> redirect to sign in with identifier prefilled
    setLoginIdentifier(forgotIdentifier);
    setLoginPassword('');
    setLoginSuccessMsg('Your password has been reset successfully! Please sign in with your new password.');
    setForgotStep('request');
    setGeneratedOtp(null);
    setAuthModalMode('login');
  };

  const fillDemoCredentials = () => {
    setLoginIdentifier('ananya.sharma@example.com');
    setLoginPassword('password123');
    setLoginError(null);
    setLoginSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F3E9EB] max-w-md w-full border border-[#D5C2D7] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D5C2D7] flex items-center justify-between bg-[#F3E9EB]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#8C5A7D]" />
            <h3 className="font-serif text-lg font-bold text-[#554052]">
              {authModalMode === 'login' && 'Customer Sign In'}
              {authModalMode === 'register' && 'Create Customer Account'}
              {authModalMode === 'forgot' && 'Reset Password with OTP'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-[#554052] hover:text-[#8C5A7D] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Sign In vs Create Account */}
        {authModalMode !== 'forgot' ? (
          <div className="grid grid-cols-2 border-b border-[#D5C2D7] bg-white text-xs font-semibold uppercase tracking-wider text-center">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setLoginError(null);
                setRegError(null);
              }}
              className={`py-3 transition-colors cursor-pointer ${
                authModalMode === 'login'
                  ? 'text-[#8C5A7D] border-b-2 border-[#8C5A7D] bg-[#F3E9EB] font-bold'
                  : 'text-[#A185A4] hover:text-[#554052]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setLoginError(null);
                setRegError(null);
              }}
              className={`py-3 transition-colors cursor-pointer ${
                authModalMode === 'register'
                  ? 'text-[#8C5A7D] border-b-2 border-[#8C5A7D] bg-[#F3E9EB] font-bold'
                  : 'text-[#A185A4] hover:text-[#554052]'
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="px-6 py-2.5 bg-white border-b border-[#D5C2D7] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setForgotError(null);
                setForgotStep('request');
              }}
              className="text-[#8C5A7D] hover:text-[#554052] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="text-[#A185A4] font-medium text-[11px]">OTP Verification</span>
          </div>
        )}

        {/* Notice Message if prompted from checkout / cart */}
        {authNoticeMessage && (
          <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">{authNoticeMessage}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#554052]">
          {/* Brand Logo */}
          <div className="text-center flex justify-center py-1">
            <AdaahLogo variant="primary" showTagline={true} className="mx-auto max-w-[210px]" />
          </div>

          {/* ========================================================= */}
          {/* VIEW 1: SIGN IN FORM                                      */}
          {/* ========================================================= */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{loginSuccessMsg}</span>
                </div>
              )}

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                  {loginError}
                </div>
              )}

              {/* Email or Phone Field */}
              <div>
                <label className="block font-medium text-[#554052] mb-1">
                  Registered Email ID or Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter email or 10-digit mobile number"
                    className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    autoFocus
                  />
                  <Mail className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3.5" />
                </div>
                <span className="text-[10px] text-[#A185A4] mt-1 block">
                  e.g. ananya.sharma@example.com or 9829012345
                </span>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-[#554052]">Password *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(loginIdentifier.trim());
                      setAuthModalMode('forgot');
                      setForgotStep('request');
                      setForgotError(null);
                    }}
                    className="text-[11px] text-[#8C5A7D] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-white border border-[#D5C2D7] pl-9 pr-9 py-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-[#A185A4] hover:text-[#554052] cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D5C2D7]" />
              </button>

              {/* Switch to Create Account link */}
              <div className="pt-2 text-center text-xs text-[#554052]">
                <span>New to HOUSE OF RII? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setLoginError(null);
                    setRegError(null);
                  }}
                  className="font-bold text-[#8C5A7D] hover:underline ml-1 cursor-pointer"
                >
                  Create an Account
                </button>
              </div>

              {/* Demo Account shortcut helper */}
              <div className="p-2.5 bg-white/70 border border-[#D5C2D7] text-[11px] flex items-center justify-between">
                <span className="text-[#A185A4]">Testing account?</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] text-[#8C5A7D] font-semibold hover:underline cursor-pointer"
                >
                  Fill Sample: Ananya Sharma
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: CREATE ACCOUNT (REGISTER) FORM                    */}
          {/* ========================================================= */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-2.5 bg-white/70 border border-[#D5C2D7] text-[11px] text-[#554052] leading-relaxed">
                ✨ <strong>Create your HOUSE OF RII account</strong> to track shipments, view your ethnic orders, and enjoy faster checkouts.
              </div>

              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                  {regError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block font-medium text-[#554052] mb-1">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Radhika Verma"
                    className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-medium text-[#554052] mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. radhika@example.com"
                    className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3" />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block font-medium text-[#554052] mb-1">
                  Mobile Number (10 Digits) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9829012345"
                    maxLength={10}
                    className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                  <Phone className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3" />
                </div>
                <span className="text-[10px] text-[#A185A4] mt-0.5 block">
                  Used for order tracking, WhatsApp notifications, and login.
                </span>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#554052] mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-white border border-[#D5C2D7] pl-8 pr-7 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                      required
                    />
                    <Lock className="w-3 h-3 text-[#A185A4] absolute left-2.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-2.5 text-[#A185A4] hover:text-[#554052] cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#554052] mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-white border border-[#D5C2D7] pl-8 pr-7 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                      required
                    />
                    <Lock className="w-3 h-3 text-[#A185A4] absolute left-2.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute right-2 top-2.5 text-[#A185A4] hover:text-[#554052] cursor-pointer"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Shipping Address */}
              <div className="pt-2 border-t border-[#D5C2D7]">
                <span className="text-[11px] font-semibold text-[#8C5A7D] uppercase tracking-wider block mb-2">
                  Optional: Default Delivery Address
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House / Street address"
                    className="w-full bg-white border border-[#D5C2D7] px-3 py-1.5 text-xs text-[#554052] outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="City"
                      className="bg-white border border-[#D5C2D7] px-3 py-1.5 text-xs text-[#554052] outline-none"
                    />
                    <input
                      type="text"
                      value={regPincode}
                      onChange={(e) => setRegPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit Pincode"
                      maxLength={6}
                      className="bg-white border border-[#D5C2D7] px-3 py-1.5 text-xs text-[#554052] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Create Account</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D5C2D7]" />
              </button>

              {/* Back to Sign In Link */}
              <div className="pt-2 text-center text-xs text-[#554052]">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setRegError(null);
                  }}
                  className="font-bold text-[#8C5A7D] hover:underline ml-1 cursor-pointer"
                >
                  Sign In here
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: FORGOT PASSWORD (OTP VERIFICATION)                */}
          {/* ========================================================= */}
          {authModalMode === 'forgot' && (
            <div className="space-y-4">
              {forgotError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                  {forgotError}
                </div>
              )}

              {/* STEP 3A: REQUEST OTP */}
              {forgotStep === 'request' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="p-3 bg-white/70 border border-[#D5C2D7] rounded-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#8C5A7D] font-semibold text-xs">
                      <KeyRound className="w-3.5 h-3.5 text-[#8C5A7D]" />
                      <span>Password Reset via OTP</span>
                    </div>
                    <p className="text-[11px] text-[#554052] leading-relaxed">
                      Enter your registered email address or 10-digit mobile number. We will send a secure 6-digit verification OTP to reset your password.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium text-[#554052] mb-1">
                      Registered Email ID or Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="Enter email or 10-digit mobile number"
                        className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                        autoFocus
                        required
                      />
                      <Mail className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D5C2D7]" />
                  </button>
                </form>
              ) : (
                /* STEP 3B: ENTER OTP & NEW PASSWORD */
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-3.5">
                  {/* Generated OTP Alert Box */}
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>OTP Sent Successfully</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold">
                        Sent to: {otpTargetMasked}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      Enter the 6-digit OTP code below to set your new password.
                    </p>
                    {generatedOtp && (
                      <div className="p-2 bg-white border border-emerald-300 text-center rounded-xs mt-1">
                        <span className="text-[10px] text-[#A185A4] block uppercase tracking-wider">
                          Verification OTP Code:
                        </span>
                        <span className="font-mono text-base font-extrabold tracking-widest text-[#8C5A7D]">
                          {generatedOtp}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* OTP Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-[#554052]">6-Digit OTP Code *</label>
                      {resendCooldown > 0 ? (
                        <span className="text-[10px] text-[#A185A4]">Resend in {resendCooldown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[10px] text-[#8C5A7D] font-semibold hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2.5 text-center font-mono text-sm tracking-widest text-[#554052] outline-none focus:border-[#8C5A7D]"
                        autoFocus
                        required
                      />
                      <KeyRound className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3.5" />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block font-medium text-[#554052] mb-1">New Password (Min 6 chars) *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-white border border-[#D5C2D7] pl-9 pr-9 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                        required
                      />
                      <Lock className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-[#A185A4] hover:text-[#554052] cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block font-medium text-[#554052] mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                        required
                      />
                      <Lock className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Submit Reset Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Update Password & Proceed to Sign In</span>
                    <Check className="w-3.5 h-3.5 text-[#D5C2D7]" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F3E9EB] border-t border-[#D5C2D7] text-center text-[11px] text-[#A185A4]">
          <span>Protected by HOUSE OF RII Customer Security & Privacy Guidelines.</span>
        </div>
      </div>
    </div>
  );
};
