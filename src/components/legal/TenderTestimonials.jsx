import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Award, 
  CheckCircle2,
  Building2,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { TESTIMONIALS_DATA } from '../../data/tendersData';

export const TenderTestimonials = () => {
  return (
    <section id="testimonials-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Section 6 • Enterprise Trust &amp; Impact</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Trusted by Fortune 500 Bidding &amp; Legal Teams
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
          Over 200+ major EPC contractors, defense manufacturers, and government suppliers rely on TenderIQ to safeguard margins and win bids.
        </p>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {TESTIMONIALS_DATA.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            className="soft-tender-card p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-white border border-orange-100/90 shadow-sm"
          >
            {/* Stars & Metric Pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full border border-orange-200">
                {t.savedTime}
              </span>
            </div>

            {/* Testimonial Quote */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-normal">
              "{t.text}"
            </p>

            {/* User Profile Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
              <img
                src={t.image}
                alt={t.name}
                className="w-11 h-11 rounded-2xl object-cover border border-orange-200 shadow-xs flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <h4 className="font-heading font-bold text-slate-900 text-sm truncate">
                  {t.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {t.role}
                </p>
                <p className="text-[10px] text-orange-600 font-bold truncate">
                  {t.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Security & Compliance Bar */}
      <div className="soft-tender-card p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-0 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-black text-sm text-white">
                SOC-2 Type II
              </p>
              <p className="text-[11px] text-slate-400">
                Audited Enterprise Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-black text-sm text-white">
                256-Bit AES Encryption
              </p>
              <p className="text-[11px] text-slate-400">
                Data Encrypted at Rest &amp; Flight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-black text-sm text-white">
                Zero Model Training
              </p>
              <p className="text-[11px] text-slate-400">
                Your Proprietary RFPs Stay Private
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-black text-sm text-white">
                ISO 27001 &amp; GDPR
              </p>
              <p className="text-[11px] text-slate-400">
                Full Statutory Compliance
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
