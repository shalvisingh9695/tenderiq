import React from 'react';
import { 
  Sparkles,
  ShieldAlert,
  Cpu,
  MessageSquare,
  FileCheck2,
  FolderOpen,
  ArrowRight,
  FileText,
  Building2,
  HardDrive
} from 'lucide-react';
import uploadIllustration from '../assets/images/upload_file_illustration_1786553515843.jpg';
import { DragDropUpload } from './upload/DragDropUpload';

export const UploadPage = ({ onUploadSuccess, onNavigate, documents = [] }) => {
  const MAX_FILE_SIZE_MB = 30;

  return (
    <div className="relative min-h-screen py-8 lg:py-12 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* AMBIENT GRADIENT & MESH BACKGROUND (LIGHT ORANGE SAAS THEME) */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-1/4 w-[28rem] h-[28rem] bg-amber-300/15 rounded-full blur-3xl" />
        <div className="absolute top-48 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fadeIn relative z-10">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-100/90 via-amber-100/70 to-orange-100/90 text-orange-950 border border-orange-200/80 shadow-2xs backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-600" />
            Enterprise Procurement AI Ingestion
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Ingest &amp; Audit Tender Documents
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Upload RFP specifications, contract terms, or bidding requirements to instantly generate clause-level extractions, eligibility audits, risk matrix scoring, and bid decisions.
          </p>
        </div>

        {/* Main Upload Area Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Specification & Capabilities Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Technical Specs Glass Card */}
            <div className="glass-card-premium glass-card-hover p-7 rounded-[2rem] text-center space-y-5">
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-inner bg-gradient-to-tr from-orange-100/50 to-amber-50/50 flex items-center justify-center mx-auto border border-orange-200/70 p-2">
                <img
                  src={uploadIllustration}
                  alt="Tender Ingestion Illustration"
                  className="w-full h-full object-cover rounded-xl shadow-sm"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Document Technical Specs
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Maximum file size: <span className="font-bold text-slate-800">{MAX_FILE_SIZE_MB}MB</span>. Fast vector text indexing &amp; structural clause separation.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <span className="px-3.5 py-1.5 bg-orange-100/80 text-orange-900 border border-orange-200 rounded-xl text-xs font-bold shadow-2xs">
                  .PDF
                </span>
                <span className="px-3.5 py-1.5 bg-amber-100/80 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold shadow-2xs">
                  .DOCX
                </span>
                <span className="px-3.5 py-1.5 bg-slate-100/80 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs">
                  .TXT
                </span>
              </div>
            </div>

            {/* Core Intelligence Feature Highlights Glass Card */}
            <div className="glass-card-premium glass-card-hover p-6 rounded-[2rem] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-orange-500" />
                  Automated Analysis Pipeline
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                  Gemini AI
                </span>
              </div>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-100 shadow-2xs hover:bg-white/90 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Clause Extraction</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Extract turnover, EMD, submission deadlines, and mandatory checklists.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-100 shadow-2xs hover:bg-white/90 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">7-Category Risk Intelligence</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Evaluates eligibility, financial, contract, and penalty risks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-orange-100 shadow-2xs hover:bg-white/90 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">RAG Chat &amp; PDF Traceability</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Ask questions and jump directly to highlighted PDF source pages.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Dropzone & Progress Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Drag & Drop Component with Elevated Depth */}
            <DragDropUpload
              onUploadSuccess={onUploadSuccess}
              onNavigate={onNavigate}
              maxSizeMB={MAX_FILE_SIZE_MB}
              allowedTypes={['.pdf', '.docx', '.txt', '.doc']}
            />

            {/* Active & Recent Tender Documents List Glass Card */}
            {documents.length > 0 && (
              <div className="glass-card-premium p-6 sm:p-7 rounded-[2rem] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-extrabold text-sm text-slate-900">
                      Active &amp; Recent Tender Documents ({documents.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    View All in Dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100/80">
                  {documents.slice(0, 4).map((doc) => {
                    const hasAnalysis = doc.analysisStatus === 'completed' || doc.structuredAnalysis;

                    return (
                      <div
                        key={doc.id}
                        className="py-3.5 flex items-center justify-between gap-3 text-xs hover:bg-orange-50/60 px-3 rounded-2xl transition-all cursor-pointer group"
                        onClick={() => onNavigate('dashboard')}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                              {doc.originalName || doc.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>{doc.sizeFormatted || '1.8 MB'}</span>
                              <span>•</span>
                              <span>Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Today'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${
                            hasAnalysis
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                              : 'bg-amber-100 text-amber-900 border border-amber-200/80'
                          }`}>
                            {hasAnalysis ? 'AI Extracted' : 'Ready for AI'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
export default UploadPage;
