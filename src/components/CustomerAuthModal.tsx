import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
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
    setActivePage,
  } = useStore();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('Rajasthan');
  const [regPincode, setRegPincode] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email address or mobile number');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password');
      return;
    }

    const res = loginCustomer(loginIdentifier, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Full name is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setRegError('Please enter a valid email address');
      return;
    }
    if (!/^\d{10}$/.test(regPhone.replace(/\D/g, ''))) {
      setRegError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }

    const res = registerCustomer({
      fullName: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      addressLine: regAddress,
      city: regCity,
      state: regState,
      pincode: regPincode,
    });

    if (!res.success) {
      setRegError(res.message);
    } else {
      // Clear fields
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegAddress('');
      setRegCity('');
      setRegPincode('');
    }
  };

  const fillDemoCredentials = () => {
    setLoginIdentifier('ananya.sharma@example.com');
    setLoginPassword('password123');
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F3E9EB] max-w-md w-full border border-[#D5C2D7] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D5C2D7] flex items-center justify-between bg-[#F3E9EB]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#8C5A7D]" />
            <h3 className="font-serif text-lg font-bold text-[#554052]">
              {authModalMode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setLoginError(null);
              setRegError(null);
            }}
            className="p-1 text-[#554052] hover:text-[#8C5A7D]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Sign In vs Create Account */}
        <div className="grid grid-cols-2 border-b border-[#D5C2D7] bg-white text-xs font-semibold uppercase tracking-wider text-center">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setLoginError(null);
            }}
            className={`py-3 transition-colors ${
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
              setRegError(null);
            }}
            className={`py-3 transition-colors ${
              authModalMode === 'register'
                ? 'text-[#8C5A7D] border-b-2 border-[#8C5A7D] bg-[#F3E9EB] font-bold'
                : 'text-[#A185A4] hover:text-[#554052]'
            }`}
          >
            New User? Register
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#554052]">
          {/* Brand Logo */}
          <div className="text-center flex justify-center py-1">
            <AdaahLogo variant="primary" showTagline={true} className="mx-auto max-w-[210px]" />
          </div>

          {/* VIEW A: SIGN IN FORM */}
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs">
                  {loginError}
                </div>
              )}

              {/* Email or Phone Field */}
              <div>
                <label className="block font-medium text-[#554052] mb-1">
                  Email ID or Mobile Number *
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
                    onClick={() => fillDemoCredentials()}
                    className="text-[10px] text-[#8C5A7D] hover:underline font-semibold"
                  >
                    Use Demo Credentials
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
                    className="absolute right-3 top-3 text-[#A185A4] hover:text-[#554052]"
                  >
                    {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D5C2D7]" />
              </button>

              {/* Fast Demo Account helper */}
              <div className="p-3 bg-[#F3E9EB] border border-[#D5C2D7] text-[11px] space-y-1">
                <span className="font-semibold text-[#8C5A7D] block">Testing customer account?</span>
                <p className="text-[#A185A4]">
                  Click below to fill sample account details:
                </p>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="mt-1 text-[11px] text-[#8C5A7D] font-semibold underline"
                >
                  Fill Demo: ananya.sharma@example.com / password123
                </button>
              </div>
            </form>
          ) : (
            /* VIEW B: CREATE ACCOUNT (REGISTER) FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
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
                  Mobile Number (for WhatsApp updates & Login) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full bg-white border border-[#D5C2D7] pl-9 pr-3 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                  <Phone className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-medium text-[#554052] mb-1">Create Password *</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-white border border-[#D5C2D7] pl-9 pr-9 py-2 text-xs text-[#554052] outline-none focus:border-[#8C5A7D]"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-[#A185A4] absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-[#A185A4] hover:text-[#554052]"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
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
                      onChange={(e) => setRegPincode(e.target.value)}
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
                className="w-full py-3 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Create HOUSE OF RII Account</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D5C2D7]" />
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F3E9EB] border-t border-[#D5C2D7] text-center text-[11px] text-[#A185A4]">
          <span>Protected by HOUSE OF RII Customer Privacy Guidelines.</span>
        </div>
      </div>
    </div>
  );
};
