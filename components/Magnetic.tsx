import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

const Magnetic: React.FC<MagneticProps> = ({ children, className = "", strength = 20 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);
    setPosition({ x: x * (strength / 100), y: y * (strength / 100) });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className={`inline-block ${className}`}
      style={{ pointerEvents: 'none' }} // Ensure the wrapper itself doesn't catch clicks
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        style={{ pointerEvents: 'auto' }} // Only the children are interactive
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Magnetic;