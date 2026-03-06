'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { FiLock, FiArrowRight, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export function DoctorOTPVerification() {
  const router = useRouter();
  const { verifyDoctorOTP, loading, error: authError } = useAuth();
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!otp.trim()) {
      setLocalError('OTP is required');
      return;
    }

    const success = await verifyDoctorOTP(otp);
    if (success) {
      setSuccess(true);
      setTimeout(() => router.push('/doctor/dashboard'), 500);
    } else {
      setLocalError(authError || 'OTP verification failed');
    }
  };

  const handleResend = () => {
    setTimer(120);
    setCanResend(false);
    setOtp('');
    setLocalError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <FiLock className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Verify OTP</h1>
          <p className="text-gray-600">We've sent an OTP to your registered number</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter 6-Digit OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono"
            />
            <p className="text-xs text-gray-500 text-center">
              Resend available in: {timer > 0 ? `${timer}s` : 'Now'}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">Demo: Use any 6-digit code</p>
          </div>

          {(localError || authError) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <FiAlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-red-700">{localError || authError}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FiCheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-green-700">Verified! Redirecting...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6 || success}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
            <FiArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-gray-600 text-sm">
            Didn't receive the OTP?{' '}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
