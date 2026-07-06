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

import { industries, portfolio, process, services } from "./data.js";

const GREETING =
  "Hi! I'm the AutoScale assistant — a live demo of the kind of chatbot we build for clients, trained on this site's own content. Ask me about our services, industries, process, past work, pricing, or how to get started.";

const SUGGESTIONS = [
  "What services do you offer?",
  "Do you work with my industry?",
  "What does your process look like?",
  "Show me examples of your work",
  "How much does it cost?",
];

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function findServiceMatch(text) {
  const normalized = normalizeText(text);
  return services.find((s) => {
    const titleWords = s.title.toLowerCase().split(/\W+/).filter(Boolean);
    return (
      titleWords.some((word) => word.length > 3 && normalized.includes(word)) ||
      s.tags.some((tag) => normalized.includes(normalizeText(tag)))
    );
  });
}

function findIndustryMatch(text) {
  const normalized = normalizeText(text);
  return industries.find((i) => normalized.includes(normalizeText(i)));
}

function findProcessMatch(text) {
  const normalized = normalizeText(text);
  return process.find(
    (p) =>
      normalized.includes(normalizeText(p.title)) ||
      normalized.includes(p.number),
  );
}

function findPortfolioMatch(text) {
  const normalized = normalizeText(text);
  return portfolio.find(
    (p) =>
      normalized.includes(normalizeText(p.title)) ||
      p.tags.some((tag) => normalized.includes(normalizeText(tag))) ||
      p.category
        .toLowerCase()
        .split(/\W+/)
        .some((word) => word.length > 3 && normalized.includes(word)),
  );
}

function detectTopic(text, contextTopic) {
  const normalized = normalizeText(text);

  if (
    /(hi|hello|hey|greeting|good morning|good afternoon|good evening|salaam|assalam)/.test(
      normalized,
    )
  ) {
    return "greeting";
  }
  if (
    /(price|pricing|cost|budget|quote|estimate|how much|cheap|expensive)/.test(
      normalized,
    )
  ) {
    return "pricing";
  }
  if (
    /(process|steps|timeline|workflow|approach|method|how.*work|how.*do)/.test(
      normalized,
    )
  ) {
    return "process";
  }
  if (
    /(portfolio|examples?|past work|case study|projects?|worked on|show me|recent work)/.test(
      normalized,
    )
  ) {
    return "portfolio";
  }
  if (
    /(industry|industries|sector|vertical|business type|niche|work with)/.test(
      normalized,
    )
  ) {
    return "industries";
  }
  if (
    /(support|maintenance|updates|monitor|optimi|after launch|help|ongoing)/.test(
      normalized,
    )
  ) {
    return "support";
  }
  if (
    /(contact|start|begin|get started|talk|book|demo|human|sales|reply|reach)/.test(
      normalized,
    )
  ) {
    return "contact";
  }
  if (
    /(service|services|offer|offerings|automate|automation|chatbot|whatsapp|workflow|software|integration|mobile)/.test(
      normalized,
    )
  ) {
    return "services";
  }
  if (
    /(tell me more|more about that|expand|details?|explain)/.test(normalized) &&
    contextTopic
  ) {
    return contextTopic;
  }
  return "general";
}

