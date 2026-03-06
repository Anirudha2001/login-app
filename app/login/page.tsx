'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/src/components/LoginForm';
import { FiArrowLeft } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();

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

      <LoginForm />

      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">Testing the app? Use any email address</p>
      </div>
    </div>
  );
}
