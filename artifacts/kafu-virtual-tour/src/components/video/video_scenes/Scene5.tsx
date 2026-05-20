import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      {...sceneTransitions.zoomThrough}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1, originY: 0.5 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-dark)]/90 via-black/20 to-transparent z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/2022/05/Graduation-12.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Graduation" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-[15vh] px-12">
        <motion.h2 
          className="text-[6vw] font-display text-white font-bold leading-none text-center uppercase"
          initial={{ opacity: 0, y: 50, rotateX: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ perspective: 1000 }}
        >
          A Community of Leaders
        </motion.h2>
        
        <motion.div
          className="flex items-center gap-6 mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-[2px] w-16 bg-[var(--color-accent)]" />
          <p className="text-[1.8vw] font-body text-[var(--color-accent)] tracking-widest uppercase font-semibold">
            Celebrate Excellence
          </p>
          <div className="h-[2px] w-16 bg-[var(--color-accent)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}