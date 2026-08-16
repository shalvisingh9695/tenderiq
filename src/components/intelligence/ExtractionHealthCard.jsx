import React from 'react';
import { ShieldCheck, CheckCircle2, Calendar, FileText, AlertCircle, HelpCircle, Activity } from 'lucide-react';

export const ExtractionHealthCard = ({ extractionHealth = {} }) => {
  const {
    fieldsExtracted = 0,
    requirementsDetected = 0,
    deadlinesDetected = 0,
    documentsDetected = 0,
    lowConfidenceItems = 0,
    ambiguousClausesCount = 0,
    overallQualityScore = 0
  } = extractionHealth;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-orange-100/90 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">
              Extraction Quality & Health Index
            </h3>
            <p className="text-xs text-slate-500">
              Audit metrics evaluating Gemini document parsing accuracy, coverage, and confidence
            </p>
          </div>
        </div>

        {/* Quality Score Pill */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 self-start sm:self-auto ${getScoreColor(overallQualityScore)}`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] uppercase font-extrabold tracking-wider block leading-none">
              Extraction Coverage
            </span>
            <span className="font-bold text-base leading-tight">
              {overallQualityScore}% Quality
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Fields
          </span>
          <p className="text-lg font-extrabold text-slate-900">{fieldsExtracted}</p>
          <span className="text-[10px] text-slate-400 block">Total Extracted</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <FileText className="w-3.5 h-3.5 text-orange-500" />
            Requirements
          </span>
          <p className="text-lg font-extrabold text-slate-900">{requirementsDetected}</p>
          <span className="text-[10px] text-slate-400 block">Parsed Clauses</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            Deadlines
          </span>
          <p className="text-lg font-extrabold text-slate-900">{deadlinesDetected}</p>
          <span className="text-[10px] text-slate-400 block">Schedule Dates</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <FileText className="w-3.5 h-3.5 text-purple-500" />
            Documents
          </span>
          <p className="text-lg font-extrabold text-slate-900">{documentsDetected}</p>
          <span className="text-[10px] text-slate-400 block">Required Attachments</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Low Conf.
          </span>
          <p className={`text-lg font-extrabold ${lowConfidenceItems > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {lowConfidenceItems}
          </p>
          <span className="text-[10px] text-slate-400 block">&lt;70% Match Score</span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
            Ambiguous
          </span>
          <p className={`text-lg font-extrabold ${ambiguousClausesCount > 0 ? 'text-purple-600' : 'text-slate-900'}`}>
            {ambiguousClausesCount}
          </p>
          <span className="text-[10px] text-slate-400 block">Vague Clauses</span>
        </div>

      </div>

    </div>
  );
};
