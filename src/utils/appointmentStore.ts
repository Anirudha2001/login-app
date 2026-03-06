import { Appointment } from '@/src/types';

const STORAGE_KEY = 'appointments';

export const appointmentStore = {
  getAll(): Appointment[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getForPatient(email: string): Appointment[] {
    return this.getAll().filter((a) => a.patientEmail === email);
  },

  getForDoctor(doctorId: string): Appointment[] {
    return this.getAll().filter((a) => a.doctorId === doctorId);
  },

  getById(id: string): Appointment | null {
    return this.getAll().find((a) => a.id === id) || null;
  },

  save(appointment: Appointment): Appointment {
    const all = this.getAll();
    const index = all.findIndex((a) => a.id === appointment.id);

    if (index >= 0) {
      all[index] = appointment;
    } else {
      all.push(appointment);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return appointment;
  },

  updateStatus(id: string, status: Appointment['status']): Appointment | null {
    const all = this.getAll();
    const index = all.findIndex((a) => a.id === id);
    if (index < 0) return null;

    const updated = { ...all[index], status };
    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  isSlotBooked(
    doctorId: string,
    date: string,
    time: string,
    excludeAppointmentId?: string
  ): boolean {
    return this.getAll().some(
      (a) =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.time === time &&
        a.status !== 'cancelled' &&
        a.id !== excludeAppointmentId
    );
  },

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter((a) => a.id !== id);

    if (filtered.length < all.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }

    return false;
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
