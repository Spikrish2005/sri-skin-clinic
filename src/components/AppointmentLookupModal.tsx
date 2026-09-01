import React, { useState } from 'react';
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
} from 'lucide-react';
import { Appointment } from '../types';
import { getStoredAppointments, updateAppointmentStatus } from '../utils/storage';
import { getAvailableDates, getTimeSlotsForDate } from '../utils/dateUtils';
import { CLINIC_INFO } from '../data/clinicData';

interface AppointmentLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentLookupModal: React.FC<AppointmentLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedAppointments, setMatchedAppointments] = useState<Appointment[]>([]);

  // Reschedule state
  const [reschedulingApptId, setReschedulingApptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [confirmingCancelApptId, setConfirmingCancelApptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Schedule Conflict');

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const all = getStoredAppointments();
    const results = all.filter(
      (a) =>
        a.id.toLowerCase().includes(query) ||
        a.patientPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        (a.patientEmail && a.patientEmail.toLowerCase().includes(query)) ||
        a.patientName.toLowerCase().includes(query)
    );

    setMatchedAppointments(results);
    setSearched(true);
    setActionNotice(null);
    setConfirmingCancelApptId(null);
  };

  const handleConfirmCancelAppt = (id: string) => {
    const success = updateAppointmentStatus(id, 'cancelled');
    if (success) {
      setConfirmingCancelApptId(null);
      setActionNotice('Appointment has been cancelled successfully.');
      setMatchedAppointments(getStoredAppointments().filter((a) => a.id === id));
    }
  };

  const handleReactivateAppt = (id: string) => {
    const success = updateAppointmentStatus(id, 'confirmed');
    if (success) {
      setActionNotice('Appointment has been restored to Confirmed status.');
      setMatchedAppointments(getStoredAppointments().filter((a) => a.id === id));
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
      setMatchedAppointments(getStoredAppointments().filter((a) => a.id === id));
    }
  };

  const availableDates = getAvailableDates(14);
  const slotsForReschedule = newDate ? getTimeSlotsForDate(newDate) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Manage / Look Up Appointment</h2>
              <p className="text-xs text-teal-300">Sri Skin Clinic • Dr. V. Kavitha (Coimbatore)</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Find your booking by Confirmation ID, Mobile, or Name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. SRI-9585-4102 or 9585526107"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>

            {/* Quick Demo Hint */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-200">
              <span>Demo Sample Code: <strong className="text-teal-700 font-mono">SRI-9585-4102</strong></span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('SRI-9585-4102');
                  setTimeout(() => {
                    const all = getStoredAppointments();
                    setMatchedAppointments(all.filter((a) => a.id === 'SRI-9585-4102'));
                    setSearched(true);
                  }, 50);
                }}
                className="text-teal-700 hover:underline font-semibold cursor-pointer"
              >
                Auto-fill Sample
              </button>
            </div>
          </form>

          {/* Action Notification */}
          {actionNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Search Results */}
          {searched && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Search Results ({matchedAppointments.length})
              </h3>

              {matchedAppointments.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-800">No appointment found for &quot;{searchQuery}&quot;</p>
                  <p className="text-xs text-slate-500">
                    Please double check your confirmation code or call the clinic directly at{' '}
                    <a href={`tel:${CLINIC_INFO.phoneClean}`} className="text-teal-700 font-semibold underline">
                      +91 {CLINIC_INFO.phone}
                    </a>
                  </p>
                </div>
              ) : (
                matchedAppointments.map((appt) => {
                  const isRescheduling = reschedulingApptId === appt.id;

                  return (
                    <div
                      key={appt.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4"
                    >
                      {/* Appt Status header with Direct Cancel Icon */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="text-[11px] font-mono text-slate-400">ID: {appt.id}</span>
                            <h4 className="text-sm font-bold text-slate-900">{appt.serviceName}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                              appt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : appt.status === 'rescheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appt.status}
                          </span>

                          {/* Quick Cancel Icon in header if confirmed/rescheduled */}
                          {appt.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmingCancelApptId(appt.id);
                                setReschedulingApptId(null);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Cancel this appointment"
                              aria-label="Cancel appointment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Patient:</span>
                          <span className="font-semibold text-slate-800">{appt.patientName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Doctor:</span>
                          <span className="font-semibold text-slate-800">{appt.providerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Scheduled Time:</span>
                          <span className="font-semibold text-teal-800">
                            {appt.date} @ {appt.time}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Format:</span>
                          <span className="capitalize">{appt.visitType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Payment / TPA:</span>
                          <span className="truncate block">{appt.insuranceProvider}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Mobile:</span>
                          <span>{appt.patientPhone}</span>
                        </div>
                      </div>

                      {/* Inline Cancel Confirmation Box */}
                      {confirmingCancelApptId === appt.id && (
                        <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 space-y-3 animate-fadeIn">
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
                              Reason for cancellation (optional):
                            </label>
                            <select
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-red-200 rounded-lg text-slate-700"
                            >
                              <option value="Schedule Conflict">Schedule Conflict / Urgent Work</option>
                              <option value="Health Improved">Symptoms Improved / Not Needed</option>
                              <option value="Booked Mistake">Booked wrong service/date by mistake</option>
                              <option value="Visiting Later">Will visit Sri Skin Clinic at a later date</option>
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
                        <div className="p-4 bg-slate-50 rounded-xl border border-teal-200 space-y-3">
                          <span className="text-xs font-bold text-teal-900 block">
                            Select New Date &amp; Slot:
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                            {availableDates.slice(0, 8).map((d) => (
                              <button
                                key={d.dateString}
                                type="button"
                                disabled={!d.isAvailable}
                                onClick={() => setNewDate(d.dateString)}
                                className={`p-1.5 text-xs rounded-lg border text-center transition-all ${
                                  !d.isAvailable
                                    ? 'opacity-40 line-through bg-slate-100'
                                    : newDate === d.dateString
                                    ? 'bg-teal-600 text-white border-teal-600 font-bold'
                                    : 'bg-white text-slate-700 hover:bg-teal-50'
                                }`}
                              >
                                <div>{d.dayName}</div>
                                <div className="font-bold">{d.dayNumber} {d.monthName}</div>
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
                                  className={`py-1 px-2 text-xs rounded-md border text-center ${
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
                              className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmReschedule(appt.id)}
                              className="text-xs px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-2xs"
                            >
                              Save New Time
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Management Buttons */}
                      {!isRescheduling && confirmingCancelApptId !== appt.id && (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                          {appt.status !== 'cancelled' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartReschedule(appt)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <CalendarX className="w-3.5 h-3.5" />
                                <span>Cancel Appointment</span>
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReactivateAppt(appt.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Restore / Re-Confirm Appointment</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Need assistance? Call +91 {CLINIC_INFO.phone}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-white font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
