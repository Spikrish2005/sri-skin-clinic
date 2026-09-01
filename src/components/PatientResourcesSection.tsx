import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Phone,
  Shield,
  UserPlus,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { CLINIC_FAQS, CLINIC_INFO } from '../data/clinicData';

interface PatientResourcesSectionProps {
  onOpenBooking: () => void;
}

export const PatientResourcesSection: React.FC<PatientResourcesSectionProps> = ({ onOpenBooking }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const steps = [
    {
      step: '01',
      title: 'Book Appointment',
      desc: 'Schedule your preferred morning or evening slot online, or call/WhatsApp us at +91 9585526107.',
    },
    {
      step: '02',
      title: 'Prepare Previous Records',
      desc: 'Keep photos or prescriptions of previous skin creams, steroid ointments, or allergies handy.',
    },
    {
      step: '03',
      title: 'Visit Saravanampatti Clinic',
      desc: 'Arrive at 295, 1st Floor, Sathy Main Road (Opposite Central Park Apartment, Amman Kovil).',
    },
    {
      step: '04',
      title: 'Consult Dr. V. Kavitha',
      desc: 'Receive thorough dermatoscopic evaluation, clear root cause diagnosis, and personalized skincare protocol.',
    },
  ];

  return (
    <section id="patient-info" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Bento Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2 block">
              Patient Guide &amp; Resources
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Consultation Steps &amp; Common FAQs
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
            Helpful guidance to ensure a seamless consultation experience at Sri Skin Clinic in Coimbatore.
          </p>
        </div>
      </div>

      {/* 4-Step Patient Journey Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-teal-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 inline-block mb-3">
                STEP {s.step}
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bento FAQs Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {CLINIC_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-white leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Booking Reminder Bento Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Ready for Healthy, Radiant Skin &amp; Hair?</h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Consult Dr. V. Kavitha, M.B.B.S., M.D., D.V.L. (Skin) at Sri Skin Clinic, Saravanampatti.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20want%20to%20schedule%20a%20skin%20consultation`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Us</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Online Now</span>
          </button>
        </div>
      </div>
    </section>
  );
};
