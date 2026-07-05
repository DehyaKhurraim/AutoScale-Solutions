// scrollAnimations.js — GSAP ScrollTrigger: reveals, stat count-up, progress bar, nav state
import { stats, services, portfolio, commitments, process } from './data.js';

export function initScrollAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  renderStats();
  renderServices();
  renderPortfolio();
  renderCommitments();
  renderProcess();
  initTiltCards();

  initNavState();
  initProgressBar();

  if (reducedMotion || !window.gsap) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    if (window.gsap) animateStatCounters(true);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      delay: (i % 3) * 0.05,
    });
  });

  gsap.utils.toArray('.service-card, .portfolio-card, .testimonial-card, .process-step').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
    });
  });

  animateStatCounters(false);
}

function initNavState() {
  const nav = document.getElementById('site-nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initProgressBar() {
  const bar = document.getElementById('scroll-progress');
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function renderStats() {
  const grid = document.getElementById('stats-grid');
  grid.innerHTML = stats.map((s, i) => `
    <div class="stat-item">
      <span class="stat-value" data-target="${s.value}" data-suffix="${s.suffix}" id="stat-${i}">0${s.suffix}</span>
      <p class="stat-label">${s.label}</p>
    </div>
  `).join('');
}

function animateStatCounters(instant) {
  const els = document.querySelectorAll('.stat-value');
  els.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';

    if (instant || !window.gsap) {
      el.textContent = target + suffix;
      return;
    }

    const counter = { val: 0 };
    gsap.to(counter, {
      val: target,
      duration: 1.6,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(counter.val) + suffix;
      },
    });
  });
}

function renderServices() {
  const grid = document.getElementById('services-grid');
  grid.innerHTML = services.map(s => `
    <article class="service-card">
      <span class="service-number">${s.number}</span>
      <h3>${s.title}</h3>
      <p>${s.copy}</p>
      <div class="tag-row">
        ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  grid.innerHTML = portfolio.map(p => {
    const isLive = !!p.url;
    const tag = isLive ? 'a' : 'div';
    const linkAttrs = isLive ? `href="${p.url}" target="_blank" rel="noopener noreferrer"` : '';
    return `
    <${tag} class="portfolio-card${isLive ? '' : ' not-live'}" ${linkAttrs}>
      <div class="portfolio-card-inner">
        <div class="portfolio-top-row">
          <span class="portfolio-category">${p.category}</span>
          ${isLive ? '' : '<span class="status-badge">Case Study</span>'}
        </div>
        <h3>${p.title}</h3>
        <p>${p.copy}</p>
        <div class="tag-row">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        ${isLive
          ? '<span class="portfolio-link">Visit live site &rarr;</span>'
          : '<span class="portfolio-link portfolio-link-muted">Live preview coming soon</span>'}
      </div>
    </${tag}>
  `;
  }).join('');
}

// Subtle pointer-driven 3D tilt on cards — cheap, GPU-friendly, and skipped
// entirely for touch/reduced-motion so it never gets in the way on mobile.
function initTiltCards() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (reducedMotion || isTouch) return;

  const cards = document.querySelectorAll('.service-card, .portfolio-card, .commitment-card, .stat-item');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function renderCommitments() {
  const grid = document.getElementById('commitments-grid');
  if (!grid) return;
  grid.innerHTML = commitments.map(c => `
    <article class="commitment-card">
      <h3>${c.title}</h3>
      <p class="testimonial-quote">${c.copy}</p>
    </article>
  `).join('');
}

function renderProcess() {
  const wrap = document.getElementById('process-timeline');
  wrap.innerHTML = process.map(p => `
    <div class="process-step">
      <span class="process-num">${p.number}</span>
      <h3>${p.title}</h3>
      <p>${p.copy}</p>
    </div>
  `).join('');
}
