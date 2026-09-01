import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { DoctorsSection } from './components/DoctorsSection';
import { InsuranceSection } from './components/InsuranceSection';
import { PatientResourcesSection } from './components/PatientResourcesSection';
import { LocationHoursSection } from './components/LocationHoursSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AppointmentLookupModal } from './components/AppointmentLookupModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Appointment } from './types';
import { Calendar, Phone, CheckCircle2, X, MessageCircle } from 'lucide-react';
import { CLINIC_INFO } from './data/clinicData';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedProviderId, setSelectedProviderId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global secret shortcut for Doctor & Admin staff (Alt + D or Ctrl + Shift + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'd') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenBooking = (
    serviceId?: string,
    providerId?: string,
    date?: string,
    time?: string,
    step?: 1 | 2 | 3 | 4 | 5
  ) => {
    setSelectedServiceId(serviceId);
    setSelectedProviderId(providerId);
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingStep(step);
    setIsBookingOpen(true);
  };

  const handleSuccessBooking = (appt: Appointment) => {
    setToastMessage(`Appointment ${appt.id} confirmed for ${appt.patientName} on ${appt.date} at ${appt.time}!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-600 selection:text-white font-sans text-slate-800">
      {/* Toast Notification for booking events */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-teal-500 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-teal-400 block">
                Booking Successful
              </span>
              <p className="text-xs text-slate-200 mt-0.5">{toastMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Clinic Header */}
      <Header
        onOpenBooking={handleOpenBooking}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16 sm:pb-0">
        <Hero
          onOpenBooking={handleOpenBooking}
          onOpenLookup={() => setIsLookupOpen(true)}
        />

        <ServicesSection
          onBookService={(serviceId) => handleOpenBooking(serviceId)}
        />

        <DoctorsSection
          onBookWithDoctor={(providerId) => handleOpenBooking(undefined, providerId)}
        />

        <LocationHoursSection
          onOpenBooking={() => handleOpenBooking()}
        />

        <InsuranceSection
          onOpenBooking={() => handleOpenBooking()}
        />

        <PatientResourcesSection
          onOpenBooking={() => handleOpenBooking()}
        />

        <ContactSection />
      </main>

      {/* Clinic Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Floating Quick Contact / Book Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center gap-2 shadow-lg">
        <a
          href={`tel:${CLINIC_INFO.phoneClean}`}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-lg text-xs border border-slate-300"
        >
          <Phone className="w-4 h-4 text-teal-600" />
          <span>Call 9585526107</span>
        </a>
        <button
          onClick={() => handleOpenBooking()}
          className="flex-1 flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-3 rounded-lg text-xs shadow-xs"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Consult</span>
        </button>
      </div>

      {/* Interactive Booking Wizard Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceId={selectedServiceId}
        initialProviderId={selectedProviderId}
        initialDate={selectedDate}
        initialTime={selectedTime}
        initialStep={bookingStep}
        onSuccessBooking={handleSuccessBooking}
      />

      {/* Interactive Look Up / Manage Booking Modal */}
      <AppointmentLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      {/* Doctor & Receptionist Live Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
