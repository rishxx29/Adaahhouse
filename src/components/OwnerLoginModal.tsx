import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OwnerLoginModal: React.FC = () => {
  const {
    isOwnerLoginModalOpen,
    setIsOwnerLoginModalOpen,
    loginAsOwner,
    setActivePage,
  } = useStore();

  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOwnerLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pin.trim()) {
      setError('Please enter your owner passcode');
      return;
    }

    const success = loginAsOwner(pin);
    if (success) {
      setPin('');
      setActivePage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Incorrect passcode. Please verify your owner credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F6F0F4] max-w-md w-full border border-[#D5C2D7] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D5C2D7] flex items-center justify-between bg-[#F6F0F4]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8C5A7D]" />
            <h3 className="font-serif text-lg font-bold text-[#554052]">
              HOUSE OF RII Owner Access
            </h3>
          </div>
          <button
            onClick={() => {
              setIsOwnerLoginModalOpen(false);
              setError(null);
              setPin('');
            }}
            className="p-1 text-[#554052] hover:text-[#8C5A7D]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5 text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-[#8C5A7D]/10 text-[#8C5A7D] flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6 text-[#A185A4]" />
            </div>
            <h4 className="font-serif text-base font-semibold text-[#554052]">
              Private Storefront Management
            </h4>
            <p className="text-xs text-[#554052]/80 leading-relaxed">
              This area is strictly restricted to the owner of HOUSE OF RII for uploading kurti images, setting sizes, and managing inventory.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#554052] mb-1">
              Owner Passcode:
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter owner passcode"
                autoFocus
                className="w-full bg-white border border-[#D5C2D7] px-3 py-2.5 text-xs text-[#554052] outline-none focus:border-[#8C5A7D] pr-10 font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A185A4] hover:text-[#554052] p-1"
                aria-label={showPin ? 'Hide passcode' : 'Show passcode'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-[11px] text-red-600 font-medium mt-1.5">{error}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsOwnerLoginModalOpen(false);
                setError(null);
                setPin('');
              }}
              className="px-4 py-2 text-xs font-medium text-[#554052] hover:bg-[#FAF5F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#8C5A7D] hover:bg-[#554052] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
            >
              Unlock Store Manager
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
