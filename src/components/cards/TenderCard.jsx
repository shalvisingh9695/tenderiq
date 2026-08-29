import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Plus, 
  Check, 
  ExternalLink,
  Scale,
  Sparkles,
  Layers,
  Flame
} from 'lucide-react';
import { getSafeRiskScore, extractText } from '../../utils/textHelper';

export const TenderCard = ({
  tender,
  onViewDetails,
  onAddToBids,
  isSavedInBids = false,
  onOpenChat
}) => {
  if (!tender) return null;

  // Format date helper
  const formatDeadline = (isoString) => {
    if (!isoString) return 'Pending Notice';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  // Determine Risk Badge styling
  const getRiskBadge = (level, score) => {
    const s = getSafeRiskScore(score !== undefined ? score : tender, 30);
    if (level === 'low' || s <= 30) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Low Risk ({s}/100)</span>
        </span>
      );
    }
    if (level === 'medium' || s <= 50) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Medium Risk ({s}/100)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-200/80 shadow-2xs">
        <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
        <span>High Risk ({s}/100)</span>
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, scale: 1.025 }}
      transition={{ 
        duration: 0.38, 
        ease: [0.22, 1, 0.36, 1],
        scale: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
      }}
      className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-orange-400/60 via-amber-300/40 to-orange-500/15 hover:from-orange-500 hover:via-amber-400 hover:to-orange-500 transition-colors duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_22px_45px_-10px_rgba(249,115,22,0.25)] group flex flex-col h-full cursor-default"
    >
      {/* Inner Card Container */}
      <div className="bg-white rounded-[22.5px] p-5 sm:p-6 flex flex-col justify-between h-full space-y-5">
        
        {/* TOP SECTION: Icon on Top + NIT Pill + Recommendation Tag */}
        <div className="space-y-4">
          
          {/* Top Bar with Icon on top & Badges */}
          <div className="flex items-start justify-between gap-3">
            
            {/* Prominent Icon on Top with Gradient Background */}
            <motion.div 
              whileHover={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.4 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:shadow-orange-500/40 transition-all duration-300 flex-shrink-0"
            >
              <FileText className="w-6 h-6 stroke-[2.2]" />
            </motion.div>

            {/* Right Meta Pill / Sector */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-lg">
                {tender.sector || 'Tender RFP'}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                tender.recommendation === 'GO'
                  ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-300/80'
                  : 'bg-amber-100/80 text-amber-800 border border-amber-300/80'
              }`}>
                {tender.recommendation || 'GO'} BID
              </span>
            </div>

          </div>

          {/* Title & Authority */}
          <div className="space-y-1.5">
            <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
              {tender.title}
            </h3>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{tender.authority}</span>
            </div>

            {tender.nitNumber && (
              <p className="text-[11px] font-mono text-slate-400 font-semibold tracking-tight">
                NIT: {tender.nitNumber}
              </p>
            )}
          </div>

          {/* FINANCIAL & DEADLINE STRIP (Budget & Deadline) */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70">
            
            {/* Budget / Estimated Value */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1">
                <span>Budget / Value</span>
              </span>
              <p className="font-heading text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {tender.valueFormatted || '₹0.0 Cr'}
              </p>
              {tender.emdFormatted && (
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  EMD: {tender.emdFormatted}
                </p>
              )}
            </div>

            {/* Deadline & Remaining Days */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-500" />
                <span>Deadline</span>
              </span>
              <p className="font-heading text-xs sm:text-sm font-bold text-slate-800">
                {formatDeadline(tender.deadline)}
              </p>
              <p className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{tender.daysRemaining !== undefined ? `${tender.daysRemaining} days left` : 'Active'}</span>
              </p>
            </div>

          </div>

          {/* RISK SCORE BADGE ROW */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Risk Score
            </span>
            {getRiskBadge(tender.riskLevel, tender.riskScore)}
          </div>

          {/* Key Clause Preview Snippet */}
          {tender.keyClauses && tender.keyClauses.length > 0 && (
            <div className="p-2.5 rounded-xl bg-orange-50/40 border border-orange-100 text-[11px] text-slate-700 flex items-start gap-2">
              <Scale className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1 font-medium">{tender.keyClauses[0]}</span>
            </div>
          )}

        </div>

        {/* BOTTOM ACTION BAR: View Details with Button Glow Effect & Track Bid */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
          
          {/* View Details Button with Glow Effect */}
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onViewDetails && onViewDetails(tender)}
            className="flex-1 btn-orange-pill btn-glow-effect py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/25 hover:shadow-orange-500/50"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

          {/* Quick Track / Save Button */}
          {onAddToBids && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onAddToBids(tender)}
              title={isSavedInBids ? 'Saved in Active Bids' : 'Add to Active Bids'}
              className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                isSavedInBids
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/30'
                  : 'bg-slate-50 text-slate-600 hover:text-orange-600 border-slate-200 hover:border-orange-300'
              }`}
            >
              {isSavedInBids ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </motion.button>
          )}

        </div>

      </div>
    </motion.div>
  );
};
