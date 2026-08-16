import React, { useState, useEffect, useRef } from 'react';
import { FileText, Sparkles, LayoutDashboard, Upload, Menu, X, ChevronRight } from 'lucide-react';

export const Navbar = ({ currentPage, onNavigate, uploadedCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const navItems = [
    { id: 'home', label: 'Home', icon: <FileText className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
  ];

  const handleNavClick = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1">
                Tender<span className="text-gradient-orange">IQ</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-orange-600/90 -mt-1 uppercase">
                AI Procurement
              </span>
            </div>
          </div>

          {/* Hamburger Menu Toggle */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200/80 shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {menuOpen ? (
                  <X className="w-5 h-5 text-orange-600 transition-transform duration-200 rotate-90" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700 transition-transform duration-200" />
                )}
              </div>
            </button>

            {/* Floating Glass Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/70 backdrop-blur-lg border border-orange-100 shadow-xl p-2.5 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Navigation Menu
                  </span>
                </div>
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200/60'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-orange-600' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.id === 'dashboard' && uploadedCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-orange-100 text-orange-700">
                            {uploadedCount}
                          </span>
                        )}
                        <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isActive ? 'text-orange-600 opacity-100' : ''}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

