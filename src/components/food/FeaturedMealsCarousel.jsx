import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Clock, Plus, Check, Flame, Heart } from 'lucide-react';

export const MEALS_DATA = [
  {
    id: 'meal-1',
    name: 'Dum Pukht Royal Mutton Biryani',
    restaurant: 'Behrouz Heritage Kitchen',
    category: 'biryani',
    price: 389,
    originalPrice: 520,
    discount: '25% OFF',
    rating: 4.9,
    reviews: '3.4k+',
    deliveryTime: '25-30 min',
    distance: '2.1 km',
    isBestseller: true,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    description: 'Slow-cooked aromatic long grain basmati rice layered with tender mutton & saffron spices.'
  },
  {
    id: 'meal-2',
    name: 'Artisan Burrata & Truffle Pizza',
    restaurant: 'Little Napoli Woodfired Crusts',
    category: 'pizza',
    price: 499,
    originalPrice: 650,
    discount: 'FLAT 50% OFF',
    rating: 4.8,
    reviews: '2.1k+',
    deliveryTime: '20-25 min',
    distance: '1.4 km',
    isBestseller: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-stretched sourdough base, fresh Pugliese burrata, wild mushrooms, and truffle glaze.'
  },
  {
    id: 'meal-3',
    name: 'Double Smoked Texas Smash Burger',
    restaurant: 'The Grand Burger Factory',
    category: 'burger',
    price: 299,
    originalPrice: 380,
    discount: '20% OFF',
    rating: 4.7,
    reviews: '1.8k+',
    deliveryTime: '15-20 min',
    distance: '0.9 km',
    isBestseller: false,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy caramelized double smashed patties, smoked cheddar, caramelized onion relish on brioche.'
  },
  {
    id: 'meal-4',
    name: 'Shoyu Ramen with Chashu & Soft Egg',
    restaurant: 'Tokyo Noodle Bar',
    category: 'chinese',
    price: 420,
    originalPrice: 499,
    discount: 'CHEF CHOICE',
    rating: 4.9,
    reviews: '950+',
    deliveryTime: '30-35 min',
    distance: '3.2 km',
    isBestseller: true,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: '18-hour rich bone broth, handmade alkaline noodles, slow-braised pork belly, and ajitsuke egg.'
  },
  {
    id: 'meal-5',
    name: 'Avocado Green Goddess Grain Bowl',
    restaurant: 'Pure Organics & Clean Greens',
    category: 'healthy',
    price: 349,
    originalPrice: 420,
    discount: '15% OFF',
    rating: 4.8,
    reviews: '1.2k+',
    deliveryTime: '20-25 min',
    distance: '1.8 km',
    isBestseller: false,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Organic quinoa, Hass avocado, edamame, baby spinach, roasted chickpeas with tahini drizzle.'
  },
  {
    id: 'meal-6',
    name: 'Signature Belgian Dark Truffle Cake',
    restaurant: 'The Parisian Bakery',
    category: 'dessert',
    price: 249,
    originalPrice: 320,
    discount: 'BUY 1 GET 1',
    rating: 4.9,
    reviews: '4.7k+',
    deliveryTime: '15-20 min',
    distance: '1.1 km',
    isBestseller: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    description: '70% single-origin Belgian chocolate ganache layered with moist cocoa sponge.'
  }
];

export const FeaturedMealsCarousel = ({ onAddToCart, cartItems = [] }) => {
  const carouselRef = useRef(null);
  const [favorites, setFavorites] = useState(new Set());

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header with Left/Right Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.45 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            Top Recommendations
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Featured Meals &amp; Chef Specials
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Hand-picked dishes loved by over 10,000+ local foodies this week
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#fff7ed', borderColor: '#fdba74' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-orange-600 shadow-xs flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous Meals"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#fff7ed', borderColor: '#fdba74' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-orange-600 shadow-xs flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next Meals"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Carousel Container with Scroll Animation */}
      <motion.div
        ref={carouselRef}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth"
      >
        {MEALS_DATA.map((meal, index) => {
          const inCart = cartItems.find((item) => item.id === meal.id);
          const isFav = favorites.has(meal.id);

          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.025 }}
              className="w-72 sm:w-80 shrink-0 soft-food-card flex flex-col justify-between overflow-hidden group relative transition-shadow"
            >
              {/* Card Image Frame */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Offer Discount Badge */}
                <div className="absolute top-3 left-3 badge-offer px-2.5 py-1 rounded-lg text-[10px] font-black shadow-md">
                  {meal.discount}
                </div>

                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => toggleFavorite(meal.id, e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  aria-label="Favorite"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? 'fill-red-500 text-red-500' : 'text-slate-600'
                    }`}
                  />
                </motion.button>

                {/* Veg/Non-Veg + Rating Strip */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md font-semibold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        meal.isVeg ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                    />
                    <span className="text-[11px]">{meal.isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-emerald-600 px-2 py-0.5 rounded-md font-bold text-[11px] shadow-xs">
                    <span>{meal.rating}</span>
                    <Star className="w-3 h-3 fill-white" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-medium truncate max-w-[170px]">{meal.restaurant}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      {meal.deliveryTime}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {meal.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {meal.description}
                  </p>
                </div>

                {/* Pricing & Add to Cart Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900 font-heading">
                        ₹{meal.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{meal.originalPrice}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      Save ₹{meal.originalPrice - meal.price}
                    </span>
                  </div>

                  {/* Add Button with Glow & Scale Micro-Interaction */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.06,
                      boxShadow: inCart ? '0 0 16px rgba(16, 185, 129, 0.4)' : '0 0 16px rgba(249, 115, 22, 0.5)'
                    }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onAddToCart && onAddToCart(meal)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      inCart
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-500'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ADDED ({inCart.quantity})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

            </motion.div>
          );
        })}
      </motion.div>

    </section>
  );
};
