export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientEmail: string;
  date: string;
  medications: Medication[];
  diagnosis: string;
  notes: string;
  followUpDate?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  availabilityDays: string[];
  availabilityHours: {
    start: string;
    end: string;
  };
  slotDurationMinutes: number;
  bio: string;
  languages: string[];
  clinic: string;
  phone: string;
}

export interface DoctorOverrides {
  name?: string;
  specialty?: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  availabilityDays?: string[];
  availabilityHours?: {
    start: string;
    end: string;
  };
  slotDurationMinutes?: number;
  bio?: string;
}

export interface Patient {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}
