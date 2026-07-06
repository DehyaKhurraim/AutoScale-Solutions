// main.js — entry point: initializes scroll animations, ticker, and lazily loads the 3D hero scene
import { initScrollAnimations } from './scrollAnimations.js';
import { initTicker } from './ticker.js';
import { initChatbot } from './chatbot.js';
import { initClientsMarquee } from './clientsMarquee.js';
import { initClientReviews } from './clientReviews.js';
import { initMobileNav } from './nav.js';

function start() {
  initScrollAnimations();
  initTicker();
  initChatbot();
  initClientsMarquee();
  initClientReviews();
  initMobileNav();
  loadHeroSceneWhenReady();
}

function loadHeroSceneWhenReady() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Kick off the module import (and the three.js fetch) on the next frame
  // after first paint, instead of requestIdleCallback — which could sit
  // idle for its whole timeout on a busy thread and was the main cause of
  // the hero feeling slow. The CSS gradient/vignette is already visible
  // underneath, so this never blocks first paint; it just starts as early
  // as possible instead of as late as possible.
  const load = () => {
    import('./scene.js').then(({ initHeroScene }) => {
      initHeroScene(canvas);
      // Crossfade the canvas in once it has a rendered frame, instead of
      // popping in abruptly.
      requestAnimationFrame(() => {
        canvas.classList.remove('hero-canvas-loading');
      });
    }).catch(() => {
      // If Three.js fails to load (e.g. offline), the vignette + gradient
      // background still reads fine on its own.
      canvas.style.display = 'none';
    });
  };

  requestAnimationFrame(() => requestAnimationFrame(load));

  // Reduced motion doesn't skip the scene entirely — scene.js itself
  // renders a single static frame in that case, per the reduced-motion spec.
  void reducedMotion;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
