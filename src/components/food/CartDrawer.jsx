import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Tag 
} from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onClearCart }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState('');
  const [tipAmount, setTipAmount] = useState(30);
  const [isOrdered, setIsOrdered] = useState(false);

  const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 500 ? 0 : 35;
  const platformFee = 7;
  const taxes = Math.round(itemTotal * 0.05);
  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + taxes + tipAmount - appliedDiscount);

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'FIRSTMEAL' || code === 'ZOMATO50' || code === 'SWIGGY50') {
      const disc = Math.round(itemTotal * 0.5);
      setAppliedDiscount(Math.min(disc, 150));
      setDiscountMsg('🎉 Coupon applied! You saved up to ₹150.');
    } else if (code === 'FREEDEL') {
      setAppliedDiscount(deliveryFee);
      setDiscountMsg('🎉 Free delivery applied!');
    } else {
      setDiscountMsg('⚠️ Invalid coupon code. Try FIRSTMEAL');
    }
  };

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      onClearCart();
      setIsOrdered(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Smooth Fade Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Smooth Slide-in Drawer with Framer Motion */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-base">
                      Your Food Cart
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
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

              {/* Cart Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {isOrdered ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="font-heading text-xl font-black text-slate-900">
                      Order Placed Successfully!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                      Your kitchen has begun cooking your delicious meal. Our delivery partner is en route! 🚴‍♂️
                    </p>
                    <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-800">
                      Estimated Delivery: 24 Mins • Live Tracking Active
                    </div>
                  </motion.div>
                ) : cartItems.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="font-heading font-bold text-slate-900 text-base">
                      Your cart is hungry!
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explore our featured meals and add your favorite dishes to start ordering.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 0 16px rgba(249, 115, 22, 0.4)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={onClose}
                      className="btn-orange-pill px-6 py-2.5 text-xs font-bold mt-2 cursor-pointer inline-flex items-center gap-2"
                    >
                      Explore Delicious Meals
                    </motion.button>
                  </div>
                ) : (
                  <>
                    {/* Delivery Time Pill */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-800 font-semibold">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>Delivery in 25–30 mins</span>
                      </div>
                      <span className="font-bold text-orange-600 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                        ⚡ Priority
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Order Items</span>
                        <button
                          onClick={onClearCart}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Clear
                        </button>
                      </div>

                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-500 font-semibold">
                                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-2 py-1 shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="text-orange-600 hover:text-orange-800 p-0.5 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-900 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="text-orange-600 hover:text-orange-800 p-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Apply Coupon Bar */}
                    <form onSubmit={applyCoupon} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            placeholder="Coupon code (e.g. FIRSTMEAL)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full bg-slate-50 text-xs text-slate-900 pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 uppercase font-semibold"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Apply
                        </motion.button>
                      </div>
                      {discountMsg && (
                        <p className="text-[11px] font-semibold text-emerald-600 px-1">
                          {discountMsg}
                        </p>
                      )}
                    </form>

                    {/* Delivery Tip */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span>Say thanks with a Delivery Partner Tip</span>
                      </p>
                      <div className="flex items-center gap-2">
                        {[20, 30, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setTipAmount(amt)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              tipAmount === amt
                                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bill Breakdown */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Item Total</span>
                        <span>₹{itemTotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Partner Fee</span>
                        <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Platform Fee</span>
                        <span>₹{platformFee}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST and Restaurant Charges</span>
                        <span>₹{taxes}</span>
                      </div>
                      {tipAmount > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Rider Tip</span>
                          <span>₹{tipAmount}</span>
                        </div>
                      )}
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Coupon Discount</span>
                          <span>-₹{appliedDiscount}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900 font-heading">
                        <span>To Pay</span>
                        <span>₹{grandTotal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Checkout Bar */}
              {cartItems.length > 0 && !isOrdered && (
                <div className="p-4 sm:p-5 border-t border-orange-100 bg-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" /> Deliver to: Indiranagar, BLR
                    </span>
                    <span className="font-bold text-orange-600 cursor-pointer">Change</span>
                  </div>

                  <motion.button
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: '0 0 24px rgba(249, 115, 22, 0.6), 0 6px 18px rgba(249, 115, 22, 0.35)' 
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full btn-orange-pill py-3.5 px-5 text-sm font-bold flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs uppercase tracking-wider font-extrabold text-orange-100">
                        Grand Total
                      </span>
                      <span className="text-base font-black text-white font-heading">
                        ₹{grandTotal}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-white font-black text-sm">
                      <span>PROCEED TO PAY</span>
                      <ArrowRight className="w-4 h-4" />
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
