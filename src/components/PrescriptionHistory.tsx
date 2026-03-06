'use client';

import { Prescription } from '@/src/types';
import { motion } from 'framer-motion';
import { FiDownload, FiEye } from 'react-icons/fi';
import { useState } from 'react';
import { exportPrescriptionPDF } from '@/src/utils/appointmentUtils';

interface PrescriptionHistoryProps {
  prescriptions: Prescription[];
  onViewClick: (prescription: Prescription) => void;
}

export function PrescriptionHistory({ prescriptions, onViewClick }: PrescriptionHistoryProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (prescription: Prescription) => {
    setDownloadingId(prescription.id);
    try {
      await exportPrescriptionPDF(
        prescription,
        `prescription-${prescription.id}-${new Date(prescription.date).toLocaleDateString()}.pdf`
      );
    } catch (error) {
      console.error('Error downloading prescription:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-600">No prescriptions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort by newest first */}
      {prescriptions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((prescription) => (
          <motion.div
            key={prescription.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start md:items-center">
              {/* Doctor Info */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Doctor</p>
                <p className="text-lg font-semibold text-gray-900">Dr. {prescription.doctorName}</p>
                <p className="text-sm text-gray-600">{prescription.specialty}</p>
              </div>

              {/* Diagnosis */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Diagnosis</p>
                <p className="text-gray-900">{prescription.diagnosis}</p>
              </div>

              {/* Date */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                <p className="text-gray-900">{new Date(prescription.date).toLocaleDateString()}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewClick(prescription)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(prescription)}
                  disabled={downloadingId === prescription.id}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center disabled:opacity-50"
                >
                  <FiDownload className="w-4 h-4" />
                  {downloadingId === prescription.id ? 'Downloading...' : 'Download'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  );
}
