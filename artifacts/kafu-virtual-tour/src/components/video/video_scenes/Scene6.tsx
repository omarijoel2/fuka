import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full bg-[var(--color-primary)]" {...sceneTransitions.crossDissolve}>
      {/* Decorative patterns */}
      <div className="absolute inset-0 z-0 opacity-10 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[100%] border-[2px] border-[var(--color-accent)] rounded-[100px] transform -rotate-45"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div 
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[100%] border-[2px] border-[var(--color-accent)] rounded-[100px] transform -rotate-45"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.2 }}
        />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white px-12 py-8 rounded-xl shadow-2xl"
        >
          <img 
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png" 
            className="w-[40vw] object-contain"
            alt="KAFU Logo" 
          />
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
        >
          <p className="text-[1.8vw] font-display text-white font-medium italic">
            Proudly rooted in our Quaker Heritage
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="w-12 h-[1px] bg-[var(--color-accent)]" />
          <p className="text-[1.2vw] font-body text-[var(--color-accent)] tracking-widest uppercase">
            kafu.ac.ke
          </p>
          <span className="w-12 h-[1px] bg-[var(--color-accent)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
