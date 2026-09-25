import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  CalendarX,
  RefreshCw,
  Phone,
  Building,
  Sparkles,
  Trash2,
  History,
  Activity,
  FileText,
  Printer,
  ChevronRight,
  UserCheck,
  Check,
  Stethoscope,
  Ticket,
} from 'lucide-react';
import { Appointment } from '../types';
import {
  getStoredAppointments,
  updateAppointmentStatus,
  getAppointmentsForPatient,
  getUserPatientPhone,
  getUserBookingIds,
  saveUserPatientPhone,
} from '../utils/storage';
import { getAvailableDates, getTimeSlotsForDate } from '../utils/dateUtils';
import { CLINIC_INFO } from '../data/clinicData';

interface AppointmentLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'upcoming' | 'completed' | 'cancelled';

export const AppointmentLookupModal: React.FC<AppointmentLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [matchedAppointments, setMatchedAppointments] = useState<Appointment[]>([]);
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null);

  // Reschedule state
  const [reschedulingApptId, setReschedulingApptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [confirmingCancelApptId, setConfirmingCancelApptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule Conflict');

  // Load history on open
  useEffect(() => {
    if (isOpen) {
      const initial = getAppointmentsForPatient();
      setMatchedAppointments(initial);
      if (initial.length > 0) {
        setSelectedApptId(initial[0].id);
      }
      setActionNotice(null);
      setConfirmingCancelApptId(null);
      setReschedulingApptId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery !== undefined ? customQuery : searchQuery;
    const query = q.trim().toLowerCase();

    if (!query) {
      const defaultHistory = getAppointmentsForPatient();
      setMatchedAppointments(defaultHistory);
      if (defaultHistory.length > 0) setSelectedApptId(defaultHistory[0].id);
      return;
    }

    // Save phone if valid number search
    const cleanDigits = query.replace(/\D/g, '');
    if (cleanDigits.length >= 10) {
      saveUserPatientPhone(cleanDigits);
    }

    const results = getAppointmentsForPatient(query);
    setMatchedAppointments(results);
    if (results.length > 0) {
      setSelectedApptId(results[0].id);
    } else {
      setSelectedApptId(null);
    }
    setActionNotice(null);
    setConfirmingCancelApptId(null);
  };

  const refreshList = (selectId?: string) => {
    const updatedAll = getAppointmentsForPatient(searchQuery);
    setMatchedAppointments(updatedAll);
    if (selectId) setSelectedApptId(selectId);
  };

  const handleConfirmCancelAppt = (id: string) => {
    const success = updateAppointmentStatus(id, 'cancelled');
    if (success) {
      setConfirmingCancelApptId(null);
      setActionNotice('Appointment has been cancelled successfully.');
      refreshList(id);
    }
  };

  const handleReactivateAppt = (id: string) => {
    const success = updateAppointmentStatus(id, 'confirmed');
    if (success) {
      setActionNotice('Appointment has been restored to Confirmed status.');
      refreshList(id);
    }
  };

  const handleStartReschedule = (appt: Appointment) => {
    setReschedulingApptId(appt.id);
    setConfirmingCancelApptId(null);
    const dates = getAvailableDates(14).filter((d) => d.isAvailable);
    setNewDate(dates[0]?.dateString || appt.date);
    setNewTime('10:30 AM');
    setActionNotice(null);
  };

  const handleConfirmReschedule = (id: string) => {
    if (!newDate || !newTime) return;
    const success = updateAppointmentStatus(id, 'rescheduled', newDate, newTime);
    if (success) {
      setReschedulingApptId(null);
      setActionNotice(`Appointment successfully rescheduled to ${newDate} at ${newTime}.`);
      refreshList(id);
    }
  };

  const handlePrintSummary = (appt: Appointment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Pass & History - ${appt.id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #1e293b; }
            .card { border: 2px solid #0d9488; border-radius: 12px; padding: 24px; max-width: 650px; margin: 0 auto; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 20px; font-weight: bold; color: #0f766e; }
            .badge { background-color: #ccfbf1; color: #0f766e; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; margin-bottom: 20px; }
            .label { color: #64748b; font-size: 12px; text-transform: uppercase; }
            .value { font-weight: bold; margin-top: 2px; }
            .box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 13px; margin-top: 16px; }
            .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <div class="logo">Skin Care Clinic</div>
                <div style="font-size: 12px; color: #64748b;">Dr. Lakshmi, Skin Care Specialist • Udumalaipettai</div>
              </div>
              <div class="badge">Token #${appt.tokenNumber || 1} • ${appt.status.toUpperCase()}</div>
            </div>
            
            <div class="grid">
              <div>
                <div class="label">Confirmation ID</div>
                <div class="value" style="color: #0f766e;">${appt.id}</div>
              </div>
              <div>
                <div class="label">Patient Name</div>
                <div class="value">${appt.patientName}</div>
              </div>
              <div>
                <div class="label">Scheduled Date & Time</div>
                <div class="value">${appt.date} at ${appt.time}</div>
              </div>
              <div>
                <div class="label">Treatment / Service</div>
                <div class="value">${appt.serviceName}</div>
              </div>
              <div>
                <div class="label">Visit Format</div>
                <div class="value">${appt.visitType === 'in-person' ? 'In-Person Consultation' : 'Telehealth Video'}</div>
              </div>
              <div>
                <div class="label">Mobile Number</div>
                <div class="value">${appt.patientPhone}</div>
              </div>
            </div>

            ${
              appt.doctorNotes
                ? `
            <div class="box">
              <strong style="color:#0f766e;">Doctor Notes / Clinical Summary:</strong>
              <p style="margin:4px 0 0 0;">${appt.doctorNotes}</p>
            </div>
            `
                : ''
            }

            ${
              appt.prescriptionSummary
                ? `
            <div class="box">
              <strong style="color:#0f766e;">Prescription Summary:</strong>
              <p style="margin:4px 0 0 0;">${appt.prescriptionSummary}</p>
            </div>
            `
                : ''
            }

            <div class="box">
              <strong>Clinic Address:</strong><br/>
              123, Palani Rd, Udumalaipettai Municipality, Tamil Nadu 642126<br/>
              Phone: +91 9245312200
            </div>

            <div class="footer">
              Printed from Skin Care Clinic Patient Portal • ${new Date().toLocaleString()}
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const availableDates = getAvailableDates(14);
  const slotsForReschedule = newDate ? getTimeSlotsForDate(newDate) : [];

  // Filter matched appointments by active tab
  const filteredAppointments = matchedAppointments.filter((a) => {
    if (activeTab === 'upcoming') {
      return a.status === 'confirmed' || a.status === 'rescheduled';
    }
    if (activeTab === 'completed') {
      return a.clinicalStatus === 'completed';
    }
    if (activeTab === 'cancelled') {
      return a.status === 'cancelled';
    }
    return true;
  });

  const selectedAppointment = matchedAppointments.find((a) => a.id === selectedApptId) || filteredAppointments[0];

  // Live Queue Progress calculation
  const getClinicalStepIndex = (appt?: Appointment): number => {
    if (!appt) return 1;
    if (appt.status === 'cancelled' || appt.clinicalStatus === 'cancelled') return 0;
    if (appt.clinicalStatus === 'completed') return 4;
    if (appt.clinicalStatus === 'in_consultation') return 3;
    if (appt.clinicalStatus === 'arrived') return 2;
    return 1; // default scheduled
  };

  const activeStepIdx = getClinicalStepIndex(selectedAppointment);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight flex items-center gap-2">
                <span>My Booking History &amp; Live Status</span>
                <span className="bg-teal-500/20 text-teal-300 text-[11px] px-2 py-0.5 rounded-full border border-teal-500/30">
                  Patient Portal
                </span>
              </h2>
              <p className="text-xs text-teal-300">Skin Care Clinic • Dr. Lakshmi (Udumalaipettai)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Search & Filter Header Row */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <form onSubmit={(e) => handleSearch(e)} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by Confirmation Code, Mobile #, or Patient Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-200/80">
              <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Filter:</span>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Bookings ({matchedAppointments.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Upcoming / Active ({matchedAppointments.filter((a) => a.status !== 'cancelled').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Completed Visits ({matchedAppointments.filter((a) => a.clinicalStatus === 'completed').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cancelled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'cancelled'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Cancelled ({matchedAppointments.filter((a) => a.status === 'cancelled').length})
              </button>
            </div>
          </div>

          {/* Action Notification Alert */}
          {actionNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{actionNotice}</span>
              </div>
              <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Featured Live Status Pipeline Banner for Selected Booking */}
          {selectedAppointment && selectedAppointment.status !== 'cancelled' && (
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-teal-700/50 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-teal-300 font-bold">
                        ID: {selectedAppointment.id}
                      </span>
                      {selectedAppointment.tokenNumber && (
                        <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-md">
                          TOKEN #{selectedAppointment.tokenNumber}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {selectedAppointment.serviceName}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-teal-200 block uppercase tracking-wider">Scheduled Time</span>
                  <span className="text-xs font-bold text-white">
                    {selectedAppointment.date} @ {selectedAppointment.time}
                  </span>
                </div>
              </div>

              {/* Live Progress Pipeline Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-teal-200 font-medium">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                    <span>Live Consultation Stage:</span>
                  </span>
                  <span className="font-bold text-teal-300 capitalize">
                    {selectedAppointment.clinicalStatus
                      ? selectedAppointment.clinicalStatus.replace('_', ' ')
                      : 'Scheduled'}
                  </span>
                </div>

                {/* Progress Steps Indicator */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {/* Step 1 */}
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        activeStepIdx >= 1 ? 'bg-teal-400 shadow-xs shadow-teal-400' : 'bg-slate-700'
                      }`}
                    />
                    <div className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
                      <Check className={`w-3 h-3 ${activeStepIdx >= 1 ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span>1. Scheduled</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        activeStepIdx >= 2 ? 'bg-teal-400 shadow-xs shadow-teal-400' : 'bg-slate-700'
                      }`}
                    />
                    <div className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
                      <UserCheck className={`w-3 h-3 ${activeStepIdx >= 2 ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span>2. Arrived</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        activeStepIdx >= 3 ? 'bg-teal-400 shadow-xs shadow-teal-400' : 'bg-slate-700'
                      }`}
                    />
                    <div className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
                      <Stethoscope className={`w-3 h-3 ${activeStepIdx >= 3 ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span>3. Consulting</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        activeStepIdx >= 4 ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-slate-700'
                      }`}
                    />
                    <div className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className={`w-3 h-3 ${activeStepIdx >= 4 ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>4. Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Notes summary if available */}
              {selectedAppointment.doctorNotes && (
                <div className="bg-slate-800/90 p-3 rounded-xl border border-teal-500/30 text-xs space-y-1">
                  <div className="font-bold text-teal-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Doctor Notes &amp; Treatment Guidance:</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{selectedAppointment.doctorNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Appointments List Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Booking Records ({filteredAppointments.length})
              </h3>
              <span className="text-[11px] text-slate-500">
                Click any card to select &amp; view live progress tracker above
              </span>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">No appointments found for this filter</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Try searching with your phone number, confirmation code, or click &quot;All Bookings&quot;.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                    setMatchedAppointments(getAppointmentsForPatient());
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Filters &amp; View All</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appt) => {
                  const isSelected = selectedApptId === appt.id;
                  const isRescheduling = reschedulingApptId === appt.id;

                  return (
                    <div
                      key={appt.id}
                      onClick={() => setSelectedApptId(appt.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                        isSelected
                          ? 'border-teal-500 bg-white shadow-md ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Appt Status header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              appt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : appt.status === 'rescheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            #{appt.tokenNumber || 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-slate-400">ID: {appt.id}</span>
                              <span className="text-[11px] text-slate-400">•</span>
                              <span className="text-[11px] text-slate-500 capitalize">{appt.visitType}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">{appt.serviceName}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                              appt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : appt.status === 'rescheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appt.status}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintSummary(appt);
                            }}
                            className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title="Print appointment summary pass"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient:</span>
                          <span className="font-bold text-slate-900">{appt.patientName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Doctor:</span>
                          <span className="font-semibold text-slate-800">{appt.providerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                            Scheduled Date:
                          </span>
                          <span className="font-bold text-teal-800">
                            {appt.date} @ {appt.time}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment / Fee:</span>
                          <span className="font-semibold text-slate-800">
                            ₹{appt.consultationFee || 500} ({appt.paymentStatus || 'pending'})
                          </span>
                        </div>
                      </div>

                      {/* Doctor Prescription / Notes for Completed Appt */}
                      {(appt.doctorNotes || appt.prescriptionSummary || appt.followUpDate) && (
                        <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs space-y-1.5">
                          {appt.doctorNotes && (
                            <p>
                              <strong className="text-teal-900">Clinical Notes:</strong>{' '}
                              <span className="text-slate-700">{appt.doctorNotes}</span>
                            </p>
                          )}
                          {appt.prescriptionSummary && (
                            <p>
                              <strong className="text-teal-900">Rx Medicines:</strong>{' '}
                              <span className="text-slate-700">{appt.prescriptionSummary}</span>
                            </p>
                          )}
                          {appt.followUpDate && (
                            <p>
                              <strong className="text-teal-900">Next Follow-up Date:</strong>{' '}
                              <span className="font-bold text-emerald-800">{appt.followUpDate}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Inline Cancel Confirmation Box */}
                      {confirmingCancelApptId === appt.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="p-4 bg-red-50/90 rounded-xl border border-red-200 space-y-3 animate-fadeIn"
                        >
                          <div className="flex items-start gap-2.5">
                            <CalendarX className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-xs font-bold text-red-900">
                                Confirm Cancellation for {appt.patientName}?
                              </h5>
                              <p className="text-[11px] text-red-700 mt-0.5">
                                Your slot on {appt.date} at {appt.time} will be released. You can re-book anytime.
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-red-800 mb-1">
                              Reason for cancellation:
                            </label>
                            <select
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-red-200 rounded-lg text-slate-700"
                            >
                              <option value="Schedule Conflict">Schedule Conflict / Urgent Work</option>
                              <option value="Health Improved">Symptoms Improved / Not Needed</option>
                              <option value="Booked Mistake">Booked wrong service/date by mistake</option>
                              <option value="Visiting Later">Will visit Skin Care Clinic at a later date</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setConfirmingCancelApptId(null)}
                              className="text-xs px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium cursor-pointer"
                            >
                              Keep Appointment
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmCancelAppt(appt.id)}
                              className="text-xs px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Yes, Cancel Appointment</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Inline Rescheduling Picker */}
                      {isRescheduling && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="p-4 bg-slate-50 rounded-xl border border-teal-200 space-y-3"
                        >
                          <span className="text-xs font-bold text-teal-900 block">Select New Date &amp; Slot:</span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                            {availableDates.slice(0, 8).map((d) => (
                              <button
                                key={d.dateString}
                                type="button"
                                disabled={!d.isAvailable}
                                onClick={() => setNewDate(d.dateString)}
                                className={`p-1.5 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                                  !d.isAvailable
                                    ? 'opacity-40 line-through bg-slate-100'
                                    : newDate === d.dateString
                                    ? 'bg-teal-600 text-white border-teal-600 font-bold'
                                    : 'bg-white text-slate-700 hover:bg-teal-50'
                                }`}
                              >
                                <div>{d.dayName}</div>
                                <div className="font-bold">
                                  {d.dayNumber} {d.monthName}
                                </div>
                              </button>
                            ))}
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block mb-1">Time Slot:</span>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                              {slotsForReschedule.map((s) => (
                                <button
                                  key={s.time}
                                  type="button"
                                  disabled={!s.isAvailable}
                                  onClick={() => setNewTime(s.time)}
                                  className={`py-1 px-2 text-xs rounded-md border text-center cursor-pointer ${
                                    !s.isAvailable
                                      ? 'opacity-40 line-through'
                                      : newTime === s.time
                                      ? 'bg-teal-600 text-white font-bold'
                                      : 'bg-white hover:bg-slate-100'
                                  }`}
                                >
                                  {s.time}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setReschedulingApptId(null)}
                              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmReschedule(appt.id)}
                              className="text-xs px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-2xs cursor-pointer"
                            >
                              Save New Time
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Management Buttons Row */}
                      {!isRescheduling && confirmingCancelApptId !== appt.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => handlePrintSummary(appt)}
                            className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Pass &amp; Summary</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {appt.status !== 'cancelled' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStartReschedule(appt)}
                                  className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span>Reschedule</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmingCancelApptId(appt.id);
                                    setReschedulingApptId(null);
                                  }}
                                  className="inline-flex items-center gap-1 font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  <CalendarX className="w-3.5 h-3.5" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleReactivateAppt(appt.id)}
                                className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Restore / Re-Confirm</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Need assistance with your booking? Call +91 {CLINIC_INFO.phone}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-white font-medium cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
