'use client';

import { Medication, Prescription } from '@/src/types';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { exportPrescriptionPDF } from '@/src/utils/appointmentUtils';

interface MedicationFormProps {
  medications: Medication[];
  onMedicationsChange: (medications: Medication[]) => void;
}

export function MedicationForm({ medications, onMedicationsChange }: MedicationFormProps) {
  const [isExporting, setIsExporting] = useState(false);

  const addMedication = () => {
    onMedicationsChange([
      ...medications,
      {
        id: Date.now().toString(),
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
      },
    ]);
  };

  const removeMedication = (id: string) => {
    onMedicationsChange(medications.filter((med) => med.id !== id));
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    onMedicationsChange(
      medications.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addMedication}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Medication
        </motion.button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {medications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No medications added yet</p>
        ) : (
          medications.map((med) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end bg-gray-50 p-3 rounded-lg"
            >
              <input
                type="text"
                placeholder="Medication name"
                value={med.name}
                onChange={(e) => updateMedication(med.id!, 'name', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <input
                type="text"
                placeholder="Dosage (e.g., 500mg)"
                value={med.dosage}
                onChange={(e) => updateMedication(med.id!, 'dosage', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <input
                type="text"
                placeholder="Frequency (e.g., 2x daily)"
                value={med.frequency}
                onChange={(e) => updateMedication(med.id!, 'frequency', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 5 days)"
                value={med.duration}
                onChange={(e) => updateMedication(med.id!, 'duration', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeMedication(med.id!)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
              >
                <FiTrash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// Prescription Preview Component
interface PrescriptionPreviewProps {
  prescription: Prescription;
  onDownload: () => Promise<void>;
}

export function PrescriptionPreview({ prescription, onDownload }: PrescriptionPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-6 shadow-md space-y-6"
    >
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">MEDICAL PRESCRIPTION</h2>
        <p className="text-gray-600 text-sm">{new Date(prescription.date).toLocaleDateString()}</p>
      </div>

      {/* Doctor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Doctor</p>
          <p className="text-lg font-semibold text-gray-900">Dr. {prescription.doctorName}</p>
          <p className="text-gray-600">{prescription.specialty}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Patient Email</p>
          <p className="text-gray-900">{prescription.patientEmail}</p>
        </div>
      </div>

      {/* Diagnosis */}
      <div>
        <p className="text-sm text-gray-600 font-medium mb-2">Diagnosis</p>
        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{prescription.diagnosis}</p>
      </div>

      {/* Medications Table */}
      <div>
        <p className="text-sm text-gray-600 font-medium mb-3">Medications</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                  Medication
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                  Dosage
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                  Frequency
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {prescription.medications.map((med, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{med.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.dosage}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.frequency}</td>
                  <td className="border border-gray-300 px-4 py-2">{med.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {prescription.notes && (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">Notes</p>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{prescription.notes}</p>
        </div>
      )}

      {/* Follow-up Date */}
      {prescription.followUpDate && (
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Follow-up Date</p>
          <p className="text-gray-900">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
        </div>
      )}

      {/* Download Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <FiDownload className="w-5 h-5" />
        {isDownloading ? 'Downloading...' : 'Download Prescription'}
      </motion.button>
    </motion.div>
  );
}
