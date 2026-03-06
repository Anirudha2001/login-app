'use client';

import { useState, useEffect } from 'react';
import { Doctor, DoctorOverrides } from '@/src/types';
import { getDoctorWithOverrides } from '@/src/utils/getDoctorWithOverrides';

export function useDoctorDashboard(doctorId: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [overrides, setOverrides] = useState<DoctorOverrides>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const baseDoctor = getDoctorWithOverrides(doctorId);
      if (!baseDoctor) {
        setError('Doctor not found');
        setLoading(false);
        return;
      }

      setDoctor(baseDoctor);

      // Load overrides
      const overridesData = localStorage.getItem('doctorOverrides');
      const allOverrides = overridesData ? JSON.parse(overridesData) : {};
      setOverrides(allOverrides[doctorId] || {});
      setLoading(false);
    } catch (err) {
      setError('Failed to load doctor data');
      setLoading(false);
    }
  }, [doctorId]);

  const updateField = (field: keyof Doctor, value: any) => {
    if (!doctor) return;

    setOverrides((prev) => ({
      ...prev,
      [field]: value,
    }));

    setDoctor((prev) => (prev ? { ...prev, [field]: value } : null));
    setHasChanges(true);
  };

  const save = () => {
    if (!doctor) return;

    try {
      const allOverrides = JSON.parse(localStorage.getItem('doctorOverrides') || '{}');
      allOverrides[doctorId] = overrides;
      localStorage.setItem('doctorOverrides', JSON.stringify(allOverrides));
      setHasChanges(false);
      return true;
    } catch {
      setError('Failed to save changes');
      return false;
    }
  };

  const reset = () => {
    const baseDoctor = getDoctorWithOverrides(doctorId);
    if (baseDoctor) {
      setDoctor(baseDoctor);
      setOverrides({});
      setHasChanges(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('doctorId');
    window.location.href = '/doctor/login';
  };

  return {
    doctor,
    loading,
    error,
    hasChanges,
    updateField,
    save,
    reset,
    logout,
  };
}
