'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import mockData from '@/src/data/mockData.json';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patientLogin = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Invalid email format');
        setLoading(false);
        return false;
      }

      // Store email for OTP verification
      localStorage.setItem('tempEmail', email);
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patientSignup = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Invalid email format');
        setLoading(false);
        return false;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return false;
      }

      // Store user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        setError('Email already registered');
        setLoading(false);
        return false;
      }

      users.push({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('tempEmail', email);
      return true;
    } catch (err) {
      setError('Signup failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simple OTP validation (in real app, this would be verified server-side)
      if (otp.length !== 6 || isNaN(Number(otp))) {
        setError('Invalid OTP. Please enter a 6-digit code.');
        setLoading(false);
        return false;
      }

      const email = localStorage.getItem('tempEmail');
      if (!email) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return false;
      }

      localStorage.setItem('userEmail', email);
      localStorage.removeItem('tempEmail');
      return true;
    } catch (err) {
      setError('OTP verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const doctorLogin = async (doctorId: string) => {
    setLoading(true);
    setError(null);

    try {
      const doctor = mockData.doctors.find((d) => d.id === doctorId);
      if (!doctor) {
        setError('Doctor ID not found');
        setLoading(false);
        return false;
      }

      localStorage.setItem('tempDoctorId', doctorId);
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyDoctorOTP = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      if (otp.length !== 6 || isNaN(Number(otp))) {
        setError('Invalid OTP. Please enter a 6-digit code.');
        setLoading(false);
        return false;
      }

      const doctorId = localStorage.getItem('tempDoctorId');
      if (!doctorId) {
        setError('Session expired. Please login again.');
        setLoading(false);
        return false;
      }

      localStorage.setItem('doctorId', doctorId);
      localStorage.removeItem('tempDoctorId');
      return true;
    } catch (err) {
      setError('OTP verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('doctorId');
    router.push('/');
  };

  return {
    loading,
    error,
    patientLogin,
    patientSignup,
    verifyOTP,
    doctorLogin,
    verifyDoctorOTP,
    logout,
  };
}
