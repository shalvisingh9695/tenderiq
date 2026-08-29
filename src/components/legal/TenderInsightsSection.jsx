import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  Search, 
  Filter, 
  Grid, 
  Cpu, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_TENDERS, TENDER_CATEGORIES } from '../../data/tendersData';
import { TenderCard } from '../cards/TenderCard';
import { InsightCard } from '../cards/InsightCard';
import { TenderDetailsModal } from '../cards/TenderDetailsModal';
import { getSafeRiskScore } from '../../utils/textHelper';

export const TenderInsightsSection = ({ 
  tenders = SAMPLE_TENDERS,
  onSelectTender,
  onAddToBids,
  activeBids = [],
  onOpenChatWithTender
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'high-val' | 'low-risk' | 'go-bid' | 'closing-soon'
  const [sortBy, setSortBy] = useState('value-desc'); // 'value-desc' | 'deadline-asc' | 'risk-asc'
  
  // Card Display Mode: 'tender' (Tender Cards), 'insight' (Insight Cards), 'dual' (Side-by-Side Dual View)
  const [cardViewMode, setCardViewMode] = useState('tender');

  // Selected tender for full details modal
  const [modalTender, setModalTender] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine built-in tenders with any dynamically uploaded tenders passed via props
  const allTenders = tenders && tenders.length > 0 ? tenders : SAMPLE_TENDERS;

  // Filter logic
  const filteredTenders = allTenders.filter((tender) => {
    // Category match
    const categoryMatch = 
      activeCategory === 'all' || 
      tender.sectorCode === activeCategory || 
      (activeCategory === 'infra' && tender.sector?.toLowerCase().includes('infra')) ||
      (activeCategory === 'energy' && tender.sector?.toLowerCase().includes('energy')) ||
      (activeCategory === 'defense' && tender.sector?.toLowerCase().includes('defense')) ||
      (activeCategory === 'telecom' && tender.sector?.toLowerCase().includes('telecom')) ||
      (activeCategory === 'govtech' && tender.sector?.toLowerCase().includes('health'));

    // Keyword match
    const keywordMatch =
      !searchKeyword ||
      tender.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      tender.authority.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      tender.nitNumber?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      tender.sector?.toLowerCase().includes(searchKeyword.toLowerCase());

    // Filter pill match
    let filterMatch = true;
    if (filterType === 'high-val') filterMatch = tender.value >= 1000000000; // >= 100 Cr
    if (filterType === 'low-risk') filterMatch = tender.riskLevel === 'low' || getSafeRiskScore(tender) <= 30;
    if (filterType === 'go-bid') filterMatch = tender.recommendation === 'GO';
    if (filterType === 'closing-soon') filterMatch = tender.daysRemaining <= 20;

    return categoryMatch && keywordMatch && filterMatch;
  });

  // Sort logic
  const sortedTenders = [...filteredTenders].sort((a, b) => {
    if (sortBy === 'value-desc') return (b.value || 0) - (a.value || 0);
    if (sortBy === 'deadline-asc') return (a.daysRemaining || 0) - (b.daysRemaining || 0);
    if (sortBy === 'risk-asc') return getSafeRiskScore(a) - getSafeRiskScore(b);
    return 0;
  });

  const handleOpenDetails = (tender) => {
    setModalTender(tender);
    setIsModalOpen(true);
    if (onSelectTender) onSelectTender(tender);
  };

  const handleInspectInsights = (tender) => {
    if (onSelectTender) onSelectTender(tender);
  };

  return (
    <section id="tender-insights-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Title Header + View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Modern SaaS Cards • TenderIQ Engine
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Procurement Intelligence &amp; Live RFP Cards
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Explore AI-audited government tenders with soft shadows, hover scaling, icon headers, and gradient borders.
          </p>
        </div>

        {/* Card View Switcher (Tender Cards vs Insight Cards vs Dual View) */}
        <div className="flex items-center p-1.5 rounded-2xl bg-white border border-orange-200/80 shadow-xs">
          
          {/* 1. Tender Cards Tab */}
          <button
            onClick={() => setCardViewMode('tender')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              cardViewMode === 'tender'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tender Cards</span>
          </button>

          {/* 2. Insight Cards Tab */}
          <button
            onClick={() => setCardViewMode('insight')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              cardViewMode === 'insight'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Insight Cards</span>
          </button>

          {/* 3. Dual Comparison Tab */}
          <button
            onClick={() => setCardViewMode('dual')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              cardViewMode === 'dual'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dual View</span>
          </button>

        </div>
      </div>

      {/* Sector Category Pills */}
      <div className="flex items-center flex-wrap gap-2 mb-6">
        {TENDER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white border border-orange-100 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search inside tenders */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search tenders, NIT, authority..."
            className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-3 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>

        {/* Quick Filter Status Badges */}
        <div className="flex items-center flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              filterType === 'all'
                ? 'bg-orange-500 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-orange-50'
            }`}
          >
            All ({allTenders.length})
          </button>
          <button
            onClick={() => setFilterType('high-val')}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              filterType === 'high-val'
                ? 'bg-orange-500 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-orange-50'
            }`}
          >
            High Value (&gt;₹100 Cr)
          </button>
          <button
            onClick={() => setFilterType('low-risk')}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              filterType === 'low-risk'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            Low Risk Only
          </button>
          <button
            onClick={() => setFilterType('go-bid')}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              filterType === 'go-bid'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Go Recommendation
          </button>
          <button
            onClick={() => setFilterType('closing-soon')}
            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              filterType === 'closing-soon'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-red-50'
            }`}
          >
            Closing &lt; 20 Days
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 text-xs font-bold text-slate-700 py-1.5 px-3 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="value-desc">Highest Value (₹)</option>
            <option value="deadline-asc">Nearest Deadline</option>
            <option value="risk-asc">Lowest Risk First</option>
          </select>
        </div>

      </div>

      {/* Empty State */}
      {sortedTenders.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-orange-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 text-base">
            No tenders found matching criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting "All Sectors" to explore available procurement packages.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchKeyword('');
              setFilterType('all');
            }}
            className="btn-orange-pill px-5 py-2 text-xs font-bold mt-2 cursor-pointer inline-flex items-center gap-2"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Dynamic Cards Display based on View Mode with Smooth Animation Transitions */
        <AnimatePresence mode="wait">
          {/* MODE 1: TENDER CARDS (Title, Deadline, Budget, Risk Score badge, View Details button) */}
          {cardViewMode === 'tender' && (
            <motion.div
              key="tender-cards"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {sortedTenders.map((tender) => {
                const isSavedInBids = activeBids.some((b) => b.id === tender.id);
                return (
                  <TenderCard
                    key={tender.id}
                    tender={tender}
                    onViewDetails={handleOpenDetails}
                    onAddToBids={onAddToBids}
                    isSavedInBids={isSavedInBids}
                    onOpenChat={onOpenChatWithTender}
                  />
                );
              })}
            </motion.div>
          )}

          {/* MODE 2: INSIGHT CARDS (Eligibility, Financial Risk, Technical Score) */}
          {cardViewMode === 'insight' && (
            <motion.div
              key="insight-cards"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {sortedTenders.map((tender) => (
                <InsightCard
                  key={tender.id}
                  tender={tender}
                  onInspectInsights={handleInspectInsights}
                  onOpenChat={onOpenChatWithTender}
                  onSelectTender={onSelectTender}
                />
              ))}
            </motion.div>
          )}

          {/* MODE 3: DUAL VIEW (Both Tender Card + Insight Card Side by Side) */}
          {cardViewMode === 'dual' && (
            <motion.div
              key="dual-cards"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {sortedTenders.map((tender) => {
                const isSavedInBids = activeBids.some((b) => b.id === tender.id);
                return (
                  <div 
                    key={tender.id}
                    className="p-4 sm:p-6 rounded-3xl bg-orange-50/30 border border-orange-200/60 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                        <h4 className="font-heading font-black text-sm text-slate-800 uppercase tracking-wider">
                          Package: {tender.shortAuthority || tender.authority} • {tender.sector}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-bold">
                        NIT: {tender.nitNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Tender Card */}
                      <div className="flex flex-col">
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-orange-500" />
                          <span>1. Tender Card (Commercial &amp; Deadline Overview)</span>
                        </div>
                        <TenderCard
                          tender={tender}
                          onViewDetails={handleOpenDetails}
                          onAddToBids={onAddToBids}
                          isSavedInBids={isSavedInBids}
                          onOpenChat={onOpenChatWithTender}
                        />
                      </div>

                      {/* Right: Insight Card */}
                      <div className="flex flex-col">
                        <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>2. Insight Card (Eligibility, Financial Risk &amp; Technical Score)</span>
                        </div>
                        <InsightCard
                          tender={tender}
                          onInspectInsights={handleInspectInsights}
                          onOpenChat={onOpenChatWithTender}
                          onSelectTender={onSelectTender}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Tender Details Full Modal Dialog */}
      <TenderDetailsModal
        tender={modalTender}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToBids={onAddToBids}
        isSavedInBids={modalTender ? activeBids.some((b) => b.id === modalTender.id) : false}
        onOpenChat={onOpenChatWithTender}
      />

    </section>
  );
};

