import { Appointment, DoctorBlockedSlot } from '../types';

const STORAGE_KEY = 'sri_skin_clinic_appointments';
const BLOCKED_SLOTS_KEY = 'sri_skin_clinic_blocked_slots';

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getInitialSampleAppointments(): Appointment[] {
  const today = getTodayString();
  const tomorrow = getTomorrowString();

  return [
    {
      id: 'SRI-9585-4102',
      serviceId: 'clinical-dermatology',
      serviceName: 'Clinical Dermatology & Acne Protocol',
      providerId: 'dr-kavitha',
      providerName: 'Dr. V. Kavitha (M.B.B.S., M.D., D.V.L.)',
      visitType: 'in-person',
      date: today,
      time: '10:30 AM',
      tokenNumber: 1,
      patientName: 'Karthik Subramanian',
      patientEmail: 'karthik.sub@example.com',
      patientPhone: '9842211098',
      dateOfBirth: '1995-04-12',
      isNewPatient: true,
      insuranceProvider: 'Direct Self-Pay / Cash / UPI',
      reasonForVisit: 'Persistent cystic acne on cheeks and jawline since 4 months. Needs clinical peel recommendation.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'confirmed',
      clinicalStatus: 'arrived',
      arrivedAt: '10:18 AM',
      consultationFee: 500,
      paymentStatus: 'paid_upi',
    },
    {
      id: 'SRI-9585-2831',
      serviceId: 'hair-trichology',
      serviceName: 'PRP Hair Regrowth & Scalp Dermatosurgery',
      providerId: 'dr-kavitha',
      providerName: 'Dr. V. Kavitha (M.B.B.S., M.D., D.V.L.)',
      visitType: 'in-person',
      date: today,
      time: '11:00 AM',
      tokenNumber: 2,
      patientName: 'Anitha Rajendran',
      patientEmail: 'anitha.raj@example.com',
      patientPhone: '9443388712',
      dateOfBirth: '1990-11-23',
      isNewPatient: false,
      insuranceProvider: 'Star Health & Allied Insurance',
      insurancePolicyId: 'SH-8842109',
      reasonForVisit: 'PRP Session 3 follow-up. Checking vertex hair density progression.',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      status: 'confirmed',
      clinicalStatus: 'in_consultation',
      arrivedAt: '10:45 AM',
      consultationStartedAt: '10:58 AM',
      consultationFee: 2500,
      paymentStatus: 'paid_upi',
      doctorNotes: 'Scalp trichoscopy shows active follicular sprouting along midline. PRP cycle 3 initiated with sterile micro-needling.',
    },
    {
      id: 'SRI-9585-7719',
      serviceId: 'cosmetology-peels',
      serviceName: 'Medical Cosmetology & Chemical Peels',
      providerId: 'dr-kavitha',
      providerName: 'Dr. V. Kavitha (M.B.B.S., M.D., D.V.L.)',
      visitType: 'in-person',
      date: today,
      time: '11:30 AM',
      tokenNumber: 3,
      patientName: 'Vigneshwaran P.',
      patientPhone: '9585544120',
      dateOfBirth: '1998-08-15',
      isNewPatient: true,
      insuranceProvider: 'Direct Self-Pay / Cash / UPI',
      reasonForVisit: 'Hyperpigmentation on forehead and post-inflammatory dark spots.',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      status: 'confirmed',
      clinicalStatus: 'scheduled',
      consultationFee: 500,
      paymentStatus: 'pending',
    },
    {
      id: 'SRI-9585-6124',
      serviceId: 'laser-scar',
      serviceName: 'Advanced Laser & Scar Revision Therapy',
      providerId: 'dr-kavitha',
      providerName: 'Dr. V. Kavitha (M.B.B.S., M.D., D.V.L.)',
      visitType: 'in-person',
      date: today,
      time: '05:30 PM',
      tokenNumber: 4,
      patientName: 'Divya Muralikrishnan',
      patientPhone: '9894452109',
      dateOfBirth: '1992-02-18',
      isNewPatient: true,
      insuranceProvider: 'Direct Self-Pay / Cash / UPI',
      reasonForVisit: 'Old chickenpox scars on cheek and laser resurfacing inquiry.',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'confirmed',
      clinicalStatus: 'scheduled',
      consultationFee: 500,
      paymentStatus: 'pending',
    },
    {
      id: 'SRI-9585-9941',
      serviceId: 'pediatric-dermatology',
      serviceName: 'Pediatric & Neonatal Dermatology',
      providerId: 'dr-kavitha',
      providerName: 'Dr. V. Kavitha (M.B.B.S., M.D., D.V.L.)',
      visitType: 'in-person',
      date: tomorrow,
      time: '10:30 AM',
      tokenNumber: 1,
      patientName: 'Master Rithvik (Parents: Sanjay & Meera)',
      patientPhone: '9789912440',
      dateOfBirth: '2021-06-10',
      isNewPatient: true,
      insuranceProvider: 'Direct Self-Pay / Cash / UPI',
      reasonForVisit: 'Atopic dermatitis rash and itchy flexural eczema on elbows and knees.',
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      status: 'confirmed',
      clinicalStatus: 'scheduled',
      consultationFee: 500,
      paymentStatus: 'pending',
    },
    {
      id: 'SRI-9585-3310',
      serviceId: 'tele-dermatology',
      serviceName: 'Online Teledermatology & E-Prescription',
      providerId: 'dr-kavitha',
      providerName: 'Dr. V. Kavitha (M.B.B.S., M.D., D.V.L.)',
      visitType: 'telehealth',
      date: tomorrow,
      time: '06:00 PM',
      tokenNumber: 2,
      patientName: 'Deepak Mohan (NRI - Dubai)',
      patientEmail: 'deepak.m@example.com',
      patientPhone: '9840012399',
      dateOfBirth: '1987-09-05',
      isNewPatient: false,
      insuranceProvider: 'Direct Self-Pay / Cash / UPI',
      reasonForVisit: 'Remote follow up for Psoriasis scalp maintenance lotion and digital prescription renewal.',
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      status: 'confirmed',
      clinicalStatus: 'scheduled',
      consultationFee: 500,
      paymentStatus: 'paid_upi',
    },
  ];
}

