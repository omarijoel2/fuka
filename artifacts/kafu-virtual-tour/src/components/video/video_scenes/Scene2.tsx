import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black"
      {...sceneTransitions.wipe}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2, x: '-5%' }}
        animate={{ scale: 1, x: '0%' }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/60 to-transparent z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/library-1.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Campus Infrastructure" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-[10vw]">
        <motion.div 
          className="w-24 h-2 bg-[var(--color-accent)] mb-8"
          initial={{ scaleX: 0, originX: 0 }}
          animate={phase >= 1 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
        />
        
        <motion.h2 
          className="text-[6vw] font-display text-white font-bold leading-none max-w-[60vw] uppercase"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Modern Campus Infrastructure
        </motion.h2>
        
        <motion.p 
          className="text-[2vw] font-body text-white/90 mt-6 max-w-[50vw] font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          Discover a green, vibrant environment designed for academic excellence and innovation.
        </motion.p>
      </div>
    </motion.div>
  );
}