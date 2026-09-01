import React, { useState } from 'react';
import {
  Calendar,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  HeartPulse,
  MessageCircle,
  UserCheck,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getAvailableDates } from '../utils/dateUtils';

interface HeroProps {
  onOpenBooking: (
    serviceId?: string,
    providerId?: string,
    date?: string,
    time?: string,
    step?: 1 | 2 | 3 | 4 | 5
  ) => void;
  onOpenLookup: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('clinical-dermatology');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  // Next 4 available dates dynamically calculated
  const availableDays = getAvailableDates(4);

  const slotList = ['10:00 AM', '11:30 AM', '05:30 PM', '07:00 PM'];

  const handleQuickBook = (overrideSlot?: string, overrideDayIndex?: number) => {
    const slotToBook = overrideSlot || selectedSlot;
    const dayIdx = overrideDayIndex !== undefined ? overrideDayIndex : selectedDayIndex;
    const dateObj = availableDays[dayIdx] || availableDays[0];
    onOpenBooking(selectedSpecialty, undefined, dateObj?.dateString, slotToBook, 4);
  };

  return (
    <section id="hero-section" className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Bento Cell 1: Main Clinic Vision (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-teal-600 font-bold uppercase tracking-widest text-xs">
                Advanced Dermatology &amp; Cosmetology
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-200">
                Saravanampatti • Coimbatore
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3 tracking-tight">
              Flawless Skin &amp; Hair Care by <br className="hidden sm:inline" />
              <span className="text-teal-700">Dr. V. Kavitha</span>
            </h2>

            <p className="text-sm sm:text-base font-semibold text-slate-700 mb-2">
              M.B.B.S., M.D., D.V.L. (Skin) • Consultant Dermatologist &amp; Cosmetologist
            </p>

            <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
              At <strong className="text-slate-900">Sri Skin Clinic</strong>, we provide personalized, evidence-based dermatological care, laser scar reduction, chemical peels, PRP hair growth therapy, and minor dermatosurgery on Sathy Main Road, Saravanampatti.
            </p>
          </div>

          {/* Stats Bar with Vertical Dividers */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-teal-600">12+</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Years Experience</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-teal-600">10k+</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Happy Patients</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-bold text-teal-600">100%</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Doctor Led Care</span>
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Quick Appointment Booking Card (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Book Skin Consultation</h3>
                <span className="text-xs text-teal-600 font-semibold">With Dr. V. Kavitha</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Live booking online" />
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Select Concern / Service
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="clinical-dermatology">Acne, Eczema &amp; Skin Allergies</option>
                  <option value="cosmetology-aesthetics">Chemical Peels &amp; Skin Glow</option>
                  <option value="laser-skin-treatments">Acne Scar Laser &amp; Hair Reduction</option>
                  <option value="hair-trichology-prp">PRP Hair Loss &amp; Regrowth</option>
                  <option value="dermatosurgery-warts">Wart, Mole &amp; Tag Removal</option>
                  <option value="pediatric-dermatology">Pediatric (Child) Skin Care</option>
                  <option value="tele-dermatology">Online Video Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Preferred Day
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {availableDays.map((d, idx) => {
                    const dayLabel = idx === 0 ? 'TODAY' : idx === 1 ? 'TOMORROW' : d.dayName.toUpperCase();
                    const subLabel = `${d.dayNumber} ${d.monthName}`;
                    return (
                      <button
                        key={d.dateString}
                        id={`hero-day-btn-${idx}`}
                        type="button"
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`p-2 rounded-xl text-center cursor-pointer transition-all border ${
                          selectedDayIndex === idx
                            ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs ring-1 ring-teal-400'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-[9px] font-bold text-slate-400">{dayLabel}</span>
                        <span className="font-bold text-xs text-slate-800">{subLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  Session Slots (Morning / Evening)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {slotList.map((slot, sIdx) => (
                    <button
                      key={slot}
                      id={`hero-slot-btn-${sIdx}`}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                      }}
                      className={`px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all text-center border ${
                        selectedSlot === slot
                          ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            id="hero-quick-book-submit-btn"
            type="button"
            onClick={() => handleQuickBook()}
            className="w-full py-3 sm:py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-md shadow-teal-600/20 mt-4 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Calendar className="w-4 h-4" />
            <span>Book for {availableDays[selectedDayIndex]?.dayName} at {selectedSlot}</span>
          </button>
        </div>

        {/* Bento Cell 3: Saturated Accent Highlight (4 cols) */}
        <div className="lg:col-span-4 bg-teal-800 p-6 rounded-3xl text-white flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-teal-200 font-bold uppercase tracking-widest text-[11px] block mb-1">
              Dermatology &amp; Cosmetology
            </span>
            <h3 className="text-xl font-bold mb-3">Signature Skin Treatments</h3>
            <ul className="space-y-2.5 opacity-95 text-xs sm:text-sm">
              <li className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-teal-300 rounded-full shrink-0"></div>
                Acne, Pimple Scars &amp; Pigmentation Peels
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-teal-300 rounded-full shrink-0"></div>
                Autologous PRP Hair Regrowth Therapy
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-teal-300 rounded-full shrink-0"></div>
                Radiofrequency Wart, Mole &amp; Tag Removal
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-teal-300 rounded-full shrink-0"></div>
                Chronic Eczema, Psoriasis &amp; Skin Allergies
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-teal-700 mt-4 flex items-center justify-between">
            <a
              href="#services"
              className="text-xs font-semibold text-teal-100 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Explore all treatments</span>
              <span>&rarr;</span>
            </a>
            <span className="text-[11px] bg-teal-900 px-2.5 py-1 rounded-lg text-teal-200 font-medium">
              7 Specialties
            </span>
          </div>
        </div>

        {/* Bento Cell 4: Contact & Hours Bento Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Saravanampatti Clinic</h3>
            <div className="space-y-3 mb-3">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-teal-600 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <a
                    href={`tel:${CLINIC_INFO.phoneClean}`}
                    className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors"
                  >
                    +91 {CLINIC_INFO.phone}
                  </a>
                  <p className="text-[11px] text-slate-400">Direct Patient Line &amp; Booking</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-teal-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">295, 1st Floor, Sathy Main Road</p>
                  <p className="text-[11px] text-slate-500">Opposite Central Park Apartment, Saravanampatti</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-600">
              <span>Morning Session:</span>
              <span className="font-mono text-slate-900">10:00 AM - 01:30 PM</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-600">
              <span>Evening Session:</span>
              <span className="font-mono text-slate-900">05:00 PM - 08:30 PM</span>
            </div>
          </div>
        </div>

        {/* Bento Cell 5: Instant WhatsApp Chat Bento Module (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 p-6 rounded-3xl text-white flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                WhatsApp Inquiry
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Quick chat: 9585526107
              </p>
            </div>
          </div>
          <a
            href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20would%20like%20to%20consult%20at%20Sri%20Skin%20Clinic`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
