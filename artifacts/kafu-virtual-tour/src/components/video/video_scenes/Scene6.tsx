import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full bg-[var(--color-bg-dark)] overflow-hidden" 
      {...sceneTransitions.crossDissolve}
    >
      <div className="absolute inset-0 z-0 bg-[url('https://kafu.ac.ke/wp-content/uploads/arial-view-e-1.jpg')] bg-cover bg-center opacity-20 mix-blend-luminosity" />

      {/* Decorative patterns */}
      <div className="absolute inset-0 z-0 opacity-10 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full border-[1px] border-white/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5, opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white px-16 py-10 rounded-2xl shadow-[0_0_50px_rgba(201,162,39,0.3)] border border-[var(--color-accent)]/20"
        >
          <img 
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png" 
            className="w-[45vw] object-contain"
            alt="KAFU Logo" 
          />
        </motion.div>

        <motion.div
          className="mt-16 text-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-[3vw] font-display text-white font-bold uppercase tracking-widest"
            initial={{ y: "100%" }}
            animate={phase >= 2 ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Spring of Knowledge
          </motion.h2>
        </motion.div>

        <motion.div
          className="mt-8 flex gap-6 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="w-16 h-[2px] bg-[var(--color-accent)]" />
          <p className="text-[1.5vw] font-body text-[var(--color-accent)] font-semibold tracking-widest uppercase">
            kafu.ac.ke
          </p>
          <span className="w-16 h-[2px] bg-[var(--color-accent)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}