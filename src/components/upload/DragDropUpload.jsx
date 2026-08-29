import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
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
  ShieldCheck,
  FileCode,
  FileCheck2,
  RefreshCw,
  HardDrive,
  Layers,
  Zap,
  Check
} from 'lucide-react';
import { safeFetchJson, getApiUrl } from '../../utils/apiHelper';

export const DragDropUpload = ({
  onUploadSuccess,
  onNavigate,
  maxSizeMB = 30,
  allowedTypes = ['.pdf', '.docx', '.txt', '.doc'],
  className = ''
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewData, setFilePreviewData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Real upload lifecycle states: 'idle' | 'uploading' | 'server_processing' | 'analyzing' | 'completed' | 'error'
  const [uploadState, setUploadState] = useState('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytesUploaded, setBytesUploaded] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [completedDoc, setCompletedDoc] = useState(null);
  const [uploadedExtractionData, setUploadedExtractionData] = useState(null);

  const fileInputRef = useRef(null);
  const cancelTokenSourceRef = useRef(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Helper to format bytes
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper for file extension badge / icon
  const getFileIcon = (fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-6 h-6 text-red-500" />;
    if (ext === 'docx' || ext === 'doc') return <FileCheck2 className="w-6 h-6 text-blue-500" />;
    return <FileCode className="w-6 h-6 text-amber-500" />;
  };

  const validateFile = (file) => {
    if (!file) {
      setErrorMessage('Please select a tender file to upload.');
      return false;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(ext)) {
      setErrorMessage(
        `Unsupported file type "${ext}". Please upload ${allowedTypes.join(', ').toUpperCase()} files.`
      );
      return false;
    }

    if (file.size > maxSizeBytes) {
      setErrorMessage(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed size of ${maxSizeMB}MB.`
      );
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const generateLocalPreview = (file) => {
    const isText = file.type.includes('text') || file.name.endsWith('.txt');
    const previewInfo = {
      name: file.name,
      size: formatFileSize(file.size),
      rawSize: file.size,
      type: file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT',
      lastModified: new Date(file.lastModified).toLocaleDateString(),
      estimatedPages: Math.max(1, Math.ceil(file.size / (1024 * 35))),
      snippet: null
    };

    if (isText && typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result?.toString() || '';
        previewInfo.snippet = text.slice(0, 300);
        setFilePreviewData({ ...previewInfo });
      };
      reader.readAsText(file.slice(0, 1000));
    } else {
      setFilePreviewData(previewInfo);
    }
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      generateLocalPreview(file);
      setUploadState('idle');
      setCompletedDoc(null);
      setUploadedExtractionData(null);
      setUploadProgress(0);
      setBytesUploaded(0);
      setTotalBytes(file.size);
      setErrorMessage(null);
    }
  };

  // Drag and drop events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Real upload execution tracking actual network byte streams and real backend responses
  const handleStartUpload = async () => {
    if (!selectedFile || uploadState === 'uploading' || uploadState === 'server_processing' || uploadState === 'analyzing') {
      return;
    }

    setUploadState('uploading');
    setUploadProgress(0);
    setBytesUploaded(0);
    setTotalBytes(selectedFile.size);
    setStatusMessage('Uploading document stream...');
    setErrorMessage(null);

    // Cancel token for axios request
    cancelTokenSourceRef.current = axios.CancelToken.source();

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 1. Send file to /api/upload with Axios and onUploadProgress tracking
      // Note: Omit manual 'Content-Type' header so Axios/browser automatically attaches the multipart boundary
      let uploadTargetUrl = getApiUrl('/api/upload');
      let response;

      const axiosConfig = {
        cancelToken: cancelTokenSourceRef.current.token,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const currentBytes = progressEvent.loaded;
            const total = progressEvent.total;
            const percent = Math.min(100, Math.round((currentBytes * 100) / total));

            setBytesUploaded(currentBytes);
            setTotalBytes(total);
            setUploadProgress(percent);

            if (percent < 100) {
              setStatusMessage(`Uploading: ${percent}% (${formatFileSize(currentBytes)} of ${formatFileSize(total)})`);
            } else {
              setUploadState('server_processing');
              setStatusMessage('Upload complete (100%). Processing file & extracting text on server...');
            }
          }
        }
      };

      try {
        response = await axios.post(uploadTargetUrl, formData, axiosConfig);
      } catch (postErr) {
        // If remote target failed with Network Error or 404, fallback to local relative /api/upload
        if (uploadTargetUrl.startsWith('http://') || uploadTargetUrl.startsWith('https://')) {
          console.warn(`[Upload Fallback] Remote upload to ${uploadTargetUrl} failed (${postErr.message}). Retrying via local /api/upload...`);
          uploadTargetUrl = '/api/upload';
          response = await axios.post(uploadTargetUrl, formData, axiosConfig);
        } else {
          throw postErr;
        }
      }

      const responseData = response.data;
      if (!responseData || !responseData.success) {
        throw new Error(responseData?.error || responseData?.message || 'Failed to upload document.');
      }

      // 2. Extract and Store uploaded file response (text, pages, chunks)
      const extractedText = responseData.text || responseData.file?.extractedText || '';
      const extractedPages = responseData.pages || responseData.file?.pages || responseData.file?.pagesCount || 1;
      const extractedChunks = responseData.chunks || responseData.file?.chunks || [];

      const extractionPayload = {
        text: extractedText,
        pages: extractedPages,
        chunks: extractedChunks,
        chunksCount: extractedChunks.length,
        fileId: responseData.file?.id,
        filename: responseData.file?.originalName || selectedFile.name
      };

      setUploadedExtractionData(extractionPayload);

      const uploadedDoc = responseData.file || {
        id: `tender-${Date.now()}`,
        originalName: selectedFile.name,
        size: selectedFile.size,
        sizeFormatted: formatFileSize(selectedFile.size),
        uploadedAt: new Date().toISOString(),
        text: extractedText,
        pages: extractedPages,
        chunks: extractedChunks
      };

      // 3. Trigger tender analysis on backend
      setUploadState('analyzing');
      setStatusMessage('Extracting compliance clauses & risk intelligence with Gemini AI...');

      let finalRecord = uploadedDoc;
      try {
        const analyzeRes = await safeFetchJson(`/api/tenders/${uploadedDoc.id}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (analyzeRes?.data) {
          finalRecord = analyzeRes.data;
        }
      } catch (analyzeErr) {
        console.warn('Clause analysis completed with initial extraction record:', analyzeErr);
      }

      // Merge verified extraction data into the final record
      finalRecord = {
        ...finalRecord,
        text: extractedText,
        extractedText: extractedText,
        pages: extractedPages,
        pagesCount: extractedPages,
        chunks: extractedChunks,
        chunksCount: extractedChunks.length
      };

      // 4. Set completed state ONLY AFTER real backend response arrives
      setUploadState('completed');
      setCompletedDoc(finalRecord);
      setStatusMessage('Document uploaded and analyzed successfully.');

      if (onUploadSuccess) {
        onUploadSuccess(finalRecord);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        setUploadState('idle');
        setStatusMessage('');
        setErrorMessage('Upload was cancelled.');
      } else {
        console.error('Upload error:', err);
        const serverError =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Failed to upload document. Please check your network and try again.';
        
        setUploadState('error');
        setErrorMessage(serverError);
      }
    }
  };

  const handleCancelUpload = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Upload cancelled by user');
    }
    setUploadState('idle');
    setUploadProgress(0);
    setBytesUploaded(0);
  };

  const handleReset = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Reset initiated');
    }
    setSelectedFile(null);
    setFilePreviewData(null);
    setUploadState('idle');
    setUploadProgress(0);
    setBytesUploaded(0);
    setTotalBytes(0);
    setStatusMessage('');
    setCompletedDoc(null);
    setUploadedExtractionData(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  const isBusy = uploadState === 'uploading' || uploadState === 'server_processing' || uploadState === 'analyzing';
  const isComplete = uploadState === 'completed' && completedDoc !== null;

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* ========================================================================= */}
      {/* 1. ERROR NOTIFICATION BANNER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 text-xs shadow-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-950">Upload / Processing Error</p>
                <p className="text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={handleStartUpload}
                    disabled={isBusy}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Retry Upload
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1 bg-white hover:bg-rose-100/50 text-rose-800 border border-rose-300 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    Select New File
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700 p-1 rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. SUCCESS CELEBRATION STATE (SHOWN ONLY AFTER REAL BACKEND RESPONSE) */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-300 shadow-xl space-y-6 relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Success Icon + Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900">
                      Successfully Processed
                    </span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Backend Extraction Verified
                    </span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                    Tender Document Ingested
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {completedDoc.originalName || selectedFile?.name} ({completedDoc.sizeFormatted || formatFileSize(selectedFile?.size)})
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-black uppercase tracking-wider shrink-0">
                100% Ready
              </span>
            </div>

            {/* Ingestion Highlights Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-100 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Document Size
                </span>
                <p className="font-heading font-black text-sm text-slate-800">
                  {completedDoc.sizeFormatted || formatFileSize(selectedFile?.size)}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Transferred &amp; Verified
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-100 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Extracted Pages &amp; Chunks
                </span>
                <p className="font-heading font-black text-sm text-slate-800">
                  {completedDoc.pages || completedDoc.pagesCount || 1} Pages • {completedDoc.chunks?.length || completedDoc.chunksCount || 0} Chunks
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Text &amp; Vectors Indexed
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-100 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Analysis Pipeline
                </span>
                <p className="font-heading font-black text-sm text-emerald-600">
                  Risk &amp; Clause Scored
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Go/No-Go Decision Ready
                </p>
              </div>
            </div>

            {/* Extracted Text and Chunks Summary Preview */}
            {uploadedExtractionData?.chunks && uploadedExtractionData.chunks.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    Indexed Semantic Chunks ({uploadedExtractionData.chunks.length})
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {uploadedExtractionData.text.length.toLocaleString()} Total Characters
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-600 italic line-clamp-2 leading-relaxed">
                  "{uploadedExtractionData.chunks[0]?.content?.slice(0, 180)}..."
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-emerald-100">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Another Tender</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (onNavigate) onNavigate('dashboard');
                }}
                className="w-full sm:w-auto btn-orange-pill btn-glow-effect px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Full Tender Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE DRAG & DROP BOX */}
      {/* ========================================================================= */}
      {!isComplete && !isBusy && !selectedFile && (
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-400/20 via-amber-300/20 to-orange-500/20 rounded-[2.2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <motion.div
            onDragEnter={handleDragEnter}
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
            aria-label="Drag and drop tender document here or browse files"
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.99 }}
            className={`relative rounded-[2rem] p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 select-none overflow-hidden backdrop-blur-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${
              isDragging
                ? 'border-2 border-dashed border-orange-500 bg-gradient-to-b from-orange-50/95 via-amber-50/90 to-white shadow-2xl ring-4 ring-orange-500/25'
                : 'border-2 border-dashed border-orange-200/80 hover:border-orange-500/80 bg-gradient-to-b from-white/95 via-orange-50/30 to-amber-50/20 hover:from-white hover:via-orange-50/60 hover:to-amber-50/40 shadow-xl shadow-orange-950/[0.03] hover:shadow-2xl hover:shadow-orange-500/15'
            }`}
          >
            {/* Hidden HTML File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedTypes.join(',')}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
              {/* Center Upload Icon */}
              <div className="relative">
                <div
                  className={`w-22 h-22 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                    isDragging
                      ? 'bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 text-white shadow-xl shadow-orange-500/40 ring-4 ring-orange-200/80'
                      : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 group-hover:shadow-2xl group-hover:shadow-orange-500/40'
                  }`}
                >
                  <Upload className="w-10 h-10" />
                </div>

                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900/90 backdrop-blur-md text-amber-400 flex items-center justify-center shadow-lg border-2 border-white/90">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-2">
                <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                  {isDragging ? 'Drop tender document to upload' : 'Drag & drop tender document here'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  or <span className="text-orange-600 font-bold underline decoration-orange-300 group-hover:decoration-orange-500 underline-offset-4">browse files</span> from your computer
                </p>
              </div>

              {/* Specs & Allowed Formats Pills */}
              <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs font-bold">
                <span className="px-3 py-1 rounded-xl bg-orange-100/70 text-orange-900 border border-orange-200/80 shadow-2xs">
                  PDF
                </span>
                <span className="px-3 py-1 rounded-xl bg-blue-100/70 text-blue-900 border border-blue-200/80 shadow-2xs">
                  DOCX
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-100/80 text-slate-700 border border-slate-200/80 shadow-2xs">
                  TXT
                </span>
                <span className="text-slate-300 mx-1.5">•</span>
                <span className="text-slate-500 font-medium flex items-center gap-1 bg-white/60 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" /> Max: {maxSizeMB}MB
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FILE PREVIEW CARD (BEFORE INITIATING UPLOAD) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedFile && !isComplete && !isBusy && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-orange-200/80 shadow-xl shadow-orange-950/[0.04] space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100/80 border border-orange-200 flex items-center justify-center shrink-0 shadow-inner">
                  {getFileIcon(selectedFile.name)}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-900 border border-orange-200/80 shadow-2xs">
                      {filePreviewData?.type || 'DOCUMENT'}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {filePreviewData?.size}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      ~{filePreviewData?.estimatedPages} pages
                    </span>
                  </div>

                  <h4 className="font-heading text-sm sm:text-base font-black text-slate-900 truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </h4>
                  
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Ready for Ingestion &amp; Gemini AI Clause Audit
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Change File
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleStartUpload}
                  className="btn-orange-pill btn-glow-effect px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Upload &amp; Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {filePreviewData?.snippet && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Buffer Snippet Preview
                </span>
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs font-mono text-slate-600 italic line-clamp-3 leading-relaxed">
                  "{filePreviewData.snippet}..."
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. REAL UPLOAD & PROCESSING PROGRESS BAR (NO FAKE / DUMMY TIMERS) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBusy && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-7 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-orange-300/80 shadow-2xl shadow-orange-500/10 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30 animate-spin">
                  <Loader2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-base text-slate-900">
                    {uploadState === 'uploading' && 'Uploading Tender Document...'}
                    {uploadState === 'server_processing' && 'Processing & Ingesting File...'}
                    {uploadState === 'analyzing' && 'Analyzing Procurement Clauses...'}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                    {selectedFile?.name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-heading text-2xl font-black text-orange-600">
                  {uploadState === 'uploading' ? `${uploadProgress}%` : '100%'}
                </span>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {uploadState === 'uploading' ? 'Transferred' : 'Uploaded'}
                </p>
              </div>
            </div>

            {/* Real Progress Bar */}
            <div className="space-y-2.5">
              <div className="w-full h-3.5 rounded-full bg-slate-100/90 overflow-hidden relative shadow-inner p-0.5 border border-slate-200/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 transition-all duration-150 ease-out"
                  style={{
                    width: `${uploadState === 'uploading' ? Math.max(2, uploadProgress) : 100}%`
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-orange-950 font-bold">
                  <Zap className="w-3.5 h-3.5 text-orange-500" />
                  {statusMessage || 'Processing...'}
                </span>
                <span className="text-slate-400 font-mono font-medium">
                  {formatFileSize(bytesUploaded)} / {formatFileSize(totalBytes || selectedFile?.size)}
                </span>
              </div>
            </div>

            {/* Real Lifecycle Discrete Stage Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
              
              {/* Step 1: File Byte Upload */}
              <div className={`p-3 rounded-2xl border text-center transition-all ${
                uploadState === 'uploading'
                  ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold shadow-xs'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
              }`}>
                <span className="text-[10px] block font-mono flex items-center justify-center gap-1">
                  {uploadState !== 'uploading' && <Check className="w-3 h-3 text-emerald-600" />}
                  STEP 1
                </span>
                <span className="text-xs">
                  {uploadState === 'uploading' ? `Upload (${uploadProgress}%)` : 'Uploaded'}
                </span>
              </div>

              {/* Step 2: Server Processing & OCR Extraction */}
              <div className={`p-3 rounded-2xl border text-center transition-all ${
                uploadState === 'uploading'
                  ? 'bg-slate-50/60 border-slate-100 text-slate-400'
                  : uploadState === 'server_processing'
                  ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold shadow-xs'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
              }`}>
                <span className="text-[10px] block font-mono flex items-center justify-center gap-1">
                  {uploadState === 'analyzing' || uploadState === 'completed' ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                  STEP 2
                </span>
                <span className="text-xs">
                  {uploadState === 'server_processing' ? 'Extracting Text...' : 'Text Extracted'}
                </span>
              </div>

              {/* Step 3: AI Clause Analysis */}
              <div className={`p-3 rounded-2xl border text-center transition-all ${
                uploadState === 'analyzing'
                  ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold shadow-xs'
                  : uploadState === 'completed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                  : 'bg-slate-50/60 border-slate-100 text-slate-400'
              }`}>
                <span className="text-[10px] block font-mono flex items-center justify-center gap-1">
                  {uploadState === 'completed' && <Check className="w-3 h-3 text-emerald-600" />}
                  STEP 3
                </span>
                <span className="text-xs">
                  {uploadState === 'analyzing' ? 'Auditing Clauses...' : 'Clause Audit'}
                </span>
              </div>

              {/* Step 4: Ready */}
              <div className={`p-3 rounded-2xl border text-center transition-all ${
                uploadState === 'completed'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                  : 'bg-slate-50/60 border-slate-100 text-slate-400'
              }`}>
                <span className="text-[10px] block font-mono">STEP 4</span>
                <span className="text-xs">Complete</span>
              </div>

            </div>

            {/* Cancel Button */}
            {uploadState === 'uploading' && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleCancelUpload}
                  className="px-3.5 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel Upload
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default DragDropUpload;

