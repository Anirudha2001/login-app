'use client';

import { useRouter } from 'next/navigation';
import { FiArrowRight, FiAward, FiClock, FiHeart, FiShield } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">MedBooking</div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Patient Login
            </button>
            <button
              onClick={() => router.push('/doctor/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Doctor Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Your Health, Our Priority
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Book appointments with qualified doctors, manage your health records, and get
          prescriptions all in one place.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 transition transform hover:scale-105"
          >
            Book Appointment <FiArrowRight />
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
          >
            Create Account
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <FiClock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Easy Booking</h3>
            <p className="text-gray-600 text-sm">Book appointments in minutes</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <FiAward className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Qualified Doctors</h3>
            <p className="text-gray-600 text-sm">Only verified medical professionals</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <FiShield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your data is safe with us</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <FiHeart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Better Health</h3>
            <p className="text-gray-600 text-sm">Manage your health easily</p>
          </div>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="bg-white rounded-lg shadow-md max-w-2xl mx-auto my-16 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Demo Credentials</h3>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700">Patient Login</p>
            <p className="text-gray-600 text-sm">Email: arjun@example.com (use any email)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Doctor Login</p>
            <p className="text-gray-600 text-sm">Doctor IDs: DOC001, DOC002, DOC003, etc.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">OTP Verification</p>
            <p className="text-gray-600 text-sm">Use any 6-digit code (e.g., 123456)</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>&copy; 2024 MedBooking. All rights reserved.</p>
      </footer>
    </div>
  );
}