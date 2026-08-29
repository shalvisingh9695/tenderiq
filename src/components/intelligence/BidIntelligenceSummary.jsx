import React from 'react';
import {
  FileText,
  Building2,
  DollarSign,
  Calendar,
  CreditCard,
  Lock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const BidIntelligenceSummary = ({
  activeDoc,
  analysisData,
  riskReport,
  decisionReport,
  onNavigateTab
}) => {
  if (!activeDoc) return null;

  // Extract core metadata fields safely with clean fallbacks
  const title =
    extractText(analysisData?.basicInformation?.title) ||
    activeDoc?.originalName ||
    activeDoc?.name ||
    'Tender Document';

  const organization =
    extractText(analysisData?.basicInformation?.organization) ||
    extractText(analysisData?.basicInformation?.issuingAuthority) ||
    extractText(analysisData?.basicInformation?.procuringAuthority) ||
    'Not Specified';

  const tenderValue =
    extractText(analysisData?.basicInformation?.estimatedValueFormatted) ||
    extractText(analysisData?.basicInformation?.estimatedValue) ||
    'Unstated / TBD';

  const deadline =
    extractText(analysisData?.importantDates?.submissionDeadline) ||
    extractText(analysisData?.basicInformation?.submissionDeadline) ||
    (Array.isArray(analysisData?.importantDates) && analysisData.importantDates.length > 0 
      ? extractText(analysisData.importantDates[0]?.originalText || analysisData.importantDates[0]?.dateString) 
      : 'See Schedule');

  const tenderFee =
    extractText(analysisData?.financialRequirements?.tenderFee) ||
    'Exempted / Nil';

  const emdAmount =
    extractText(analysisData?.financialRequirements?.emd) ||
    'Not Required';

  // Risk Level & Score
  const riskScore = riskReport?.overallScore !== undefined ? Math.round(riskReport.overallScore) : null;
  
  const getRiskLevelBadge = (score) => {
    if (score === null) {
      return {
        label: 'PENDING',
        bg: 'bg-slate-100 text-slate-700 border-slate-200'
      };
    }
    if (score <= 25) {
      return {
        label: 'LOW',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      };
    }
    if (score <= 50) {
      return {
        label: 'MEDIUM',
        bg: 'bg-amber-100 text-amber-900 border-amber-300'
      };
    }
    if (score <= 75) {
      return {
        label: 'HIGH',
        bg: 'bg-orange-100 text-orange-950 border-orange-300'
      };
    }
    return {
      label: 'CRITICAL',
      bg: 'bg-red-100 text-red-950 border-red-300'
    };
  };

  const riskBadge = getRiskLevelBadge(riskScore);

  // Recommendation Badge (GO / REVIEW / NO-GO)
  const rawRec = extractText(decisionReport?.recommendation) || 'Consider';
  const getDecisionBadge = (rec) => {
    const r = (rec || '').toLowerCase();
    if (r === 'apply' || r === 'go') {
      return {
        label: 'GO',
        badgeClass: 'bg-emerald-500 text-white shadow-xs',
        icon: CheckCircle2,
        subtext: 'High Qualification Match'
      };
    }
    if (r === 'avoid' || r === 'no-go' || r === 'nogo') {
      return {
        label: 'NO-GO',
        badgeClass: 'bg-rose-600 text-white shadow-xs',
        icon: XCircle,
        subtext: 'High Risk / Disqualification Exposure'
      };
    }
    return {
      label: 'REVIEW',
      badgeClass: 'bg-amber-500 text-white shadow-xs',
      icon: AlertTriangle,
      subtext: 'Conditional / Verification Required'
    };
  };

  const decisionBadge = getDecisionBadge(rawRec);
  const DecIcon = decisionBadge.icon;

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl border border-orange-200/90 bg-gradient-to-br from-white via-orange-50/20 to-white shadow-sm space-y-5">
      
      {/* Top Title & Status Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-orange-100 text-orange-800 uppercase tracking-wider shrink-0">
              Executive Brief
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ID: {activeDoc.id}
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-slate-900 text-lg sm:text-xl truncate" title={title}>
            {title}
          </h2>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium truncate">
            <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{organization}</span>
          </p>
        </div>

        {/* Quick Recommendation & Risk Badges */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          
          {/* Decision Badge */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                Bid Decision
              </span>
              <span className="text-[11px] font-semibold text-slate-600">
                {decisionBadge.subtext}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-1 ${decisionBadge.badgeClass}`}>
              <DecIcon className="w-3.5 h-3.5" />
              {decisionBadge.label}
            </span>
          </div>

          {/* Risk Level Badge */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                Overall Risk
              </span>
              <span className="text-[11px] font-extrabold text-slate-800">
                {riskScore !== null ? `${riskScore}/100` : 'Not Evaluated'}
              </span>
            </div>
            <span className={`px-2.5 py-1 rounded-lg font-extrabold text-xs uppercase tracking-wider border ${riskBadge.bg}`}>
              {riskBadge.label}
            </span>
          </div>

        </div>
      </div>

      {/* Grid of Key Financial & Operational Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Estimated Tender Value */}
        <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            Tender Value
          </span>
          <p className="font-heading font-extrabold text-slate-900 text-sm sm:text-base truncate text-emerald-950">
            {tenderValue}
          </p>
        </div>

        {/* Submission Deadline */}
        <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-600" />
            Submission Deadline
          </span>
          <p className="font-heading font-bold text-slate-900 text-xs sm:text-sm truncate text-amber-950">
            {deadline}
          </p>
        </div>

        {/* Tender Fee */}
        <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-blue-600" />
            Tender Document Fee
          </span>
          <p className="font-heading font-bold text-slate-800 text-xs sm:text-sm truncate">
            {tenderFee}
          </p>
        </div>

        {/* EMD / Deposit */}
        <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-600" />
            EMD / Security Deposit
          </span>
          <p className="font-heading font-bold text-slate-800 text-xs sm:text-sm truncate">
            {emdAmount}
          </p>
        </div>

      </div>

      {/* Navigation Quick Actions */}
      {onNavigateTab && (
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 text-slate-500 font-medium flex-wrap gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Clause-level RAG indexing complete</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('risk')}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>View Risk Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigateTab('decision')}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>View Decision Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

