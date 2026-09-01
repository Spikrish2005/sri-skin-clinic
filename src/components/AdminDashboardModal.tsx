import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Stethoscope,
  FileText,
  DollarSign,
  Printer,
  Download,
  Plus,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building,
  Video,
  LogOut,
  ChevronRight,
  Ban,
  Tag,
  Share2,
} from 'lucide-react';
import { Appointment, DoctorBlockedSlot } from '../types';
import {
  getStoredAppointments,
  updateClinicalStatus,
  updateAppointmentStatus,
  deleteAppointment,
  addAppointment,
  generateAppointmentId,
  getStoredBlockedSlots,
  addBlockedSlot,
  removeBlockedSlot,
} from '../utils/storage';
import { MEDICAL_SERVICES, CLINIC_INFO } from '../data/clinicData';
import { getAvailableDates } from '../utils/dateUtils';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PINS = ['9585', 'sriskin2025', 'kavitha123', 'admin'];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sri_skin_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Appointments & Data State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<DoctorBlockedSlot[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filters State
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [dateFilterMode, setDateFilterMode] = useState<'today' | 'tomorrow' | 'all' | 'custom'>('today');
  const [selectedSession, setSelectedSession] = useState<'all' | 'morning' | 'evening'>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'waiting' | 'in_consultation' | 'scheduled' | 'completed' | 'cancelled'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals inside Admin
  const [selectedApptForNotes, setSelectedApptForNotes] = useState<Appointment | null>(null);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isBlockedSlotsOpen, setIsBlockedSlotsOpen] = useState(false);
  const [isRxPrintOpen, setIsRxPrintOpen] = useState<Appointment | null>(null);

  // Notes & Rx Form State
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescriptionSummary, setPrescriptionSummary] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid_cash' | 'paid_upi' | 'insurance'>('pending');
  const [consultationFee, setConsultationFee] = useState(500);

  // Walk-in form state
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInAge, setWalkInAge] = useState('28');
  const [walkInService, setWalkInService] = useState('clinical-dermatology');
  const [walkInReason, setWalkInReason] = useState('');
  const [walkInSession, setWalkInSession] = useState<'morning' | 'evening'>('morning');
  const [walkInPayment, setWalkInPayment] = useState<'paid_cash' | 'paid_upi' | 'pending'>('paid_upi');

  // Block Slot form state
  const [blockDate, setBlockDate] = useState(todayStr);
  const [blockSession, setBlockSession] = useState<'full_day' | 'morning' | 'evening'>('morning');
  const [blockReason, setBlockReason] = useState('Dr. V. Kavitha attending Dermatology Conference / OT Surgery');

  // Cancel & No-show management state
  const [cancelConfirmAppt, setCancelConfirmAppt] = useState<Appointment | null>(null);
  const [cancelActionType, setCancelActionType] = useState<'no_show' | 'cancelled' | 'delete'>('no_show');
  const [cancelReasonNote, setCancelReasonNote] = useState('Schedule Conflict / No-Show');

  // Load appointments
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setAppointments(getStoredAppointments());
      setBlockedSlots(getStoredBlockedSlots());
    }
  }, [isOpen, isAuthenticated, refreshTrigger]);

  const reloadData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PINS.includes(pinInput.trim().toLowerCase())) {
      setIsAuthenticated(true);
      localStorage.setItem('sri_skin_admin_auth', 'true');
      setAuthError('');
      setAppointments(getStoredAppointments());
      setBlockedSlots(getStoredBlockedSlots());
    } else {
      setAuthError('Incorrect Doctor PIN / Passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sri_skin_admin_auth');
    setPinInput('');
  };

  // Filtered appointments calculation
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // Date filter
      if (dateFilterMode === 'today') {
        if (appt.date !== todayStr) return false;
      } else if (dateFilterMode === 'tomorrow') {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const tomStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (appt.date !== tomStr) return false;
      } else if (dateFilterMode === 'custom') {
        if (appt.date !== selectedDate) return false;
      } // 'all' passes date filter

      // Session filter
      if (selectedSession !== 'all') {
        const isEvening = appt.time.includes('PM') && !appt.time.startsWith('12:');
        if (selectedSession === 'morning' && isEvening) return false;
        if (selectedSession === 'evening' && !isEvening) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'waiting') {
          if (appt.clinicalStatus !== 'arrived') return false;
        } else if (statusFilter === 'in_consultation') {
          if (appt.clinicalStatus !== 'in_consultation') return false;
        } else if (statusFilter === 'completed') {
          if (appt.clinicalStatus !== 'completed') return false;
        } else if (statusFilter === 'scheduled') {
          if (appt.clinicalStatus && appt.clinicalStatus !== 'scheduled') return false;
        } else if (statusFilter === 'cancelled') {
          if (appt.status !== 'cancelled' && appt.clinicalStatus !== 'cancelled' && appt.clinicalStatus !== 'no_show')
            return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          appt.patientName.toLowerCase().includes(q) ||
          appt.patientPhone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
          appt.id.toLowerCase().includes(q) ||
          appt.serviceName.toLowerCase().includes(q) ||
          (appt.reasonForVisit && appt.reasonForVisit.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [appointments, dateFilterMode, todayStr, selectedDate, selectedSession, statusFilter, searchQuery]);

  // Metrics for active date
  const todayMetrics = useMemo(() => {
    const activeList = appointments.filter((a) => a.date === selectedDate && a.status !== 'cancelled');
    const waiting = activeList.filter((a) => a.clinicalStatus === 'arrived').length;
    const inConsult = activeList.filter((a) => a.clinicalStatus === 'in_consultation').length;
    const completed = activeList.filter((a) => a.clinicalStatus === 'completed').length;
    const totalRevenue = activeList.reduce((acc, curr) => acc + (curr.consultationFee || 500), 0);
    return {
      total: activeList.length,
      waiting,
      inConsult,
      completed,
      scheduled: activeList.filter((a) => !a.clinicalStatus || a.clinicalStatus === 'scheduled').length,
      totalRevenue,
    };
  }, [appointments, selectedDate]);

  // Actions
  const handleSetClinicalStatus = (
    id: string,
    newStatus: 'scheduled' | 'arrived' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show'
  ) => {
    updateClinicalStatus(id, newStatus);
    reloadData();
  };

  const handleOpenNotes = (appt: Appointment) => {
    setSelectedApptForNotes(appt);
    setClinicalNotes(appt.doctorNotes || '');
    setPrescriptionSummary(appt.prescriptionSummary || '');
    setFollowUpDate(appt.followUpDate || '');
    setPaymentStatus(appt.paymentStatus || 'pending');
    setConsultationFee(appt.consultationFee || 500);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptForNotes) return;
    updateClinicalStatus(selectedApptForNotes.id, selectedApptForNotes.clinicalStatus || 'completed', {
      doctorNotes: clinicalNotes,
      prescriptionSummary,
      followUpDate,
      paymentStatus,
      consultationFee,
    });
    setSelectedApptForNotes(null);
    reloadData();
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName.trim() || !walkInPhone.trim()) return;

    const srv = MEDICAL_SERVICES.find((s) => s.id === walkInService) || MEDICAL_SERVICES[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const slotTime = walkInSession === 'morning' ? '11:45 AM' : '06:30 PM';

    const newAppt: Appointment = {
      id: generateAppointmentId(),
      serviceId: srv.id,
      serviceName: srv.title,
      providerId: 'dr-kavitha',
      providerName: 'Dr. V. Kavitha (M.B.B.S., M.D., D.V.L.)',
      visitType: 'in-person',
      date: selectedDate,
      time: slotTime,
      patientName: walkInName.trim(),
      patientPhone: walkInPhone.trim(),
      dateOfBirth: `Age: ${walkInAge}`,
      isNewPatient: true,
      insuranceProvider: 'Direct Walk-In / Cash / UPI',
      reasonForVisit: walkInReason.trim() || 'Direct Walk-In Patient consultation at front desk',
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      clinicalStatus: 'arrived',
      arrivedAt: nowTime,
      consultationFee: 500,
      paymentStatus: walkInPayment,
    };

    addAppointment(newAppt);
    setIsWalkInOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    setWalkInReason('');
    reloadData();
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlock: DoctorBlockedSlot = {
      id: `BLK-${Date.now()}`,
      date: blockDate,
      session: blockSession,
      reason: blockReason,
      createdAt: new Date().toISOString(),
    };
    addBlockedSlot(newBlock);
    setBlockedSlots(getStoredBlockedSlots());
    setBlockReason('Dr. V. Kavitha attending Surgery OT / Dermatology Conference');
  };

  const handleRemoveBlock = (id: string) => {
    removeBlockedSlot(id);
    setBlockedSlots(getStoredBlockedSlots());
  };

  const handleWhatsAppPatient = (appt: Appointment) => {
    let msg = `Hello ${appt.patientName},\nThis is a notification from Sri Skin Clinic (Dr. V. Kavitha).\n`;
    if (appt.clinicalStatus === 'in_consultation' || appt.clinicalStatus === 'arrived') {
      msg += `Your Token #${appt.tokenNumber || '1'} is called into Dr. Kavitha's consultation chamber. Please step inside.`;
    } else {
      msg += `Reminder for your Skin Consultation on ${appt.date} at ${appt.time}.\nLocation: 295, 1st Floor, Sathy Main Road, Saravanampatti, Coimbatore.\nDoctor: Dr. V. Kavitha, M.D., D.V.L. (Skin)\nClinic Contact: +91 9585526107`;
    }
    const cleanPhone = appt.patientPhone.replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExecuteCancelOrDelete = () => {
    if (!cancelConfirmAppt) return;
    if (cancelActionType === 'delete') {
      deleteAppointment(cancelConfirmAppt.id);
    } else if (cancelActionType === 'no_show') {
      updateClinicalStatus(cancelConfirmAppt.id, 'no_show');
    } else {
      updateAppointmentStatus(cancelConfirmAppt.id, 'cancelled');
    }
    setCancelConfirmAppt(null);
    reloadData();
  };

  const handlePrintDayQueue = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Appointment ID',
      'Token',
      'Date',
      'Time',
      'Patient Name',
      'Mobile',
      'Treatment',
      'Clinical Status',
      'Payment Status',
      'Fee',
      'Doctor Notes',
    ];
    const rows = filteredAppointments.map((a) => [
      a.id,
      a.tokenNumber || '',
      a.date,
      a.time,
      `"${a.patientName}"`,
      a.patientPhone,
      `"${a.serviceName}"`,
      a.clinicalStatus || 'scheduled',
      a.paymentStatus || 'pending',
      a.consultationFee || 500,
      `"${(a.doctorNotes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sri_Skin_Clinic_Appointments_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4 md:p-6 animate-fadeIn">
      {/* AUTH SCREEN */}
      {!isAuthenticated ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-5 sm:p-8 space-y-5 sm:space-y-6 text-slate-800 my-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">Doctor &amp; Staff Portal</h2>
                <p className="text-xs text-teal-700 font-semibold">Sri Skin Clinic • Dr. V. Kavitha</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-teal-50/80 border border-teal-200 p-3.5 rounded-2xl text-xs text-teal-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Restricted Clinical Administration</span>
            </p>
            <p className="text-slate-600">
              Only authorized clinic staff and Dr. V. Kavitha can access the live consultation queue, clinical notes, and patient records.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Enter Doctor / Receptionist Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter Passcode (e.g. 9585)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-600 bg-slate-50 focus:bg-white font-mono"
                />
              </div>
              {authError && <p className="text-xs text-red-600 mt-1.5 font-medium">{authError}</p>}
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Quick Demo Passcode: <strong className="text-teal-700 font-mono">9585</strong></span>
              <button
                type="button"
                onClick={() => setPinInput('9585')}
                className="text-teal-700 hover:underline font-semibold cursor-pointer"
              >
                Auto-fill
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400">
            Sri Skin Clinic, Saravanampatti, Coimbatore • +91 9585526107
          </p>
        </div>
      ) : (
        /* AUTHENTICATED DOCTOR & RECEPTIONIST WORKSPACE */
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl overflow-hidden flex flex-col h-[98vh] sm:h-[94vh] text-slate-800 my-auto">
          {/* Top Bar - Mobile Optimized */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-slate-900 text-white border-b border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-sm sm:text-base font-bold leading-tight truncate">Dr. V. Kavitha • OPD Desk</h2>
                    <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                      LIVE OPD
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                    Sri Skin Clinic • Saravanampatti, Coimbatore
                  </p>
                </div>
              </div>

              {/* Close button always accessible on right */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                aria-label="Close dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 pt-2.5 border-t border-slate-800/80 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setIsWalkInOpen(true)}
                className="bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Walk-In</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBlockedSlotsOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5 text-amber-400" />
                <span>Blackout</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                title="Export appointments to CSV"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={handlePrintDayQueue}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                title="Print OPD Token Sheet"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={reloadData}
                className="bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                title="Refresh Live Queue"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shrink-0 cursor-pointer ml-auto"
                title="Sign out from doctor admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            </div>
          </div>

          {/* Metrics Ribbon */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block">Queue</span>
                <span className="text-sm sm:text-base font-bold text-slate-900">{todayMetrics.total} Patients</span>
              </div>
              <div className="bg-amber-50/80 p-2 sm:p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-700 block">Waiting</span>
                <span className="text-sm sm:text-base font-bold text-amber-900">{todayMetrics.waiting} Arrived</span>
              </div>
              <div className="bg-purple-50/80 p-2 sm:p-2.5 rounded-xl border border-purple-200 shadow-2xs">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-purple-700 block">In Consult</span>
                <span className="text-sm sm:text-base font-bold text-purple-900">{todayMetrics.inConsult} Active</span>
              </div>
              <div className="bg-emerald-50/80 p-2 sm:p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-700 block">Completed</span>
                <span className="text-sm sm:text-base font-bold text-emerald-900">{todayMetrics.completed} Done</span>
              </div>
              <div className="bg-blue-50/80 p-2 sm:p-2.5 rounded-xl border border-blue-200 shadow-2xs">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-700 block">Scheduled</span>
                <span className="text-sm sm:text-base font-bold text-blue-900">{todayMetrics.scheduled} Slots</span>
              </div>
              <div className="bg-teal-50/80 p-2 sm:p-2.5 rounded-xl border border-teal-200 shadow-2xs">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-teal-700 block">Est. Revenue</span>
                <span className="text-sm sm:text-base font-bold text-teal-950">₹{todayMetrics.totalRevenue}</span>
              </div>
            </div>
          </div>

          {/* Filters and Controls Toolbar */}
          <div className="p-3 sm:p-4 bg-white border-b border-slate-200 flex flex-col gap-2.5 text-xs">
            {/* Row 1: Date quick selectors */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="font-bold text-slate-700 shrink-0 mr-1 text-[11px] uppercase">Date:</span>
              <button
                type="button"
                onClick={() => {
                  setDateFilterMode('today');
                  setSelectedDate(todayStr);
                }}
                className={`px-2.5 py-1 sm:py-1.5 rounded-lg font-semibold cursor-pointer transition-colors shrink-0 text-xs ${
                  dateFilterMode === 'today'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateFilterMode('tomorrow');
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(
                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                  );
                }}
                className={`px-2.5 py-1 sm:py-1.5 rounded-lg font-semibold cursor-pointer transition-colors shrink-0 text-xs ${
                  dateFilterMode === 'tomorrow'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setDateFilterMode('all')}
                className={`px-2.5 py-1 sm:py-1.5 rounded-lg font-semibold cursor-pointer transition-colors shrink-0 text-xs ${
                  dateFilterMode === 'all'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Dates
              </button>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setDateFilterMode('custom');
                  }}
                  className="px-2 py-1 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Row 2: Status Filter Tabs & Session Filter */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar max-w-full">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'waiting', label: 'Waiting Room' },
                  { id: 'in_consultation', label: 'In Consult' },
                  { id: 'scheduled', label: 'Scheduled' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'cancelled', label: 'Cancelled' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id as any)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                      statusFilter === st.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Session Selector & Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value as any)}
                  className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-600 font-medium shrink-0"
                >
                  <option value="all">All Sessions</option>
                  <option value="morning">Morning (10:00 AM - 01:30 PM)</option>
                  <option value="evening">Evening (05:00 PM - 08:30 PM)</option>
                </select>

                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, phone, token..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Patient Queue Cards List */}
          <div className="p-2.5 sm:p-4 md:p-6 overflow-y-auto flex-1 bg-slate-100/70 space-y-2.5 sm:space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3 max-w-md mx-auto my-6">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Appointments Matched Current Filters</h3>
                <p className="text-xs text-slate-500">
                  Try switching the date, clearing search filters, or adding a new walk-in patient.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWalkInOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Walk-In Patient</span>
                </button>
              </div>
            ) : (
              filteredAppointments.map((appt, idx) => {
                const isWaiting = appt.clinicalStatus === 'arrived';
                const isInConsult = appt.clinicalStatus === 'in_consultation';
                const isCompleted = appt.clinicalStatus === 'completed';
                const isCancelled =
                  appt.status === 'cancelled' ||
                  appt.clinicalStatus === 'cancelled' ||
                  appt.clinicalStatus === 'no_show';

                return (
                  <div
                    key={appt.id}
                    className={`p-3 sm:p-4 rounded-2xl border transition-all bg-white shadow-xs space-y-3 ${
                      isInConsult
                        ? 'border-purple-400 ring-2 ring-purple-100 bg-purple-50/20'
                        : isWaiting
                        ? 'border-amber-300 ring-1 ring-amber-100'
                        : isCompleted
                        ? 'border-emerald-200 opacity-90'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Top Row: Token + Patient Info + Status Tags + Direct Cancel Icon */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Token Badge */}
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold border ${
                            isInConsult
                              ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                              : isWaiting
                              ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-600 text-white border-emerald-700'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="text-[8px] uppercase tracking-widest leading-none">Token</span>
                          <span className="text-sm sm:text-base leading-tight">#{appt.tokenNumber || idx + 1}</span>
                        </div>

                        {/* Name, Age & Category */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">{appt.patientName}</h4>
                            <span className="text-[11px] text-slate-500 font-medium">{appt.dateOfBirth}</span>
                            {appt.isNewPatient ? (
                              <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-bold">
                                New
                              </span>
                            ) : (
                              <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full font-bold">
                                Review
                              </span>
                            )}
                            {appt.visitType === 'telehealth' && (
                              <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                <Video className="w-2.5 h-2.5" />
                                <span>Video</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block">{appt.id}</span>
                        </div>
                      </div>

                      {/* Right top: Status Pill + Direct Cancel Icon */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider ${
                            isInConsult
                              ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-200'
                              : isWaiting
                              ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-200'
                              : isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCancelled
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isInConsult
                            ? 'In Chamber'
                            : isWaiting
                            ? `Waiting (${appt.arrivedAt || 'Arrived'})`
                            : isCompleted
                            ? `Done (${appt.completedAt || 'Rx Done'})`
                            : isCancelled
                            ? 'Cancelled / No-show'
                            : 'Scheduled'}
                        </span>

                        {/* Quick Cancel or Restore Icon for fast operation */}
                        {!isCompleted && !isCancelled ? (
                          <button
                            type="button"
                            onClick={() => {
                              setCancelConfirmAppt(appt);
                              setCancelActionType('no_show');
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Cancel or mark no-show"
                            aria-label="Cancel appointment"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : isCancelled ? (
                          <button
                            type="button"
                            onClick={() => {
                              updateAppointmentStatus(appt.id, 'confirmed');
                              updateClinicalStatus(appt.id, 'scheduled');
                              reloadData();
                            }}
                            className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Restore / Re-activate appointment"
                            aria-label="Restore appointment"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Middle Row: Service, Slot, Phone, Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Treatment:</span>
                        <span className="font-semibold text-teal-800 flex items-center gap-1 truncate">
                          <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
                          <span className="truncate">{appt.serviceName}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Slot Time:</span>
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{appt.date} • {appt.time}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Contact:</span>
                        <a
                          href={`tel:${appt.patientPhone}`}
                          className="font-medium text-slate-700 hover:text-teal-700 flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{appt.patientPhone}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Billing:</span>
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            appt.paymentStatus === 'paid_upi' || appt.paymentStatus === 'paid_cash'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : appt.paymentStatus === 'insurance'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          ₹{appt.consultationFee || 500} •{' '}
                          {appt.paymentStatus === 'paid_upi'
                            ? 'Paid UPI'
                            : appt.paymentStatus === 'paid_cash'
                            ? 'Paid Cash'
                            : appt.paymentStatus === 'insurance'
                            ? 'TPA'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Chief Complaint / Notes */}
                    {appt.reasonForVisit && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                        <strong className="text-slate-700 not-italic">Chief Complaint:</strong> {appt.reasonForVisit}
                      </p>
                    )}

                    {/* Doctor Notes Preview */}
                    {appt.doctorNotes && (
                      <div className="text-xs text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                        <strong>Dr. Kavitha&apos;s Notes:</strong> {appt.doctorNotes}
                      </div>
                    )}

                    {/* Bottom Action Buttons Row - Highly Responsive */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end pt-2 border-t border-slate-100">
                      {/* Step 1: Mark Arrived */}
                      {!isWaiting && !isInConsult && !isCompleted && !isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleSetClinicalStatus(appt.id, 'arrived')}
                          className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Patient arrived at clinic desk"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Mark Arrived</span>
                        </button>
                      )}

                      {/* Step 2: Start Consult with Dr. Kavitha */}
                      {isWaiting && (
                        <button
                          type="button"
                          onClick={() => handleSetClinicalStatus(appt.id, 'in_consultation')}
                          className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer transition-colors animate-pulse"
                          title="Doctor calls patient into chamber"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Start Consult</span>
                        </button>
                      )}

                      {/* Step 3: Complete Consult & Add Rx */}
                      {(isInConsult || isWaiting) && (
                        <button
                          type="button"
                          onClick={() => handleOpenNotes(appt)}
                          className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Complete visit and add notes/Rx"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete &amp; Rx</span>
                        </button>
                      )}

                      {/* Clinical Notes & Prescription Slip */}
                      <button
                        type="button"
                        onClick={() => handleOpenNotes(appt)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Doctor clinical notes"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-700" />
                        <span>Notes</span>
                      </button>

                      {/* WhatsApp Notify */}
                      <button
                        type="button"
                        onClick={() => handleWhatsAppPatient(appt)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Send Token Alert / Reminder to Patient on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Cancel / No show action button */}
                      {!isCompleted && !isCancelled ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCancelConfirmAppt(appt);
                            setCancelActionType('no_show');
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Cancel or mark no-show"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel / No-Show</span>
                        </button>
                      ) : isCancelled ? (
                        <button
                          type="button"
                          onClick={() => {
                            updateAppointmentStatus(appt.id, 'confirmed');
                            updateClinicalStatus(appt.id, 'scheduled');
                            reloadData();
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Re-activate appointment"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Restore</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <span>
                <strong>Session:</strong> Morning (10 AM - 1:30 PM) • Evening (5 PM - 8:30 PM)
              </span>
              <span className="hidden sm:inline">•</span>
              <span>
                <strong>Doctor:</strong> Dr. V. Kavitha (Skin)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reloadData}
                className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cancel / No-Show Confirmation Dialog */}
      {cancelConfirmAppt && (
        <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh] text-slate-800">
            <div className="px-5 py-3.5 bg-red-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold">Manage Appointment Status</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelConfirmAppt(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{cancelConfirmAppt.patientName}</span>
                  <span className="font-mono text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                    Token #{cancelConfirmAppt.tokenNumber || '1'}
                  </span>
                </div>
                <p className="text-slate-600">
                  {cancelConfirmAppt.serviceName} • {cancelConfirmAppt.date} @ {cancelConfirmAppt.time}
                </p>
                <p className="text-slate-500 font-mono text-[11px]">Ph: {cancelConfirmAppt.patientPhone}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Action
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      cancelActionType === 'no_show'
                        ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelActionType"
                      checked={cancelActionType === 'no_show'}
                      onChange={() => setCancelActionType('no_show')}
                      className="mt-0.5 text-amber-600"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Mark as Patient No-Show</span>
                      <span className="text-slate-500 text-[11px]">
                        Releases the slot for walk-ins and logs patient as absent in clinic queue records.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      cancelActionType === 'cancelled'
                        ? 'bg-red-50/80 border-red-300 ring-1 ring-red-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelActionType"
                      checked={cancelActionType === 'cancelled'}
                      onChange={() => setCancelActionType('cancelled')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Cancel Appointment</span>
                      <span className="text-slate-500 text-[11px]">
                        Marks appointment as officially cancelled on patient&apos;s request.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      cancelActionType === 'delete'
                        ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelActionType"
                      checked={cancelActionType === 'delete'}
                      onChange={() => setCancelActionType('delete')}
                      className="mt-0.5 text-rose-600"
                    />
                    <div>
                      <span className="font-bold text-rose-900 block">Delete Record Permanently</span>
                      <span className="text-slate-500 text-[11px]">
                        Removes this booking completely from the database (e.g. test booking).
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Reason Note
                </label>
                <input
                  type="text"
                  value={cancelReasonNote}
                  onChange={(e) => setCancelReasonNote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800"
                  placeholder="e.g. Patient called to cancel / Did not arrive"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCancelConfirmAppt(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={handleExecuteCancelOrDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>
                    {cancelActionType === 'delete'
                      ? 'Confirm Delete'
                      : cancelActionType === 'no_show'
                      ? 'Confirm No-Show'
                      : 'Confirm Cancel'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Clinical Notes & Prescription Summary */}
      {selectedApptForNotes && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] text-slate-800">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold">
                  Clinical Examination &amp; Rx: {selectedApptForNotes.patientName} (Token #{selectedApptForNotes.tokenNumber || '1'})
                </h3>
              </div>
              <button
                onClick={() => setSelectedApptForNotes(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Treatment Protocol</span>
                  <span className="font-bold text-slate-900">{selectedApptForNotes.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Patient Concern</span>
                  <span className="font-medium text-slate-800">{selectedApptForNotes.reasonForVisit}</span>
                </div>
              </div>

              {/* Diagnosis / Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Doctor&apos;s Clinical Findings &amp; Diagnosis *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Grade 2 Comedonal & Inflammatory Acne on bilateral malar region. Advised Salicylic-Mandelic peel series + topical clindamycin gel."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 bg-white"
                />
              </div>

              {/* Prescription / Skincare Regimen */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Prescription &amp; Home Care Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 1. Tab. Doxycycline 100mg once daily after food x 14 days&#10;2. Sunscreen Gel SPF 50+ every 3 hours&#10;3. Gentle non-comedogenic foaming cleanser"
                  value={prescriptionSummary}
                  onChange={(e) => setPrescriptionSummary(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 bg-white font-mono"
                />
              </div>

              {/* Follow up & Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="paid_upi">Paid via UPI / GPay</option>
                    <option value="paid_cash">Paid Cash</option>
                    <option value="insurance">Insurance / TPA</option>
                    <option value="pending">Payment Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedApptForNotes(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Record &amp; Mark Completed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Walk-In Patient */}
      {isWalkInOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] text-slate-800">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold">Register Walk-In OPD Patient</h3>
              </div>
              <button onClick={() => setIsWalkInOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWalkIn} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9842211223"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age / DOB</label>
                  <input
                    type="text"
                    placeholder="e.g. 28 Yrs"
                    value={walkInAge}
                    onChange={(e) => setWalkInAge(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Slot</label>
                  <select
                    value={walkInSession}
                    onChange={(e) => setWalkInSession(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="morning">Morning (10:00 AM - 1:30 PM)</option>
                    <option value="evening">Evening (5:00 PM - 8:30 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Fee Paid</label>
                  <select
                    value={walkInPayment}
                    onChange={(e) => setWalkInPayment(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="paid_upi">₹500 (GPay / UPI)</option>
                    <option value="paid_cash">₹500 (Cash)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service / Treatment</label>
                <select
                  value={walkInService}
                  onChange={(e) => setWalkInService(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                >
                  {MEDICAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chief Complaint</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Skin allergy, sudden rash, acne consultation..."
                  value={walkInReason}
                  onChange={(e) => setWalkInReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsWalkInOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Live Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Slot Blackout / Doctor Leave Manager */}
      {isBlockedSlotsOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] text-slate-800">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">Doctor Leave &amp; Slot Blackout Manager</h3>
              </div>
              <button onClick={() => setIsBlockedSlotsOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <form onSubmit={handleAddBlock} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900">Block New Date / Session</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={blockDate}
                      onChange={(e) => setBlockDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Blocked Session</label>
                    <select
                      value={blockSession}
                      onChange={(e) => setBlockSession(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                    >
                      <option value="full_day">Full Day (Closed)</option>
                      <option value="morning">Morning Session Only (10 AM - 1:30 PM)</option>
                      <option value="evening">Evening Session Only (5 PM - 8:30 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reason / Notice</label>
                  <input
                    type="text"
                    required
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block Selected Slots</span>
                </button>
              </form>

              {/* Active Blocked Slots List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Active Blackout Dates ({blockedSlots.length})
                </h4>
                {blockedSlots.length === 0 ? (
                  <p className="text-slate-400 italic">No slots currently blocked. Doctor available as scheduled.</p>
                ) : (
                  blockedSlots.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          {b.date} • <span className="capitalize">{b.session?.replace('_', ' ')}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{b.reason}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(b.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 cursor-pointer"
                        title="Unblock slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setIsBlockedSlotsOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
