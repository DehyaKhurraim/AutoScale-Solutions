// clientsMarquee.js — animated, auto-scrolling strip of industry badges.
//
// These are illustrative industry marks, not real client logos (see the
// section label in index.html, which says so explicitly). Once real clients
// come on board, give a client object a `logoUrl` field and swap the <img>
// branch in logoCardHTML for it — no other changes needed.

import { clients } from './data.js';

const ICONS = {
  bag: '<path d="M9 4h6v2M6 6h12l-1 12H7L6 6z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
  cross: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  hardhat: '<path d="M4 15a8 8 0 0 1 16 0H4z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M2 15h20M12 15V8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  truck: '<path d="M3 7h10v8H3zM13 10h4l3 3v2h-7v-5z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><circle cx="7" cy="17" r="1.6" fill="currentColor"/><circle cx="17" cy="17" r="1.6" fill="currentColor"/>',
  building: '<rect x="5" y="3" width="14" height="18" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
  bed: '<path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 11V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
};

function logoMarkSVG(client, uid) {
  const gradId = `client-grad-${uid}`;
  return `
    <svg width="38" height="38" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${client.color}" stop-opacity="0.32" />
          <stop offset="100%" stop-color="${client.color}" stop-opacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="7" fill="url(#${gradId})" stroke="${client.color}" stroke-width="1.1" stroke-opacity="0.55" />
      <g style="color:${client.color}">${ICONS[client.icon] || ''}</g>
    </svg>
  `;
}

function logoCardHTML(client, uid) {
  if (client.logoUrl) {
    return `
      <div class="client-logo-card">
        <img src="${client.logoUrl}" alt="${client.name} logo" width="38" height="38" loading="lazy" />
        <span>${client.name}</span>
      </div>
    `;
  }
  return `
    <div class="client-logo-card">
      ${logoMarkSVG(client, uid)}
      <span>${client.name}</span>
    </div>
  `;
}

export function initClientsMarquee() {
  const track = document.getElementById('clients-track');
  const wrap = document.getElementById('clients-marquee-wrap');
  if (!track || !wrap) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Duplicate the list so the loop can scroll seamlessly from the first
  // copy straight into the second with no visible seam.
  track.innerHTML = [...clients, ...clients]
    .map((client, i) => logoCardHTML(client, i))
    .join('');

  if (reducedMotion) {
    track.classList.add('no-scroll');
    return;
  }

  if (!window.gsap) return;

  requestAnimationFrame(() => {
    const fullWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -fullWidth,
      duration: 26,
      ease: 'none',
      repeat: -1,
    });

    wrap.addEventListener('mouseenter', () => tween.pause());
    wrap.addEventListener('mouseleave', () => tween.play());
  });
}
