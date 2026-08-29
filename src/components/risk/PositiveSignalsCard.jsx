import React from 'react';
import { CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const PositiveSignalsCard = ({ positiveSignals = [], onOpenSource }) => {
  if (!positiveSignals || positiveSignals.length === 0) {
    return null;
  }

  return (
    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/80 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-heading font-extrabold text-emerald-950 text-lg flex items-center gap-2">
              Favorable Vendor Conditions ({positiveSignals.length})
            </h3>
            <p className="text-xs text-emerald-800 font-medium">
              Positive signals aiding bid qualification & commercial feasibility
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900 uppercase tracking-wide">
          Vendor Advantage
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positiveSignals.map((signal, idx) => {
          const titleText = extractText(signal.title || signal.heading || (typeof signal === 'string' ? signal : 'Favorable Term'));
          const explanationText = extractText(signal.explanation || signal.description || signal.value || (typeof signal === 'string' ? '' : ''));
          const sectionText = extractText(signal.section);
          const pageText = extractText(signal.page);

          return (
            <div
              key={idx}
              className="bg-white/95 p-4 rounded-xl border border-emerald-100 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="font-heading font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {titleText}
                </span>
                {explanationText && (
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {explanationText}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  {sectionText && <span className="font-medium text-slate-700">{sectionText}</span>}
                  {pageText && <span>Pg {pageText}</span>}
                </div>

                {onOpenSource && (
                  <button
                    onClick={() =>
                      onOpenSource({
                        value: `FAVORABLE CONDITION: ${titleText}`,
                        sourceText: extractText(signal.sourceText || signal.explanation || titleText),
                        section: sectionText,
                        page: pageText,
                        confidence: signal.confidence || 0.95,
                        requirementType: 'favorable'
                      })
                    }
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
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

