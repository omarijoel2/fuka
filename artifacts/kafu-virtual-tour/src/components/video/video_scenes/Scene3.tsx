import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full" {...sceneTransitions.clipPolygon}>
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05, y: '-5%' }}
        animate={{ scale: 1, y: '0%' }}
        transition={{ duration: 5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A1C11]/80 to-transparent z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/main-building.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Main Building" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-end justify-center px-[10vw] text-right">
        <motion.h2 
          className="text-[4.5vw] font-display text-white font-bold leading-tight max-w-[50vw]"
          initial={{ opacity: 0, y: 40 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Excellence in Education
        </motion.h2>
        
        <motion.div 
          className="w-16 h-1 bg-[var(--color-accent)] mt-6 mb-6"
          initial={{ width: 0, opacity: 0 }}
          animate={phase >= 2 ? { width: '4rem', opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'circOut' }}
        />
        
        <motion.p 
          className="text-[1.5vw] font-body text-white/80 max-w-[40vw] font-light"
          initial={{ opacity: 0, x: 30 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8 }}
        >
          Fostering innovation and critical thinking through rigorous academic programs.
        </motion.p>
      </div>
    </motion.div>
  );
}
