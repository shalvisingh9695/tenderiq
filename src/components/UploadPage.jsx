import React, { useState, useRef } from 'react';
<<<<<<< HEAD
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  X, 
  Trash2, 
  Sparkles,
  ShieldAlert,
  Cpu,
  MessageSquare,
  Clock,
  RefreshCw,
  Building2,
  FileCheck2,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import uploadIllustration from '../assets/images/upload_file_illustration_1786553515843.jpg';
import { safeFetchJson } from '../utils/apiHelper';

export const UploadPage = ({ onUploadSuccess, onNavigate, documents = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
=======
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight, X, Trash2 } from 'lucide-react';
import uploadIllustration from '../assets/images/upload_file_illustration_1786553515843.jpg';

export const UploadPage = ({ onUploadSuccess, onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedResult, setUploadedResult] = useState(null);

  const fileInputRef = useRef(null);

  const allowedExtensions = ['.pdf', '.docx', '.txt', '.doc'];
<<<<<<< HEAD
  const MAX_FILE_SIZE_MB = 25;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const ANALYSIS_STAGES = [
    { id: 1, title: 'Document Ingestion & Text Extraction', desc: 'Parsing raw document buffer and extracting searchable text streams.' },
    { id: 2, title: 'Structuring Clause Hierarchy', desc: 'Mapping sections, annexures, and clause numbers.' },
    { id: 3, title: 'Evaluating Eligibility & Requirements', desc: 'Identifying turnover thresholds, EMD, and mandatory certificates.' },
    { id: 4, title: 'Running Risk Intelligence Engine', desc: 'Scoring compliance across 7 risk dimensions and penalty clauses.' },
    { id: 5, title: 'Computing Bid Recommendation', desc: 'Calculating GO / REVIEW / NO-GO decision score.' },
    { id: 6, title: 'Finalizing Procurement Dashboard', desc: 'Indexing citations for RAG chat and source traceability.' }
  ];

  const validateFile = (file) => {
    if (!file) {
      setErrorMessage('Please select a tender document to upload.');
      return false;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Unsupported format "${ext}". Please upload a PDF, DOCX, or TXT file.`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }

=======

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(`Invalid file format "${ext}". Please upload a PDF, DOCX, or TXT file.`);
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit.');
      return false;
    }
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    setErrorMessage(null);
    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadedResult(null);
<<<<<<< HEAD
      setErrorMessage(null);
=======
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
<<<<<<< HEAD
    if (!bytes || bytes === 0) return '0 Bytes';
=======
    if (bytes === 0) return '0 Bytes';
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

<<<<<<< HEAD
  // Full Pipeline: Upload -> AI Analyze -> Final Dashboard
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setIsAnalyzing(false);
    setErrorMessage(null);
    setCurrentStage(1);
=======
  const handleSubmitUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setUploadProgress(20);
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
<<<<<<< HEAD
      // Step 1: File Upload & Ingestion
      const uploadData = await safeFetchJson('/api/upload', {
=======
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const response = await fetch('/api/upload', {
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
        method: 'POST',
        body: formData,
      });

<<<<<<< HEAD
      const uploadedDoc = uploadData.file;
      if (onUploadSuccess) {
        onUploadSuccess(uploadedDoc);
      }

      // Transition to AI Extraction
      setIsUploading(false);
      setIsAnalyzing(true);
      setCurrentStage(2);

      // Interval simulator for realistic stage progression during analysis API call
      const stageTimer = setInterval(() => {
        setCurrentStage((prev) => (prev < 5 ? prev + 1 : prev));
      }, 700);

      // Step 2: Trigger AI Tender Intelligence Analysis
      const analyzeData = await safeFetchJson(`/api/tenders/${uploadedDoc.id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      clearInterval(stageTimer);

      const finalDoc = analyzeData.data || uploadedDoc;
      setCurrentStage(6);

      if (onUploadSuccess) {
        onUploadSuccess(finalDoc);
      }

      setUploadedResult(finalDoc);
      setSelectedFile(null);

    } catch (err) {
      console.error('Upload / Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred during file upload or tender analysis.');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const isBusy = isUploading || isAnalyzing;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          Enterprise Procurement AI
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ingest Tender Document
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-medium">
          Upload RFP specifications, contract terms, or tender documents to instantly generate clause-level extractions, eligibility audits, risk scoring, and bid decisions.
        </p>
      </div>

      {/* Main Upload Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Specification & Capabilities Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-orange-100 text-center space-y-4">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-inner bg-orange-50/50 flex items-center justify-center mx-auto border border-orange-200/60">
              <img
                src={uploadIllustration}
                alt="Tender Ingestion Illustration"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Document Technical Specs
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                Maximum file size: <span className="font-bold text-slate-800">{MAX_FILE_SIZE_MB}MB</span>. Fast vector text indexing & structural clause separation.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 border border-orange-200 rounded-lg text-xs font-bold">
                .PDF
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold">
                .DOCX
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-bold">
                .TXT
              </span>
            </div>
          </div>

          {/* Core Intelligence Feature Highlights */}
          <div className="glass-card p-5 rounded-2xl border border-orange-100 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-orange-500" />
              Automated Analysis Pipeline
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80">
                <FileCheck2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Clause Extraction</span>
                  <p className="text-[11px] text-slate-500">Extract turnover, EMD, submission deadlines, and mandatory checklists.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">7-Category Risk Intelligence</span>
                  <p className="text-[11px] text-slate-500">Evaluates eligibility, financial, contract, and penalty risks.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80">
                <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">RAG Chat & PDF Traceability</span>
                  <p className="text-[11px] text-slate-500">Ask questions and jump directly to highlighted PDF source pages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Interactive Dropzone & Progress Column */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start justify-between gap-3 text-xs shadow-xs animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-900">Upload Validation Error</p>
                  <p className="text-red-700 mt-0.5 font-medium">{errorMessage}</p>
=======
      clearInterval(progressTimer);
      setUploadProgress(100);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload document.');
      }

      setUploadedResult(data.file);
      onUploadSuccess(data.file);
      setSelectedFile(null);

    } catch (err) {
      setErrorMessage(err.message || 'Error communicating with backend server.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
          Upload Tender Document
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Ingest RFP specifications, contract details, or procurement addendums for instant AI risk profiling.
        </p>
      </div>

      {/* Main Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left/Top Illustration Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-orange-100 text-center space-y-4">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden shadow-inner bg-orange-50/50 flex items-center justify-center">
            <img
              src={uploadIllustration}
              alt="File Upload Illustration"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-base">Supported Document Specs</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              PDF, DOCX, and TXT files up to 25MB. Text extraction and structural parsing occur instantly.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-1 bg-orange-100 text-orange-800 rounded-md text-[11px] font-semibold">.PDF</span>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-[11px] font-semibold">.DOCX</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-[11px] font-semibold">.TXT</span>
          </div>
        </div>

        {/* Right Dropzone Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Error Message Dismissible */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3 text-sm animate-shake">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Upload Issue</p>
                  <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                </div>
              </div>
              <button 
                onClick={() => setErrorMessage(null)} 
<<<<<<< HEAD
                className="text-red-400 hover:text-red-700 p-1 cursor-pointer transition-colors"
                aria-label="Dismiss error"
=======
                className="text-red-400 hover:text-red-700 p-1"
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

<<<<<<< HEAD
          {/* Success Result Card */}
          {uploadedResult && !isBusy && (
            <div className="p-6 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-4 shadow-xs animate-fadeIn">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-emerald-950">
                      Tender Analysis Complete!
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium truncate max-w-sm">
                      {uploadedResult.originalName} ({uploadedResult.sizeFormatted})
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold rounded-full uppercase tracking-wider shrink-0">
                  AI Extracted
                </span>
              </div>

              {uploadedResult.previewSnippet && (
                <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-200/80 text-xs font-mono text-slate-700 italic max-h-24 overflow-y-auto leading-relaxed">
                  "{uploadedResult.previewSnippet}"
                </div>
              )}

              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-primary-orange px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
                >
                  <span>View Tender Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setUploadedResult(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white rounded-xl border border-slate-200 cursor-pointer transition-all"
                >
                  Upload Another Tender
=======
          {/* Upload Success Banner */}
          {uploadedResult && (
            <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900">File Ingested Successfully!</h4>
                    <p className="text-xs text-emerald-700">{uploadedResult.originalName} ({uploadedResult.sizeFormatted})</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                  Ready
                </span>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-emerald-100/80 text-xs text-slate-600 italic">
                "{uploadedResult.previewSnippet}"
              </div>

              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-primary-orange px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  View in Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setUploadedResult(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Upload Another File
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                </button>
              </div>
            </div>
          )}

          {/* Drag and Drop Zone */}
<<<<<<< HEAD
          {!isBusy && !uploadedResult && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Drop tender document here or browse files"
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer relative overflow-hidden focus:outline-hidden focus:ring-2 focus:ring-orange-500/50 ${
                isDragging
                  ? 'border-orange-500 bg-orange-50/90 scale-[1.01] shadow-lg'
                  : 'border-orange-200/90 hover:border-orange-400 bg-white/80 hover:bg-orange-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDragging ? 'bg-orange-500 text-white scale-110 shadow-md' : 'bg-orange-100 text-orange-600'
                }`}>
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="font-heading font-bold text-slate-900 text-base sm:text-lg">
                    Drop your tender document here
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    or <span className="text-orange-600 font-bold underline cursor-pointer">browse files</span> from your computer
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span>Supported: PDF, DOCX, TXT</span>
                  <span>•</span>
                  <span>Max file size: {MAX_FILE_SIZE_MB}MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected File Card & Start Analysis Action */}
          {selectedFile && !isBusy && (
            <div className="glass-card p-5 rounded-2xl border border-orange-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {selectedFile.name}
                    </p>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-extrabold uppercase">
                      {selectedFile.name.split('.').pop()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Size: {formatFileSize(selectedFile.size)}
=======
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer relative overflow-hidden ${
              isDragging
                ? 'border-orange-500 bg-orange-50/80 scale-[1.01]'
                : 'border-orange-200/90 hover:border-orange-400 bg-white/70 hover:bg-orange-50/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform ${
                isDragging ? 'bg-orange-500 text-white scale-110' : 'bg-orange-100 text-orange-600'
              }`}>
                <Upload className="w-8 h-8" />
              </div>

              <div>
                <p className="font-heading font-semibold text-slate-900 text-base sm:text-lg">
                  Drag & Drop tender document here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  or <span className="text-orange-600 font-bold underline">browse files</span> from your computer
                </p>
              </div>

              <p className="text-[11px] text-slate-400">
                Supports PDF, DOCX, TXT (Max 25MB)
              </p>
            </div>
          </div>

          {/* Selected File Preview Box */}
          {selectedFile && (
            <div className="glass-card p-4 rounded-xl border border-orange-200/90 flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(selectedFile.size)}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                  </p>
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  disabled={isBusy}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Remove file"
                  aria-label="Remove selected file"
=======
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  title="Remove file"
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
<<<<<<< HEAD
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isBusy}
                  className="btn-primary-orange px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
=======
                  onClick={handleSubmitUpload}
                  disabled={isUploading}
                  className="btn-primary-orange px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Process Upload
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
                </button>
              </div>
            </div>
          )}

<<<<<<< HEAD
          {/* Processing / AI Analysis Staged Progress Checklist */}
          {isBusy && (
            <div className="glass-card p-6 rounded-2xl border border-orange-200 space-y-6 animate-fadeIn shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center animate-spin">
                    <Loader2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-slate-900">
                      Analyzing Tender Document...
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedFile?.name || 'Tender Document Ingestion'}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full text-xs font-bold uppercase animate-pulse">
                  Analyzing...
                </span>
              </div>

              {/* Checklist Stages */}
              <div className="space-y-3 pt-2">
                {ANALYSIS_STAGES.map((stage) => {
                  const isDone = currentStage > stage.id;
                  const isCurrent = currentStage === stage.id;

                  return (
                    <div
                      key={stage.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : isCurrent
                          ? 'bg-orange-50/90 border-orange-300 text-slate-900 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200/60 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs">{stage.title}</p>
                        <p className="text-[11px] opacity-80 mt-0.5 leading-normal">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active & Recent Tender Documents List */}
          {documents.length > 0 && (
            <div className="glass-card p-6 rounded-2xl border border-orange-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-orange-500" />
                  <h3 className="font-heading font-extrabold text-sm text-slate-900">
                    Active & Recent Tender Documents ({documents.length})
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

              <div className="divide-y divide-slate-100">
                {documents.slice(0, 4).map((doc) => {
                  const hasAnalysis = doc.analysisStatus === 'completed' || doc.structuredAnalysis;

                  return (
                    <div
                      key={doc.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-orange-50/40 px-2 rounded-xl transition-colors cursor-pointer"
                      onClick={() => onNavigate('dashboard')}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">
                            {doc.originalName}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{doc.sizeFormatted}</span>
                            <span>•</span>
                            <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          hasAnalysis
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {hasAnalysis ? 'AI Extracted' : 'Ready for AI'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
=======
          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Ingesting tender document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
>>>>>>> 11a40448ad7b423ee66a3ef5abb6259ffadc0ad1
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
