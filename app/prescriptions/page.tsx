'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Prescription } from '@/src/types';
import { prescriptionStore } from '@/src/utils/prescriptionStore';
import { PrescriptionHistory } from '@/src/components/PrescriptionHistory';
import { PrescriptionPreview } from '@/src/components/PrescriptionForm';
import { Modal } from '@/src/components/Modal';
import { LoadingSpinner } from '@/src/components/LoadingStates';
import { EmptyState } from '@/src/components/CardComponents';
import { useToast } from '@/src/hooks/useToast';
import { Toast } from '@/src/components/Toast';

export default function PrescriptionsPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      router.push('/login');
      return;
    }
    setUserEmail(email);

    // Load prescriptions for this patient
    const allPrescriptions = prescriptionStore.getAll() as Prescription[];
    const patientPrescriptions = allPrescriptions.filter((p) => p.patientEmail === email);
    setPrescriptions(patientPrescriptions);
    setIsLoading(false);
  }, [router]);

  const handleDownload = async () => {
    if (!selectedPrescription) return;
    try {
      const { exportPrescriptionPDF } = await import('@/src/utils/appointmentUtils');
      await exportPrescriptionPDF(
        selectedPrescription,
        `prescription-${selectedPrescription.id}.pdf`
      );
      addToast('Prescription downloaded successfully!', 'success');
    } catch (error) {
      addToast('Error downloading prescription', 'error');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading prescriptions..." />
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="text-gray-600 mt-1">View and download your medical prescriptions</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {prescriptions.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Prescriptions Yet"
            description="You don't have any prescriptions yet. Complete an appointment with a doctor to receive prescriptions."
            action={{
              label: 'Book an Appointment',
              onClick: () => router.push('/appointments'),
            }}
          />
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {prescriptions.length} {prescriptions.length === 1 ? 'Prescription' : 'Prescriptions'}
              </h2>
            </div>
            <PrescriptionHistory
              prescriptions={prescriptions}
              onViewClick={setSelectedPrescription}
            />
          </div>
        )}
      </div>

      {/* Prescription Preview Modal */}
      <Modal
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <PrescriptionPreview
            prescription={selectedPrescription}
            onDownload={handleDownload}
          />
        )}
      </Modal>
    </div>
  );
}
