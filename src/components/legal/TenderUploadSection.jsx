import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles,
  FileText,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { DragDropUpload } from '../upload/DragDropUpload';
import { SAMPLE_TENDERS } from '../../data/tendersData';

export const TenderUploadSection = ({ onUploadSuccess, onSelectPreset }) => {
  const handleSelectPresetTender = (tender) => {
    if (onSelectPreset) onSelectPreset(tender);
    if (onUploadSuccess) onUploadSuccess(tender);
    const el = document.getElementById('tender-insights-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="upload-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Section 2 • Document Ingestion</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Upload Tender Document for Deep AI Extraction
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
          Drop your procurement RFP, tender notice, or contract draft. Our multi-stage RAG pipeline analyzes clauses, checks eligibility criteria, and assesses legal liabilities in seconds.
        </p>
      </div>

      {/* Main Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Drag-and-Drop Card (7 cols) */}
        <div className="lg:col-span-7">
          <DragDropUpload
            onUploadSuccess={onUploadSuccess}
            maxSizeMB={30}
            allowedTypes={['.pdf', '.docx', '.txt', '.doc']}
          />
        </div>

        {/* Right Column: 1-Click Preset Tenders & Pipeline Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Quick Preset RFPs */}
          <div className="soft-tender-card p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                1-Click Preset Tenders
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Instant Test</span>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_TENDERS.slice(0, 3).map((tender) => (
                <div
                  key={tender.id}
                  onClick={() => handleSelectPresetTender(tender)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/70 border border-slate-200/80 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate max-w-[200px] sm:max-w-[240px]">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-orange-700 transition-colors truncate">
                        {tender.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {tender.valueFormatted} • {tender.sector}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-orange-600 bg-white group-hover:bg-orange-600 group-hover:text-white px-2.5 py-1 rounded-xl border border-orange-200 transition-all shadow-2xs">
                    Load
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Pipeline Overview Widget */}
          <div className="soft-tender-card p-5 space-y-3.5 bg-gradient-to-br from-white to-orange-50/30">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-orange-500" />
                AI Extraction Pipeline
              </span>
              <span className="text-[10px] text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded-full">
                5-Stage Audit
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Document Ingestion &amp; OCR</p>
                  <p className="text-[11px] text-slate-400">Extracting text streams, tabular BOQs, and scanned signatures.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Clause Hierarchy &amp; Compliance</p>
                  <p className="text-[11px] text-slate-400">Mapping NIT sections, turnover thresholds, and bank guarantees.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">7-Factor Risk Scoring</p>
                  <p className="text-[11px] text-slate-400">Analyzing liquidated damages, termination liabilities, and defect SLAs.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
export default TenderUploadSection;
