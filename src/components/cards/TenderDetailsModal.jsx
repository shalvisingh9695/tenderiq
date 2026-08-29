import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  DollarSign, 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  Download, 
  Plus, 
  Check, 
  Sparkles, 
  ExternalLink,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getSafeRiskScore, getSafeRiskLabel, extractText } from '../../utils/textHelper';

export const TenderDetailsModal = ({
  tender,
  isOpen,
  onClose,
  onAddToBids,
  isSavedInBids = false,
  onOpenChat
}) => {
  if (!isOpen || !tender) return null;

  const formatDeadline = (isoString) => {
    if (!isoString) return 'Active Notice';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8">
        
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-orange-200/80 overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header Gradient Top Strip */}
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 text-white flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-xs text-white border border-white/30">
                  {tender.sector || 'Tender Dossier'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-orange-700 shadow-2xs">
                  {tender.recommendation === 'GO' ? 'Recommended Bid (GO)' : 'Review Required'}
                </span>
                {tender.nitNumber && (
                  <span className="text-xs font-mono bg-black/20 px-2.5 py-1 rounded-md text-white/90">
                    NIT: {tender.nitNumber}
                  </span>
                )}
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl leading-tight">
                {tender.title}
              </h2>
              <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span>{tender.authority}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body Content (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Top Metric Grid: Value, EMD, Deadline, Risk */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Budget / Estimated Value */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1">
                <span className="text-[11px] uppercase font-black tracking-wider text-slate-400">
                  Contract Value
                </span>
                <p className="font-heading text-lg sm:text-xl font-black text-slate-900">
                  {tender.valueFormatted || '₹0.0 Cr'}
                </p>
                <p className="text-[11px] text-orange-600 font-semibold">Estimated Budget</p>
              </div>

              {/* EMD Deposit */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] uppercase font-black tracking-wider text-slate-400">
                  EMD Required
                </span>
                <p className="font-heading text-lg sm:text-xl font-black text-slate-900">
                  {tender.emdFormatted || 'Exempted'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Bid Security</p>
              </div>

              {/* Submission Deadline */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  <span>Bid Deadline</span>
                </span>
                <p className="font-heading text-sm sm:text-base font-bold text-slate-900">
                  {tender.daysRemaining !== undefined ? `${tender.daysRemaining} days left` : 'Active'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {formatDeadline(tender.deadline)}
                </p>
              </div>

              {/* Risk & Eligibility Score */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-1">
                <span className="text-[11px] uppercase font-black tracking-wider text-slate-400">
                  Risk &amp; Match
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg font-black text-slate-900">
                    {getSafeRiskScore(tender, 30)}/100
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {extractText(tender.eligibilityScore, '92')}% Match
                  </span>
                </div>
                <p className="text-[11px] text-amber-700 font-semibold">{getSafeRiskLabel(tender)}</p>
              </div>

            </div>

            {/* Scope of Work Summary */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Executive Scope of Work Summary</span>
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {tender.summary || 'Detailed RFP requirements and scope of work extracted through AI parser.'}
              </p>
              {tender.turnoverReq && (
                <div className="pt-2 text-xs text-slate-600 font-medium">
                  <strong>Mandatory Annual Turnover:</strong> {tender.turnoverReq}
                </div>
              )}
            </div>

            {/* Two-Column Breakdown: Red Flags vs Positive Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Critical Legal Red Flags */}
              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-red-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Identified Red Flags &amp; Risk Penalties</span>
                </h4>
                <ul className="space-y-2 text-xs text-red-950 font-medium">
                  {tender.redFlags && tender.redFlags.length > 0 ? (
                    tender.redFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">No critical red flags detected.</li>
                  )}
                </ul>
              </div>

              {/* Favorable Contractor Terms */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Contractor Favorable Terms</span>
                </h4>
                <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                  {tender.positiveSignals && tender.positiveSignals.length > 0 ? (
                    tender.positiveSignals.map((signal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{signal}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 italic">Standard government contracting terms apply.</li>
                  )}
                </ul>
              </div>

            </div>

            {/* Extracted Key Contract Clauses */}
            {tender.keyClauses && tender.keyClauses.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-orange-600" />
                  <span>Key Extracted Legal &amp; Commercial Clauses</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tender.keyClauses.map((clause, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{clause}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Actions */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2">
              {onAddToBids && (
                <button
                  onClick={() => onAddToBids(tender)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSavedInBids
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-300 text-slate-700 hover:border-orange-400 hover:text-orange-600'
                  }`}
                >
                  {isSavedInBids ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isSavedInBids ? 'Tracked in Active Bids' : 'Add to Active Bids'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  const chatEl = document.getElementById('tender-chat-section');
                  if (chatEl) chatEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-700 hover:border-orange-400 hover:text-orange-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-orange-600" />
                <span>Ask AI Lawyer</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onClose();
                  const riskEl = document.getElementById('risk-analysis-section');
                  if (riskEl) riskEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-orange-pill py-2 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
              >
                <span>Full Risk Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
