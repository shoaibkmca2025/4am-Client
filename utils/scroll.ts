export const scrollToSection = (id: string) => {
  const attemptScroll = (attempts = 0) => {
    const element = document.getElementById(id);
    if (!element) {
      if (attempts < 50) {
        // Try again in 100ms, up to 5 seconds total
        setTimeout(() => attemptScroll(attempts + 1), 100);
      }
      return;
    }
    // Use native scrollIntoView which respects scroll-padding-top from CSS
    element.scrollIntoView({ behavior: 'smooth' });
  };

  attemptScroll();
};
