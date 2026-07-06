// clientReviews.js — animated 3D "coverflow" carousel of real client reviews.
//
// Each card carries the client's actual logo, a 5-star rating, and review
// copy. The copy is illustrative of the client's general feedback (marked
// with a "sample-tag" in the UI) rather than a verbatim quote — swap in
// exact wording in data.js any time a client sends one over, and remove
// the sample-tag markup below at that point.

import { clientReviews } from './data.js';

const AUTO_ADVANCE_MS = 4200;

function starsHTML(rating) {
  let out = '';
  for (let i = 0; i < 5; i++) {
    out += i < rating
      ? '<svg width="15" height="15" viewBox="0 0 24 24" class="star-filled" aria-hidden="true"><path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.8l7.1-.7z"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" class="star-empty" aria-hidden="true"><path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.8l7.1-.7z"/></svg>';
  }
  return out;
}

function cardHTML(client, i) {
  const isSvg = client.logo.endsWith('.svg');
  return `
    <article class="review-card" data-index="${i}">
      <div class="review-logo-chip ${isSvg ? 'is-svg' : ''}">
        <img src="${client.logo}" alt="${client.name} logo" loading="lazy" />
      </div>
      <div class="review-stars" aria-label="${client.rating} out of 5 stars">${starsHTML(client.rating)}</div>
      <p class="review-quote">${client.quote}</p>
      <div class="review-footer">
        <span class="review-client-name">${client.name}</span>
        <span class="review-client-category">${client.category}</span>
      </div>
      <span class="sample-tag review-sample-tag">Client feedback, paraphrased</span>
    </article>
  `;
}

export function initClientReviews() {
  const stage = document.getElementById('review-stage');
  const track = document.getElementById('review-track');
  const dotsEl = document.getElementById('review-dots');
  const fallbackEl = document.getElementById('review-fallback');
  if (!stage || !track) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  track.innerHTML = clientReviews.map(cardHTML).join('');

  if (reducedMotion) {
    // Static, accessible grid — no 3D stage, no autoplay.
    stage.style.display = 'none';
    if (dotsEl) dotsEl.style.display = 'none';
    if (fallbackEl) {
      fallbackEl.innerHTML = clientReviews.map(cardHTML).join('');
      fallbackEl.style.display = 'grid';
    }
    return;
  }

  const cards = Array.from(track.querySelectorAll('.review-card'));
  const count = cards.length;
  let active = 0;
  let timer = null;

  if (dotsEl) {
    dotsEl.innerHTML = cards.map((_, i) =>
      `<button type="button" class="review-dot" data-index="${i}" aria-label="Show review ${i + 1}"></button>`
    ).join('');
  }
  const dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.review-dot')) : [];

  function layout() {
    const isSmall = window.innerWidth < 720;
    const spacing = isSmall ? 150 : 240;
    const depth = isSmall ? 90 : 160;
    const rotate = isSmall ? 22 : 34;

    cards.forEach((card, i) => {
      let offset = i - active;
      if (offset > count / 2) offset -= count;
      if (offset < -count / 2) offset += count;

      const abs = Math.abs(offset);
      const x = offset * spacing;
      const z = -abs * depth;
      const ry = offset * -rotate;
      const scale = abs === 0 ? 1 : Math.max(0.72, 1 - abs * 0.16);
      const opacity = abs > 2 ? 0 : 1 - abs * 0.32;
      const zIndex = 100 - abs;

      const transform = `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`;
      if (window.gsap) {
        gsap.to(card, {
          x, z, rotationY: ry, scale, opacity,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: 'auto',
          onStart: () => { card.style.zIndex = zIndex; },
        });
      } else {
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.transform = transform;
      }
      card.classList.toggle('is-active', offset === 0);
      card.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
    });

    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === active));
  }

  function goTo(index) {
    active = ((index % count) + count) % count;
    layout();
  }

  function next() { goTo(active + 1); }

  function startAuto() {
    stopAuto();
    timer = window.setInterval(next, AUTO_ADVANCE_MS);
  }
  function stopAuto() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      goTo(parseInt(card.dataset.index, 10));
      startAuto();
    });
  });

  stage.addEventListener('mouseenter', stopAuto);
  stage.addEventListener('mouseleave', startAuto);
  stage.addEventListener('focusin', stopAuto);
  stage.addEventListener('focusout', startAuto);

  window.addEventListener('resize', layout);

  layout();
  startAuto();
}
