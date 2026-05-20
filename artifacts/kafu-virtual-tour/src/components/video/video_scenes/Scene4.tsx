import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      {...sceneTransitions.splitHorizontal}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, rotate: 2 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-bg-dark)]/90 via-transparent to-transparent z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/main-building.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Academics" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-end justify-center px-[10vw] text-right">
        <motion.div 
          className="bg-[var(--color-accent)] px-6 py-2 mb-6"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-[1.2vw] font-body font-bold uppercase tracking-widest text-[var(--color-bg-dark)]">
            Academics
          </span>
        </motion.div>

        <motion.h2 
          className="text-[5vw] font-display text-white font-bold leading-tight max-w-[50vw] uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Rigorous & Relevant
        </motion.h2>
        
        <motion.p 
          className="text-[1.8vw] font-body text-white/90 mt-4 max-w-[40vw] font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          Programs designed to challenge, inspire, and prepare students for the demands of the modern workforce.
        </motion.p>
      </div>
    </motion.div>
  );
}