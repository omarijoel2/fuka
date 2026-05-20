import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full" {...sceneTransitions.wipe}>
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1, x: '-5%' }}
        animate={{ scale: 1.05, x: '0%' }}
        transition={{ duration: 5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/80 to-transparent z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/library-1.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Library" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-[10vw]">
        <motion.div 
          className="w-16 h-1 bg-[var(--color-accent)] mb-8"
          initial={{ width: 0 }}
          animate={phase >= 1 ? { width: '4rem' } : { width: 0 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
        />
        
        <motion.h2 
          className="text-[4vw] font-display text-white font-bold leading-tight max-w-[50vw]"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          World-Class Resources
        </motion.h2>
        
        <motion.p 
          className="text-[1.5vw] font-body text-white/80 mt-4 max-w-[40vw] font-light"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          Equipping students with modern facilities and extensive research materials to discover their potential.
        </motion.p>
      </div>
    </motion.div>
  );
}
