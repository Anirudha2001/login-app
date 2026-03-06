import { Appointment } from '@/src/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Prescription } from '@/src/types';

export const appointmentStatusConfig = {
  scheduled: {
    label: 'Scheduled',
    color: 'bg-blue-100 text-blue-800',
    badgeColor: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
    badgeColor: 'bg-green-500',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    badgeColor: 'bg-red-500',
  },
  rescheduled: {
    label: 'Rescheduled',
    color: 'bg-yellow-100 text-yellow-800',
    badgeColor: 'bg-yellow-500',
  },
};

export function getAppointmentStatus(date: string): 'upcoming' | 'completed' | 'past' {
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  appointmentDate.setHours(0, 0, 0, 0);

  if (appointmentDate > today) return 'upcoming';
  if (appointmentDate < today) return 'past';
  return 'completed';
}

export function isUpcomingAppointment(appointment: Appointment): boolean {
  const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
  return appointmentDateTime > new Date();
}

export function canCreatePrescription(appointment: Appointment): boolean {
  return appointment.status === 'completed';
}

// PDF Export Utility
export async function exportPrescriptionPDF(
  prescription: Prescription,
  fileName: string = 'prescription.pdf'
): Promise<void> {
  try {
    // Create HTML content for prescription
    const html = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; color: #1e40af;">MEDICAL PRESCRIPTION</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 10px;">
            <strong>Doctor Information:</strong>
          </div>
          <div>Dr. ${prescription.doctorName}</div>
          <div>${prescription.specialty}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 10px;">
            <strong>Patient Information:</strong>
          </div>
          <div>Email: ${prescription.patientEmail}</div>
          <div>Date: ${new Date(prescription.date).toLocaleDateString()}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 10px;">
            <strong>Diagnosis:</strong>
          </div>
          <div>${prescription.diagnosis}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <strong>Medications:</strong>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #e5e7eb;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Medication</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Dosage</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Frequency</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Duration</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.medications
                .map(
                  (med) => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${med.name}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${med.dosage}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${med.frequency}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">${med.duration}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        ${
          prescription.notes
            ? `
        <div style="margin-bottom: 20px;">
          <div style="margin-bottom: 10px;">
            <strong>Notes:</strong>
          </div>
          <div>${prescription.notes}</div>
        </div>
        `
            : ''
        }

        ${
          prescription.followUpDate
            ? `
        <div>
          <strong>Follow-up Date:</strong> ${new Date(prescription.followUpDate).toLocaleDateString()}
        </div>
        `
            : ''
        }
      </div>
    `;

    // Create temporary element
    const element = document.createElement('div');
    element.innerHTML = html;
    element.style.display = 'none';
    document.body.appendChild(element);

    // Convert HTML to canvas
    const canvas = await html2canvas(element, { scale: 2 });
    document.body.removeChild(element);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    // Download PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
