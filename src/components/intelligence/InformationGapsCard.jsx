import React from 'react';
import { AlertTriangle, HelpCircle, FileSearch, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const InformationGapsCard = ({ informationGaps = [], missingFields = [], onOpenPdf }) => {
  // Combine extracted gaps, ambiguous clauses, or missing requirements
  const combinedGaps = [
    ...informationGaps.map((g) => ({
      title: g.title || g.clauseText || g.field || 'Ambiguous / Unverified Clause',
      description: g.description || g.ambiguityReason || g.reason || 'Verification required prior to bid submission.',
      severity: g.severity || 'warning',
      category: g.category || 'Uncertain Requirement',
      page: g.page || null,
      section: g.section || null,
      clauseText: g.clauseText || g.sourceText || null
    })),
    ...missingFields.map((f) => ({
      title: `${f} Not Detected`,
      description: `The ${f.toLowerCase()} requirement could not be confidently identified in the ingested document text.`,
      severity: 'warning',
      category: 'Uncertain Requirement',
      page: null,
      section: null
    }))
  ];

  const hasRealGaps = combinedGaps.length > 0;

  // Default fallback if no explicit gaps provided
  const displayGaps = hasRealGaps ? combinedGaps : [
    {
      title: 'Turnover Threshold Verification',
      description: 'Annual turnover requirement not explicitly specified in main eligibility clauses. Confirm with addendum or corrigendum.',
      severity: 'warning',
      category: 'Financial Eligibility',
      section: 'Section 2.1 Eligibility',
      page: 3,
      isDemoFallback: true
    },
    {
      title: 'Technical Qualification Clarification',
      description: 'Minimum required prior completed projects list requires clarification regarding joint venture inclusion.',
      severity: 'warning',
      category: 'Technical Qualification',
      section: 'Technical Annexure B',
      page: 12,
      isDemoFallback: true
    },
    {
      title: 'Contract Duration & Extension Terms',
      description: 'Base project duration is listed but operational extension terms remain unverified.',
      severity: 'info',
      category: 'Commercial Terms',
      section: 'General Conditions of Contract',
      page: 18,
      isDemoFallback: true
    }
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/20 via-white to-amber-50/10 space-y-5 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-slate-900 text-base">
              Information Gaps & Ambiguities ({displayGaps.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Requirements or clauses that require clarification or source verification
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
          hasRealGaps
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          {hasRealGaps ? 'Verification Required' : 'Clean Extraction'}
        </span>
      </div>

      {/* Grid List of Information Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayGaps.map((gap, idx) => {
          const titleText = typeof gap === 'string' ? gap : (gap.title || gap.field || 'Unverified Requirement');
          const descText = typeof gap === 'string' ? 'Details require verification with original PDF source.' : (gap.description || gap.reason || 'Verification required prior to bid submission.');
          const pageNum = gap.page || null;
          const sectionName = gap.section || null;

          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 shadow-2xs space-y-3 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-heading font-bold text-slate-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="line-clamp-2">{titleText}</span>
                  </div>
                  {gap.isDemoFallback && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 shrink-0 uppercase">
                      Sample Checklist
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {descText}
                </p>
              </div>

              {/* Source Attribution or Fallback */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                {pageNum ? (
                  <span className="font-semibold text-slate-700">
                    {sectionName ? `${sectionName} • ` : ''}Page {pageNum}
                  </span>
                ) : (
                  <span className="italic text-slate-400">
                    Source reference unavailable
                  </span>
                )}

                {pageNum && onOpenPdf && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenPdf({
                        page: pageNum,
                        section: sectionName,
                        text: gap.clauseText || descText || titleText
                      })
                    }
                    className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>View in PDF</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
