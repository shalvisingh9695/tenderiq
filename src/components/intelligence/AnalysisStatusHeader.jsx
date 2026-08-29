import React from 'react';
import { Sparkles, Loader2, RefreshCw, AlertCircle, CheckCircle2, Clock, Cpu } from 'lucide-react';

export const AnalysisStatusHeader = ({ 
  analysisStatus, 
  analyzedAt, 
  analysisError, 
  onStartAnalysis 
}) => {
  if (analysisStatus === 'analyzing' || analysisStatus === 'processing') {
    return (
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 p-6 rounded-2xl border border-orange-200 space-y-4 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-lg flex items-center gap-2">
                Extracting Tender Intelligence...
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wide">
                  Gemini AI
                </span>
              </h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Converting document text layer into clause-level procurement intelligence & structured schemas.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-700 bg-orange-100/80 px-3.5 py-2 rounded-xl shrink-0">
            <Sparkles className="w-4 h-4 animate-spin text-orange-600" />
            Analyzing clauses & dates
          </div>
        </div>

        {/* Loading Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-orange-200/60 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-orange-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            1. Text Extraction
          </div>
          <div className="flex items-center gap-1.5 font-medium text-orange-800">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500 shrink-0" />
            2. Dates & Eligibility
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            3. Mandatory Docs
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            4. Contract & Penalties
          </div>
        </div>
      </div>
    );
  }

  if (analysisStatus === 'failed') {
    return (
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-red-900 text-base sm:text-lg">
                Tender Intelligence Extraction Failed
              </h3>
              <p className="text-red-700 text-xs sm:text-sm mt-1 max-w-2xl">
                {analysisError || 'An error occurred while calling the Gemini AI extraction service.'}
              </p>
            </div>
          </div>

          <button
            onClick={onStartAnalysis}
            className="btn-primary-orange px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Extraction
          </button>
        </div>
      </div>
    );
  }

  if (analysisStatus === 'analyzed' || analysisStatus === 'completed') {
    return (
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                AI Intelligence Extraction Complete
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                Analyzed
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-2">
              <span>Analyzed on {analyzedAt ? new Date(analyzedAt).toLocaleString() : 'Just now'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Cpu className="w-3 h-3 text-orange-500" /> Gemini AI Engine
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={onStartAnalysis}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-Analyze Tender
        </button>
      </div>
    );
  }

  // State === 'none' (Not yet analyzed)
  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-white p-6 rounded-2xl border border-orange-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
      <div className="space-y-1.5 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-orange-100 text-orange-600">
            <Sparkles className="w-4 h-4" />
          </span>
          <h3 className="font-heading font-bold text-slate-900 text-lg">
            Run AI Intelligence Extraction Engine
          </h3>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm">
          Extract clause-level eligibility requirements, mandatory submission documents, deadline timelines, financial deposits, and contract penalty conditions using Gemini.
        </p>
      </div>

      <button
        onClick={onStartAnalysis}
        className="btn-primary-orange px-6 py-3 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2.5 cursor-pointer shrink-0 shadow-md shadow-orange-500/20"
      >
        <Sparkles className="w-4 h-4" />
        Analyze Tender with AI
      </button>
    </div>
  );
};
