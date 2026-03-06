'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCalendar, FiClock, FiUser, FiFileText, FiTrash2 } from 'react-icons/fi';
import { Appointment, Prescription } from '@/src/types';
import { appointmentStore } from '@/src/utils/appointmentStore';
import { prescriptionStore } from '@/src/utils/prescriptionStore';
import { getDoctorWithOverrides } from '@/src/utils/getDoctorWithOverrides';

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      router.push('/login');
      return;
    }

    const apt = appointmentStore.getById(appointmentId);
    if (!apt || apt.patientEmail !== userEmail) {
      router.push('/home');
      return;
    }

    setAppointment(apt);

    // Get prescription if exists
    const prescriptions = prescriptionStore.getForPatient(userEmail);
    const rx = prescriptions.find((p) => p.appointmentId === appointmentId);
    if (rx) {
      setPrescription(rx);
    }

    setLoading(false);
  }, [appointmentId, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!appointment) {
    return <div className="min-h-screen flex items-center justify-center">Appointment not found</div>;
  }

  const doctor = getDoctorWithOverrides(appointment.doctorId);
  const canCancelAppointment =
    appointment.status === 'scheduled' &&
    new Date(`${appointment.date}T${appointment.time}`) > new Date();

  const handleCancel = () => {
    if (appointment?.status !== 'scheduled') return;
    const isPastOrNow = new Date(`${appointment.date}T${appointment.time}`) <= new Date();
    if (isPastOrNow) return;

    if (confirm('Are you sure you want to cancel this appointment?')) {
      const updated = appointmentStore.updateStatus(appointmentId, 'cancelled');
      if (updated) {
        setAppointment(updated);
      }
    }
  };

  const handleDownloadPrescription = () => {
    if (!prescription) return;

    const content = `
PRESCRIPTION
============

Doctor: Dr. ${prescription.doctorName}
Specialty: ${prescription.specialty}
Date: ${new Date(prescription.date).toLocaleDateString()}

DIAGNOSIS
---------
${prescription.diagnosis}

MEDICATIONS
-----------
${prescription.medications.map((med) => `${med.name} - ${med.dosage}, ${med.frequency}`).join('\n')}

NOTES
-----
${prescription.notes || 'None'}

${prescription.followUpDate ? `Follow-up Date: ${prescription.followUpDate}` : ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${appointmentId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 space-y-8">
          {/* Doctor Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Information</h2>
            {doctor && (
              <div className="space-y-3">
                <p className="text-lg">
                  <span className="font-semibold text-gray-900">Dr. {doctor.name}</span>
                </p>
                <p className="text-gray-700">{doctor.specialty}</p>
                <p className="text-gray-600">{doctor.qualification}</p>
                <p className="text-gray-600">{doctor.experience} years experience</p>
                <p className="text-gray-600">Clinic: {doctor.clinic}</p>
                <p className="text-gray-600">Phone: {doctor.phone}</p>
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Schedule</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <FiCalendar className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">{appointment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="text-lg font-semibold text-gray-900">{appointment.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiUser className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold capitalize">{appointment.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prescription */}
          {prescription && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText /> Prescription
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Diagnosis</p>
                  <p className="text-gray-700">{prescription.diagnosis}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-2">Medications</p>
                  <ul className="space-y-2">
                    {prescription.medications.map((med, idx) => (
                      <li key={idx} className="text-gray-700">
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-600">
                          {med.dosage} - {med.frequency} - {med.duration}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {prescription.notes && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Notes</p>
                    <p className="text-gray-700">{prescription.notes}</p>
                  </div>
                )}

                {prescription.followUpDate && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Follow-up Date</p>
                    <p className="text-gray-700">{prescription.followUpDate}</p>
                  </div>
                )}

                <button
                  onClick={handleDownloadPrescription}
                  className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  Download Prescription
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          {canCancelAppointment && (
            <div className="border-t pt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
              >
                <FiTrash2 /> Cancel Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
