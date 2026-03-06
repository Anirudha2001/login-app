'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { getAllDoctorsWithOverrides } from '@/src/utils/getDoctorWithOverrides';
import { generatePreviewSlots } from '@/src/utils/timeUtils';
import { Doctor } from '@/src/types';
import { appointmentStore } from '@/src/utils/appointmentStore';
import { DoctorCard, SlotSelector, DatePicker } from '@/src/components/DoctorCard';
import { Modal, ConfirmDialog } from '@/src/components/Modal';
import { useToast } from '@/src/hooks/useToast';
import { Toast } from '@/src/components/Toast';
import { LoadingSpinner } from '@/src/components/LoadingStates';

export default function AppointmentsPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
      return;
    }
    setUserEmail(email);
    const allDoctors = getAllDoctorsWithOverrides();
    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (specialty) {
      setFilteredDoctors(
        doctors.filter((d) => d.specialty.toLowerCase().includes(specialty.toLowerCase()))
      );
    } else {
      setFilteredDoctors(doctors);
    }
  }, [specialty, doctors]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const slots = generatePreviewSlots(
        selectedDoctor.availabilityHours.start,
        selectedDoctor.availabilityHours.end,
        selectedDoctor.slotDurationMinutes
      );
      setAvailableSlots(slots);

      // Get booked slots for this date
      const appointments = appointmentStore.getAll();
      const bookedForDate = appointments
        .filter(
          (apt) =>
            apt.doctorId === selectedDoctor.id &&
            apt.date === selectedDate &&
            apt.status !== 'cancelled'
        )
        .map((apt) => apt.time);
      setBookedSlots(bookedForDate);
    }
  }, [selectedDoctor, selectedDate]);

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      addToast('Please select doctor, date and time', 'warning');
      return;
    }

    if (appointmentStore.isSlotBooked(selectedDoctor.id, selectedDate, selectedTime)) {
      setShowConfirmDialog(false);
      addToast('This slot was just booked. Please choose another time.', 'error');
      setSelectedTime('');
      return;
    }

    setShowConfirmDialog(false);

    const appointment = {
      id: Date.now().toString(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      patientEmail: userEmail,
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled' as const,
      createdAt: new Date().toISOString(),
    };

    appointmentStore.save(appointment);
    addToast('Appointment booked successfully!', 'success');
    setTimeout(() => router.push('/appointment-scheduled'), 1500);
  };

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));
  const minDate = new Date().toISOString().split('T')[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading doctors..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-1">Select a doctor and choose your preferred date and time</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedDoctor ? (
          <>
            {/* Filters */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Specialty</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSpecialty('')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    specialty === ''
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  All Specialties
                </button>
                {specialties.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpecialty(s)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      specialty === s
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Available Doctors ({filteredDoctors.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookClick={() => setSelectedDoctor(doctor)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Doctor Selected - Show Booking Form */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  setSelectedDate('');
                  setSelectedTime('');
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <FiArrowLeft /> Select Another Doctor
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Dr. {selectedDoctor.name}
                  </h2>
                  <p className="text-blue-600 font-medium mb-6">{selectedDoctor.specialty}</p>

                  <div className="space-y-8">
                    {/* Date Selection */}
                    <DatePicker
                      selectedDate={selectedDate}
                      minDate={minDate}
                      onSelectDate={setSelectedDate}
                    />

                    {/* Slot Selection */}
                    {selectedDate && (
                      <SlotSelector
                        slots={availableSlots}
                        selectedSlot={selectedTime}
                        bookedSlots={bookedSlots}
                        onSelectSlot={setSelectedTime}
                      />
                    )}

                    {/* Booking Summary */}
                    {selectedDate && selectedTime && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(selectedDate).toLocaleDateString('en-IN', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium text-gray-900">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Consultation Fee:</span>
                            <span className="font-bold text-blue-600">
                              ₹{selectedDoctor.consultationFee}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Confirm Button */}
                    <button
                      onClick={() => setShowConfirmDialog(true)}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>

              {/* Doctor Info Sidebar */}
              <div className="h-fit">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Experience</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedDoctor.experience} years
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Qualification</p>
                    <p className="text-gray-900 font-medium">{selectedDoctor.qualification}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Clinic</p>
                    <p className="text-gray-900">{selectedDoctor.clinic}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.languages.map((lang) => (
                        <span key={lang} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">About</p>
                    <p className="text-gray-700 text-sm">{selectedDoctor.bio}</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold text-yellow-800">Rating: </span>
                      <span className="text-yellow-700">{selectedDoctor.rating}/5</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirm Appointment"
        message={`Confirm your appointment with Dr. ${selectedDoctor?.name} on ${selectedDate ? new Date(selectedDate).toLocaleDateString() : ''} at ${selectedTime}?`}
        onConfirm={handleBookAppointment}
        onCancel={() => setShowConfirmDialog(false)}
        confirmLabel="Book Appointment"
      />
    </div>
  );
}
