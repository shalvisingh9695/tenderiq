import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  FileText, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Download, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Briefcase, 
  Plus, 
  Layers,
  Sparkles,
  Scale
} from 'lucide-react';
import { getSafeRiskScore } from '../../utils/textHelper';

export const ActiveBidsDrawer = ({ 
  isOpen, 
  onClose, 
  activeBids = [], 
  onRemoveBid, 
  onClearBids,
  onOpenTender 
}) => {
  const [isExported, setIsExported] = useState(false);

  const totalValue = activeBids.reduce((acc, bid) => acc + (bid.value || 0), 0);
  const totalEMD = activeBids.reduce((acc, bid) => acc + (bid.emd || 0), 0);

  const formatCrores = (amount) => {
    if (!amount) return '₹0.0 Cr';
    const cr = (amount / 10000000).toFixed(1);
    return `₹${cr} Cr`;
  };

  const handleExportDossier = () => {
    setIsExported(true);
    setTimeout(() => setIsExported(false), 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-orange-100 flex items-center justify-between bg-orange-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-base">
                      Active Bids Pipeline
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {activeBids.length} {activeBids.length === 1 ? 'tender' : 'tenders'} under tracking
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {isExported ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="font-heading text-xl font-black text-slate-900">
                      Bid Dossier Generated!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                      Executive compliance matrix, EMD requirements, and risk summary exported for your executive committee.
                    </p>
                    <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800">
                      Total Pipeline: {formatCrores(totalValue)} • {activeBids.length} RFPs
                    </div>
                  </motion.div>
                ) : activeBids.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <h4 className="font-heading font-bold text-slate-900 text-base">
                      No Tenders in Your Pipeline
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore active RFPs and click "TRACK BID" to monitor deadlines, calculate total EMD security, and audit risk.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={onClose}
                      className="btn-orange-pill px-6 py-2.5 text-xs font-bold mt-2 cursor-pointer inline-flex items-center gap-2"
                    >
                      Explore Active Tenders
                    </motion.button>
                  </div>
                ) : (
                  <>
                    {/* Pipeline Summary Strip */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          Total Pipeline Value
                        </span>
                        <p className="font-heading text-base font-black text-slate-900">
                          {formatCrores(totalValue)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          Total EMD Required
                        </span>
                        <p className="font-heading text-base font-black text-orange-600">
                          {formatCrores(totalEMD)}
                        </p>
                      </div>
                    </div>

                    {/* List of Tracked Tenders */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Tracked Bids ({activeBids.length})</span>
                        <button
                          onClick={onClearBids}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Clear All
                        </button>
                      </div>

                      {activeBids.map((bid) => (
                        <motion.div
                          key={bid.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="truncate max-w-[200px]">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {bid.title}
                                </p>
                                <p className="text-[11px] text-slate-500 font-semibold">
                                  {bid.valueFormatted} • EMD: {bid.emdFormatted}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => onRemoveBid && onRemoveBid(bid.id)}
                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <span className="text-slate-500 flex items-center gap-1 font-semibold">
                              <Clock className="w-3 h-3 text-orange-500" />
                              Due in {bid.daysRemaining} days
                            </span>

                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              bid.riskLevel === 'low'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              Risk: {getSafeRiskScore(bid)}/100
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick Bid Checklist */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        <span>Pre-Bid Preparation Checklist</span>
                      </p>
                      <div className="space-y-1 text-[11px] text-slate-600">
                        <p>✓ CA Audited Balance Sheets ready for upload</p>
                        <p>✓ Bank Guarantee limit verified with treasury</p>
                        <p>✓ Class-I Local Supplier Undertaking signed</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer Actions */}
              {activeBids.length > 0 && !isExported && (
                <div className="p-4 sm:p-5 border-t border-orange-100 bg-white space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExportDossier}
                    className="w-full btn-orange-pill py-3.5 px-5 text-sm font-bold flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-100">
                        Pipeline Value
                      </span>
                      <span className="text-base font-black text-white font-heading">
                        {formatCrores(totalValue)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
                      <span>EXPORT BID DOSSIER</span>
                      <Download className="w-4 h-4" />
                    </div>
                  </motion.button>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
