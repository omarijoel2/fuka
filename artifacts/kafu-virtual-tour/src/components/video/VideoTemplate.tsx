import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

export const SCENE_DURATIONS: Record<string, number> = {
  intro: 4500,
  campus: 4000,
  stats: 5000,
  academics: 4500,
  community: 4500,
  outro: 4000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  intro: Scene1,
  campus: Scene2,
  stats: Scene3,
  academics: Scene4,
  community: Scene5,
  outro: Scene6,
};

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentScene, currentSceneKey } = useVideoPlayer({ durations, loop });

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '') as keyof typeof SCENE_DURATIONS;
  const sceneIndex = Object.keys(SCENE_DURATIONS).indexOf(baseSceneKey);
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];

  return (
    <div className="w-full h-screen overflow-hidden relative bg-[var(--color-bg-dark)] font-body">
      {/* Persistent Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-[120vw] h-[120vw] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}
          animate={{
            x: ['-30%', '10%', '-20%'],
            y: ['-10%', '20%', '-10%'],
            scale: [1, 1.1, 0.9],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-20 blur-[100px] bottom-0 right-0"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)' }}
          animate={{
            x: ['10%', '-20%', '10%'],
            y: ['20%', '-10%', '0%'],
            scale: [1, 1.2, 0.95],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Persistent Brand Logo - Top Right */}
      <motion.div 
        className="absolute top-10 right-12 z-50 origin-right"
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ 
          opacity: currentScene === 5 ? 0 : 1, // Hide on outro when logo is centered
          scale: currentScene === 5 ? 0.8 : 1,
          x: currentScene === 5 ? 20 : 0
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-white/20">
          <img 
            src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png" 
            alt="KAFU Logo" 
            className="h-10 object-contain"
          />
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {SceneComponent && <SceneComponent key={currentSceneKey} />}
      </AnimatePresence>

      {/* suppress unused warning */}
      <span style={{ display: 'none' }}>{sceneIndex}</span>
    </div>
  );
}