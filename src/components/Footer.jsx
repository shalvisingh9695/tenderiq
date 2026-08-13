import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-white/60 backdrop-blur-md border-t border-orange-100 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 fill-white/20" />
          </div>
          <span className="font-heading font-bold text-slate-900 text-base tracking-tight">
            Tender<span className="text-gradient-orange">IQ</span>
          </span>
          <span className="text-xs text-slate-400 font-medium ml-2">
            AI-powered Tender & Procurement Assistant
          </span>
        </div>

        {/* Quick Nav */}
        <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-orange-600 transition-colors">
            Home
          </button>
          <button onClick={() => onNavigate('upload')} className="hover:text-orange-600 transition-colors">
            Upload Tender
          </button>
          <button onClick={() => onNavigate('dashboard')} className="hover:text-orange-600 transition-colors">
            Dashboard
          </button>
        </div>

        {/* Phase Info */}
        <div className="text-[11px] text-slate-400 font-medium">
          © 2026 TenderIQ Inc. Phase 1 Foundation.
        </div>

      </div>
    </footer>
  );
};
