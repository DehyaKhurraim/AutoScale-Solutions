// ticker.js — industries auto-scrolling ticker (GSAP-driven), with static fallback
import { industries } from './data.js';

export function initTicker() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const row1El = document.getElementById('ticker-row-1');
  const row2El = document.getElementById('ticker-row-2');
  const fallbackEl = document.getElementById('industries-fallback');

  const half = Math.ceil(industries.length / 2);
  const row1Items = industries.slice(0, half);
  const row2Items = industries.slice(half);

  // Static fallback list (also used when reduced motion / no JS via CSS)
  fallbackEl.innerHTML = industries.map(i => `<li class="chip">${i}</li>`).join('');

  if (reducedMotion) {
    return; // CSS hides ticker-wrap and shows fallback under reduced motion
  }

  // Duplicate items for seamless looping
  row1El.innerHTML = [...row1Items, ...row1Items].map(i => `<span class="chip">${i}</span>`).join('');
  row2El.innerHTML = [...row2Items, ...row2Items].map(i => `<span class="chip">${i}</span>`).join('');

  if (!window.gsap) return;

  requestAnimationFrame(() => {
    const row1Width = row1El.scrollWidth / 2;
    const row2Width = row2El.scrollWidth / 2;

    gsap.set(row1El, { x: 0 });
    gsap.set(row2El, { x: -row2Width });

    const tween1 = gsap.to(row1El, {
      x: -row1Width,
      duration: 32,
      ease: 'none',
      repeat: -1,
    });

    const tween2 = gsap.to(row2El, {
      x: 0,
      duration: 32,
      ease: 'none',
      repeat: -1,
    });

    const wrap = document.getElementById('ticker-wrap');
    wrap.addEventListener('mouseenter', () => { tween1.pause(); tween2.pause(); });
    wrap.addEventListener('mouseleave', () => { tween1.play(); tween2.play(); });
  });
}
