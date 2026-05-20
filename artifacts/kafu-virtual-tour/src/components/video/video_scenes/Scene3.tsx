import { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

function Counter({ from, to, duration, format }: { from: number; to: number; duration: number; format?: (v: number) => string }) {
  const nodeRef = useState<HTMLSpanElement | null>(null)[1];
  const count = useMotionValue(from);

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  useEffect(() => {
    return count.on("change", (latest) => {
      const element = document.getElementById(`counter-${to}`);
      if (element) {
        element.textContent = format ? format(Math.round(latest)) : Math.round(latest).toString();
      }
    });
  }, [count, format, to]);

  return <span id={`counter-${to}`}>{format ? format(from) : from}</span>;
}

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-black overflow-hidden"
      {...sceneTransitions.clipPolygon}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, y: '5%' }}
        animate={{ scale: 1, y: '0%' }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-[var(--color-primary)]/80 z-10 mix-blend-multiply" />
        <img 
          src="https://kafu.ac.ke/wp-content/uploads/students-2.jpg" 
          className="w-full h-full object-cover object-center"
          alt="Students" 
        />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-wrap items-center justify-center content-center gap-16 px-20">
        
        {/* Stat 1 */}
        <motion.div 
          className="flex flex-col items-center justify-center p-8 border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl min-w-[250px]"
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="text-[6vw] font-display font-bold text-[var(--color-accent)] leading-none">
            {phase >= 1 ? <Counter from={0} to={9000} duration={2} format={(v) => `${v.toLocaleString()}+`} /> : "0"}
          </div>
          <div className="text-[1.5vw] font-body text-white mt-4 uppercase tracking-widest font-medium">Students</div>
        </motion.div>

        {/* Stat 2 */}
        <motion.div 
          className="flex flex-col items-center justify-center p-8 border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl min-w-[250px]"
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="text-[6vw] font-display font-bold text-[var(--color-accent)] leading-none">
            {phase >= 2 ? <Counter from={0} to={6} duration={1.5} /> : "0"}
          </div>
          <div className="text-[1.5vw] font-body text-white mt-4 uppercase tracking-widest font-medium">Schools</div>
        </motion.div>

        {/* Stat 3 */}
        <motion.div 
          className="flex flex-col items-center justify-center p-8 border border-white/20 bg-black/40 backdrop-blur-md rounded-2xl min-w-[250px]"
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="text-[6vw] font-display font-bold text-[var(--color-accent)] leading-none">
            {phase >= 3 ? <Counter from={2000} to={2014} duration={1.5} /> : "2000"}
          </div>
          <div className="text-[1.5vw] font-body text-white mt-4 uppercase tracking-widest font-medium">Established</div>
        </motion.div>

      </div>
    </motion.div>
  );
}