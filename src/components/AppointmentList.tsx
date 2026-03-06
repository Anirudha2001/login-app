'use client';

import { Appointment } from '@/src/types';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { appointmentStatusConfig } from '@/src/utils/appointmentUtils';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelClick?: (appointment: Appointment) => void;
  showStatus?: boolean;
}

export function AppointmentList({
  appointments,
  onCancelClick,
  showStatus = true,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <FiCalendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-600">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((apt) => {
        const status = appointmentStatusConfig[apt.status];
        const appointmentDate = new Date(`${apt.date}T${apt.time}`);
        const isUpcoming = appointmentDate > new Date();

        return (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Appointment Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {apt.doctorName}
                    </h3>
                    <p className="text-sm text-blue-600">{apt.specialty}</p>
                  </div>
                  {showStatus && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.color}`}>
                      {status.label}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiCalendar className="w-4 h-4" />
                    {new Date(apt.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FiClock className="w-4 h-4" />
                    {apt.time}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isUpcoming && onCancelClick && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCancelClick(apt)}
                    className="px-4 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition font-medium text-sm"
                  >
                    Cancel
                  </motion.button>
                )}
                {apt.status === 'completed' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <FiCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {apt.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{apt.notes}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
