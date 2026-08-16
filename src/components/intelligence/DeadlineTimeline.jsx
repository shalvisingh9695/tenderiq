import React from 'react';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
<<<<<<< HEAD
import { extractText } from '../../utils/textHelper';
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

export const DeadlineTimeline = ({ importantDates = [], onOpenSource }) => {
  if (!importantDates || importantDates.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-orange-100 text-center space-y-2">
        <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
        <h3 className="font-heading font-bold text-slate-700 text-sm">No Specific Deadlines Extracted</h3>
        <p className="text-xs text-slate-500">Document text did not contain explicit key dates or milestones.</p>
      </div>
    );
  }

  const getConfidencePill = (conf) => {
    if (typeof conf !== 'number') return null;
    if (conf >= 0.90) {
      return <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">High Conf ({Math.round(conf * 100)}%)</span>;
    }
    if (conf >= 0.70) {
      return <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">Med Conf ({Math.round(conf * 100)}%)</span>;
    }
    return <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-semibold">Low Conf ({Math.round(conf * 100)}%)</span>;
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              Deadline Timeline & Key Milestones
            </h3>
            <p className="text-xs text-slate-500">
              Chronological schedule extracted directly from tender clauses
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {importantDates.length} Key Dates
        </span>
      </div>

      {/* Timeline Layout */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-200">
        {importantDates.map((item, idx) => {
<<<<<<< HEAD
          const itemLabel = extractText(item.label || item.event, 'Procurement Event');
          const itemDate = extractText(item.dateString || item.date || item.value || item);
          const itemWording = extractText(item.originalWording || item.description);
          const itemSection = extractText(item.section || item.source);
          const itemPage = extractText(item.page);
          const isDeadline = itemLabel.toLowerCase().includes('deadline') || itemLabel.toLowerCase().includes('submission');
=======
          const isDeadline = item.label?.toLowerCase().includes('deadline') || item.label?.toLowerCase().includes('submission');
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

          return (
            <div key={idx} className="relative group">
              {/* Timeline Bullet */}
              <div className={`absolute -left-[23px] sm:-left-[29px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white transition-transform group-hover:scale-110 ${
                isDeadline ? 'border-orange-500 text-orange-600 shadow-xs' : 'border-slate-300 text-slate-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isDeadline ? 'bg-orange-500' : 'bg-slate-300'}`} />
              </div>

              {/* Card content */}
              <div className={`p-4 rounded-xl border transition-all ${
                isDeadline 
                  ? 'bg-orange-50/40 border-orange-200/90 shadow-xs' 
                  : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-slate-900 text-sm sm:text-base">
<<<<<<< HEAD
                        {itemLabel}
=======
                        {item.label || 'Procurement Event'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                      </span>
                      {isDeadline && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-500 text-white uppercase tracking-wider">
                          Critical
                        </span>
                      )}
                    </div>
<<<<<<< HEAD
                    {itemWording && (
                      <p className="text-xs text-slate-600 font-medium">
                        "{itemWording}"
=======
                    {item.originalWording && (
                      <p className="text-xs text-slate-600 font-medium">
                        "{item.originalWording}"
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                      </p>
                    )}
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 text-sm block">
<<<<<<< HEAD
                      {itemDate || 'Unspecified'}
=======
                      {item.dateString || 'Unspecified'}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                    </span>
                    <div className="mt-0.5">
                      {getConfidencePill(item.confidence)}
                    </div>
                  </div>
                </div>

                {/* Source & Page attribution */}
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
<<<<<<< HEAD
                    {itemSection && (
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <FileText className="w-3 h-3 text-orange-500" />
                        {itemSection}
                      </span>
                    )}
                    {itemPage && (
                      <span>Pg {itemPage}</span>
=======
                    {(item.section || item.source) && (
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <FileText className="w-3 h-3 text-orange-500" />
                        {item.section || item.source}
                      </span>
                    )}
                    {item.page && (
                      <span>Pg {item.page}</span>
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                    )}
                  </div>

                  {onOpenSource && (
                    <button
                      onClick={() => onOpenSource({
<<<<<<< HEAD
                        value: `${itemLabel}: ${itemDate}`,
                        sourceText: extractText(item.sourceText || item.originalText || itemDate),
                        section: itemSection,
                        page: itemPage,
=======
                        value: `${item.label}: ${item.originalText || item.dateString}`,
                        sourceText: item.sourceText || item.originalText,
                        section: item.section || item.source,
                        page: item.page,
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                        confidence: item.confidence,
                        requirementType: 'explicit'
                      })}
                      className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Source
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
<<<<<<< HEAD

=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
