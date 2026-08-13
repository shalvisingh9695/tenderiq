import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, Bookmark } from 'lucide-react';

export const SourceViewModal = ({ isOpen, onClose, sourceData, title }) => {
  if (!isOpen || !sourceData) return null;

  const {
    value,
    sourceText,
    section,
    page,
    confidence,
    requirementType,
    isAmbiguous
  } = sourceData;

  const confidencePercent = confidence ? Math.round(confidence * 100) : 90;

  const getRequirementBadge = () => {
    const type = (requirementType || '').toLowerCase();
    if (type === 'explicit' || type === 'must_submit' || type === 'mandatory') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Explicit Requirement
        </span>
      );
    }
    if (type === 'conditional' || type === 'where_applicable') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          Conditional Requirement
        </span>
      );
    }
    if (type === 'optional' || type === 'may_submit') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <Bookmark className="w-3.5 h-3.5" />
          Optional
        </span>
      );
    }
    if (isAmbiguous || type === 'ambiguous') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          <HelpCircle className="w-3.5 h-3.5" />
          Ambiguous Clause
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        Extracted Requirement
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 text-slate-800 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Source Document Verification
              </h4>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">
                {title || 'Tender Document Extraction'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Extracted Value Card */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Extracted Value / Parameter
            </span>
            <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-200/60 font-semibold text-slate-900 text-sm">
              {value || 'No value extracted'}
            </div>
          </div>

          {/* Source Snippet */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Original Document Clause Snippet
            </span>
            <div className="p-4 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 font-mono text-xs leading-relaxed italic relative">
              "{sourceText || 'Exact snippet not preserved in source index.'}"
            </div>
          </div>

          {/* Provenance Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">Document Section</span>
              <p className="font-bold text-slate-800">
                {section || 'Unspecified Section'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">Page Index</span>
              <p className="font-bold text-slate-800">
                {page ? `Page ${page}` : 'Page N/A'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">AI Confidence Score</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{confidencePercent}% Confidence</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-medium text-[11px] block">Requirement Classification</span>
              <div>
                {getRequirementBadge()}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="btn-primary-orange px-5 py-2 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Close Verification
          </button>
        </div>

      </div>
    </div>
  );
};
