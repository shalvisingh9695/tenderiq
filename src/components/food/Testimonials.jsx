import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2, Heart, Sparkles } from 'lucide-react';

export const TESTIMONIALS_DATA = [
  {
    id: 'test-1',
    name: 'Ananya Sharma',
    role: 'Verified Top Foodie • 140+ Orders',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    tag: 'Biryani & Kebabs Fan',
    comment: 'The Dum Pukht Biryani arrived burning hot in 22 minutes! The packaging had an unbroken seal and the aroma blew everyone away. The fastest delivery in town!',
    favoriteDish: 'Dum Pukht Royal Biryani'
  },
  {
    id: 'test-2',
    name: 'Rohan Mehta',
    role: 'Verified Gourmet Explorer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    tag: 'Artisan Pizza Lover',
    comment: 'Zomato/Swiggy level tracking with even better food quality curation. Little Napoli’s Truffle Pizza crust was super crisp and bubbly. 10/10 recommend!',
    favoriteDish: 'Burrata Truffle Pizza'
  },
  {
    id: 'test-3',
    name: 'Pooja Venkatesh',
    role: 'Fitness Enthusiast • Clean Greens',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    tag: 'Healthy Bowls Regular',
    comment: 'Finally an app that delivers fresh avocado and clean salads without soggy dressings. The eco-friendly packaging is a huge plus for conscious eaters.',
    favoriteDish: 'Avocado Goddess Bowl'
  }
];

export const Testimonials = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
          Loved by Food Lovers
        </div>
        
        <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          What Our <span className="text-gradient-orange">Hungry Community</span> Says
        </h2>
        
        <p className="text-slate-500 text-xs sm:text-sm mt-2">
          Real feedback from verified foodies who trust us for their daily cravings
        </p>
      </motion.div>

      {/* Testimonials 3-Card Grid with Staggered Scroll Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {TESTIMONIALS_DATA.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, scale: 1.025 }}
            className="soft-food-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-4 group relative cursor-pointer"
          >
            {/* Top Stars & Quote Mark */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-orange-200 group-hover:text-orange-400 transition-colors" />
            </div>

            {/* Comment Body */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-normal">
              "{item.comment}"
            </p>

            {/* Favorite Dish Chip */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Favorite order:</span>
              <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                {item.favoriteDish}
              </span>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-2">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-200"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    {item.name}
                  </h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {item.role}
                </p>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      {/* Trust Banner with Button Hover Glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45 }}
        className="mt-12 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading text-xl sm:text-2xl font-black">
            Ready to taste the difference?
          </h3>
          <p className="text-orange-100 text-xs sm:text-sm">
            Join over 100,000+ happy eaters across Bengaluru, Mumbai, Delhi &amp; Hyderabad.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <motion.button 
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 0 25px rgba(255, 255, 255, 0.7), 0 8px 20px rgba(0, 0, 0, 0.2)' 
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-3 rounded-full bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs sm:text-sm shadow-md cursor-pointer"
          >
            Claim 50% Off Code: FIRSTMEAL
          </motion.button>
        </div>
      </motion.div>

    </section>
  );
};
