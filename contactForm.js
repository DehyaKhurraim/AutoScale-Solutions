// contactForm.js — animated 3D submit button + toast for the project-brief form
//
// IMPORTANT — read before deploying:
// The form still has no real backend (see the NOTE in index.html). This
// module simulates a network round-trip so the button/loader/toast can be
// built and reviewed now. To wire up real delivery:
//   1. Replace the body of `submitBrief()` below with a real fetch() call
//      to your form-processing endpoint (Formspree, EmailJS, custom API).
//   2. Keep the try/catch shape — resolve on a real 2xx response, throw
//      (or return false) on a non-2xx response, so the existing
//      success/error UI keeps working unchanged.

const SIMULATED_LATENCY_MS = 1400;

function validate(form) {
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const brief = form.querySelector('#brief');

  if (!name.value.trim() || !brief.value.trim()) return false;
  // Simple, permissive email shape check — real validation happens server-side.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
}

// Placeholder network call. Swap this out for a real fetch() per the note
// above — the caller only cares whether the returned promise resolves or
// rejects.
function submitBrief(payload) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve(payload);
    }, SIMULATED_LATENCY_MS);
  });
}

function showToast(root, { type, title, message }) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

  const icon = type === 'success'
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><path d="M7 12.5l3.2 3.2L17 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/><path d="M12 7.5v6M12 16.8h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-copy">
      <strong class="toast-title">${title}</strong>
      <span class="toast-message">${message}</span>
    </span>
    <button type="button" class="toast-close" aria-label="Dismiss">&times;</button>
  `;

  root.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-in'));

  let dismissTimer = null;
  function dismiss() {
    if (dismissTimer) window.clearTimeout(dismissTimer);
    toast.classList.remove('toast-in');
    toast.classList.add('toast-out');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  dismissTimer = window.setTimeout(dismiss, 5200);
}

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-brief-btn');
  const toastRoot = document.getElementById('toast-root');
  if (!form || !btn || !toastRoot) return;

  let state = 'idle'; // idle | loading | success | error

  function setState(next) {
    state = next;
    btn.dataset.state = next;
    btn.disabled = next === 'loading';
  }

  setState('idle');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state === 'loading') return;

    if (!validate(form)) {
      setState('error');
      showToast(toastRoot, {
        type: 'error',
        title: "Couldn't send that",
        message: 'Please fill in your name, a valid work email, and what you want to automate.',
      });
      window.setTimeout(() => setState('idle'), 2200);
      return;
    }

    setState('loading');

    const payload = {
      name: form.querySelector('#name').value.trim(),
      email: form.querySelector('#email').value.trim(),
      company: form.querySelector('#company').value.trim(),
      brief: form.querySelector('#brief').value.trim(),
    };

    try {
      await submitBrief(payload);
      setState('success');
      showToast(toastRoot, {
        type: 'success',
        title: 'Project brief sent',
        message: "We'll reply within 48 hours with how we'd automate it.",
      });
      form.reset();
      window.setTimeout(() => setState('idle'), 2600);
    } catch (err) {
      setState('error');
      showToast(toastRoot, {
        type: 'error',
        title: 'Something went wrong',
        message: 'That request failed to send. Please try again in a moment.',
      });
      window.setTimeout(() => setState('idle'), 2200);
    }
  });
}
