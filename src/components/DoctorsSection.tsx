import React from 'react';
import {
  Award,
  Calendar,
  Languages,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  HeartPulse,
  MessageCircle,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { DOCTOR_PROVIDERS, CLINIC_INFO } from '../data/clinicData';

interface DoctorsSectionProps {
  onBookWithDoctor: (providerId: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onBookWithDoctor }) => {
  const doctor = DOCTOR_PROVIDERS[0];

  return (
    <section id="doctor" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header Bento Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2 block">
              Consultant Dermatologist &amp; Cosmetologist
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Meet Our Specialist Doctor
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg leading-relaxed">
            All clinical and aesthetic consultations at Sri Skin Clinic are personally evaluated and treated by Dr. V. Kavitha.
          </p>
        </div>
      </div>

      {/* Main Doctor Bento Showcase (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Doctor Profile Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-4 sm:gap-5 mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-teal-600 to-slate-900 text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-teal-900/10">
                <Sparkles className="w-8 h-8 text-teal-300 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">Skin &amp; Hair</span>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 mb-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sole Lead Consultant</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  Dr. V. Kavitha
                </h3>
                <p className="text-xs sm:text-sm font-bold text-teal-700 mt-0.5">
                  M.B.B.S., M.D., D.V.L. (Skin)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dermatologist, Cosmetologist &amp; Dermatosurgeon
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              {doctor.bio}
            </p>

            {/* Credentials & Details Bento Sub-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-slate-100 mb-6">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Qualifications</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  M.B.B.S., M.D. in Dermatology, Venereology &amp; Leprosy (D.V.L.)
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-1">
                  <Award className="w-4 h-4" />
                  <span>Clinical Experience</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  12+ Years of Specialized Dermatological Practice in Coimbatore
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-1">
                  <Languages className="w-4 h-4" />
                  <span>Languages Spoken</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Tamil (தமிழ்) &amp; English
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-teal-700 font-bold text-xs mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Consultation Timings</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Mon - Sat: 10:00 AM - 1:30 PM &amp; 5:00 PM - 8:30 PM
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onBookWithDoctor(doctor.id)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold py-3.5 px-5 rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book Appointment with Dr. V. Kavitha</span>
            </button>

            <a
              href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20would%20like%20to%20book%20a%20consultation%20at%20Sri%20Skin%20Clinic`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold py-3.5 px-5 rounded-2xl shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquire</span>
            </a>
          </div>
        </div>

        {/* Right Column: Clinical Specializations & Practice Pillars (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Top Pillar: Areas of Specialization */}
          <div className="bg-teal-900 text-white p-6 sm:p-7 rounded-3xl shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <span className="text-teal-300 font-bold uppercase tracking-widest text-[11px] block mb-2">
                Specialized Treatments
              </span>
              <h4 className="text-lg sm:text-xl font-bold mb-4">
                Clinical &amp; Cosmetic Focus Areas
              </h4>

              <ul className="space-y-3 text-xs sm:text-sm text-teal-100">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Acne &amp; Scar Revision:</strong> Medical peels, subcision, and laser scar resurfacing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Hair Fall &amp; PRP Therapy:</strong> Follicular mapping, platelet-rich plasma, and regrowth serums.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Pigmentation &amp; Glow:</strong> Melasma treatments, tan removal, and pre-bridal packages.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Radiofrequency Removal:</strong> Quick excision for warts, moles, DPNs, and skin tags.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Chronic Skin Care:</strong> Psoriasis, eczema, urticaria, fungal infections, and vitiligo.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-teal-800 mt-4 flex items-center justify-between text-xs text-teal-300">
              <span>Saravanampatti, Coimbatore</span>
              <span className="font-mono">+91 95855 26107</span>
            </div>
          </div>

          {/* Bottom Pillar: Doctor Philosophy */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Ethical &amp; Evidence-Based</h5>
              <p className="text-xs text-slate-400 mt-0.5">
                No aggressive treatments or false claims — tailored medical solutions with proven dermatological results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
