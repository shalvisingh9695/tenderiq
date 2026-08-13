import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight, X, Trash2 } from 'lucide-react';
import uploadIllustration from '../assets/images/upload_file_illustration_1786553515843.jpg';

export const UploadPage = ({ onUploadSuccess, onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedResult, setUploadedResult] = useState(null);

  const fileInputRef = useRef(null);

  const allowedExtensions = ['.pdf', '.docx', '.txt', '.doc'];

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
    setErrorMessage(null);
    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadedResult(null);
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmitUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

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
                </div>
              </div>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="text-red-400 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

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
                </button>
              </div>
            </div>
          )}

          {/* Drag and Drop Zone */}
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
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
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
                </button>
              </div>
            </div>
          )}

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
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
