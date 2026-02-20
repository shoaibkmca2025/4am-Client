import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll reset
    window.scrollTo(0, 0);
    
    // Fallback for some browsers/situations where layout isn't ready
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;