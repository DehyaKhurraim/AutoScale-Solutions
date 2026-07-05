// chatbot.js — live demo of the AutoScale AI assistant widget
//
// IMPORTANT — read before deploying:
// This is a front-end demo only. Responses are generated locally with
// keyword matching against the site's own content (services, industries,
// process, contact). There is no real LLM call here, on purpose: calling
// an AI API directly from client-side JS would require embedding a secret
// API key in code anyone can view in the browser, which is not safe to ship.
//
// To make this a real trained bot:
//   1. Stand up a small backend endpoint (e.g. /api/chat) that holds the
//      API key server-side and forwards the user's message to Claude.
//   2. Replace the `getReply()` function below with a fetch() call to that
//      endpoint, passing the conversation history and streaming back the
//      response.
// Everything else in this file (the UI, open/close state, message
// rendering, typing indicator) is production-ready as-is.

import { services, industries, process, portfolio, stats } from './data.js';

const GREETING = "Hi! I'm the AutoScale assistant — a live demo of the kind of chatbot we build for clients, trained on this site's own content. Ask me about our services, industries, process, past work, or how to get started.";

const SUGGESTIONS = [
  'What services do you offer?',
  'Do you work with my industry?',
  'What does your process look like?',
  'Show me examples of your work',
];

function findServiceMatch(text) {
  return services.find(s =>
    s.title.toLowerCase().split(/\W+/).some(word => word.length > 3 && text.includes(word)) ||
    s.tags.some(tag => text.includes(tag.toLowerCase()))
  );
}

function findIndustryMatch(text) {
  return industries.find(i => text.includes(i.toLowerCase()));
}

function findProcessMatch(text) {
  return process.find(p => text.includes(p.title.toLowerCase()));
}

function findPortfolioMatch(text) {
  return portfolio.find(p =>
    text.includes(p.title.toLowerCase()) ||
    p.tags.some(tag => text.includes(tag.toLowerCase())) ||
    p.category.toLowerCase().split(/\W+/).some(word => word.length > 3 && text.includes(word))
  );
}

function getReply(rawText) {
  const text = rawText.toLowerCase();

  if (/\b(hi|hello|hey|salaam|assalam)\b/.test(text)) {
    return "Hey there! Want to know about our chatbots, WhatsApp automation, workflow automation, our process, or something else?";
  }

  if (/whats ?app/.test(text)) {
    return "Our WhatsApp automation turns your business number into a 24/7 sales and support channel — it qualifies leads, books appointments, and tracks orders automatically. Want details on any of those?";
  }

  if (/(price|pricing|cost|how much|quote)/.test(text)) {
    return "Pricing depends on scope — a single WhatsApp flow is very different from a full workflow overhaul. The fastest way to get a real number is the project brief form below, or tell me what you want to automate and I'll point you to the right service.";
  }

  if (/(process|how.*work.*(with|together)|steps|methodology|approach)/.test(text)) {
    const stepHit = findProcessMatch(text);
    if (stepHit) {
      return `${stepHit.title} (step ${stepHit.number}): ${stepHit.copy}`;
    }
    return `We run a four-step process: ${process.map(p => `${p.number}. ${p.title}`).join(' → ')}. Ask about any single step for more detail.`;
  }

  if (/(portfolio|examples?|past work|case stud|shipped|projects?|clients?.*(built|made)|show me)/.test(text)) {
    const portfolioHit = findPortfolioMatch(text);
    if (portfolioHit) {
      return `${portfolioHit.title} (${portfolioHit.category}): ${portfolioHit.copy} You can see it live at ${portfolioHit.url}`;
    }
    return `Here's a couple of things we've shipped: ${portfolio.map(p => `${p.title} — ${p.category}`).join(', ')}. Scroll to the "Selected Work" section to open them live, or ask about one by name.`;
  }

  if (/(how many|stats?|numbers?|track record|proof|experience)/.test(text)) {
    return `Quick snapshot: ${stats.map(s => `${s.value}${s.suffix} ${s.label.toLowerCase()}`).join(', ')}.`;
  }

  if (/(industry|industries|sector|work with)/.test(text)) {
    const industryHit = findIndustryMatch(text);
    if (industryHit) {
      return `Yes — ${industryHit} is one of the sectors we build for. We tailor the automation (chatbots, WhatsApp, workflows) to how that industry actually operates rather than a one-size-fits-all bot.`;
    }
    return `We build across a wide range of industries — ${industries.slice(0, 6).join(', ')}, and more. Tell me yours and I'll confirm.`;
  }

  if (/(start|begin|get started|contact|talk to|human|sales)/.test(text)) {
    return "Easiest way: scroll down to the contact form and tell us what's eating your team's time — we reply within 48 hours. Or message us on WhatsApp directly using the callout in that section.";
  }

  if (/(service|services|offer|what.*do|help with)/.test(text)) {
    const serviceHit = findServiceMatch(text);
    if (serviceHit) {
      return `${serviceHit.title}: ${serviceHit.copy}`;
    }
    return `We cover five areas: ${services.map(s => s.title).join(' • ')}. Ask me about any one of these for specifics.`;
  }

  const serviceHit = findServiceMatch(text);
  if (serviceHit) {
    return `${serviceHit.title}: ${serviceHit.copy}`;
  }

  const portfolioHit = findPortfolioMatch(text);
  if (portfolioHit) {
    return `${portfolioHit.title} (${portfolioHit.category}): ${portfolioHit.copy} Live at ${portfolioHit.url}`;
  }

  const stepHit = findProcessMatch(text);
  if (stepHit) {
    return `${stepHit.title} (step ${stepHit.number}): ${stepHit.copy}`;
  }

  return "Good question — in a fully trained version I'd answer that from your real knowledge base. For this demo, try asking about our services, an industry, our process, past work, or how to get started.";
}

export function initChatbot() {
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const log = document.getElementById('chatbot-log');
  const suggestionsEl = document.getElementById('chatbot-suggestions');

  if (!form || !input || !log) return;

  function appendMessage(role, text) {
    const row = document.createElement('div');
    row.className = `chat-msg chat-msg-${role}`;
    row.textContent = text;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'chat-msg chat-msg-bot chat-typing';
    row.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function renderSuggestions() {
    if (!suggestionsEl) return;
    suggestionsEl.innerHTML = SUGGESTIONS.map(s => `<button type="button" class="chat-suggestion">${s}</button>`).join('');
    suggestionsEl.querySelectorAll('.chat-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        sendMessage(btn.textContent);
      });
    });
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    appendMessage('user', trimmed);
    input.value = '';

    const typingRow = showTyping();
    const delay = 500 + Math.min(trimmed.length * 12, 900);

    window.setTimeout(() => {
      typingRow.remove();
      appendMessage('bot', getReply(trimmed));
    }, delay);
  }

  // The panel is inline in its own section now (no open/close toggle) —
  // greet immediately so there's always something in the log when the
  // section scrolls into view.
  appendMessage('bot', GREETING);
  renderSuggestions();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });
}
