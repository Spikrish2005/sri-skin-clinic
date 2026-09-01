import React, { useState, useEffect } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Calendar,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  MessageCircle,
  Lock,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { getClinicOpenStatus } from '../utils/dateUtils';

interface HeaderProps {
  onOpenBooking: (serviceId?: string, providerId?: string) => void;
  onOpenLookup: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, onOpenLookup, onOpenAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clinicStatus, setClinicStatus] = useState(getClinicOpenStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setClinicStatus(getClinicOpenStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { label: 'Treatments', href: '#services' },
    { label: 'Clinic & Hours', href: '#location' },
    { label: 'Charges & Insurance', href: '#insurance' },
    { label: 'Patient Guide', href: '#patient-info' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="clinic-header" className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-all">
      {/* Top Announcement Bar (Compact) */}
      <div className="max-w-7xl mx-auto mb-2 flex items-center justify-between text-xs px-2 text-slate-500">
        <div className="flex items-center gap-3">
          <a
            href={CLINIC_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-600 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate max-w-sm">Sathy Main Rd, Saravanampatti, Coimbatore</span>
          </a>

          <div className="inline-flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                clinicStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-medium text-slate-700">{clinicStatus.statusText}</span>
            <span className="hidden md:inline text-slate-400">({clinicStatus.nextOpenText})</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${CLINIC_INFO.phoneClean}`}
            className="inline-flex items-center gap-1.5 text-slate-800 hover:text-teal-600 font-bold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>+91 {CLINIC_INFO.phone}</span>
          </a>

          <button
            onClick={onOpenLookup}
            id="lookup-header-btn"
            type="button"
            className="hidden sm:inline-flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>Look Up Booking</span>
          </button>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              id="doctor-portal-header-btn"
              type="button"
              className="p-1 rounded-md text-slate-400 hover:text-teal-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Doctor / Staff Portal (PIN Protected)"
              aria-label="Doctor & Staff Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Bento Floating Header Card */}
      <div className="max-w-7xl mx-auto bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-hidden"
          id="brand-logo-link"
        >
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-teal-200 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight group-hover:text-teal-600 transition-colors">
              Sri Skin Clinic
            </h1>
            <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest block">
              Dermatology &amp; Cosmetology • Coimbatore
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="hover:text-teal-600 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20would%20like%20to%20inquire%20about%20a%20skin%20consultation%20at%20Sri%20Skin%20Clinic`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => onOpenBooking()}
            id="header-primary-book-btn"
            type="button"
            className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-teal-400" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => onOpenBooking()}
            className="sm:hidden bg-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-xl"
          >
            Book
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle"
            type="button"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="max-w-7xl mx-auto mt-2 lg:hidden bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xl animate-fadeIn">
          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <span className={`w-2 h-2 rounded-full ${clinicStatus.isOpen ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{clinicStatus.statusText} • {clinicStatus.nextOpenText}</span>
            </div>
            <p className="text-slate-600 text-[11px]">{CLINIC_INFO.address.fullAddress}</p>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-600"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow-xs"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Schedule Skin Consultation</span>
            </button>

            <a
              href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hello%20Dr.%20V.%20Kavitha,%20I%20would%20like%20to%20inquire%20about%20a%20skin%20consultation`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>WhatsApp: 9585526107</span>
            </a>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 px-4 rounded-xl text-sm"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Look Up Existing Booking</span>
            </button>

            <a
              href={`tel:${CLINIC_INFO.phoneClean}`}
              className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>Call Clinic: {CLINIC_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
