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
  return [];
}

export function getStoredAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveStoredAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (e) {
    console.error('Failed to save appointment to localStorage', e);
  }
}

const USER_PHONE_KEY = 'sri_user_patient_phone';
const RECENT_BOOKINGS_KEY = 'sri_user_recent_bookings';

export function clearAllAppointmentHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem(USER_PHONE_KEY);
    localStorage.removeItem(RECENT_BOOKINGS_KEY);
    localStorage.setItem(BLOCKED_SLOTS_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Failed to clear appointment history', e);
  }
}

export function saveUserPatientPhone(phone: string): void {
  try {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone) {
      localStorage.setItem(USER_PHONE_KEY, cleanPhone);
    }
  } catch (e) {
    console.error('Failed to save user phone', e);
  }
}

export function getUserPatientPhone(): string | null {
  try {
    return localStorage.getItem(USER_PHONE_KEY);
  } catch {
    return null;
  }
}

export function saveUserBookingId(id: string): void {
  try {
    const raw = localStorage.getItem(RECENT_BOOKINGS_KEY);
    const existing: string[] = raw ? JSON.parse(raw) : [];
    if (!existing.includes(id)) {
      const updated = [id, ...existing].slice(0, 20);
      localStorage.setItem(RECENT_BOOKINGS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to save user booking ID', e);
  }
}

export function getUserBookingIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAppointmentsForPatient(queryPhoneOrCode?: string): Appointment[] {
  const all = getStoredAppointments();
  const targetQuery = queryPhoneOrCode?.trim().toLowerCase();
  
  if (targetQuery) {
    const cleanNum = targetQuery.replace(/\D/g, '');
    return all.filter(
      (a) =>
        a.id.toLowerCase().includes(targetQuery) ||
        (cleanNum && a.patientPhone.replace(/\D/g, '').includes(cleanNum)) ||
        (a.patientEmail && a.patientEmail.toLowerCase().includes(targetQuery)) ||
        a.patientName.toLowerCase().includes(targetQuery)
    );
  }

  // Auto-load by saved session phone or recent booking IDs
  const savedPhone = getUserPatientPhone();
  const savedIds = getUserBookingIds();

  if (!savedPhone && savedIds.length === 0) {
    return [];
  }

  return all.filter((a) => {
    const matchesPhone = savedPhone && a.patientPhone.replace(/\D/g, '').includes(savedPhone);
    const matchesId = savedIds.includes(a.id);
    return matchesPhone || matchesId;
  });
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
  if (enrichedAppt.id) saveUserBookingId(enrichedAppt.id);
  if (enrichedAppt.patientPhone) saveUserPatientPhone(enrichedAppt.patientPhone);
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
