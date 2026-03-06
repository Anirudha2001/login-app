'use client';

import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function AppointmentScheduledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <FiCheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booked!</h1>
        <p className="text-gray-600 mb-8">
          Your appointment has been successfully scheduled. You will receive a confirmation via email.
        </p>

        <div className="bg-green-50 p-4 rounded-lg mb-8 text-left">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">What's next?</span>
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your email for confirmation</li>
            <li>• View appointment details in your dashboard</li>
            <li>• Doctor may contact you before the appointment</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/home')}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
          >
            Go to Dashboard <FiArrowRight />
          </button>
          <button
            onClick={() => router.push('/appointments')}
            className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition"
          >
            Book Another
          </button>
        </div>
      </div>
    </div>
  );
}
