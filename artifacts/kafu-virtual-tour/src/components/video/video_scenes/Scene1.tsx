import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 w-full h-full" {...sceneTransitions.fadeBlur}>
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/arial-view-e-1.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Campus Aerial" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <h1 className="text-[5vw] font-display text-white leading-tight font-bold drop-shadow-2xl">
            Kaimosi Friends University
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mt-6 border-b border-t border-[var(--color-accent)] py-3 px-8"
        >
          <p className="text-[2vw] font-body text-[var(--color-accent)] uppercase tracking-[0.3em] font-medium">
            Spring of Knowledge
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
