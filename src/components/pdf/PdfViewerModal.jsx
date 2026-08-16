import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  FileText,
  Search,
  ExternalLink,
  Highlighter,
  AlertCircle,
  MapPin,
  Maximize2,
  BookOpen,
  Sparkles
} from 'lucide-react';

// Configure pdf.js worker URL
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfViewerModal = ({
  isOpen,
  onClose,
  fileUrl,
  pageNumber = 1,
  highlightText = '',
  documentTitle = 'Tender Document',
  section = null,
  approximatePosition = null
}) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
      const targetPage = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
      setCurrentPage(targetPage);
      setPdfError(false);
      setIsLoading(true);
    }
  }, [isOpen, pageNumber, fileUrl]);

  if (!isOpen) return null;

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setPdfError(false);
    // Ensure currentPage doesn't exceed total pages
    const target = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
    if (target <= numPages) {
      setCurrentPage(target);
    } else {
      setCurrentPage(1);
    }
  };

  const handleDocumentLoadError = (err) => {
    console.warn('PDF load error or fallback triggered:', err);
    setPdfError(true);
    setIsLoading(false);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (numPages ? Math.min(numPages, prev + 1) : prev + 1));
  };

  const zoomIn = () => setScale((prev) => Math.min(2.0, prev + 0.15));
  const zoomOut = () => setScale((prev) => Math.max(0.6, prev - 0.15));
  const resetZoom = () => setScale(1.1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-sm text-slate-100 truncate">
                  {documentTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30 shrink-0">
                  PDF Source Trace
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <span className="text-orange-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Page {currentPage} {numPages ? `of ${numPages}` : ''}
                </span>
                {section && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[200px]" title={section}>{section}</span>
                  </>
                )}
                {approximatePosition && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300 truncate max-w-[180px]">{approximatePosition}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                title="Open original file in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open File</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          {/* Page Navigation */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-700 font-semibold px-2">
              Page {currentPage} {numPages ? `of ${numPages}` : ''}
            </span>
            <button
              onClick={goToNextPage}
              disabled={numPages ? currentPage >= numPages : false}
              className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Source Highlight Badge Indicator */}
          {highlightText && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-medium shadow-2xs max-w-md truncate">
              <Highlighter className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-semibold text-amber-950 shrink-0">Highlighted Source:</span>
              <span className="truncate italic">"{highlightText}"</span>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={zoomOut}
              className="p-1 rounded text-slate-600 hover:bg-slate-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:text-orange-600 transition-colors"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={zoomIn}
              className="p-1 rounded text-slate-600 hover:bg-slate-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Highlighted Quote Banner overlay (always visible inside modal view) */}
        {highlightText && (
          <div className="mx-5 my-3 p-3.5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50/60 rounded-xl border-2 border-amber-300/80 shadow-sm shrink-0">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-amber-950">
                  <span className="flex items-center gap-1">
                    Matched Context Excerpt
                    {pageNumber && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-200/90 text-amber-900 text-[10px]">
                        Page {pageNumber}
                      </span>
                    )}
                  </span>
                  {approximatePosition && (
                    <span className="text-[11px] text-amber-800 font-medium">
                      📍 {approximatePosition}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-800 italic leading-relaxed font-serif bg-yellow-100/70 p-2 rounded-lg border border-yellow-300/60">
                  "{highlightText}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PDF Document Canvas View */}
        <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-auto flex justify-center items-start">
          {fileUrl && !pdfError ? (
            <div className="relative shadow-xl rounded-lg bg-white overflow-hidden border border-slate-300 transition-transform duration-200">
              <Document
                file={fileUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={
                  <div className="p-12 text-center space-y-3 bg-white w-[500px]">
                    <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">Loading PDF document (Page {currentPage})...</p>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  renderAnnotationLayer={false}
                  renderTextLayer={true}
                  className="max-w-full"
                />
              </Document>

              {/* Translucent Yellow Overlay for highlighted text area on the PDF page */}
              {highlightText && (
                <div className="absolute top-12 left-6 right-6 p-4 rounded-xl bg-yellow-300/40 border-2 border-amber-400/80 shadow-lg pointer-events-none backdrop-blur-[1px] animate-pulse">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-1">
                    <Highlighter className="w-3.5 h-3.5 text-amber-700" />
                    <span>Matched AI Source Area (Page {currentPage})</span>
                  </div>
                  <p className="text-xs text-slate-900 font-medium line-clamp-4">
                    "{highlightText}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Fallback View if PDF file URL is missing or fails to render in canvas */
            <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-md border border-slate-200/80 space-y-6">
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-amber-950">PDF Render Fallback Mode</p>
                  <p className="text-amber-800">
                    Displaying extracted document source trace text for Page {currentPage}.
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-l-4 border-amber-500 pl-4 bg-slate-50 p-4 rounded-r-xl">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1 text-orange-600">
                    <BookOpen className="w-4 h-4" /> Page {currentPage}
                  </span>
                  {section && <span className="text-slate-500">{section}</span>}
                </div>

                {highlightText ? (
                  <div className="bg-yellow-100/90 p-3 rounded-lg border border-yellow-300 text-slate-900 text-sm font-serif leading-relaxed">
                    "{highlightText}"
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm italic">
                    Source text excerpt indexed for this page.
                  </p>
                )}
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  TenderIQ RAG Engine • Source Traceability Module
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-medium">
            Page {currentPage} of {numPages || '?'} • PDF Source Location Trace
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};

export default PdfViewerModal;
