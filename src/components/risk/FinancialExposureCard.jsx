import React from 'react';
import { DollarSign, Landmark, CreditCard, ShieldCheck, FileSpreadsheet, ExternalLink, AlertCircle } from 'lucide-react';

export const FinancialExposureCard = ({ financialExposure = {}, onOpenSource }) => {
  const {
    totalEstimatedCommitment,
    emd,
    tenderFee,
    performanceSecurity,
    securityDeposit,
    retentionAmount,
    exposureSummary
  } = financialExposure;

  const items = [
    { key: 'emd', label: 'Earnest Money Deposit (EMD)', icon: <Landmark className="w-4 h-4 text-orange-600" />, data: emd },
    { key: 'performanceSecurity', label: 'Performance Security BG', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, data: performanceSecurity },
    { key: 'tenderFee', label: 'Tender Document Fee', icon: <CreditCard className="w-4 h-4 text-blue-600" />, data: tenderFee },
    { key: 'securityDeposit', label: 'Security Deposit / Retention', icon: <FileSpreadsheet className="w-4 h-4 text-purple-600" />, data: securityDeposit || retentionAmount }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100/80">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-orange-100/80 text-orange-700">
            <DollarSign className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-heading font-extrabold text-slate-900 text-lg">
              Financial Exposure & Bank Commitments
            </h3>
            <p className="text-xs text-slate-500">
              Upfront capital locks, bank guarantees, and non-refundable fees
            </p>
          </div>
        </div>

        {totalEstimatedCommitment && (
          <div className="bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-200 shrink-0 self-start sm:self-auto">
            <span className="text-[10px] font-bold text-orange-900 uppercase tracking-wider block">
              Total Collateral Exposure
            </span>
            <span className="font-heading font-extrabold text-slate-900 text-sm">
              {totalEstimatedCommitment}
            </span>
          </div>
        )}
      </div>

      {/* Grid of Financial Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const info = item.data || {};
          const amount = info.amount || 'Unstated in document';
          const derivation = info.derivationType || 'Explicitly Stated';

          return (
            <div
              key={item.key}
              className="bg-white/90 p-4 rounded-xl border border-slate-200/80 hover:border-orange-200 shadow-2xs hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                </div>

                <div>
                  <p className="font-heading font-extrabold text-slate-900 text-lg">
                    {amount}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                    derivation === 'Explicitly Stated'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {derivation}
                  </span>
                </div>

                {info.paymentDeadline && (
                  <p className="text-xs text-slate-600 font-medium pt-1">
                    <span className="text-slate-400">Due:</span> {info.paymentDeadline}
                  </p>
                )}
              </div>

              {/* Source button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span className="truncate max-w-[120px]">{info.section || 'Tender Clause'}</span>

                {onOpenSource && info.sourceText && (
                  <button
                    onClick={() =>
                      onOpenSource({
                        value: `${item.label}: ${amount}`,
                        sourceText: info.sourceText,
                        section: info.section,
                        page: info.page,
                        confidence: info.confidence || 0.95,
                        requirementType: 'financial'
                      })
                    }
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Source
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Exposure Note */}
      {exposureSummary && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs text-slate-700 font-medium flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p><span className="font-bold text-slate-900">Capital Lockup Note:</span> {exposureSummary}</p>
        </div>
      )}

    </div>
  );
};
