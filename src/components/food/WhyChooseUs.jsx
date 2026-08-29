import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Leaf, 
  ShieldCheck, 
  Percent, 
  PackageCheck, 
  Sparkles,
  Flame
} from 'lucide-react';

export const WHY_CHOOSE_US_DATA = [
  {
    id: 'superfast',
    icon: <Zap className="w-6 h-6 text-orange-600" />,
    badge: '30 MIN GUARANTEE',
    title: 'Lightning-Fast Delivery',
    description: 'Precision dispatch algorithms route your meal to the nearest rider for hyper-local delivery in under 30 minutes.',
    accentColor: 'bg-orange-50 border-orange-200 group-hover:border-orange-400'
  },
  {
    id: 'ingredients',
    icon: <Leaf className="w-6 h-6 text-emerald-600" />,
    badge: 'FARM FRESH',
    title: '100% Fresh & Organic',
    description: 'Every restaurant partner is vetted for pristine hygiene ratings, quality audits, and fresh daily ingredient sourcing.',
    accentColor: 'bg-emerald-50 border-emerald-200 group-hover:border-emerald-400'
  },
  {
    id: 'kitchens',
    icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
    badge: 'VERIFIED CHEFS',
    title: '15,000+ Verified Kitchens',
    description: 'From neighborhood hidden gems and local legends to Michelin-starred masterchefs, taste unmatched authentic diversity.',
    accentColor: 'bg-amber-50 border-amber-200 group-hover:border-amber-400'
  },
  {
    id: 'offers',
    icon: <Percent className="w-6 h-6 text-red-600" />,
    badge: 'BEST PRICES',
    title: 'Daily Deals & Cashback',
    description: 'Enjoy exclusive discounts, 1+1 meal passes, zero surge pricing on subscriptions, and instant bank reward drops.',
    accentColor: 'bg-red-50 border-red-200 group-hover:border-red-400'
  },
  {
    id: 'packaging',
    icon: <PackageCheck className="w-6 h-6 text-indigo-600" />,
    badge: 'TAMPER PROOF',
    title: 'Eco & Safe Packaging',
    description: 'Multi-layer thermal insulation and spill-resistant biodegradable containers keep your food steaming hot and intact.',
    accentColor: 'bg-indigo-50 border-indigo-200 group-hover:border-indigo-400'
  },
  {
    id: 'support',
    icon: <Sparkles className="w-6 h-6 text-orange-600" />,
    badge: '24/7 ASSISTANCE',
    title: 'Instant Live Concierge',
    description: 'Direct 24/7 chat support with instant refunds, live rider telemetry, and intelligent real-time order tracking.',
    accentColor: 'bg-orange-50 border-orange-200 group-hover:border-orange-400'
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Fade + Slide Up Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            The Gold Standard in Food Delivery
          </div>
          
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Foodies Choose <span className="text-gradient-orange">Us Every Day</span>
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            We don't just deliver food — we deliver joy, sizzling aromas, and restaurant-quality experiences straight to your table.
          </p>
        </motion.div>

        {/* 6-Card Grid with Staggered Scroll Animation & Hover Scale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CHOOSE_US_DATA.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.025 }}
              className="soft-food-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 group relative overflow-hidden cursor-pointer"
            >
              {/* Subtle top corner gradient shine on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-400/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-4">
                {/* Icon & Badge Row */}
                <div className="flex items-center justify-between">
                  <motion.div 
                    whileHover={{ scale: 1.12, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-14 h-14 rounded-2xl ${feature.accentColor} border flex items-center justify-center shadow-xs`}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  <span className="text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 uppercase">
                    {feature.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-orange-600 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
