import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  HeartPulse,
  Scissors,
  Baby,
  Video,
  CheckCircle2,
  Calendar,
  Search,
  ArrowRight,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';
import { MEDICAL_SERVICES } from '../data/clinicData';
import { MedicalService } from '../types';

interface ServicesSectionProps {
  onBookService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  const getIcon = (name: string) => {
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

  const filteredServices = MEDICAL_SERVICES.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesTitle = srv.title.toLowerCase().includes(query);
    const matchesDesc = srv.shortDesc.toLowerCase().includes(query);
    const matchesConditions = srv.conditionsTreated.some((c) => c.toLowerCase().includes(query));
    const matchesTreatments = srv.treatments.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && (matchesTitle || matchesDesc || matchesConditions || matchesTreatments);
  });

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'clinical-dermatology', label: 'Clinical Dermatology' },
    { id: 'cosmetology', label: 'Cosmetology & Peels' },
    { id: 'laser-treatments', label: 'Laser & Scar Revision' },
    { id: 'hair-trichology', label: 'Hair & PRP Therapy' },
    { id: 'pediatric-skin', label: 'Pediatric Skin' },
    { id: 'tele-derm', label: 'Online Consultation' },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header Bento Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-2 block">
              Dermatology &amp; Cosmetology Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Clinical Skin, Hair &amp; Aesthetic Treatments
            </h2>
            <p className="mt-2 text-slate-500 text-sm sm:text-base leading-relaxed">
              From chronic skin allergies and active acne management to US-FDA approved laser therapies, chemical peels, and autologous PRP hair restoration.
            </p>
          </div>

          {/* Search condition/symptom */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search acne, scars, hair, peels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-100 mt-6 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 shadow-sm">
          <p className="text-sm font-semibold">No treatments found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs text-teal-600 font-bold underline cursor-pointer"
          >
            Reset search and view all treatments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service, idx) => {
            const IconComponent = getIcon(service.iconName);
            const isExpanded = expandedServiceId === service.id;
            const isHighlighted = idx === 0 && selectedCategory === 'all';

            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  isHighlighted ? 'ring-2 ring-teal-600/30' : ''
                }`}
              >
                {/* Top Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3 text-teal-600" />
                      <span>{service.durationMinutes} mins</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Common Conditions Treated */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Conditions Treated:
                    </span>
                    <ul className="space-y-1.5">
                      {service.conditionsTreated.slice(0, isExpanded ? 10 : 3).map((condition, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expanded Treatment details */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-fadeIn">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Clinical Procedures &amp; Modalities:
                        </span>
                        <ul className="space-y-1">
                          {service.treatments.map((treatment, tIdx) => (
                            <li key={tIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold">•</span>
                              <span>{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                        <strong className="text-slate-800 block mb-0.5">Recommended For:</strong>
                        {service.recommendedFor}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom CTA Actions */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedServiceId(isExpanded ? null : service.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer px-2 py-1 rounded-lg"
                  >
                    {isExpanded ? (
                      <>
                        <Minus className="w-3.5 h-3.5" />
                        <span>Less</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-teal-600" />
                        <span>Details ({service.conditionsTreated.length})</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookService(service.id)}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>Book Consult</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
