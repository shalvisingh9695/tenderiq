import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Search, 
  Briefcase, 
  FileText, 
  Sparkles, 
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  Upload,
  ChevronDown,
  Menu,
  X,
  Scale
} from 'lucide-react';
import { TENDER_CATEGORIES } from '../data/tendersData';

export const Navbar = ({ 
  currentPage, 
  onNavigate, 
  activeBidsCount = 0, 
  onOpenBidsDrawer 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState('All Procurement Sectors');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  const handleNavClick = (page, sectionId) => {
    if (onNavigate) onNavigate(page);
    setMenuOpen(false);

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Brand & Sector Switcher */}
          <div className="flex items-center gap-6">
            
            {/* Logo */}
            <motion.div 
              onClick={() => handleNavClick('home')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tight text-slate-900 flex items-center gap-1">
                  Tender<span className="text-gradient-orange">IQ</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-orange-600 uppercase -mt-1">
                  Legal AI &amp; Tender Intelligence
                </span>
              </div>
            </motion.div>

            {/* Procurement Sector Switcher */}
            <div className="hidden md:flex items-center relative">
              <button
                onClick={() => setSectorOpen(!sectorOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200/80 text-xs font-semibold transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate max-w-[150px]">{currentSector}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <AnimatePresence>
                {sectorOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl border border-orange-100 shadow-xl p-2 z-50"
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase px-3 py-1">
                      Filter by Sector
                    </p>
                    {TENDER_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCurrentSector(cat.name);
                          setSectorOpen(false);
                          const el = document.getElementById('tender-insights-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          currentSector === cat.name
                            ? 'bg-orange-50 text-orange-600 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400">{cat.count}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Center Navigation Actions */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <button
              onClick={() => handleNavClick('home', 'tender-insights-section')}
              className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Tender Cards</span>
            </button>

            <button
              onClick={() => handleNavClick('home', 'upload-section')}
              className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-orange-500" />
              <span>Upload Document</span>
            </button>

            <button
              onClick={() => handleNavClick('home', 'risk-analysis-section')}
              className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Risk Engine</span>
            </button>

            <button
              onClick={() => handleNavClick('home', 'ai-chat-section')}
              className="flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-orange-500" />
              <span>RAG AI Chat</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentPage === 'dashboard' ? 'text-orange-600 font-black' : 'hover:text-orange-600'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Procurement Dashboard</span>
            </button>
          </div>

          {/* Right Action Icons: Active Bids Drawer & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            
            {/* Active Bids Drawer Button */}
            <motion.button
              onClick={onOpenBidsDrawer}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 22px rgba(249, 115, 22, 0.6), 0 4px 14px rgba(249, 115, 22, 0.35)' 
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="btn-orange-pill px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/25 relative group"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Active Bids</span>
              {activeBidsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center font-black text-xs shadow-xs animate-bounce">
                  {activeBidsCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Hamburger Toggle */}
            <div className="relative lg:hidden" ref={menuRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-2xl text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-orange-50 border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-orange-600" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </motion.button>

              {/* Mobile Glass Dropdown Menu */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-orange-100 shadow-2xl p-3 space-y-1.5 z-50"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Legal AI Navigation
                      </span>
                    </div>

                    <button
                      onClick={() => handleNavClick('home', 'tender-insights-section')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-orange-500" />
                      <span>Explore Tender Cards</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('home', 'upload-section')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-orange-500" />
                      <span>Upload Tender RFP</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('home', 'risk-analysis-section')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                      <span>7-Factor Risk Engine</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('home', 'ai-chat-section')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      <span>RAG Legal AI Chat</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-orange-500" />
                      <span>Procurement Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenBidsDrawer();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-slate-100 pt-2 mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <Briefcase className="w-4 h-4 text-orange-500" />
                        <span>Active Bids</span>
                      </div>
                      {activeBidsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black">
                          {activeBidsCount}
                        </span>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
