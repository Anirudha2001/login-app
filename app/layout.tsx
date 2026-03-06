import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/src/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'MedBooking - Medical Appointment System',
  description: 'Book doctor appointments easily and manage your health',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
