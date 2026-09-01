import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Phone,
  Search,
  IndianRupee,
  FileCheck,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { INSURANCE_PLANS, CLINIC_INFO } from '../data/clinicData';

interface InsuranceSectionProps {
  onOpenBooking: () => void;
}

export const InsuranceSection: React.FC<InsuranceSectionProps> = ({ onOpenBooking }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredPlans = INSURANCE_PLANS.filter((p) =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (p.notes && p.notes.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <section id="insurance" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Bento Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2 block">
              Transparent Pricing &amp; Insurance
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Consultation Charges &amp; TPA Claims
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
            At Sri Skin Clinic, we uphold transparent, affordable dermatological consultation charges with zero hidden hospital markups.
          </p>
        </div>
      </div>

      {/* 2 Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Accepted Insurance Plans & Digital Payments (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Insurance TPA &amp; Payment Networks</h3>
              <p className="text-xs text-slate-400">Reimbursement documentation &amp; cashless digital payments</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter insurance or payments..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Plans List */}
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {filteredPlans.map((plan, idx) => (
              <div
                key={idx}
                className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">{plan.name}</span>
                    <span className="text-[11px] text-slate-500">{plan.notes}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                  Accepted
                </span>
              </div>
            ))}
          </div>

          {/* Assistance Note */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block mb-0.5">Need Treatment Estimate or Claim Papers?</strong>
              <span>
                For day-care minor dermatosurgery or surgical cyst excisions, our front desk provides complete itemized receipts and doctor treatment certificates for insurance reimbursement. Call us at{' '}
                <a href={`tel:${CLINIC_INFO.phoneClean}`} className="text-teal-700 font-bold underline">
                  +91 {CLINIC_INFO.phone}
                </a>.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Transparent Treatment Pricing in INR (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-700 font-bold">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Standard Consultation &amp; Care Fees</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent, competitive fee schedule for Dr. V. Kavitha&apos;s skin &amp; hair treatments.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800 block">Dermatology Specialist Consultation</span>
                  <span className="text-[11px] text-slate-400">Dr. V. Kavitha in-clinic physical exam</span>
                </div>
                <span className="font-bold text-teal-700 font-mono text-sm">₹400 - ₹500</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800 block">Online Telederm Consultation</span>
                  <span className="text-[11px] text-slate-400">Video assessment + E-Prescription</span>
                </div>
                <span className="font-bold text-teal-700 font-mono text-sm">₹400</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800 block">Medical Chemical Peels / Medi-Facials</span>
                  <span className="text-[11px] text-slate-400">Acne, glow, pigmentation reduction</span>
                </div>
                <span className="font-bold text-teal-700 font-mono text-sm">₹1,500 - ₹2,500</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800 block">PRP Hair Regrowth Therapy (per session)</span>
                  <span className="text-[11px] text-slate-400">Autologous concentrated plasma scalp care</span>
                </div>
                <span className="font-bold text-teal-700 font-mono text-sm">₹3,500 - ₹4,500</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800 block">RF Wart / Mole / Tag Excision</span>
                  <span className="text-[11px] text-slate-400">Painless radiofrequency removal</span>
                </div>
                <span className="font-bold text-teal-700 font-mono text-sm">₹800 - ₹2,000</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
            >
              <span>Schedule Consultation Online</span>
            </button>
          </div>

          {/* What to Bring Summary */}
          <div className="bg-teal-800 text-white rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-teal-200 text-sm">
              <FileCheck className="w-4 h-4" />
              <span>For Your Skin Consultation</span>
            </div>
            <ul className="text-xs text-teal-50 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>Wash face with plain water without heavy makeup or concealer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>Bring names/photos of current skincare creams and oral medicines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                <span>Carry recent blood test reports (Thyroid, CBC, Vitamin D/B12 if available)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
