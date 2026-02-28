import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const HeroScene: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center lg:justify-end">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="relative z-10"
      >
        <TiltCard 
          className="w-[300px] h-[300px] rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden flex items-center justify-center p-8"
          maxTilt={8}
          scale={1.05}
          glow={true}
        >
          <img 
            src="/assets/logo.jpeg" 
            alt="4AM Global Media" 
            className="w-full h-full object-contain drop-shadow-md rounded-xl"
          />
        </TiltCard>
      </motion.div>
    </div>
  );
};

export default HeroScene;
