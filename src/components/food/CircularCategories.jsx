import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight } from 'lucide-react';

export const CATEGORIES_DATA = [
  {
    id: 'all',
    name: 'All Cuisines',
    count: '150+ Dishes',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'biryani',
    name: 'Biryani',
    count: '42 Outlets',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'pizza',
    name: 'Pizzas',
    count: '38 Outlets',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'burger',
    name: 'Burgers',
    count: '29 Outlets',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: 'thali',
    name: 'North Indian',
    count: '54 Outlets',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=300&q=80',
    color: 'from-yellow-600 to-orange-600'
  },
  {
    id: 'chinese',
    name: 'Asian & Wok',
    count: '31 Outlets',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
    color: 'from-red-600 to-amber-600'
  },
  {
    id: 'healthy',
    name: 'Healthy Bowls',
    count: '25 Outlets',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'dessert',
    name: 'Desserts & Bakes',
    count: '48 Outlets',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'drinks',
    name: 'Shakes & Drinks',
    count: '22 Outlets',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80',
    color: 'from-cyan-500 to-blue-500'
  }
];

export const CircularCategories = ({ activeCategory, onSelectCategory }) => {
  return (
    <section className="py-8 bg-white/60 border-y border-orange-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-orange-100 text-orange-600">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Inspiration For Your First Order
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore mouth-watering cuisines curated by top masterchefs
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer">
            <span>Scroll &amp; Explore</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Circular Layout Grid / Horizontal Scroll */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
          {CATEGORIES_DATA.map((cat, index) => {
            const isSelected = activeCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className="flex flex-col items-center gap-2.5 shrink-0 group cursor-pointer text-center focus:outline-none"
              >
                {/* Circular Avatar Frame */}
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 shadow-lg shadow-orange-500/30 ring-2 ring-orange-400'
                      : 'bg-gradient-to-tr from-slate-200 to-orange-100 group-hover:from-orange-400 group-hover:to-amber-400 group-hover:shadow-md'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5 relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Active Overlay Check */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-orange-600/20 backdrop-blur-2xs flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-white ring-4 ring-orange-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Count */}
                <div className="space-y-0.5">
                  <p
                    className={`text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                      isSelected ? 'text-orange-600 font-extrabold' : 'text-slate-800 group-hover:text-orange-600'
                    }`}
                  >
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {cat.count}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
