import { Prescription } from '@/src/types';

const STORAGE_KEY = 'prescriptions';

export const prescriptionStore = {
  getAll(): Prescription[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getForPatient(email: string): Prescription[] {
    return this.getAll().filter((p) => p.patientEmail === email);
  },

  getForDoctor(doctorId: string): Prescription[] {
    return this.getAll().filter((p) => p.doctorId === doctorId);
  },

  getById(id: string): Prescription | null {
    return this.getAll().find((p) => p.id === id) || null;
  },

  save(prescription: Prescription): Prescription {
    const all = this.getAll();
    const index = all.findIndex((p) => p.id === prescription.id);

    if (index >= 0) {
      all[index] = prescription;
    } else {
      all.push(prescription);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return prescription;
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((p) => p.id !== id);

    if (filtered.length < all.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }

    return false;
  },

  deleteForAppointment(appointmentId: string): number {
    const all = this.getAll();
    const filtered = all.filter((p) => p.appointmentId !== appointmentId);
    const deletedCount = all.length - filtered.length;

    if (deletedCount > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    return deletedCount;
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
