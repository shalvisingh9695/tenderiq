import React, { useState } from 'react';
import { AlertCircle, Filter, Search, FileText, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RiskFactorList = ({ riskFactors = [], onOpenSource }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

<<<<<<< HEAD
  const categories = ['All', 'Eligibility', 'Financial', 'Technical', 'Documentation', 'Timeline', 'Contractual', 'Commercial'];
=======
  const categories = ['All', 'Financial', 'Legal', 'Operational', 'Eligibility', 'Compliance'];
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const getSeverityBadge = (severity) => {
    const s = (severity || 'medium').toLowerCase();
    if (s === 'critical') {
      return (
<<<<<<< HEAD
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-950 border border-red-200 flex items-center gap-1">
=======
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-900 border border-red-200 flex items-center gap-1">
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
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
    const matchesCat =
      selectedCategory === 'All' ||
      (rf.category && rf.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    const matchesSev =
      selectedSeverity === 'All' ||
      (rf.severity && rf.severity.toLowerCase() === selectedSeverity.toLowerCase());

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (rf.title || '').toLowerCase().includes(query) ||
      (rf.explanation && rf.explanation.toLowerCase().includes(query)) ||
      (rf.sourceText && rf.sourceText.toLowerCase().includes(query));

    return matchesCat && matchesSev && matchesSearch;
  });

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-orange-100/80">
        <div>
          <h3 className="font-heading font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-600" />
<<<<<<< HEAD
            Detected Clause Risks ({filteredFactors.length})
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Explainable clause-level risk factors with tender evidence & page attribution
=======
            Detected Risk Factors ({filteredFactors.length})
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Explainable clause-level risks with tender evidence & commercial impact
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
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
<<<<<<< HEAD
          filteredFactors.map((rf, idx) => {
            const hasPage = Boolean(rf.page || rf.sourcePage);
            const pageNum = rf.page || rf.sourcePage;
            const sectionText = rf.section || rf.category || 'Tender Clause';

            return (
              <div
                key={idx}
                className="bg-white p-4.5 rounded-xl border border-slate-200/80 hover:border-orange-300 shadow-2xs hover:shadow-sm transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                      {rf.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {rf.category || 'General'}
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
                    {rf.explanation || rf.description || 'Clause conditions trigger elevated risk exposure.'}
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
                          value: `${rf.title} (${(rf.severity || 'Medium').toUpperCase()} RISK)`,
                          sourceText: rf.sourceText || rf.explanation,
                          section: sectionText,
                          page: pageNum,
                          confidence: rf.confidence || 0.9,
                          requirementType: rf.severity
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
=======
          filteredFactors.map((rf, idx) => (
            <div
              key={idx}
              className="bg-white/90 p-4 rounded-xl border border-slate-200/80 hover:border-orange-300 shadow-2xs hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                    {rf.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                    {rf.category}
                  </span>
                  {getSeverityBadge(rf.severity)}
                </div>
              </div>

              {/* Explainable Why is this risky? */}
              <div className="bg-slate-50/90 p-3 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Why is this risky?
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {rf.explanation}
                </p>
              </div>

              {/* Source Clause Attribution & Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-3 truncate max-w-xl">
                  {rf.section && (
                    <span className="flex items-center gap-1 font-semibold text-slate-700 shrink-0">
                      <FileText className="w-3 h-3 text-orange-500" />
                      {rf.section}
                    </span>
                  )}
                  {rf.page && <span className="shrink-0">Page {rf.page}</span>}
                  {rf.confidence && (
                    <span className="text-emerald-700 font-semibold shrink-0">
                      {Math.round(rf.confidence * 100)}% Match
                    </span>
                  )}
                </div>

                {onOpenSource && (
                  <button
                    onClick={() =>
                      onOpenSource({
                        value: `${rf.title} (${rf.category.toUpperCase()} RISK)`,
                        sourceText: rf.sourceText || rf.explanation,
                        section: rf.section,
                        page: rf.page,
                        confidence: rf.confidence,
                        requirementType: rf.severity
                      })
                    }
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline self-end sm:self-auto shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Clause Source
                  </button>
                )}
              </div>
            </div>
          ))
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
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
