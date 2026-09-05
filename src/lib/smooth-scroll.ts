type ActiveScroll = {
  frame: number;
  root: HTMLElement;
  previousBehavior: string;
  cleanup: () => void;
};

let activeScroll: ActiveScroll | null = null;

function stopActiveScroll() {
  if (!activeScroll) return;

  cancelAnimationFrame(activeScroll.frame);
  activeScroll.root.style.scrollBehavior = activeScroll.previousBehavior;
  activeScroll.cleanup();
  activeScroll = null;
}

export function smoothScrollDuration(distance: number) {
  return Math.min(1250, Math.max(520, 400 + Math.abs(distance) * 0.14));
}

export function smoothScrollEasing(progress: number) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  return clampedProgress < 0.5
    ? 4 * clampedProgress ** 3
    : 1 - Math.pow(-2 * clampedProgress + 2, 3) / 2;
}

export function smoothScrollTo(targetTop: number) {
  stopActiveScroll();

  const root = document.documentElement;
  const maximumTop = Math.max(0, root.scrollHeight - window.innerHeight);
  const destination = Math.min(Math.max(targetTop, 0), maximumTop);
  const start = window.scrollY;
  const distance = destination - start;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const previousBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";

  if (reduceMotion || Math.abs(distance) < 2) {
    window.scrollTo(0, destination);
    root.style.scrollBehavior = previousBehavior;
    return;
  }

  const startedAt = performance.now();
  const duration = smoothScrollDuration(distance);
  const interruptionEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
  const stopForUserInput = () => stopActiveScroll();
  const cleanup = () => {
    interruptionEvents.forEach((eventName) => {
      window.removeEventListener(eventName, stopForUserInput);
    });
  };

  interruptionEvents.forEach((eventName) => {
    window.addEventListener(eventName, stopForUserInput, { passive: true, once: true });
  });

  const scroll: ActiveScroll = {
    frame: 0,
    root,
    previousBehavior,
    cleanup,
  };

  function animate(now: number) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const easedProgress = smoothScrollEasing(progress);
    window.scrollTo(0, start + distance * easedProgress);

    if (progress < 1 && activeScroll === scroll) {
      scroll.frame = requestAnimationFrame(animate);
      return;
    }

    root.style.scrollBehavior = previousBehavior;
    cleanup();
    if (activeScroll === scroll) activeScroll = null;
  }

  scroll.frame = requestAnimationFrame(animate);
  activeScroll = scroll;
}

export function smoothScrollToElement(element: HTMLElement) {
  const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const targetTop = element.getBoundingClientRect().top + window.scrollY - scrollPadding;
  smoothScrollTo(targetTop);
}
