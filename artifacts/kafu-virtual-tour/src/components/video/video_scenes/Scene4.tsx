import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full" {...sceneTransitions.splitHorizontal}>
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/students-2.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Student Life" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-12">
        <motion.div
          className="bg-[var(--color-primary)]/90 backdrop-blur-md p-10 rounded-lg border border-white/10"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <motion.h2 
            className="text-[3.5vw] font-display text-[var(--color-accent)] font-bold text-center leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            A Vibrant Community
          </motion.h2>
          
          <motion.p 
            className="text-[1.4vw] font-body text-white text-center mt-4 max-w-[40vw] font-light"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join a diverse student body dedicated to learning, collaboration, and personal growth.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
