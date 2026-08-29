import React from 'react';
import { Flame, AlertTriangle, ExternalLink, ShieldAlert } from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const RedFlagsCard = ({ redFlags = [], onOpenSource }) => {
  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100/90 text-center space-y-1">
        <span className="inline-flex p-2 rounded-full bg-emerald-100 text-emerald-700 mb-1">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <h4 className="font-heading font-extrabold text-emerald-950 text-sm">
          No Red Flags Detected
        </h4>
        <p className="text-xs text-emerald-800 font-medium">
          No critical deal-breaker conditions or extreme risk clauses flagged in the tender text.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200/90 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-red-200/60">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-red-100 text-red-700 animate-pulse">
            <Flame className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-heading font-extrabold text-red-950 text-lg flex items-center gap-2">
              Critical Red Flags ({redFlags.length})
            </h3>
            <p className="text-xs text-red-800 font-medium">
              High-impact warning signals requiring mandatory executive review
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-200 text-red-950 uppercase tracking-wide">
          High Priority
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {redFlags.map((flag, idx) => {
          const titleText = extractText(flag.title || flag.heading || (typeof flag === 'string' ? flag : 'Risk Alert'));
          const explanationText = extractText(flag.explanation || flag.description || flag.value || (typeof flag === 'string' ? '' : ''));
          const severityText = extractText(flag.severity, 'High');
          const sectionText = extractText(flag.section);
          const pageText = extractText(flag.page);

          return (
            <div
              key={idx}
              className="bg-white/95 p-4 rounded-xl border border-red-200 shadow-2xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-heading font-bold text-slate-900 text-sm leading-snug flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    {titleText}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800 shrink-0">
                    {severityText}
                  </span>
                </div>

                {explanationText && (
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {explanationText}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-red-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  {sectionText && <span className="font-medium text-slate-700">{sectionText}</span>}
                  {pageText && <span>Pg {pageText}</span>}
                </div>

                {onOpenSource && (
                  <button
                    onClick={() =>
                      onOpenSource({
                        value: `RED FLAG: ${titleText}`,
                        sourceText: extractText(flag.sourceText || flag.explanation || titleText),
                        section: sectionText,
                        page: pageText,
                        confidence: flag.confidence || 0.95,
                        requirementType: 'critical'
                      })
                    }
                    className="text-red-700 hover:text-red-800 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
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
    </div>
  );
};

