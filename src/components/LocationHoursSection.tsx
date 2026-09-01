import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Car,
  Building,
  Calendar,
  MessageCircle,
  Navigation,
} from 'lucide-react';
import { CLINIC_INFO, CLINIC_HOURS } from '../data/clinicData';
import { getClinicOpenStatus } from '../utils/dateUtils';

interface LocationHoursSectionProps {
  onOpenBooking: () => void;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({ onOpenBooking }) => {
  const [clinicStatus, setClinicStatus] = useState(getClinicOpenStatus());
  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const timer = setInterval(() => {
      setClinicStatus(getClinicOpenStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="location" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Bento Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2 block">
              Saravanampatti, Coimbatore
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Clinic Location &amp; Consultation Timings
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md leading-relaxed">
            Conveniently situated on Sathy Main Road, Chidambaram Nagar, opposite Central Park apartment near Amman Kovil, Saravanampatti.
          </p>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map & Facility Bento Module (Spans 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          {/* Visual Map Display */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-64 sm:h-72 bg-slate-950 flex flex-col items-center justify-center p-6 text-center group">
            {/* Map grid background pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(#14b8a6 1px, transparent 1px), radial-gradient(#14b8a6 1px, #020617 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Sathy Highway vector visual lines */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <div className="w-full h-1.5 bg-teal-400/60 absolute top-1/2 transform -rotate-6" />
              <div className="h-full w-1 bg-teal-400/40 absolute left-1/2 transform rotate-12" />
            </div>

            {/* Pin Marker */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/50 ring-4 ring-white/20">
                <MapPin className="w-6 h-6 fill-current" />
              </div>
              <span className="mt-2 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-teal-500 shadow-md">
                Sri Skin Clinic • 1st Floor
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <div className="text-left text-xs">
                <span className="font-bold text-white block">295, 1st Floor, Sathy Main Road</span>
                <span className="text-slate-400">Chidambaram Nagar, Saravanampatti, Coimbatore - 641035</span>
              </div>
              <a
                href={CLINIC_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Landmarks & Accessibility mini bento blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Building className="w-4 h-4 text-teal-600" />
                <span>Landmarks &amp; Location</span>
              </div>
              <p className="text-slate-500">
                Opposite Central Park Apartment &amp; Amman Kovil on Sathy Main Highway, Saravanampatti.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Car className="w-4 h-4 text-teal-600" />
                <span>Parking &amp; Facility</span>
              </div>
              <p className="text-slate-500">
                Easy two-wheeler &amp; four-wheeler parking with modern clinic reception and procedure rooms.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Hours Bento Card (Spans 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            {/* Live Status indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    clinicStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <div>
                  <span className="block text-sm font-bold text-slate-900">{clinicStatus.statusText}</span>
                  <span className="block text-xs text-slate-400">{clinicStatus.nextOpenText}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Hours Schedule Table */}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Dr. V. Kavitha Consultation Timings
              </span>
              <div className="space-y-1.5 text-xs">
                {CLINIC_HOURS.map((h) => {
                  const isToday = h.day === currentDayName;
                  return (
                    <div
                      key={h.day}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between py-2 px-3 rounded-xl transition-colors gap-1 ${
                        isToday
                          ? 'bg-teal-50 border border-teal-200 font-bold text-teal-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{h.day}</span>
                        {isToday && (
                          <span className="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-semibold uppercase">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="text-slate-800 font-mono text-[11px]">
                        {h.open} {h.close ? `& ${h.close}` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${CLINIC_INFO.phoneClean}`}
                className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-3 rounded-2xl text-xs transition-colors border border-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Call 9585526107</span>
              </a>

              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20want%20to%20visit%20Sri%20Skin%20Clinic`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-3 px-3 rounded-2xl text-xs transition-colors border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 px-4 rounded-2xl text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book In-Clinic Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
