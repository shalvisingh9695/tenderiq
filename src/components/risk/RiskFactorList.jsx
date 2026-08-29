import React, { useState } from 'react';
import { AlertCircle, Filter, Search, FileText, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { extractText } from '../../utils/textHelper';

export const RiskFactorList = ({ riskFactors = [], onOpenSource }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Eligibility', 'Financial', 'Technical', 'Documentation', 'Timeline', 'Contractual', 'Commercial'];
  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const getSeverityBadge = (severity) => {
    const s = (extractText(severity) || 'medium').toLowerCase();
    if (s === 'critical') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-950 border border-red-200 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-red-600" /> Critical
        </span>
      );
    }
    if (s === 'high') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-950 border border-orange-200 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-orange-600" /> High
        </span>
      );
    }
    if (s === 'medium') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-amber-600" /> Medium
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-slate-500" /> Low
      </span>
    );
  };

  const filteredFactors = riskFactors.filter((rf) => {
    const rfCat = extractText(rf.category, '');
    const rfSev = extractText(rf.severity, '');
    const rfTitle = extractText(rf.title, '');
    const rfExpl = extractText(rf.explanation || rf.description, '');
    const rfSource = extractText(rf.sourceText, '');

    const matchesCat =
      selectedCategory === 'All' ||
      rfCat.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesSev =
      selectedSeverity === 'All' ||
      rfSev.toLowerCase() === selectedSeverity.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      rfTitle.toLowerCase().includes(query) ||
      rfExpl.toLowerCase().includes(query) ||
      rfSource.toLowerCase().includes(query);

    return matchesCat && matchesSev && matchesSearch;
  });

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100/80">
        <div>
          <h3 className="font-heading font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-600" />
            Detected Clause Risks ({filteredFactors.length})
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Explainable clause-level risk factors with tender evidence & page attribution
          </p>
        </div>

        {/* Controls: Search & Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter risks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 w-36 sm:w-44"
            />
          </div>

          {/* Severity selector */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            {severities.map((sev) => (
              <option key={sev} value={sev}>Severity: {sev}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Risk Items List */}
      <div className="space-y-3">
        {filteredFactors.length > 0 ? (
          filteredFactors.map((rf, idx) => {
            const pageNum = extractText(rf.page || rf.sourcePage);
            const hasPage = Boolean(pageNum);
            const titleText = extractText(rf.title, 'Risk Factor');
            const categoryText = extractText(rf.category, 'General');
            const explanationText = extractText(rf.explanation || rf.description, 'Clause conditions trigger elevated risk exposure.');
            const sectionText = extractText(rf.section || rf.category, 'Tender Clause');

            return (
              <div
                key={idx}
                className="bg-white p-4.5 rounded-xl border border-slate-200/80 hover:border-orange-300 shadow-2xs hover:shadow-sm transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                      {titleText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {categoryText}
                    </span>
                    {getSeverityBadge(rf.severity)}
                  </div>
                </div>

                {/* Reason (Why is this detected?) */}
                <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100 space-y-1">
                  <span className="text-[10px] font-bold text-orange-900 uppercase tracking-wider block">
                    Reason / Detected Clause Trigger:
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {explanationText}
                  </p>
                </div>

                {/* Evidence & PDF Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2 truncate max-w-xl">
                    <span className="font-semibold text-slate-400 shrink-0">Evidence:</span>
                    {hasPage ? (
                      <span className="font-bold text-slate-800 flex items-center gap-1 truncate">
                        <FileText className="w-3 h-3 text-orange-500 shrink-0" />
                        <span>{sectionText} — Page {pageNum}</span>
                      </span>
                    ) : (
                      <span className="italic text-slate-400">
                        Source reference unavailable
                      </span>
                    )}
                  </div>

                  {hasPage && onOpenSource ? (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenSource({
                          value: `${titleText} (${(extractText(rf.severity) || 'Medium').toUpperCase()} RISK)`,
                          sourceText: extractText(rf.sourceText || explanationText),
                          section: sectionText,
                          page: pageNum,
                          confidence: rf.confidence || 0.9,
                          requirementType: extractText(rf.severity)
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200/80 transition-colors shadow-2xs cursor-pointer self-end sm:self-auto shrink-0"
                    >
                      <ExternalLink className="w-3 h-3 text-amber-600" />
                      <span>View in PDF</span>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-500 space-y-1">
            <p className="text-sm font-semibold">No risk factors match the active filters.</p>
            <p className="text-xs text-slate-400">Try selecting "All" categories or clearing your search term.</p>
          </div>
        )}
      </div>

    </div>
  );
};