export function getStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleAppointments();
      saveStoredAppointments(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getInitialSampleAppointments();
      saveStoredAppointments(initial);
      return initial;
    }
    return parsed;
  } catch {
    return getInitialSampleAppointments();
  }
}

export function saveStoredAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.error('Failed to save appointment to localStorage', e);
  }
}

export function addAppointment(newAppt: Appointment): void {
  const list = getStoredAppointments();
  // Assign token number for that date
  const sameDateAppts = list.filter((a) => a.date === newAppt.date && a.status !== 'cancelled');
  const tokenNumber = sameDateAppts.length + 1;
  const enrichedAppt: Appointment = {
    ...newAppt,
    tokenNumber: newAppt.tokenNumber || tokenNumber,
    clinicalStatus: newAppt.clinicalStatus || 'scheduled',
    consultationFee: newAppt.consultationFee || 500,
    paymentStatus: newAppt.paymentStatus || 'pending',
  };
  const updated = [enrichedAppt, ...list];
  saveStoredAppointments(updated);
}

export function updateAppointmentStatus(
  id: string,
  status: 'confirmed' | 'rescheduled' | 'cancelled',
  newDate?: string,
  newTime?: string
): boolean {
  const list = getStoredAppointments();
  const index = list.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return false;

  list[index].status = status;
  if (status === 'cancelled') {
    list[index].clinicalStatus = 'cancelled';
  } else if (status === 'confirmed' || status === 'rescheduled') {
    if (list[index].clinicalStatus === 'cancelled' || list[index].clinicalStatus === 'no_show') {
      list[index].clinicalStatus = 'scheduled';
    }
  }
  if (newDate) list[index].date = newDate;
  if (newTime) list[index].time = newTime;
  saveStoredAppointments([...list]);
  return true;
}

export function updateClinicalStatus(
  id: string,
  clinicalStatus: 'scheduled' | 'arrived' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show',
  extra?: {
    doctorNotes?: string;
    prescriptionSummary?: string;
    followUpDate?: string;
    paymentStatus?: 'pending' | 'paid_cash' | 'paid_upi' | 'insurance';
    consultationFee?: number;
  }
): boolean {
  const list = getStoredAppointments();
  const index = list.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return false;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  list[index].clinicalStatus = clinicalStatus;

  if (clinicalStatus === 'arrived' && !list[index].arrivedAt) {
    list[index].arrivedAt = nowTime;
  }
  if (clinicalStatus === 'in_consultation' && !list[index].consultationStartedAt) {
    list[index].consultationStartedAt = nowTime;
  }
  if (clinicalStatus === 'completed' && !list[index].completedAt) {
    list[index].completedAt = nowTime;
  }
  if (clinicalStatus === 'cancelled' || clinicalStatus === 'no_show') {
    list[index].status = 'cancelled';
  } else if (clinicalStatus === 'scheduled' || clinicalStatus === 'arrived' || clinicalStatus === 'in_consultation' || clinicalStatus === 'completed') {
    if (list[index].status === 'cancelled') {
      list[index].status = 'confirmed';
    }
  }

  if (extra) {
    if (extra.doctorNotes !== undefined) list[index].doctorNotes = extra.doctorNotes;
    if (extra.prescriptionSummary !== undefined) list[index].prescriptionSummary = extra.prescriptionSummary;
    if (extra.followUpDate !== undefined) list[index].followUpDate = extra.followUpDate;
    if (extra.paymentStatus !== undefined) list[index].paymentStatus = extra.paymentStatus;
    if (extra.consultationFee !== undefined) list[index].consultationFee = extra.consultationFee;
  }

  saveStoredAppointments([...list]);
  return true;
}

export function deleteAppointment(id: string): boolean {
  const list = getStoredAppointments();
  const filtered = list.filter((a) => a.id.toLowerCase() !== id.toLowerCase());
  saveStoredAppointments(filtered);
  return true;
}

export function generateAppointmentId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SRI-9585-${randomNum}`;
}

// Doctor Blocked Slots (e.g. Doctor in OT / surgeries / holiday)
export function getStoredBlockedSlots(): DoctorBlockedSlot[] {
  try {
    const raw = localStorage.getItem(BLOCKED_SLOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredBlockedSlots(slots: DoctorBlockedSlot[]): void {
  try {
    localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify(slots));
  } catch (e) {
    console.error('Failed to save blocked slots', e);
  }
}

export function addBlockedSlot(slot: DoctorBlockedSlot): void {
  const list = getStoredBlockedSlots();
  saveStoredBlockedSlots([...list, slot]);
}

export function removeBlockedSlot(id: string): void {
  const list = getStoredBlockedSlots();
  saveStoredBlockedSlots(list.filter((s) => s.id !== id));
}
