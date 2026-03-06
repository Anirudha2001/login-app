import { Doctor, DoctorOverrides } from '@/src/types';
import mockData from '@/src/data/mockData.json';

export function getDoctorWithOverrides(doctorId: string): Doctor | null {
  const baseDoctor = mockData.doctors.find((d) => d.id === doctorId) as Doctor | undefined;

  if (!baseDoctor) return null;

  if (typeof window === 'undefined') return baseDoctor;

  try {
    const overridesData = localStorage.getItem('doctorOverrides');
    const overrides: Record<string, DoctorOverrides> = overridesData
      ? JSON.parse(overridesData)
      : {};

    const doctorOverride = overrides[doctorId] || {};

    return {
      ...baseDoctor,
      name: doctorOverride.name ?? baseDoctor.name,
      specialty: doctorOverride.specialty ?? baseDoctor.specialty,
      qualification: doctorOverride.qualification ?? baseDoctor.qualification,
      experience: doctorOverride.experience ?? baseDoctor.experience,
      consultationFee: doctorOverride.consultationFee ?? baseDoctor.consultationFee,
      availabilityDays: doctorOverride.availabilityDays ?? baseDoctor.availabilityDays,
      availabilityHours: doctorOverride.availabilityHours ?? baseDoctor.availabilityHours,
      slotDurationMinutes:
        doctorOverride.slotDurationMinutes ?? baseDoctor.slotDurationMinutes,
      bio: doctorOverride.bio ?? baseDoctor.bio,
    };
  } catch {
    return baseDoctor;
  }
}

export function getAllDoctorsWithOverrides(): Doctor[] {
  if (typeof window === 'undefined') {
    return mockData.doctors as Doctor[];
  }

  try {
    const overridesData = localStorage.getItem('doctorOverrides');
    const overrides: Record<string, DoctorOverrides> = overridesData
      ? JSON.parse(overridesData)
      : {};

    return (mockData.doctors as Doctor[]).map((baseDoctor) => {
      const doctorOverride = overrides[baseDoctor.id] || {};

      return {
        ...baseDoctor,
        name: doctorOverride.name ?? baseDoctor.name,
        specialty: doctorOverride.specialty ?? baseDoctor.specialty,
        qualification: doctorOverride.qualification ?? baseDoctor.qualification,
        experience: doctorOverride.experience ?? baseDoctor.experience,
        consultationFee: doctorOverride.consultationFee ?? baseDoctor.consultationFee,
        availabilityDays: doctorOverride.availabilityDays ?? baseDoctor.availabilityDays,
        availabilityHours: doctorOverride.availabilityHours ?? baseDoctor.availabilityHours,
        slotDurationMinutes:
          doctorOverride.slotDurationMinutes ?? baseDoctor.slotDurationMinutes,
        bio: doctorOverride.bio ?? baseDoctor.bio,
      };
    });
  } catch {
    return mockData.doctors as Doctor[];
  }
}
