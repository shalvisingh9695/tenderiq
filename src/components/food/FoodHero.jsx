import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, Clock, Flame, Tag } from 'lucide-react';

export const FoodHero = ({ onSearch, onExploreMenu }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Indiranagar, Bengaluru');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const trendingTags = ['Hyderabadi Biryani', 'Woodfired Pizza', 'Cheesy Burgers', 'Butter Chicken', 'Tacos'];

  return (
    <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16 bg-gradient-to-b from-orange-50/70 via-white to-transparent">
      {/* Background ambient gradient blurs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.35, 0.5, 0.35]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 right-10 w-96 h-96 bg-gradient-to-br from-orange-400/20 via-amber-300/20 to-red-400/10 rounded-full blur-3xl pointer-events-none -z-10" 
      />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-orange-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Top Announcement Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-900 text-xs font-semibold tracking-wide shadow-xs"
            >
              <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Superfast Delivery • 50% OFF on 1st Order</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">NEW</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
            >
              Craving something <br />
              <span className="text-gradient-orange">delicious right now?</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl"
            >
              Order gourmet meals, authentic biryanis, and street treats from top-rated kitchens delivered piping hot to your doorstep in 30 minutes.
            </motion.p>

            {/* Search & Location Bar (Zomato/Swiggy Style) with Smooth Elevate */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              whileHover={{ borderColor: 'rgba(249, 115, 22, 0.7)' }}
              className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full border border-orange-200/80 shadow-lg shadow-orange-500/10 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 max-w-2xl transition-colors"
            >
              
              {/* Location Select */}
              <div className="flex items-center gap-2 px-3 py-2 text-slate-700 w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
                >
                  <option value="Indiranagar, Bengaluru">Indiranagar, BLR</option>
                  <option value="Koramangala, Bengaluru">Koramangala, BLR</option>
                  <option value="Bandra West, Mumbai">Bandra West, MUM</option>
                  <option value="Connaught Place, Delhi">Connaught Place, DEL</option>
                  <option value="Jubilee Hills, Hyderabad">Jubilee Hills, HYD</option>
                </select>
              </div>

              {/* Input */}
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 px-2 w-full">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for dishes, restaurants, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearch) onSearch(e.target.value);
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none py-1"
                />
              </form>

              {/* CTA Button with Button Hover Glow Effect */}
              <motion.button
                type="button"
                onClick={() => onExploreMenu && onExploreMenu()}
                whileHover={{ 
                  scale: 1.04, 
                  boxShadow: '0 0 24px rgba(249, 115, 22, 0.65), 0 6px 18px rgba(249, 115, 22, 0.4)' 
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full sm:w-auto btn-orange-pill px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Find Food</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Trending Tags with Hover Pop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center flex-wrap gap-2 text-xs text-slate-500 pt-1"
            >
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> Popular:
              </span>
              {trendingTags.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05, backgroundColor: '#fed7aa', color: '#c2410c' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery(tag);
                    if (onSearch) onSearch(tag);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 cursor-pointer text-[11px] font-medium transition-colors"
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>

            {/* Quick Metrics Bar with Subtle Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="pt-3 grid grid-cols-3 gap-3 border-t border-slate-100 max-w-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">25–30 Mins</p>
                  <p className="text-[11px] text-slate-500">Average Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">500+ Kitchens</p>
                  <p className="text-[11px] text-slate-500">Verified Quality</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">100% Fresh</p>
                  <p className="text-[11px] text-slate-500">Safety Assured</p>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Hero Visual Cards Showcase with Spring & Floating Elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-5 relative mt-4 lg:mt-0"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Rounded Hero Food Image Card with Hover Scale */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="soft-food-card p-3 rounded-3xl overflow-hidden shadow-2xl relative group bg-white border-2 border-orange-100 cursor-pointer"
              >
                <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                    alt="Delicious Gourmet Meals"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-orange-600 flex items-center gap-1 shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    <span>#1 TRENDING PLATTER</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-sm sm:text-base font-bold">Royal Chef's Charcoal Grill Feast</p>
                    <p className="text-xs text-orange-200 font-medium">Smoked tikkas, fragrant saffron rice &amp; dips</p>
                  </div>
                </div>

                {/* Floating Soft Badge 1: 30 Mins Speed with Float Animation */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-orange-200 shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/30">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">30 Min Delivery</p>
                    <p className="text-[10px] text-slate-500">Live GPS tracking</p>
                  </div>
                </motion.div>

                {/* Floating Soft Badge 2: Rating with Float Animation */}
                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-orange-200 shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-emerald-500/30">
                    ★ 4.9
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">45k+ Happy Foodies</p>
                    <p className="text-[10px] text-slate-500">Real customer ratings</p>
                  </div>
                </motion.div>

              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
