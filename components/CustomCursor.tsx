
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [cursorState, setCursorState] = useState<'default' | 'pointer' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const ringSpring = { stiffness: 250, damping: 30, mass: 0.5 };
  const coreSpring = { stiffness: 800, damping: 50, mass: 0.1 };
  
  const smoothX = useSpring(mouseX, ringSpring);
  const smoothY = useSpring(mouseY, ringSpring);
  const coreX = useSpring(mouseX, coreSpring);
  const coreY = useSpring(mouseY, coreSpring);

  const velocity = useRef(0);
  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);

      const now = Date.now();
      const dt = now - lastPos.current.time;
      if (dt > 0) {
        const dx = clientX - lastPos.current.x;
        const dy = clientY - lastPos.current.y;
        velocity.current = Math.sqrt(dx * dx + dy * dy) / dt;
        
        // Emit particles on move
        if (velocity.current > 0.5 && particles.current.length < 50) {
          particles.current.push({
            x: clientX,
            y: clientY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1.0,
            color: Math.random() > 0.5 ? '#3B82F6' : '#8B5CF6',
            size: Math.random() * 2 + 1
          });
        }
      }
      lastPos.current = { x: clientX, y: clientY, time: now };

      // Element detection for states
      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === 'pointer' || 
                        target.tagName === 'A' || 
                        target.tagName === 'BUTTON' ||
                        target.closest('button') ||
                        target.closest('a');
      
      setCursorState(isPointer ? 'pointer' : 'default');
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Canvas Animation Loop
    let animationFrame: number;
    const ctx = canvasRef.current?.getContext('2d');
    
    const animate = () => {
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        particles.current.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.life <= 0) particles.current.splice(i, 1);
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();

    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Core Node */}
            <motion.div
              // FIX: Removed duplicate x and y properties. Using left/top with translateX/translateY for centering.
              style={{ left: coreX, top: coreY, translateX: '-50%', translateY: '-50%' }}
              className="absolute w-1.5 h-1.5 bg-brand-primary rounded-full z-10 shadow-[0_0_10px_#3B82F6]"
              animate={{ 
                scale: isMouseDown ? 0.5 : cursorState === 'pointer' ? 1.5 : 1,
                backgroundColor: cursorState === 'pointer' ? '#8B5CF6' : '#3B82F6'
              }}
            />

            {/* Diagnostic Ring */}
            <motion.div
              // FIX: Removed duplicate x and y properties. Using left/top with translateX/translateY for centering.
              style={{ left: smoothX, top: smoothY, translateX: '-50%', translateY: '-50%' }}
              className="absolute rounded-full border border-brand-primary/30 z-0"
              animate={{ 
                width: cursorState === 'pointer' ? 60 : 32,
                height: cursorState === 'pointer' ? 60 : 32,
                rotate: velocity.current * 10,
                borderColor: cursorState === 'pointer' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)',
                borderWidth: isMouseDown ? 4 : 1,
              }}
            >
              {/* Spinning Crosshair Segments */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-[110%] h-[1px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                <div className="h-[110%] w-[1px] bg-gradient-to-b from-transparent via-brand-primary to-transparent" />
              </div>
            </motion.div>

            {/* Telemetry Label */}
            <motion.div
              style={{ left: smoothX, top: smoothY }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: cursorState === 'pointer' ? 1 : 0,
                x: 40,
                y: -10
              }}
              className="absolute text-[8px] font-mono font-bold text-brand-primary uppercase tracking-[0.2em] pointer-events-none whitespace-nowrap bg-white/10 backdrop-blur-md px-2 py-1 rounded-md border border-brand-primary/20"
            >
              SYNC_NODE_ACTIVE
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomCursor;
