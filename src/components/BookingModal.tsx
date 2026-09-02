import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Download,
  Printer,
  MessageCircle,
  Scissors,
  Baby,
  Video,
  HeartPulse,
  Zap,
} from 'lucide-react';
import { MEDICAL_SERVICES, DOCTOR_PROVIDERS, INSURANCE_PLANS, CLINIC_INFO } from '../data/clinicData';
import { getAvailableDates, getTimeSlotsForDate } from '../utils/dateUtils';
import { Appointment } from '../types';
import { addAppointment, generateAppointmentId, getStoredAppointments, getStoredBlockedSlots } from '../utils/storage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialProviderId?: string;
  initialDate?: string;
  initialTime?: string;
  initialStep?: 1 | 2 | 3 | 4 | 5;
  onSuccessBooking?: (appt: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialProviderId,
  initialDate,
  initialTime,
  initialStep,
  onSuccessBooking,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || 'clinical-dermatology');
  const [visitType, setVisitType] = useState<'in-person' | 'telehealth'>('in-person');
  const [selectedProviderId, setSelectedProviderId] = useState<string>(initialProviderId || 'dr-kavitha');

  const availableDates = getAvailableDates(14);
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || availableDates.find((d) => d.isAvailable)?.dateString || availableDates[0].dateString
  );
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '10:30 AM');

  // Patient Info State
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [insuranceProvider, setInsuranceProvider] = useState('Direct Self-Pay / Cash / UPI');
  const [insurancePolicyId, setInsurancePolicyId] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Confirmed Appointment Result
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
      if (initialServiceId === 'tele-dermatology') {
        setVisitType('telehealth');
      } else {
        setVisitType('in-person');
      }
    }
    if (initialProviderId) {
      setSelectedProviderId(initialProviderId);
    }
    if (initialDate) {
      setSelectedDate(initialDate);
    }
    if (initialTime) {
      setSelectedTime(initialTime);
    }
    if (initialStep) {
      setStep(initialStep);
    } else if (isOpen && !confirmedAppointment) {
      // If no initialStep is explicitly provided and date & time were supplied, jump to step 4
      if (initialDate && initialTime) {
        setStep(4);
      } else if (step === 5) {
        setStep(1);
      }
    }
  }, [initialServiceId, initialProviderId, initialDate, initialTime, initialStep, isOpen]);

  if (!isOpen) return null;

  const currentService = MEDICAL_SERVICES.find((s) => s.id === selectedServiceId) || MEDICAL_SERVICES[0];
  const rawTimeSlots = getTimeSlotsForDate(selectedDate);
  const existingAppointments = getStoredAppointments();
  const blockedSlots = getStoredBlockedSlots();

  // Check if date or session is blocked by Doctor
  const isDateBlockedFull = blockedSlots.some((b) => b.date === selectedDate && (!b.session || b.session === 'full_day'));
  const isMorningBlocked = blockedSlots.some((b) => b.date === selectedDate && b.session === 'morning');
  const isEveningBlocked = blockedSlots.some((b) => b.date === selectedDate && b.session === 'evening');

  const timeSlots = rawTimeSlots.map((slot) => {
    if (isDateBlockedFull) {
      return { ...slot, isAvailable: false };
    }
    if (isMorningBlocked && (slot.period === 'morning' || slot.period === 'afternoon')) {
      return { ...slot, isAvailable: false };
    }
    if (isEveningBlocked && slot.period === 'evening') {
      return { ...slot, isAvailable: false };
    }
    const isBooked = existingAppointments.some(
      (a) => a.date === selectedDate && a.time === slot.time && a.status !== 'cancelled'
    );
    return {
      ...slot,
      isAvailable: slot.isAvailable && !isBooked,
    };
  });

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Sparkles': return Sparkles;
      case 'Zap': return Zap;
      case 'HeartPulse': return HeartPulse;
      case 'Scissors': return Scissors;
      case 'Baby': return Baby;
      case 'Video': return Video;
      default: return Sparkles;
    }
  };

  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!patientName.trim()) errs.patientName = 'Full patient name is required';
    if (!patientPhone.trim() || patientPhone.replace(/\D/g, '').length < 10) {
      errs.patientPhone = 'Valid 10-digit mobile number is required (e.g. 9876543210)';
    }
    if (!dateOfBirth.trim()) {
      errs.dateOfBirth = 'Patient age or date of birth is required';
    }
    if (!reasonForVisit.trim()) {
      errs.reasonForVisit = 'Please describe your skin, hair, or cosmetic concern';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalBooking = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep4()) return;

    const providerObj = DOCTOR_PROVIDERS.find((p) => p.id === selectedProviderId) || DOCTOR_PROVIDERS[0];
    const providerName = `${providerObj.name} (${providerObj.degrees})`;

    const newAppt: Appointment = {
      id: generateAppointmentId(),
      serviceId: currentService.id,
      serviceName: currentService.title,
      providerId: selectedProviderId,
      providerName,
      visitType,
      date: selectedDate,
      time: selectedTime,
      patientName,
      patientEmail: patientEmail.trim() || undefined,
      patientPhone,
      dateOfBirth,
      isNewPatient,
      insuranceProvider,
      insurancePolicyId: insurancePolicyId.trim() || undefined,
      reasonForVisit,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };

    addAppointment(newAppt);
    setConfirmedAppointment(newAppt);
    setStep(5);
    if (onSuccessBooking) {
      onSuccessBooking(newAppt);
    }
  };

  const handleAddToCalendar = () => {
    if (!confirmedAppointment) return;
    const title = encodeURIComponent(`Skin Consultation: ${confirmedAppointment.serviceName} at Sri Skin Clinic`);
    const details = encodeURIComponent(
      `Appointment with Dr. V. Kavitha\nPatient: ${confirmedAppointment.patientName}\nAppointment ID: ${confirmedAppointment.id}\nClinic Phone: +91 9585526107\nAddress: 295, 1st Floor, Sathy Main Road, Saravanampatti, Coimbatore`
    );
    const location = encodeURIComponent('295, 1st Floor, Sathy Main Road, Saravanampatti, Coimbatore 641035');
    const dateFormatted = confirmedAppointment.date.replace(/-/g, '');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T050000Z/${dateFormatted}T060000Z`;
    window.open(gCalUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Book Skin Consultation</h2>
              <p className="text-xs text-teal-300">Sri Skin Clinic • Dr. V. Kavitha • Saravanampatti, Coimbatore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        {step < 5 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {[
                { num: 1, label: 'Treatment' },
                { num: 2, label: 'Doctor' },
                { num: 3, label: 'Date & Time' },
                { num: 4, label: 'Patient Info' },
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step === s.num
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                          : step > s.num
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step > s.num ? '✓' : s.num}
                    </span>
                    <span
                      className={`text-xs hidden sm:inline font-medium ${
                        step === s.num ? 'text-slate-900 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        step > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body with Scroll */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          {/* STEP 1: Select Service & Visit Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 1: Choose Skin / Hair Treatment</h3>
                <p className="text-xs text-slate-500">Select the clinical condition or cosmetic procedure.</p>
              </div>

              {/* Visit Type selector */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-700">Consultation Format:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisitType('in-person')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      visitType === 'in-person'
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>In-Clinic (Saravanampatti)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('telehealth')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      visitType === 'telehealth'
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Online Video Consult</span>
                  </button>
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MEDICAL_SERVICES.map((srv) => {
                  const IconC = getServiceIcon(srv.iconName);
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <IconC className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <span className="block text-sm font-bold text-slate-900">{srv.title}</span>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{srv.shortDesc}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          <span>~{srv.durationMinutes} min evaluation</span>
                        </span>
                        {isSelected && (
                          <span className="font-semibold text-teal-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>Selected</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Doctor Profile */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 2: Specialist Doctor</h3>
                <p className="text-xs text-slate-500">
                  All patients at Sri Skin Clinic are personally treated by Dr. V. Kavitha.
                </p>
              </div>

              {/* Single Doctor Profile Showcase */}
              <div className="p-5 rounded-2xl border-2 border-teal-600 bg-teal-50/50 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-700 to-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                    <Sparkles className="w-7 h-7 text-teal-300" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">Dr. V. Kavitha</span>
                      <span className="text-[11px] bg-teal-700 text-white px-2 py-0.5 rounded-full font-bold">
                        Lead Specialist
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-800">
                      M.B.B.S., M.D., D.V.L. (Skin) • 12+ Years Clinical Practice
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Consultant Dermatologist, Cosmetologist, and Dermatosurgeon in Coimbatore.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-teal-200/60 text-xs text-slate-700">
                  <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                    <strong className="block text-slate-900">Languages:</strong>
                    <span>Tamil &amp; English</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                    <strong className="block text-slate-900">Daily Sessions:</strong>
                    <span>Morning &amp; Evening</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time Picker */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 3: Select Consultation Date &amp; Slot</h3>
                <p className="text-xs text-slate-500">
                  Select your preferred morning (10:00 AM - 1:30 PM) or evening (5:00 PM - 8:30 PM) slot.
                </p>
              </div>

              {/* Date grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Date (Next 14 Days)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                  {availableDates.map((d) => {
                    const isSelected = selectedDate === d.dateString;
                    return (
                      <button
                        key={d.dateString}
                        type="button"
                        disabled={!d.isAvailable}
                        onClick={() => setSelectedDate(d.dateString)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          !d.isAvailable
                            ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm ring-2 ring-teal-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[11px] font-medium uppercase">{d.dayName}</span>
                        <span className="text-lg font-bold my-0.5">{d.dayNumber}</span>
                        <span className="text-[10px]">{d.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Available Consultation Slots on{' '}
                    <span className="text-teal-700 font-bold">
                      {availableDates.find((d) => d.dateString === selectedDate)?.displayFormatted || selectedDate}
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-500">IST (Coimbatore, India)</span>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-sm border border-slate-200">
                    Clinic is closed on this day. Please pick another date.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Morning Session */}
                    <div>
                      <span className="text-xs font-bold text-slate-600 block mb-1.5">
                        Morning Session (10:00 AM - 01:30 PM)
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots
                          .filter((t) => t.period === 'morning')
                          .map((slot) => (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.isAvailable}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                                !slot.isAvailable
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                                  : selectedTime === slot.time
                                  ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                                  : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 cursor-pointer'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Evening Session */}
                    {timeSlots.some((t) => t.period === 'evening') && (
                      <div>
                        <span className="text-xs font-bold text-slate-600 block mb-1.5">
                          Evening Session (05:00 PM - 08:30 PM)
                        </span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {timeSlots
                            .filter((t) => t.period === 'evening')
                            .map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.isAvailable}
                                onClick={() => setSelectedTime(slot.time)}
                                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                                  !slot.isAvailable
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                                    : selectedTime === slot.time
                                    ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 cursor-pointer'
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Patient Information Intake Form */}
          {step === 4 && (
            <form onSubmit={handleFinalBooking} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Step 4: Patient Details &amp; Concern</h3>
                <p className="text-xs text-slate-500">
                  Please provide patient details for prescription and clinical registration.
                </p>
              </div>

              {/* Patient Type toggle */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Patient Status:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(true)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                      isNewPatient ? 'bg-teal-600 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    First Time Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(false)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium cursor-pointer ${
                      !isNewPatient ? 'bg-teal-600 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    Follow-up / Review
                  </button>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar / Priya S."
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${
                      errors.patientName ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.patientName && <p className="text-[11px] text-red-600 mt-1">{errors.patientName}</p>}
                </div>

                {/* Age or DOB */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth / Age *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 28 yrs or YYYY-MM-DD"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${
                      errors.dateOfBirth ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-[11px] text-red-600 mt-1">{errors.dateOfBirth}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (WhatsApp Reminders) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${
                      errors.patientPhone ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.patientPhone && <p className="text-[11px] text-red-600 mt-1">{errors.patientPhone}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Payment / Insurance Method */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment / Coverage Preference
                  </label>
                  <select
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {INSURANCE_PLANS.map((plan) => (
                      <option key={plan.name} value={plan.name}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Insurance / TPA ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Insurance / UHID / ID (If applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STAR-987654 / Optional"
                    value={insurancePolicyId}
                    onChange={(e) => setInsurancePolicyId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Reason for visit / symptoms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Describe Your Skin / Hair Problem *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g., Acne on cheeks since 3 months, severe dandruff and hair shedding, dark spots, itchy rash..."
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 ${
                    errors.reasonForVisit ? 'border-red-400 bg-red-50/50' : 'border-slate-300'
                  }`}
                />
                {errors.reasonForVisit && <p className="text-[11px] text-red-600 mt-1">{errors.reasonForVisit}</p>}
              </div>

              {/* Booking Summary Box */}
              <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-teal-950">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>Appointment Summary Review</span>
                </div>
                <p>
                  <strong>Doctor:</strong> Dr. V. Kavitha, M.B.B.S., M.D., D.V.L. (Skin)
                </p>
                <p>
                  <strong>Treatment:</strong> {currentService.title} ({visitType === 'in-person' ? 'In-Clinic' : 'Online Video'})
                </p>
                <p>
                  <strong>Date &amp; Time:</strong> {selectedDate} at {selectedTime}
                </p>
                <p>
                  <strong>Location:</strong> 295, 1st Floor, Sathy Main Road, Saravanampatti, Coimbatore
                </p>
              </div>
            </form>
          )}

          {/* STEP 5: Booking Confirmation Pass */}
          {step === 5 && confirmedAppointment && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold">Appointment Confirmed</span>
                <h3 className="text-2xl font-bold font-serif text-slate-900">You Are All Set!</h3>
                <p className="text-xs text-slate-500">
                  Your appointment with Dr. V. Kavitha has been booked. Save your confirmation code below.
                </p>
              </div>

              {/* Printable Appointment Pass */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 text-left max-w-lg mx-auto shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Confirmation ID</span>
                    <span className="block text-lg font-mono font-bold text-teal-700">{confirmedAppointment.id}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Patient Name:</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Treatment:</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Scheduled Date:</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Time Slot:</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.time} (IST)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Doctor:</span>
                    <span className="font-bold text-slate-900">Dr. V. Kavitha (D.V.L.)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Visit Format:</span>
                    <span className="font-bold text-slate-900 capitalize">{confirmedAppointment.visitType}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-teal-600" />
                    <span>Sri Skin Clinic:</span>
                  </p>
                  <p>295, 1st Floor, Sathy Main Road, Chidambaram Nagar, opposite Central Park apartment, Amman Kovil, Saravanampatti, Coimbatore - 641035</p>
                  <p className="text-[11px] text-teal-700 font-bold">Contact: +91 {CLINIC_INFO.phone}</p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Please arrive 10 minutes prior to your slot time.</p>
                  <p>• Bring previous skincare creams/prescriptions and reports.</p>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Notification, Add to Calendar, Print, Close */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20have%20booked%20an%20appointment%20(ID:%20${confirmedAppointment.id})%20for%20${confirmedAppointment.patientName}%20on%20${confirmedAppointment.date}%20at%20${confirmedAppointment.time}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Confirmation to WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Add to Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3.5 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as 2 | 3 | 4)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 px-5 py-2.5 rounded-lg shadow-xs cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalBooking}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 px-6 py-2.5 rounded-lg shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Book Appointment</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
