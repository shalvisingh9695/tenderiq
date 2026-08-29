import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Mail, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale, 
  Linkedin, 
  Twitter, 
  Github, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80 items-start">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={() => onNavigate && onNavigate('home')}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                <Flame className="w-6 h-6 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-tight text-white flex items-center gap-1">
                  Tender<span className="text-gradient-orange">IQ</span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-orange-400 uppercase -mt-1">
                  Legal AI &amp; Tender Risk Intelligence
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering enterprise bidding teams, contractors, and legal counsels with instant tender extraction, 7-factor risk scoring, and zero-hallucination RAG clause citations.
            </p>

            {/* Social & Compliance Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#linkedin" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-500 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-500 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#github" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-500 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter / Procurement Intelligence Dispatch */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h3 className="font-heading font-bold text-white text-base sm:text-lg">
                Receive Weekly High-Value Tender &amp; RFP Risk Bulletins
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Subscribe to automated alerts for infrastructure, defense, smart grid, and IT tenders matching your turnover profile.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter corporate email (e.g. counsel@company.com)..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-xs sm:text-sm text-white px-4 py-3 rounded-full border border-slate-700 focus:outline-none focus:border-orange-500 placeholder:text-slate-500 font-medium"
              />
              <button
                type="submit"
                className="w-full sm:w-auto btn-orange-pill px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Verified! You have been subscribed to TenderIQ Weekly Intelligence.
              </p>
            )}
          </div>

        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-slate-800/80 text-xs">
          
          {/* Col 1: Platform Modules */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              AI Platform
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => scrollToSection('upload-section')} className="hover:text-orange-400 transition-colors text-left">Document Ingestion &amp; OCR</button></li>
              <li><button onClick={() => scrollToSection('tender-insights-section')} className="hover:text-orange-400 transition-colors text-left">Tender Insights Cards</button></li>
              <li><button onClick={() => scrollToSection('risk-analysis-section')} className="hover:text-orange-400 transition-colors text-left">7-Factor Risk Engine</button></li>
              <li><button onClick={() => scrollToSection('ai-chat-section')} className="hover:text-orange-400 transition-colors text-left">RAG Legal AI Assistant</button></li>
              <li><button onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-orange-400 transition-colors text-left">Procurement Dashboard</button></li>
            </ul>
          </div>

          {/* Col 2: Sectors & Tenders */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Procurement Sectors
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Highways, Roads &amp; EPC Packages</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Power &amp; Smart Grid AMI Rollouts</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Defense Radar &amp; Tactical Networks</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Railway DWDM Optical Fiber</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Healthcare &amp; GovTech Cloud</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Water Supply &amp; Desalination EPC</span></li>
            </ul>
          </div>

          {/* Col 3: Legal & Risk Tools */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Risk &amp; Compliance
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Liquidated Damages Auditor</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Turnover &amp; Financial Ratio Check</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Defect Liability Period Matrix</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">EMD &amp; Performance BG Calculator</span></li>
              <li><span className="hover:text-orange-400 transition-colors cursor-pointer">Pre-Bid Query Draft Generator</span></li>
            </ul>
          </div>

          {/* Col 4: Enterprise & Contact */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Security &amp; Support
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <p className="text-white font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  SOC-2 Type II Certified
                </p>
                <p className="text-[11px] text-slate-400">
                  Zero training on customer RFP documents.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-orange-400" /> +91 (80) 4122-7800 (Enterprise Support)</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-orange-400" /> legal-ai@tenderiq.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            Built for enterprise procurement officers and contract counsels.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">SOC-2 Security Whitepaper</span>
            <span className="hover:text-slate-400 cursor-pointer">ISO 27001</span>
          </div>
          <p>© 2026 TenderIQ Legal AI Systems. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
