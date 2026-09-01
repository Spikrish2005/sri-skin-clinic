export interface MedicalService {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  category: 'clinical-dermatology' | 'cosmetology' | 'laser-treatments' | 'hair-trichology' | 'pediatric-skin' | 'tele-derm' | string;
  durationMinutes: number;
  conditionsTreated: string[];
  treatments: string[];
  recommendedFor: string;
  isPopular?: boolean;
}

export interface DoctorProvider {
  id: string;
  name: string;
  title: string;
  specialty: string;
  degrees: string;
  experienceYears: number;
  bio: string;
  languages: string[];
  servicesOffered: string[];
  availableDays: string[];
  imageUrl?: string;
}

export interface TimeSlot {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  visitType: 'in-person' | 'telehealth';
  date: string;
  time: string;
  patientName: string;
  patientEmail?: string;
  patientPhone: string;
  dateOfBirth: string;
  isNewPatient: boolean;
  insuranceProvider: string;
  insurancePolicyId?: string;
  reasonForVisit: string;
  createdAt: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  // Clinical Queue & Doctor Management Fields
  clinicalStatus?: 'scheduled' | 'arrived' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show';
  tokenNumber?: number;
  arrivedAt?: string;
  consultationStartedAt?: string;
  completedAt?: string;
  doctorNotes?: string;
  prescriptionSummary?: string;
  followUpDate?: string;
  consultationFee?: number;
  paymentStatus?: 'pending' | 'paid_cash' | 'paid_upi' | 'insurance';
}

export interface DoctorBlockedSlot {
  id: string;
  date: string;
  time?: string; // if undefined, full day is blocked
  session?: 'morning' | 'evening' | 'full_day';
  reason: string;
  createdAt: string;
}

export interface InsurancePlan {
  name: string;
  category: 'Health Insurance & TPA' | 'Corporate Network' | 'Direct Consultation & Self-Pay' | string;
  accepted: boolean;
  notes?: string;
}

export interface ClinicHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}
