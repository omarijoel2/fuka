import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black"
      {...sceneTransitions.fadeBlur}
    >
      {/* Background Aerial Video/Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-dark)]/80 via-transparent to-[var(--color-bg-dark)]/40 z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/arial-view-e-1.jpg" 
          alt="Campus Aerial" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Foreground Typography */}
      <div className="relative z-20 flex flex-col items-center w-full px-12 mt-12">
        <div className="overflow-hidden">
          <motion.h1 
            className="text-[8vw] font-display font-bold uppercase tracking-tight text-white leading-[0.9] text-center drop-shadow-2xl"
            initial={{ y: "100%" }}
            animate={phase >= 1 ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Kaimosi Friends
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1 
            className="text-[8vw] font-display font-bold uppercase tracking-tight text-[var(--color-accent)] leading-[0.9] text-center drop-shadow-2xl"
            initial={{ y: "100%" }}
            animate={phase >= 2 ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            University
          </motion.h1>
        </div>
        
        <motion.div 
          className="mt-8 h-[2px] bg-white/50 relative overflow-hidden"
          initial={{ width: 0 }}
          animate={phase >= 3 ? { width: "40%" } : { width: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            className="absolute inset-0 bg-[var(--color-accent)]"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}