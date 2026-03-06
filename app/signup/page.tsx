'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SignupForm } from '@/src/components/SignupForm';
import { FiArrowLeft } from 'react-icons/fi';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back
      </button>

      <SignupForm />

      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">All fields are required to create an account</p>
      </div>
    </div>
  );
}
