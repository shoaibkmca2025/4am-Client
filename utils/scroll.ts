type ScrollOptions = {
  duration?: number;
  offset?: number;
  retries?: number;
  retryDelayMs?: number;
};

let activeScrollFrame: number | null = null;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const prefersReducedMotion = () =>
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getScrollPaddingTop = () => {
  const rawValue = getComputedStyle(document.documentElement).scrollPaddingTop;
  const parsedValue = Number.parseFloat(rawValue);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

const cancelActiveScroll = () => {
  if (activeScrollFrame !== null) {
    window.cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = null;
  }
};

export const smoothScrollTo = (targetY: number, options: { duration?: number } = {}) => {
  cancelActiveScroll();

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 1) return;

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY);
    return;
  }

  const dynamicDuration = clamp(Math.abs(distance) * 0.45, 260, 900);
  const duration = options.duration ?? dynamicDuration;
  const startTime = performance.now();

  const cancelOnUserInput = () => cancelActiveScroll();
  window.addEventListener('wheel', cancelOnUserInput, { passive: true, once: true });
  window.addEventListener('touchmove', cancelOnUserInput, { passive: true, once: true });
  window.addEventListener('touchstart', cancelOnUserInput, { passive: true, once: true });
  window.addEventListener('mousedown', cancelOnUserInput, { passive: true, once: true });
  window.addEventListener('keydown', cancelOnUserInput, { once: true });

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = clamp(elapsed / duration, 0, 1);
    const easedProgress = easeOutCubic(progress);
    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      activeScrollFrame = window.requestAnimationFrame(step);
    } else {
      activeScrollFrame = null;
    }
  };

  activeScrollFrame = window.requestAnimationFrame(step);
};

export const scrollToTop = (options: { duration?: number } = {}) => {
  smoothScrollTo(0, options);
};

export const scrollToSection = (id: string, options: ScrollOptions = {}) => {
  const { duration, offset = 0, retries = 50, retryDelayMs = 100 } = options;

  const attemptScroll = (attempt: number) => {
    const element = document.getElementById(id);
    if (!element) {
      if (attempt < retries) {
        window.setTimeout(() => attemptScroll(attempt + 1), retryDelayMs);
      }
      return;
    }

    const paddingTop = getScrollPaddingTop();
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const rawTarget = elementTop - paddingTop - offset;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = clamp(rawTarget, 0, maxScroll);
    smoothScrollTo(targetY, { duration });
  };

  attemptScroll(0);
};
