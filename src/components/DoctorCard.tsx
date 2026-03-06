'use client';

import { Doctor } from '@/src/types';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar, FiCalendar } from 'react-icons/fi';
import { useState } from 'react';

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBookClick }: DoctorCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
            <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
            <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700">{doctor.qualification}</p>
          <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FiMapPin className="w-4 h-4" />
            {doctor.clinic}
          </div>
          <p className="text-lg font-bold text-blue-600">₹{doctor.consultationFee}</p>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doctor.bio}</p>

        {/* Availability */}
        <div className="flex items-center gap-2 mb-4 text-green-600 text-sm font-medium">
          <FiCalendar className="w-4 h-4" />
          Available {doctor.availabilityDays.join(', ')}
        </div>

        {/* Book Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onBookClick(doctor.id)}
          className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
        >
          Book Appointment
        </motion.button>
      </div>
    </motion.div>
  );
}

// Slot Selection Component
interface SlotSelectorProps {
  slots: string[];
  selectedSlot: string | null;
  bookedSlots: string[];
  onSelectSlot: (slot: string) => void;
}

export function SlotSelector({ slots, selectedSlot, bookedSlots, onSelectSlot }: SlotSelectorProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">Select Time Slot</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;

          return (
            <motion.button
              key={slot}
              whileHover={!isBooked ? { scale: 1.05 } : undefined}
              whileTap={!isBooked ? { scale: 0.95 } : undefined}
              onClick={() => !isBooked && onSelectSlot(slot)}
              disabled={isBooked}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition ${
                isBooked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {slot}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Date Picker Component
interface DatePickerProps {
  selectedDate: string;
  minDate: string;
  onSelectDate: (date: string) => void;
}

export function DatePicker({ selectedDate, minDate, onSelectDate }: DatePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
      <motion.input
        type="date"
        value={selectedDate}
        min={minDate}
        onChange={(e) => onSelectDate(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
}
