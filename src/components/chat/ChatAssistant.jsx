import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  FileText,
  ShieldCheck,
  Info,
  Upload,
  ExternalLink
} from 'lucide-react';
import { PdfViewerModal } from '../pdf/PdfViewerModal';
import { safeFetchJson } from '../../utils/apiHelper';

export const ChatAssistant = ({ tenderId, documentTitle, fileUrl, onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSources, setExpandedSources] = useState({});

  // PDF Viewer Modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfSource, setSelectedPdfSource] = useState({
    page: 1,
    text: '',
    section: '',
    approximatePosition: ''
  });

  const handleOpenPdfViewer = (source) => {
    setSelectedPdfSource({
      page: source?.page || 1,
      text: source?.text || '',
      section: source?.section || '',
      approximatePosition: source?.approximatePosition || ''
    });
    setPdfModalOpen(true);
  };

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'What are the eligibility requirements?',
    'What documents are mandatory for submission?',
    'What is the EMD requirement?',
    'What are the key technical qualifications?',
    'What are the major risks in this tender?',
    'Why did TenderIQ recommend REVIEW?'
  ];

  // Initial welcome message
  useEffect(() => {
    if (tenderId && messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          text: `Hello! I am your TenderIQ AI Assistant. I have indexed the full text of "${documentTitle || 'this tender document'}". Ask me any question and I will provide answers grounded directly in the source document.`,
          sources: [],
          timestamp: new Date()
        }
      ]);
    }
  }, [tenderId, documentTitle]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const toggleSourceExpand = (msgId) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleCopy = (text, msgId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleSend = async (questionText, isRegenerate = false) => {
    const query = questionText || input;
    if (!query || !query.trim() || loading || !tenderId) return;

    const trimmedQuery = query.trim();

    if (!isRegenerate) {
      const userMsgId = `user-${Date.now()}`;
      const userMessage = {
        id: userMsgId,
        sender: 'user',
        text: trimmedQuery,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
    }

    setLoading(true);
    setError(null);

    try {
      const data = await safeFetchJson(`/api/tenders/${tenderId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: trimmedQuery })
      });

      const aiMsgId = `ai-${Date.now()}`;
      const aiMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: data.answer || 'No answer generated.',
        sources: Array.isArray(data.sources) ? data.sources : [],
        userQuery: trimmedQuery,
        timestamp: new Date()
      };

      if (isRegenerate) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          for (let i = newMsgs.length - 1; i >= 0; i--) {
            if (newMsgs[i].sender === 'ai') {
              newMsgs[i] = aiMessage;
              break;
            }
          }
          return newMsgs;
        });
      } else {
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Unable to analyze the tender right now.');
      const errorMsgObj = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Unable to analyze the tender right now. Please try again.',
        isError: true,
        userQuery: trimmedQuery,
        sources: [],
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsgObj]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = (userQuery) => {
    if (!userQuery) {
      const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
      if (lastUserMsg) {
        handleSend(lastUserMsg.text, true);
      }
    } else {
      handleSend(userQuery, true);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `Chat reset. Ask any question about "${documentTitle || 'this tender document'}".`,
        sources: [],
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const formatTime = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format inline bolding (**text**)
  const formatInlineBold = (str) => {
    if (!str) return str;
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Helper to render formatted markdown-style text safely without raw markers
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-1" />;

          // Headings (### or ##)
          if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <h4 key={lineIdx} className="font-heading font-extrabold text-slate-900 text-xs sm:text-sm mt-2 mb-1">
                {formatInlineBold(headingText)}
              </h4>
            );
          }

          // Bullet items (- or *)
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletContent = trimmed.substring(2);
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                <div className="text-slate-800 leading-relaxed font-medium">
                  {formatInlineBold(bulletContent)}
                </div>
              </div>
            );
          }

          // Numbered items (1. 2. etc)
          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numberedMatch) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="font-extrabold text-orange-600 shrink-0">{numberedMatch[1]}.</span>
                <div className="text-slate-800 leading-relaxed font-medium">
                  {formatInlineBold(numberedMatch[2])}
                </div>
              </div>
            );
          }

          return (
            <p key={lineIdx} className="leading-relaxed font-medium text-slate-800">
              {formatInlineBold(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  // Missing Tender Document Empty State
  if (!tenderId) {
    return (
      <div className="glass-card rounded-2xl border border-orange-100 p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <MessageSquare className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-heading font-extrabold text-xl text-slate-900">
            No Tender Document Loaded
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Upload or select a tender document to ask grounded questions, query eligibility rules, extract clause evidence, and jump directly to cited PDF pages.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('upload')}
            className="btn-primary-orange px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Tender Document</span>
          </button>
        )}
      </div>
    );
  }

  const isInitialState = messages.length <= 1 && messages[0]?.id?.startsWith('welcome');

  return (
    <div className="glass-card rounded-2xl border border-orange-100 bg-gradient-to-br from-white via-orange-50/20 to-white shadow-xs overflow-hidden flex flex-col h-[650px] transition-all">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-orange-100/80 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                TenderIQ AI Assistant
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-200 uppercase tracking-wider">
                RAG Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-md font-medium">
              Ask questions about this tender and get answers grounded in the uploaded document.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1.5 font-bold shrink-0"
          title="Reset Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
        
        {/* Empty Suggested Questions Showcase */}
        {isInitialState && (
          <div className="my-2 p-6 rounded-2xl bg-gradient-to-b from-orange-50/60 to-amber-50/40 border border-orange-100/80 text-center space-y-4 animate-fadeIn shadow-2xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-slate-900 text-base">
                Grounded Document Assistant
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                Indexed full text of <span className="font-bold text-slate-800">{documentTitle || 'selected tender document'}</span>. Select a suggested query below to begin:
              </p>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Suggested Questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left max-w-xl mx-auto">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="p-3 rounded-xl bg-white border border-slate-200/90 hover:border-orange-300 hover:bg-orange-50/80 text-slate-800 hover:text-orange-950 text-xs font-semibold transition-all shadow-2xs hover:shadow-xs flex items-start gap-2.5 cursor-pointer group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="leading-snug">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const isSourceExpanded = expandedSources[msg.id];
          const isLastAiMsg = !isUser && index === messages.length - 1;
          const hasSources = Array.isArray(msg.sources) && msg.sources.length > 0;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn group`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs transition-transform group-hover:scale-105 ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : msg.isError
                    ? 'bg-red-100 text-red-600 border border-red-200'
                    : 'bg-orange-500 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`space-y-1.5 max-w-[90%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs relative transition-all ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs font-medium'
                      : msg.isError
                      ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs hover:border-slate-300'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}
                </div>

                {/* Grounding Source Trust Indicator Badge */}
                {!isUser && !msg.isError && (
                  <div className="flex items-center gap-2 pt-0.5 px-1 flex-wrap">
                    {hasSources ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/90 text-emerald-800 border border-emerald-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Grounded in tender document</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <Info className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>No supporting source found in the uploaded tender.</span>
                      </span>
                    )}

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-orange-600 hover:bg-orange-50 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                      title="Copy response to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Regenerate Button */}
                    {(isLastAiMsg || msg.userQuery) && (
                      <button
                        type="button"
                        onClick={() => handleRegenerate(msg.userQuery)}
                        disabled={loading}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-orange-600 hover:bg-orange-50 px-2 py-0.5 rounded-md transition-all cursor-pointer disabled:opacity-50"
                        title="Regenerate Answer"
                      >
                        <RotateCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        <span>Regenerate</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Retrived Citations Card List */}
                {!isUser && hasSources && (
                  <div className="mt-2 rounded-xl bg-slate-50/90 border border-slate-200/80 p-3 text-xs space-y-2 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleSourceExpand(msg.id)}
                      className="flex items-center justify-between w-full text-[11px] font-extrabold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                        Retrieved Document Sources ({msg.sources.length})
                      </span>
                      {isSourceExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {isSourceExpanded && (
                      <div className="space-y-2 pt-1 border-t border-slate-200/60 animate-fadeIn">
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200/70 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span>Source #{idx + 1}</span>
                                {src.page && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                                    Page {src.page}
                                  </span>
                                )}
                                {src.section && (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px] truncate max-w-[160px]" title={src.section}>
                                    {src.section}
                                  </span>
                                )}
                              </div>
                              {src.relevance && (
                                <span className="text-orange-600 font-extrabold shrink-0">
                                  {Math.round((src.relevance || 0.8) * 100)}% relevance
                                </span>
                              )}
                            </div>

                            {src.approximatePosition && (
                              <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <span className="text-orange-500">📍</span>
                                <span>{src.approximatePosition}</span>
                              </div>
                            )}

                            {src.text && (
                              <p className="text-[11px] text-slate-600 italic leading-snug line-clamp-3">
                                "{src.text}"
                              </p>
                            )}

                            <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleOpenPdfViewer(src)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-200/80 transition-colors shadow-2xs cursor-pointer"
                                title="Open PDF Viewer at this page and highlight text snippet"
                              >
                                <FileText className="w-3 h-3 text-amber-600" />
                                <span>View in PDF {src.page ? `(Page ${src.page})` : ''}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Timestamp */}
                <span className={`text-[10px] font-medium text-slate-400 px-1 block ${isUser ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Polished Loading Processing State */}
        {loading && (
          <div className="flex items-start gap-3 flex-row animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4 animate-spin text-orange-600" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-orange-200 text-slate-800 rounded-tl-xs shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-orange-700">TenderIQ is reviewing the tender...</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight font-medium">
                Searching tender clauses and generating grounded answer...
              </p>
            </div>
          </div>
        )}

        {/* Global Error Banner / Retry UI */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => handleRegenerate()}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Bar */}
      <div className="px-4 py-2.5 border-t border-slate-200/60 bg-slate-50/70 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-orange-500" /> Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-900 hover:bg-orange-50 transition-all cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 shadow-2xs hover:shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-orange-100 bg-white/95 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask any question about ${documentTitle || 'this tender document'}...`}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:opacity-50 shadow-2xs font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send query"
            className="btn-primary-orange p-3 rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xs hover:shadow-md transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* PDF Viewer Modal Popup */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        fileUrl={fileUrl || (tenderId ? `/api/tenders/${tenderId}/file` : null)}
        pageNumber={selectedPdfSource.page}
        highlightText={selectedPdfSource.text}
        documentTitle={documentTitle || 'Tender Document'}
        section={selectedPdfSource.section}
        approximatePosition={selectedPdfSource.approximatePosition}
      />

    </div>
  );
};
