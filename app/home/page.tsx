'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiLogOut, FiCalendar, FiFileText, FiUser } from 'react-icons/fi';
import { appointmentStore } from '@/src/utils/appointmentStore';
import { prescriptionStore } from '@/src/utils/prescriptionStore';
import { Appointment, Prescription } from '@/src/types';

export default function HomePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'prescriptions' | 'profile'>('appointments');
  const appointmentStats = appointments.reduce(
    (stats, appointment) => {
      stats[appointment.status] += 1;
      return stats;
    },
    {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      rescheduled: 0,
    } as Record<Appointment['status'], number>
  );

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
      return;
    }

    setUserEmail(email);
    setAppointments(appointmentStore.getForPatient(email));
    setPrescriptions(prescriptionStore.getForPatient(email));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    if (!appointment || appointment.status !== 'scheduled') return;

    const isPastOrNow = new Date(`${appointment.date}T${appointment.time}`) <= new Date();
    if (isPastOrNow) return;

    if (confirm('Are you sure you want to cancel this appointment?')) {
      appointmentStore.updateStatus(appointmentId, 'cancelled');
      setAppointments(appointmentStore.getForPatient(userEmail));
    }
  };

  const handleBookNew = () => {
    router.push('/appointments');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600">Welcome, {userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'appointments'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <FiCalendar /> Appointments
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'prescriptions'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <FiFileText /> Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'profile'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <FiUser /> Profile
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-green-700 mt-1">{appointmentStats.scheduled}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Completed
                </p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{appointmentStats.completed}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-red-700 mt-1">{appointmentStats.cancelled}</p>
              </div>
            </div>

            <button
              onClick={handleBookNew}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Book New Appointment
            </button>

            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No appointments scheduled</p>
                <button
                  onClick={handleBookNew}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Book your first appointment
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((apt) => {
                  const appointmentDateTime = new Date(`${apt.date}T${apt.time}`);
                  const canCancel = apt.status === 'scheduled' && appointmentDateTime > new Date();

                  return (
                    <div
                      key={apt.id}
                      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Dr. {apt.doctorName}
                          </h3>
                          <p className="text-gray-600">{apt.specialty}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          apt.status === 'scheduled'
                            ? 'bg-green-100 text-green-700'
                            : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-gray-700">
                          <span className="font-medium">Date & Time:</span> {apt.date} at {apt.time}
                        </p>
                        {apt.notes && (
                          <p className="text-gray-700">
                            <span className="font-medium">Notes:</span> {apt.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/appointment/${apt.id}`)}
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 font-medium transition"
                        >
                          View Details
                        </button>
                        {canCancel && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 font-medium transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            {prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No prescriptions available</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Dr. {rx.doctorName}
                    </h3>
                    <p className="text-gray-600 mb-4">{rx.specialty}</p>

                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">Diagnosis</p>
                      <p className="text-gray-700 mb-4">{rx.diagnosis}</p>

                      <p className="font-medium text-gray-900">Medications</p>
                      <ul className="space-y-2 mb-4">
                        {rx.medications.map((med, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">
                            - {med.name} - {med.dosage}, {med.frequency}
                          </li>
                        ))}
                      </ul>

                      {rx.notes && (
                        <>
                          <p className="font-medium text-gray-900">Notes</p>
                          <p className="text-gray-700 text-sm mb-4">{rx.notes}</p>
                        </>
                      )}

                      <p className="text-xs text-gray-500">
                        Date: {new Date(rx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700 mb-2">Email Address</p>
                <p className="text-gray-900">{userEmail}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Account Type</p>
                <p className="text-gray-900">Patient</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Total Appointments</p>
                <p className="text-gray-900">{appointments.length}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Cancelled Appointments</p>
                <p className="text-gray-900">{appointmentStats.cancelled}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">Total Prescriptions</p>
                <p className="text-gray-900">{prescriptions.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
