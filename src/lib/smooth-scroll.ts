type ActiveScroll = {
  frame: number;
  root: HTMLElement;
  previousBehavior: string;
};

let activeScroll: ActiveScroll | null = null;

function stopActiveScroll() {
  if (!activeScroll) return;

  cancelAnimationFrame(activeScroll.frame);
  activeScroll.root.style.scrollBehavior = activeScroll.previousBehavior;
  activeScroll = null;
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
  const duration = Math.min(760, Math.max(420, Math.abs(distance) * 0.48));

  function animate(now: number) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 4);
    window.scrollTo(0, start + distance * easedProgress);

    if (progress < 1 && activeScroll) {
      activeScroll.frame = requestAnimationFrame(animate);
      return;
    }

    root.style.scrollBehavior = previousBehavior;
    activeScroll = null;
  }

  activeScroll = {
    frame: requestAnimationFrame(animate),
    root,
    previousBehavior,
  };
}

export function smoothScrollToElement(element: HTMLElement) {
  const scrollPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const targetTop = element.getBoundingClientRect().top + window.scrollY - scrollPadding;
  smoothScrollTo(targetTop);
}
