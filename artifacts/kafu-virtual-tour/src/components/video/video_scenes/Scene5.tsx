import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full" {...sceneTransitions.zoomThrough}>
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1, originY: 0.5 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/2022/05/Graduation-12.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Graduation" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-[15vh] px-12">
        <motion.h2 
          className="text-[5vw] font-display text-white font-bold leading-none text-center"
          initial={{ opacity: 0, y: 50, rotateX: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -20 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ perspective: 1000 }}
        >
          Your Future Begins Here
        </motion.h2>
        
        <motion.p 
          className="text-[1.8vw] font-body text-[var(--color-accent)] mt-6 text-center tracking-wide uppercase"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
        >
          Empowering leaders since 2014
        </motion.p>
      </div>
    </motion.div>
  );
}
