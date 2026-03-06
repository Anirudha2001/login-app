'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { OTPVerification } from '@/src/components/OTPVerification';
import { FiArrowLeft } from 'react-icons/fi';

export default function VerifyOTPPage() {
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const tempEmail = localStorage.getItem('tempEmail');

    if (userEmail) {
      router.push('/home');
    }

    if (!tempEmail) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => router.push('/login')}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back
      </button>

      <OTPVerification />

      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">Use any 6-digit code for testing</p>
      </div>
    </div>
  );
}
