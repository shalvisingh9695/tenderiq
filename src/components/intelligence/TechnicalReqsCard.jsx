import React from 'react';
import { Cpu, CheckCircle2, Users, Wrench, ShieldAlert, Layers, ExternalLink } from 'lucide-react';
<<<<<<< HEAD
import { extractText, extractTextList } from '../../utils/textHelper';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

export const TechnicalReqsCard = ({ technicalRequirements = {}, onOpenSource }) => {
  const {
    scopeOfWork,
    technicalSpecifications = [],
    minimumManpower,
    equipmentRequirements = [],
    infrastructureRequirements,
    technologyRequirements = [],
    serviceLevelRequirements = [],
    deliveryRequirements,
    qualityStandards = []
  } = technicalRequirements;

<<<<<<< HEAD
  const scopeVal = extractText(scopeOfWork);
  const manpowerVal = extractText(minimumManpower);
  const deliveryVal = extractText(deliveryRequirements);
  const specsList = extractTextList(technicalSpecifications);
  const slaList = extractTextList(serviceLevelRequirements);
  const qualityList = extractTextList(qualityStandards);
=======
  const scopeVal = typeof scopeOfWork === 'object' ? scopeOfWork?.value : scopeOfWork;
  const manpowerVal = typeof minimumManpower === 'object' ? minimumManpower?.value : minimumManpower;
  const deliveryVal = typeof deliveryRequirements === 'object' ? deliveryRequirements?.value : deliveryRequirements;
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              Technical & Scope Specifications
            </h3>
            <p className="text-xs text-slate-500">
              Deliverables, manpower allocation, technology stack, and SLAs
            </p>
          </div>
        </div>
      </div>

      {/* Scope of Work Box */}
      {scopeVal && (
        <div className="bg-orange-50/30 p-4 rounded-xl border border-orange-100 space-y-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-orange-950 uppercase tracking-wider block">
              Scope of Work Overview
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mt-1">
              {scopeVal}
            </p>
          </div>
          {onOpenSource && typeof scopeOfWork === 'object' && (
            <button
              onClick={() => onOpenSource(scopeOfWork)}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline shrink-0 self-start sm:self-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Source
            </button>
          )}
        </div>
      )}

      {/* Grid of Key Technical Sub-sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Technical Specs & Technology Stack */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-orange-500" />
<<<<<<< HEAD
            Technical Specifications ({specsList.length})
          </label>
          {specsList.length > 0 ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              {specsList.map((spec, i) => (
=======
            Technical Specifications ({technicalSpecifications.length})
          </label>
          {technicalSpecifications.length > 0 ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              {technicalSpecifications.map((spec, i) => (
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No specific itemized technical specs extracted.</p>
          )}
        </div>

        {/* Service Level Agreements (SLAs) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
            Service Level Requirements (SLAs)
          </label>
<<<<<<< HEAD
          {slaList.length > 0 ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              {slaList.map((sla, i) => (
=======
          {serviceLevelRequirements.length > 0 ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              {serviceLevelRequirements.map((sla, i) => (
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                <div key={i} className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span>{sla}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Standard SLA conditions apply.</p>
          )}
        </div>

      </div>

      {/* Additional Attributes: Manpower, Infrastructure, Quality */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
        
        {/* Manpower */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Minimum Manpower
          </span>
          <p className="text-xs text-slate-800 font-medium">
<<<<<<< HEAD
            {manpowerVal || 'As per project execution plan'}
=======
            {minimumManpower || 'As per project execution plan'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </p>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-slate-400" />
            Delivery Schedule
          </span>
          <p className="text-xs text-slate-800 font-medium">
<<<<<<< HEAD
            {deliveryVal || 'Specified in contractual terms'}
=======
            {deliveryRequirements || 'Specified in contractual terms'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </p>
        </div>

        {/* Quality Standards */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            Quality Standards
          </span>
          <p className="text-xs text-slate-800 font-medium truncate">
<<<<<<< HEAD
            {qualityList.length > 0 ? qualityList.join(', ') : 'Standard ISO/Industry Norms'}
=======
            {qualityStandards.length > 0 ? qualityStandards.join(', ') : 'Standard ISO/Industry Norms'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
          </p>
        </div>

      </div>

    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
