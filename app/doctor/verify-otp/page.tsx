'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DoctorOTPVerification } from '@/src/components/DoctorOTPVerification';
import { FiArrowLeft } from 'react-icons/fi';

export default function DoctorVerifyOTPPage() {
  const router = useRouter();

  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');
    const tempDoctorId = localStorage.getItem('tempDoctorId');

    if (doctorId) {
      router.push('/doctor/dashboard');
    }

    if (!tempDoctorId) {
      router.push('/doctor/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => router.push('/doctor/login')}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back
      </button>

      <DoctorOTPVerification />
    </div>
  );
}
