import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const hasMountedRef = useRef(false);

  const initialVariant = hasMountedRef.current
    ? { opacity: 0, y: 8 }
    : false;

  const handleComplete = () => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={initialVariant}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
        onAnimationComplete={handleComplete}
        className="h-full transition-all duration-300 ease-in-out"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;