function getReply(rawText, context = {}) {
  const text = normalizeText(rawText);
  const topic = detectTopic(text, context.lastTopic);
  const serviceHit = findServiceMatch(text);
  const industryHit = findIndustryMatch(text);
  const processHit = findProcessMatch(text);
  const portfolioHit = findPortfolioMatch(text);

  if (topic === "greeting") {
    return {
      text: "Hi! I'm the AutoScale assistant — a live demo of the kind of AI support we build for clients. I can explain our services, show examples of work, outline our process, or help you get started.",
      topic,
    };
  }

  if (topic === "services") {
    if (serviceHit) {
      return { text: `${serviceHit.title}: ${serviceHit.copy}`, topic };
    }
    return {
      text: `We work across ${services.length} core service areas, including ${services
        .slice(0, 4)
        .map((s) => s.title)
        .join(" • ")}. Ask me about a specific area and I'll go deeper.`,
      topic,
    };
  }

  if (topic === "process") {
    if (processHit) {
      return {
        text: `${processHit.title} (step ${processHit.number}): ${processHit.copy}`,
        topic,
      };
    }
    return {
      text: `Our process is simple: ${process.map((p) => `${p.number}. ${p.title}`).join(" → ")}. We map the workflow first, then design, build, launch, and keep improving after go-live.`,
      topic,
    };
  }

  if (topic === "portfolio") {
    if (portfolioHit) {
      return {
        text: `${portfolioHit.title} (${portfolioHit.category}): ${portfolioHit.copy}${portfolioHit.url ? ` Live at ${portfolioHit.url}` : ""}`,
        topic,
      };
    }
    return {
      text: `We’ve shipped work across web, automation, and AI products — including ${portfolio
        .slice(0, 4)
        .map((p) => `${p.title} (${p.category})`)
        .join(", ")}. Ask about one by name if you want the details.`,
      topic,
    };
  }

  if (topic === "industries") {
    if (industryHit) {
      return {
        text: `Yes — ${industryHit} is one of the industries we understand well. We tailor chatbots, WhatsApp automation, and workflows around how that business actually operates.`,
        topic,
      };
    }
    return {
      text: `We work across industries like ${industries.slice(0, 6).join(", ")} and more. Tell me yours and I’ll match it to the right automation path.`,
      topic,
    };
  }

  if (topic === "pricing") {
    return {
      text: "Pricing depends on scope — a single WhatsApp flow is very different from a full AI and workflow rollout. The fastest way to get a real estimate is to share what you want to automate and we can scope it clearly.",
      topic,
    };
  }

  if (topic === "support") {
    return {
      text: "We support what we build after launch with monitoring, tuning, and improvements, so the bot or automation keeps performing as your business changes.",
      topic,
    };
  }

  if (topic === "contact") {
    return {
      text: "The best next step is to send us a brief with what you want to automate. We usually reply within 48 hours and can help shape the right solution from there.",
      topic,
    };
  }

  if (topic === "general" && serviceHit) {
    return {
      text: `${serviceHit.title}: ${serviceHit.copy}`,
      topic: "services",
    };
  }

  if (topic === "general" && portfolioHit) {
    return {
      text: `${portfolioHit.title} (${portfolioHit.category}): ${portfolioHit.copy}`,
      topic: "portfolio",
    };
  }

  if (topic === "general" && processHit) {
    return {
      text: `${processHit.title} (step ${processHit.number}): ${processHit.copy}`,
      topic: "process",
    };
  }

  return {
    text: "Good question — I can help with services, industries, process, examples, pricing, or next steps. Try asking about one of those and I’ll narrow it down.",
    topic: "general",
  };
}

export function initChatbot() {
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const log = document.getElementById("chatbot-log");
  const suggestionsEl = document.getElementById("chatbot-suggestions");

  if (!form || !input || !log) return;

  const conversationContext = { lastTopic: "greeting" };

  function appendMessage(role, text) {
    const row = document.createElement("div");
    row.className = `chat-msg chat-msg-${role}`;
    row.textContent = text;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function showTyping() {
    const row = document.createElement("div");
    row.className = "chat-msg chat-msg-bot chat-typing";
    row.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  function renderSuggestions() {
    if (!suggestionsEl) return;
    suggestionsEl.innerHTML = SUGGESTIONS.map(
      (s) => `<button type="button" class="chat-suggestion">${s}</button>`,
    ).join("");
    suggestionsEl.querySelectorAll(".chat-suggestion").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendMessage(btn.textContent);
      });
    });
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    appendMessage("user", trimmed);
    input.value = "";

    const typingRow = showTyping();
    const delay = 500 + Math.min(trimmed.length * 12, 900);

    window.setTimeout(() => {
      typingRow.remove();
      const reply = getReply(trimmed, conversationContext);
      conversationContext.lastTopic = reply.topic;
      appendMessage("bot", reply.text);
    }, delay);
  }

  appendMessage("bot", GREETING);
  renderSuggestions();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage(input.value);
  });
}
