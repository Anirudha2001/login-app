'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export function DoctorLoginForm() {
  const router = useRouter();
  const { doctorLogin, loading, error: authError } = useAuth();
  const [doctorId, setDoctorId] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);

    if (!doctorId.trim()) {
      setLocalError('Doctor ID is required');
      return;
    }

    const success = await doctorLogin(doctorId);
    if (success) {
      setSuccess(true);
      setTimeout(() => router.push('/doctor/verify-otp'), 500);
    } else {
      setLocalError(authError || 'Failed to login');
    }
  };

  const presetDoctors = ['DOC001', 'DOC002', 'DOC003', 'DOC004', 'DOC005'];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <FiUser className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Doctor Login</h1>
          <p className="text-gray-600">Access your doctor dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
              Doctor ID
            </label>
            <input
              id="doctorId"
              type="text"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value.toUpperCase())}
              placeholder="DOC001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500">Example: DOC001, DOC002, etc.</p>
          </div>

          {(localError || authError) && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <FiAlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-red-700">{localError || authError}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">Redirecting to OTP verification...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !doctorId.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Send OTP'}
            <FiArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-3">
          <p className="text-xs text-gray-500 text-center">Demo Doctor IDs</p>
          <div className="grid grid-cols-3 gap-2">
            {presetDoctors.map((id) => (
              <button
                key={id}
                onClick={() => setDoctorId(id)}
                className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-gray-600 text-sm">
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
