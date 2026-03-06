'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDoctorDashboard } from '@/src/hooks/useDoctorDashboard';
import {
  FiLogOut,
  FiSave,
  FiRotateCcw,
  FiCalendar,
  FiEdit2,
  FiFileText,
} from 'react-icons/fi';
import { appointmentStore } from '@/src/utils/appointmentStore';
import { prescriptionStore } from '@/src/utils/prescriptionStore';
import { Appointment, Medication } from '@/src/types';
import { generatePreviewSlots } from '@/src/utils/timeUtils';

type PrescriptionForm = {
  diagnosis: string;
  medications: Medication[];
  notes: string;
  followUpDate: string;
};

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState('');
  const { doctor, hasChanges, save, reset, logout, updateField } = useDoctorDashboard(
    doctorId || ''
  );

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'prescriptions'>(
    'profile'
  );
  const [editMode, setEditMode] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState<PrescriptionForm>({
    diagnosis: '',
    medications: [{ id: '1', name: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
    followUpDate: '',
  });
  const parseNumberOrFallback = (value: string, fallback: number) => {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  };
  const hasPrescriptionForAppointment = (appointmentId: string) =>
    prescriptionStore.getAll().some((p) => p.appointmentId === appointmentId);
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
    const id = localStorage.getItem('doctorId');
    if (!id) {
      router.push('/doctor/login');
      return;
    }
    setDoctorId(id);
  }, [router]);

  useEffect(() => {
    if (doctor) {
      setAppointments(appointmentStore.getForDoctor(doctor.id));
    }
  }, [doctor]);

  const handleSave = () => {
    const success = save();
    if (success) {
      setEditMode(false);
      alert('Changes saved successfully!');
    }
  };

  const handleAddMedication = () => {
    setPrescriptionForm((prev: PrescriptionForm) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { id: Date.now().toString(), name: '', dosage: '', frequency: '', duration: '' },
      ],
    }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    setPrescriptionForm((prev: PrescriptionForm) => ({
      ...prev,
      medications: prev.medications.map((med: Medication, i: number) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleSavePrescription = () => {
    if (!selectedAppointment) return;

    const validMedications = prescriptionForm.medications.filter(
      (m: Medication) => m.name && m.dosage && m.frequency
    );
    const hasExistingPrescription = prescriptionStore
      .getAll()
      .some((p) => p.appointmentId === selectedAppointment.id);

    if (!prescriptionForm.diagnosis.trim()) {
      alert('Diagnosis is required.');
      return;
    }

    if (validMedications.length === 0) {
      alert('Add at least one medication with name, dosage and frequency.');
      return;
    }

    if (hasExistingPrescription) {
      alert('A prescription already exists for this appointment.');
      return;
    }

    const prescription = {
      id: Date.now().toString(),
      appointmentId: selectedAppointment.id,
      doctorId: doctor!.id,
      doctorName: doctor!.name,
      specialty: doctor!.specialty,
      patientEmail: selectedAppointment.patientEmail,
      date: new Date().toISOString(),
      medications: validMedications,
      diagnosis: prescriptionForm.diagnosis,
      notes: prescriptionForm.notes,
      followUpDate: prescriptionForm.followUpDate,
      createdAt: new Date().toISOString(),
    };

    prescriptionStore.save(prescription);
    setShowPrescriptionForm(false);
    setPrescriptionForm({
      diagnosis: '',
      medications: [{ id: '1', name: '', dosage: '', frequency: '', duration: '' }],
      notes: '',
      followUpDate: '',
    });
    setSelectedAppointment(null);
    alert('Prescription saved successfully!');
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading doctor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600">Dr. {doctor.name} - {doctor.specialty}</p>
          </div>

          <div className="flex gap-3">
            {editMode && (
              <>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
                >
                  <FiSave /> Save
                </button>
                <button
                  onClick={() => {
                    reset();
                    setEditMode(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
                >
                  <FiRotateCcw /> Reset
                </button>
              </>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
              activeTab === 'profile'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <FiEdit2 /> Profile
          </button>
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
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={doctor.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{doctor.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Specialty</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={doctor.specialty}
                        onChange={(e) => updateField('specialty', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{doctor.specialty}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Qualification</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={doctor.qualification}
                        onChange={(e) => updateField('qualification', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{doctor.qualification}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Experience (years)</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={doctor.experience}
                        onChange={(e) =>
                          updateField(
                            'experience',
                            parseNumberOrFallback(e.target.value, doctor.experience)
                          )
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{doctor.experience} years</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Info */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Consultation Fee (Rs)</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={doctor.consultationFee}
                        onChange={(e) =>
                          updateField(
                            'consultationFee',
                            parseNumberOrFallback(e.target.value, doctor.consultationFee)
                          )
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">Rs {doctor.consultationFee}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Time</label>
                    {editMode ? (
                      <input
                        type="time"
                        value={doctor.availabilityHours.start}
                        onChange={(e) =>
                          updateField('availabilityHours', {
                            ...doctor.availabilityHours,
                            start: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{doctor.availabilityHours.start}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">End Time</label>
                    {editMode ? (
                      <input
                        type="time"
                        value={doctor.availabilityHours.end}
                        onChange={(e) =>
                          updateField('availabilityHours', {
                            ...doctor.availabilityHours,
                            end: e.target.value,
                          })
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{doctor.availabilityHours.end}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Slot Duration (minutes)
                    </label>
                    {editMode ? (
                      <input
                        type="number"
                        value={doctor.slotDurationMinutes}
                        onChange={(e) =>
                          updateField(
                            'slotDurationMinutes',
                            parseNumberOrFallback(e.target.value, doctor.slotDurationMinutes)
                          )
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      <p className="text-gray-900 mt-1">{doctor.slotDurationMinutes} minutes</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Available Slots Preview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Time Slots</h3>
              <div className="grid grid-cols-4 gap-2">
                {generatePreviewSlots(
                  doctor.availabilityHours.start,
                  doctor.availabilityHours.end,
                  doctor.slotDurationMinutes
                ).map((slot) => (
                  <div key={slot} className="px-3 py-2 bg-green-50 border border-green-200 rounded text-center text-sm font-medium text-green-700">
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
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

            {appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((apt: Appointment) => {
                  const hasPrescription = hasPrescriptionForAppointment(apt.id);
                  const canAddPrescription = apt.status !== 'cancelled' && !hasPrescription;

                  return (
                    <div
                      key={apt.id}
                      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Patient: {apt.patientEmail}
                          </h3>
                          <p className="text-gray-600">{apt.date} at {apt.time}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            apt.status === 'scheduled'
                              ? 'bg-green-100 text-green-700'
                              : apt.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : apt.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      {apt.notes && (
                        <p className="text-gray-600 mb-4">
                          <span className="font-medium">Notes:</span> {apt.notes}
                        </p>
                      )}

                      <button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setShowPrescriptionForm(true);
                        }}
                        disabled={!canAddPrescription}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition"
                      >
                        {hasPrescription ? 'Prescription Added' : 'Add Prescription'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Prescriptions</h2>
            <div className="grid gap-4">
              {prescriptionStore
                .getForDoctor(doctor.id)
                .map((rx) => (
                  <div
                    key={rx.id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {rx.patientEmail}
                    </h3>
                    <p className="text-gray-600 mb-4">{rx.diagnosis}</p>

                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">Medications</p>
                      <ul className="space-y-1">
                        {rx.medications.map((med, idx) => (
                          <li key={idx} className="text-gray-700 text-sm">
                            - {med.name} - {med.dosage}, {med.frequency}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Prescription Form Modal */}
      {showPrescriptionForm && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add Prescription for {selectedAppointment.patientEmail}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  value={prescriptionForm.diagnosis}
                  onChange={(e) =>
                    setPrescriptionForm((prev: PrescriptionForm) => ({ ...prev, diagnosis: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Diagnosis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medications
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {prescriptionForm.medications.map((med: Medication, idx: number) => (
                    <div key={idx} className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) =>
                          handleMedicationChange(idx, 'name', e.target.value)
                        }
                        placeholder="Medicine name"
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicationChange(idx, 'dosage', e.target.value)
                        }
                        placeholder="Dosage"
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) =>
                          handleMedicationChange(idx, 'frequency', e.target.value)
                        }
                        placeholder="Frequency"
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) =>
                          handleMedicationChange(idx, 'duration', e.target.value)
                        }
                        placeholder="Duration"
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddMedication}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Medication
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={prescriptionForm.notes}
                  onChange={(e) =>
                    setPrescriptionForm((prev: PrescriptionForm) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={prescriptionForm.followUpDate}
                  onChange={(e) =>
                    setPrescriptionForm((prev: PrescriptionForm) => ({
                      ...prev,
                      followUpDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSavePrescription}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                >
                  Save Prescription
                </button>
                <button
                  onClick={() => {
                    setShowPrescriptionForm(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
