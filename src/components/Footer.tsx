import React from 'react';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Search,
  Shield,
  Heart,
  MessageCircle,
  Lock,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenLookup, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-slate-900 text-slate-400 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-base font-bold text-white leading-tight">
                  Sri Skin Clinic
                </span>
                <span className="block text-[11px] text-teal-400 font-semibold uppercase tracking-wider">
                  Dr. V. Kavitha • Saravanampatti, Coimbatore
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Specialized dermatology, cosmetology, laser treatments, PRP hair restoration, and minor dermatosurgery led by <strong>Dr. V. Kavitha</strong>, M.B.B.S., M.D., D.V.L. (Skin) on Sathy Main Road, Coimbatore.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={onOpenLookup}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-xl text-xs transition-colors border border-slate-700 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Lookup Booking</span>
              </button>

              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20would%20like%20to%20consult%20at%20Sri%20Skin%20Clinic`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Skin &amp; Hair Treatments
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">Acne &amp; Pimple Care</a>
              </li>
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">PRP Hair Regrowth Therapy</a>
              </li>
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">Chemical Peels &amp; Glow</a>
              </li>
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">Laser Scar Resurfacing</a>
              </li>
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">Wart, Mole &amp; Tag Excision</a>
              </li>
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">Eczema &amp; Psoriasis Care</a>
              </li>
              <li>
                <a href="#services" className="hover:text-teal-400 transition-colors">Online Teledermatology</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Google Maps Direct Link */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Coimbatore Clinic &amp; Contact
            </span>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">295, 1st Floor, Sathy Main Road</p>
                  <p className="text-slate-400">Opposite Central Park Apartment, Amman Kovil</p>
                  <p className="text-slate-400">Saravanampatti, Coimbatore, Tamil Nadu 641035</p>
                  <a
                    href={CLINIC_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-400 hover:underline font-semibold mt-1"
                  >
                    <span>Google Maps Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phoneClean}`} className="hover:text-teal-400 font-semibold text-white">
                  +91 {CLINIC_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{CLINIC_INFO.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {currentYear} Sri Skin Clinic • Dr. V. Kavitha, M.B.B.S., M.D., D.V.L. (Skin). All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-slate-400">Ethical Dermatology</span>
            <span>•</span>
            <span className="hover:text-slate-400">Patient Confidentiality</span>
            <span>•</span>
            <span className="hover:text-slate-400">Sterile Protocols</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-teal-400 text-slate-400 flex items-center gap-1 transition-colors cursor-pointer font-medium"
                  title="Doctor & Receptionist Admin Login"
                >
                  <Lock className="w-3 h-3" />
                  <span>Staff Portal</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
