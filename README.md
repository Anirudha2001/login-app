# MedBooking - Medical Appointment Booking System

A full-stack medical appointment booking web application built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

✅ **Patient Authentication**
- Email-based login with OTP verification
- User registration with profile information
- Secure session management with localStorage

✅ **Doctor Authentication**
- Doctor ID-based login with OTP verification
- Secure doctor dashboard access

✅ **Appointment Booking**
- Browse doctors by specialty
- View doctor ratings and qualifications
- Select available time slots
- Book appointments instantly

✅ **Doctor Dashboard**
- Manage profile and professional information
- Edit availability and consultation fees
- View and manage patient appointments
- Create and manage prescriptions

✅ **Prescription Management**
- Doctors can add prescriptions to appointments
- Patients can view prescriptions
- Download prescription as text file
- Track medications and diagnosis

✅ **Patient Dashboard**
- View all booked appointments
- View prescriptions and medications
- Cancel appointments
- View profile information

✅ **Data Persistence**
- All data stored in localStorage
- No backend required for testing
- Mock data included for doctors

## Project Structure

```
MedBooking-App/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── login/page.tsx           # Patient login
│   ├── signup/page.tsx          # Patient signup
│   ├── verify-otp/page.tsx      # OTP verification
│   ├── home/page.tsx            # Patient dashboard
│   ├── appointments/page.tsx    # Appointment booking
│   ├── appointment-scheduled/page.tsx
│   ├── appointment/[id]/page.tsx # Appointment details
│   └── doctor/
│       ├── login/page.tsx       # Doctor login
│       ├── verify-otp/page.tsx  # Doctor OTP verification
│       └── dashboard/page.tsx   # Doctor dashboard
│
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── OTPVerification.tsx
│   │   ├── DoctorLoginForm.tsx
│   │   └── DoctorOTPVerification.tsx
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   ├── hooks/
│   │   ├── useAuth.ts           # Authentication logic
│   │   └── useDoctorDashboard.ts # Doctor dashboard logic
│   │
│   ├── utils/
│   │   ├── timeUtils.ts         # Time formatting utilities
│   │   ├── dayUtils.ts          # Day parsing utilities
│   │   ├── appointmentStore.ts  # Appointment CRUD
│   │   ├── prescriptionStore.ts # Prescription CRUD
│   │   └── getDoctorWithOverrides.ts
│   │
│   └── data/
│       └── mockData.json        # Mock doctors and patients
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Installation & Setup

### 1. Prerequisites
- Node.js 18+ 
- npm or yarn

### 2. Clone/Extract the Project
```bash
cd MedBooking-App
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Demo Credentials

### Patient Login
- **Email**: Use any email address (e.g., `test@example.com`)
- **OTP**: Use any 6-digit code (e.g., `123456`)

Pre-registered patients:
- `arjun@example.com`
- `priya@example.com`

### Doctor Login
- **Doctor IDs**: `DOC001`, `DOC002`, `DOC003`, `DOC004`, `DOC005`
- **OTP**: Use any 6-digit code (e.g., `123456`)

## Usage Guide

### For Patients

1. **Create Account or Login**
   - Click "Sign Up" or "Patient Login"
   - Enter your email
   - Verify OTP (use any 6-digit code)

2. **Book Appointment**
   - Go to "Book Appointment"
   - Filter by specialty
   - Select doctor
   - Choose date and time
   - Confirm booking

3. **Manage Appointments**
   - View all appointments in dashboard
   - Cancel appointments if needed
   - View appointment details
   - Access prescriptions

### For Doctors

1. **Login**
   - Click "Doctor Login"
   - Enter doctor ID (e.g., `DOC001`)
   - Verify OTP

2. **Manage Profile**
   - Edit profile information
   - Update availability hours
   - Modify consultation fee
   - Adjust appointment slot duration

3. **Manage Appointments**
   - View all patient appointments
   - Add prescriptions to appointments
   - Track appointment status

4. **Create Prescriptions**
   - Select appointment
   - Add diagnosis and medications
   - Add follow-up date if needed
   - Save prescription

## API Routes (if extending)

### Appointments
- `GET /api/appointments` - List all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment details
- `DELETE /api/appointments/:id` - Cancel appointment

### Prescriptions
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor profile

## TypeScript Types

### Doctor
```typescript
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  availabilityDays: string[];
  availabilityHours: { start: string; end: string };
  slotDurationMinutes: number;
  bio: string;
  languages: string[];
  clinic: string;
  phone: string;
}
```

### Appointment
```typescript
interface Appointment {
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
```

### Prescription
```typescript
interface Prescription {
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
```

## localStorage Keys

- `userEmail` - Patient's email (login state)
- `doctorId` - Doctor's ID (login state)
- `tempEmail` - Temporary email during OTP verification
- `tempDoctorId` - Temporary doctor ID during OTP verification
- `appointments` - All appointments (JSON array)
- `prescriptions` - All prescriptions (JSON array)
- `doctorOverrides` - Doctor profile overrides (JSON object)
- `users` - Registered users (JSON array)

## Utility Functions

### Time Utilities
```typescript
formatTimeLabel("14:30") // "2:30 PM"
parseHoursString("9am - 5pm") // { start: "09:00", end: "17:00" }
generatePreviewSlots("09:00", "17:00", 30) // ["09:00", "09:30", "10:00", ...]
```

### Day Utilities
```typescript
parseDaysString("Mon-Fri") // ["Mon", "Tue", "Wed", "Thu", "Fri"]
formatDaysString(["Mon", "Tue", "Wed"]) // "Mon-Wed"
```

## Custom Hooks

### useAuth()
Authentication hook for patient and doctor login flows.

### useDoctorDashboard(doctorId)
Doctor dashboard state management with profile editing and saving.

## Features Implementation

✅ Full type safety with TypeScript
✅ Responsive design with Tailwind CSS
✅ React Icons for beautiful UI icons
✅ Client-side routing with Next.js App Router
✅ Functional components with React Hooks
✅ localStorage for data persistence
✅ Mock data for testing
✅ OTP verification flow
✅ Time slot generation
✅ Doctor profile management
✅ Prescription management

## Testing the App

1. **Test Patient Flow**
   - Sign up as new patient
   - Book appointment with any doctor
   - View appointment and prescription
   - Cancel appointment

2. **Test Doctor Flow**
   - Login with doctor ID (DOC001)
   - Edit profile information
   - View patient appointments
   - Add prescriptions

3. **Test Data Persistence**
   - Book appointments
   - Refresh page
   - Data should persist

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized with Next.js Image optimization
- Client-side routing for fast navigation
- Minimal bundle size
- localStorage for instant data access

## Future Enhancements

- Backend API integration
- Real OTP verification via email/SMS
- Payment gateway integration
- Video consultations
- Real-time notifications
- Doctor availability calendar
- Appointment reminders
- User reviews and ratings
- Search and filter improvements
- Mobile app version

## Troubleshooting

### localStorage not working
- Ensure browser allows localStorage
- Check if using private/incognito mode
- Clear cache and reload

### Appointments not saving
- Check localStorage quota (typically 5-10MB)
- Clear old data if needed
- Check browser console for errors

### Styling issues
- Ensure Tailwind CSS is compiled
- Clear `.next` folder and rebuild
- Check `tailwind.config.ts` configuration
