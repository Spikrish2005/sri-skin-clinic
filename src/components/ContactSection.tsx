import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Skin Consultation');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Bento Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2 block">
              Patient Support &amp; Enquiries
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact Sri Skin Clinic
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
            Reach out to Dr. V. Kavitha regarding skin, hair, laser consultations, or procedural inquiries in Saravanampatti, Coimbatore.
          </p>
        </div>
      </div>

      {/* Emergency Notice Pill */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Urgent Dermatological / Allergy Notice:</strong>
          <span>
            For acute severe drug allergic reactions (anaphylaxis/angioedema) or acute burns, please visit the nearest hospital emergency department or call ambulance <strong>108</strong> immediately.
          </span>
        </div>
      </div>

      {/* 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Direct Clinic Contact Details (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Direct Contact Channels</h3>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Phone & WhatsApp */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">Phone Call</span>
                <a
                  href={`tel:${CLINIC_INFO.phoneClean}`}
                  className="font-bold text-slate-900 hover:text-teal-700 text-sm transition-colors"
                >
                  +91 {CLINIC_INFO.phone}
                </a>
                <span className="block text-[11px] text-slate-400 mt-0.5">Appointment &amp; Desk Inquiries</span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">WhatsApp Chat</span>
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20have%20an%20inquiry%20regarding%20Sri%20Skin%20Clinic`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:underline text-sm transition-colors"
                >
                  +91 {CLINIC_INFO.phone}
                </a>
                <span className="block text-[11px] text-slate-400 mt-0.5">Instant WhatsApp message</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-teal-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">Clinic Address</span>
                <span className="font-bold text-slate-900 block">{CLINIC_INFO.address.street}</span>
                <span className="text-slate-500 block">{CLINIC_INFO.address.landmark}</span>
                <span className="text-slate-500 block">{CLINIC_INFO.address.area}, {CLINIC_INFO.address.city} - {CLINIC_INFO.address.pincode}</span>
                <a
                  href={CLINIC_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-700 hover:underline text-xs font-semibold mt-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-teal-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">Clinic Email</span>
                <span className="font-semibold text-slate-800">{CLINIC_INFO.email}</span>
              </div>
            </div>

            {/* Hours summary */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-teal-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 uppercase font-semibold">Consultation Hours</span>
                <span className="font-semibold text-slate-800 block">Mon - Sat: 10:00 AM - 1:30 PM &amp; 5:00 PM - 8:30 PM</span>
                <span className="font-semibold text-slate-800 block">Sun: 10:30 AM - 1:30 PM (Prior Appt)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Message & Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Send a Consultation Request or Question
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Dr. V. Kavitha&apos;s team will review your query and respond via call or WhatsApp.
          </p>

          {isSubmitted ? (
            <div className="p-8 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
              <h4 className="text-base font-bold text-teal-900">Enquiry Received!</h4>
              <p className="text-xs text-teal-800 max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. Sri Skin Clinic will get back to you at <strong>{phone || email}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setPhone('');
                  setEmail('');
                  setMessage('');
                }}
                className="mt-3 text-xs text-teal-700 font-bold underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar / Priya S."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Treatment Concern
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Skin Consultation">Skin Problem (Acne/Eczema/Allergy)</option>
                    <option value="Hair & PRP Treatment">Hair Loss &amp; PRP Treatment</option>
                    <option value="Chemical Peels & Glow">Chemical Peels &amp; Pigmentation</option>
                    <option value="Laser Scar Subcision">Laser Scar Reduction</option>
                    <option value="Wart/Mole Removal">Wart / Mole / Skin Tag Removal</option>
                    <option value="Online Video Consult">Online Video Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Describe Your Skin / Hair Concern *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe duration of symptoms, affected body areas, or previous treatments..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3.5 px-5 rounded-2xl shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Consultation Enquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
