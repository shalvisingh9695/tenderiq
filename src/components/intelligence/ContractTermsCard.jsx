import React from 'react';
import { Scale, AlertTriangle, ShieldX, Clock, FileText, Lock, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const ContractTermsCard = ({ commercialTerms = {}, onOpenSource }) => {
  const {
    contractDuration,
    renewalConditions,
    paymentSchedule,
    warrantyRequirements,
    maintenanceRequirements,
    deliverySchedule,
    liquidatedDamages,
    penalties,
    terminationConditions,
    blacklistingConditions,
    disputeResolution,
    arbitration,
    forceMajeure,
    otherObligations = []
  } = commercialTerms;

  const ldVal = extractText(liquidatedDamages);
  const penVal = extractText(penalties);
  const durVal = extractText(contractDuration);
  const warVal = extractText(warrantyRequirements);
  const termVal = extractText(terminationConditions);
  const blVal = extractText(blacklistingConditions);
  const arbVal = extractText(arbitration) || extractText(disputeResolution);
  const fmVal = extractText(forceMajeure);

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              Commercial & Contractual Terms Overview
            </h3>
            <p className="text-xs text-slate-500">
              Duration, penalties, liquidated damages, warranties, and legal liability clauses
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Penalties & Liquidated Damages (High Importance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Liquidated Damages */}
        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Liquidated Damages Clause
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mt-1">
              {ldVal || 'Standard municipal delay damages clause applies.'}
            </p>
          </div>
          {onOpenSource && typeof liquidatedDamages === 'object' && (
            <button
              onClick={() => onOpenSource(liquidatedDamages)}
              className="text-red-700 hover:text-red-800 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end pt-2"
            >
              <ExternalLink className="w-3 h-3" />
              View Source
            </button>
          )}
        </div>

        {/* Penalties */}
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-1.5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldX className="w-4 h-4 text-amber-600" />
              Performance Penalties & SLA Breaches
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mt-1">
              {penVal || 'Penalties tied to SLA response failures.'}
            </p>
          </div>
          {onOpenSource && typeof penalties === 'object' && (
            <button
              onClick={() => onOpenSource(penalties)}
              className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end pt-2"
            >
              <ExternalLink className="w-3 h-3" />
              View Source
            </button>
          )}
        </div>

      </div>

      {/* General Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              Contract Duration & Extensions
            </span>
            <p className="font-semibold text-slate-900 mt-1">{durVal || 'Unspecified'}</p>
          </div>
          {onOpenSource && typeof contractDuration === 'object' && (
            <button onClick={() => onOpenSource(contractDuration)} className="text-orange-600 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end">
              <ExternalLink className="w-3 h-3" /> View Source
            </button>
          )}
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-orange-500" />
              Warranty & Maintenance
            </span>
            <p className="font-semibold text-slate-900 mt-1">{warVal || 'Standard warranty'}</p>
          </div>
          {onOpenSource && typeof warrantyRequirements === 'object' && (
            <button onClick={() => onOpenSource(warrantyRequirements)} className="text-orange-600 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end">
              <ExternalLink className="w-3 h-3" /> View Source
            </button>
          )}
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-orange-500" />
              Termination Conditions
            </span>
            <p className="font-semibold text-slate-900 mt-1">{termVal || 'Standard 30-day notice'}</p>
          </div>
          {onOpenSource && typeof terminationConditions === 'object' && (
            <button onClick={() => onOpenSource(terminationConditions)} className="text-orange-600 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end">
              <ExternalLink className="w-3 h-3" /> View Source
            </button>
          )}
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldX className="w-3.5 h-3.5 text-orange-500" />
              Debarment / Blacklisting Rules
            </span>
            <p className="font-semibold text-slate-900 mt-1">{blVal || 'Debarment for misrepresentation'}</p>
          </div>
          {onOpenSource && typeof blacklistingConditions === 'object' && (
            <button onClick={() => onOpenSource(blacklistingConditions)} className="text-orange-600 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end">
              <ExternalLink className="w-3 h-3" /> View Source
            </button>
          )}
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-orange-500" />
              Dispute Resolution & Arbitration
            </span>
            <p className="font-semibold text-slate-900 mt-1">{arbVal || 'Governing Law Jurisdiction'}</p>
          </div>
          {onOpenSource && (typeof arbitration === 'object' || typeof disputeResolution === 'object') && (
            <button onClick={() => onOpenSource(arbitration || disputeResolution)} className="text-orange-600 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end">
              <ExternalLink className="w-3 h-3" /> View Source
            </button>
          )}
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              Force Majeure
            </span>
            <p className="font-semibold text-slate-900 mt-1">{fmVal || 'Standard Force Majeure clause'}</p>
          </div>
          {onOpenSource && typeof forceMajeure === 'object' && (
            <button onClick={() => onOpenSource(forceMajeure)} className="text-orange-600 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end">
              <ExternalLink className="w-3 h-3" /> View Source
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

