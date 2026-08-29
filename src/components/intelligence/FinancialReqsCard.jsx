import React from 'react';
import { DollarSign, ShieldCheck, CreditCard, Landmark, FileText, ExternalLink } from 'lucide-react';
import { extractText, extractTextList } from '../../utils/textHelper';

export const FinancialReqsCard = ({ financialRequirements = {}, onOpenSource }) => {
  const {
    emd,
    tenderFee,
    performanceSecurity,
    securityDeposit,
    bankGuarantee,
    paymentTerms,
    otherThresholds = []
  } = financialRequirements;

  const renderFinancialMetric = (label, obj, icon) => {
    if (!obj) return null;
    const val = extractText(obj);
    if (!val) return null;

    const section = typeof obj === 'object' ? obj.section : null;
    const page = typeof obj === 'object' ? obj.page : null;

    return (
      <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-100/90 space-y-2 flex flex-col justify-between">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-orange-900/70 flex items-center gap-1.5">
            {icon}
            {label}
          </span>
          <p className="font-heading font-extrabold text-slate-900 text-base sm:text-lg">
            {val}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-orange-200/40 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
            {section && <span className="font-medium text-slate-700">{extractText(section)}</span>}
            {page && <span>Pg {extractText(page)}</span>}
          </div>

          {onOpenSource && (typeof obj === 'object') && (
            <button
              onClick={() => onOpenSource(obj)}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline shrink-0"
            >
              <ExternalLink className="w-3 h-3" />
              View Source
            </button>
          )}
        </div>
      </div>
    );
  };

  const paymentTermsText = extractText(paymentTerms);
  const thresholdsList = extractTextList(otherThresholds);

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              Financial Requirements & Security Deposits
            </h3>
            <p className="text-xs text-slate-500">
              EMD, Tender Fees, Performance Guarantees, and Payment Schedule
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Key Deposits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderFinancialMetric('Earnest Money Deposit (EMD)', emd, <DollarSign className="w-4 h-4 text-orange-600" />)}
        {renderFinancialMetric('Tender Document Fee', tenderFee, <CreditCard className="w-4 h-4 text-orange-600" />)}
        {renderFinancialMetric('Performance Security', performanceSecurity, <ShieldCheck className="w-4 h-4 text-orange-600" />)}
        {renderFinancialMetric('Security Deposit', securityDeposit, <Landmark className="w-4 h-4 text-orange-600" />)}
        {renderFinancialMetric('Bank Guarantee Conditions', bankGuarantee, <Landmark className="w-4 h-4 text-orange-600" />)}
      </div>

      {/* Payment Terms & Financial Thresholds */}
      {paymentTermsText && (
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Extracted Payment Terms & Milestones
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {paymentTermsText}
          </p>
        </div>
      )}

      {thresholdsList.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Other Financial Thresholds & Penalties
          </span>
          <div className="flex flex-wrap gap-2">
            {thresholdsList.map((threshold, idx) => (
              <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-medium">
                {threshold}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

