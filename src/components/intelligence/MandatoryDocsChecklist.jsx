import React, { useState } from 'react';
import { ListChecks, FileText, Filter, CheckCircle2, AlertTriangle, Search, Tag, ExternalLink } from 'lucide-react';

export const MandatoryDocsChecklist = ({ mandatoryDocuments = [], onOpenSource }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!mandatoryDocuments || mandatoryDocuments.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-orange-100 text-center space-y-2">
        <ListChecks className="w-8 h-8 text-slate-300 mx-auto" />
        <h3 className="font-heading font-bold text-slate-700 text-sm">No Submission Documents Identified</h3>
        <p className="text-xs text-slate-500">Document text did not list specific required bidder attachments.</p>
      </div>
    );
  }

  // Extract unique categories
  const categories = ['All', ...new Set(mandatoryDocuments.map(d => d.category || 'Other'))];

  // Filter documents
  const filteredDocs = mandatoryDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRequirementBadge = (status) => {
    const st = (status || '').toLowerCase();
    if (st.includes('mandatory')) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
          Mandatory
        </span>
      );
    }
    if (st.includes('conditional')) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          Conditional
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        Optional
      </span>
    );
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              Mandatory Submission Documents Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Categorized checklist of required attachments & bidder declarations
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {mandatoryDocuments.length} Documents Required
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative shrink-0 sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>

      </div>

      {/* Document List */}
      <div className="space-y-2.5">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc, idx) => (
            <div 
              key={idx}
              className="p-3.5 bg-slate-50/80 hover:bg-white rounded-xl border border-slate-100 hover:border-orange-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-semibold text-slate-900 text-sm">
                    {doc.documentName || doc.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-600">{doc.category || 'General'}</span>
                    {(doc.section || doc.source) && (
                      <>
                        <span>•</span>
                        <span>{doc.section || doc.source}</span>
                      </>
                    )}
                    {doc.page && (
                      <span>(Pg {doc.page})</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                {onOpenSource && (
                  <button
                    onClick={() => onOpenSource({
                      value: `${doc.documentName || doc.name} (${doc.category || 'General'})`,
                      sourceText: doc.sourceText || doc.source,
                      section: doc.section || doc.source,
                      page: doc.page,
                      confidence: doc.confidence,
                      requirementType: doc.requirementType || (doc.mandatory ? 'must_submit' : 'where_applicable')
                    })}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Source
                  </button>
                )}
                {getRequirementBadge(doc.requirementType || doc.requirementStatus)}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            No documents match the selected category or filter.
          </div>
        )}
      </div>

    </div>
  );
};
