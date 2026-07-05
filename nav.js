// nav.js — mobile hamburger menu (open/close, backdrop, escape, link-close)
export function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const backdrop = document.getElementById('nav-backdrop');
  if (!toggle || !links || !backdrop) return;

  let open = false;

  function setOpen(next) {
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('nav-links-open', open);
    backdrop.classList.toggle('visible', open);
    document.body.classList.toggle('nav-lock-scroll', open);
  }

  toggle.addEventListener('click', () => setOpen(!open));
  backdrop.addEventListener('click', () => setOpen(false));

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && open) setOpen(false);
  });
}
