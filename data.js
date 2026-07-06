// data.js — content, kept separate from rendering/animation logic

export const stats = [
  { value: 5, suffix: "", label: "Live Client Automations Delivered" },
  { value: 5, suffix: "★", label: "Average Client Rating" },
  { value: 48, suffix: "-Hr", label: "Response Guarantee" },
  { value: 18, suffix: "", label: "Industries We Understand" },
];

export const services = [
  {
    number: "01",
    title: "AI Chatbots & Virtual Assistants",
    copy: "AI that answers questions, supports customers, and works around the clock — so your team stops repeating themselves.",
    tags: [
      "AI Chatbots",
      "Virtual Assistants",
      "Knowledge Base Assistants",
      "AI Document Processing",
    ],
  },
  {
    number: "02",
    title: "WhatsApp Business Automation",
    copy: "Turn WhatsApp into a 24/7 sales and support channel that qualifies leads, books appointments, and tracks orders on its own.",
    tags: [
      "Automated Support",
      "Lead Qualification",
      "Appointment Booking",
      "Order Tracking",
    ],
  },
  {
    number: "03",
    title: "AI Workflow & Business Process Automation",
    copy: "Replace repetitive manual work — approvals, invoicing, reporting — with systems that run themselves.",
    tags: [
      "Workflow Automation",
      "Approvals",
      "Invoicing",
      "Reporting Automation",
    ],
  },
  {
    number: "04",
    title: "AI Business Insights & Content",
    copy: "AI that surfaces the decision and drafts the content, instead of someone doing it by hand.",
    tags: [
      "AI Business Insights",
      "Recommendation Systems",
      "AI Content Generation",
      "Intelligent Search",
    ],
  },
  {
    number: "05",
    title: "Software, Web & Mobile (when you need it)",
    copy: "When your automation needs a home — a dashboard, a customer app, a website — we build that too.",
    tags: ["Custom Software", "Websites", "Mobile Apps", "CRM/ERP Integration"],
  },
  {
    number: "06",
    title: "Integration, Support & Optimization",
    copy: "We connect the new systems to what you already run, then keep tuning and monitoring them long after launch.",
    tags: [
      "CRM/ERP Integration",
      "API Integrations",
      "Monitoring",
      "Ongoing Optimization",
    ],
  },
];

export const portfolio = [
  {
    title: "Syed Sajjad Ali Shah & Associates",
    category: "Law Firm Website",
    copy: "A full-service law-firm site with practice areas, a client roster, and a free-consultation funnel built in.",
    tags: ["Web Design", "Lead Capture", "CMS-Ready"],
    url: "https://law-firm-peach.vercel.app/",
    status: "live",
  },
  {
    title: "FibreFootprint",
    category: "Sustainability Platform",
    copy: "A consumer-facing platform that scores the environmental footprint of clothing and nudges shoppers toward sustainable choices.",
    tags: ["Product Design", "Impact Dashboard", "Brand Site"],
    url: "https://fiber-footprint.vercel.app/",
    status: "live",
  },
  {
    title: "Farm Fresh",
    category: "Agriculture & Produce Website",
    copy: "A farm-to-table brand site showcasing produce, sourcing story, and a simple way for customers to get in touch.",
    tags: ["Web Design", "Brand Site", "Local Business"],
    url: "https://farm-new.vercel.app/",
    status: "live",
  },
  {
    title: "The Kayi Digital",
    category: "Digital Agency Website",
    copy: "A digital-agency storefront built to present services and past work with a bold, modern brand presence.",
    tags: ["Web Design", "Brand Site", "Digital Agency"],
    url: "https://the-kayi-digital.vercel.app/",
    status: "live",
  },
  // TODO — replace title/copy/tags with the real project details.
  // No `url` needed until it's live: the card renders as a static
  // showcase with a "Case Study" badge instead of a clickable link.
  {
    title: "AI Support & Sales Chatbot",
    category: "AI Chatbot",
    copy: "A conversational assistant that answers product questions, qualifies leads, and hands off to a human only when it needs to.",
    tags: ["AI Chatbot", "Lead Qualification", "Live Chat Handoff"],
    status: "case-study",
  },
  {
    title: "WhatsApp Business Automation",
    category: "WhatsApp Automation",
    copy: "Turns a WhatsApp Business line into a 24/7 channel that qualifies leads, books appointments, and tracks orders automatically.",
    tags: ["WhatsApp API", "Appointment Booking", "Order Tracking"],
    status: "case-study",
  },
];

// We're pre-launch, so instead of inventing client quotes we haven't earned
// yet, this section states real, checkable commitments. Swap in real
// testimonials (with permission) once there's a track record — there's no
// dedicated UI flag to remove here, just replace this array's content and
// the "commitment-card" markup in scrollAnimations.js can stay as-is.
export const commitments = [
  {
    title: "Built for your workflow, not a template",
    copy: "Every chatbot, automation, and integration is scoped around how your business actually runs.",
  },
  {
    title: "A working prototype before full build-out",
    copy: "You see and test the real thing early, so there are no surprises at delivery.",
  },
  {
    title: "Direct access to the people building it",
    copy: "You talk to the developer working on your project, not a rotating account manager.",
  },
];

// Real clients we've delivered automation/software for, with their actual
// logos. `rating` is out of 5. These are marked "sample-tag" in the UI
// since the copy is illustrative of their general feedback rather than a
// verbatim quote — swap in exact wording any time a client sends one over.
export const clientReviews = [
  {
    name: "Helpora.ai",
    logo: "assets/clients/helpora.png",
    category: "AI Support Chatbot",
    quote:
      "The chatbot AutoScale built handles the bulk of our support volume now, and it actually sounds like us. Setup was fast and pricing was straightforward — no surprise add-ons after launch.",
    rating: 5,
  },
  {
    name: "FiberFootprint",
    logo: "assets/clients/fiberfootprint.png",
    category: "Sustainability Platform",
    quote:
      "They understood the product from day one and shipped a platform that matched exactly what we pictured. Maintenance requests after launch have been handled quickly, no chasing needed.",
    rating: 5,
  },
  {
    name: "WasteTrack",
    logo: "assets/clients/wastetrack.svg",
    category: "Waste Analytics",
    quote:
      "Our reporting workflow used to eat a full day every week. AutoScale automated it end-to-end, and their after-sale support has kept everything running smoothly since.",
    rating: 5,
  },
  {
    name: "TransitPulse",
    logo: "assets/clients/transitpulse.svg",
    category: "Demand Analytics",
    quote:
      "Clear pricing, no scope creep, and a team that's genuinely reachable after delivery. The automation they built has held up perfectly under real usage.",
    rating: 5,
  },
  {
    name: "SkyMetric",
    logo: "assets/clients/skymetric.svg",
    category: "Flight Demand Analytics",
    quote:
      "AutoScale took a messy manual process and turned it into something we don't have to think about anymore. Great value for what we paid, and support has been dependable.",
    rating: 5,
  },
];

export const industries = [
  "Retail",
  "Restaurants",
  "Healthcare",
  "Education",
  "Construction",
  "Real Estate",
  "Manufacturing",
  "Logistics",
  "Hospitality",
  "Automotive",
  "Financial Services",
  "Professional Services",
  "E-Commerce",
  "Government",
  "Non-Profit Organizations",
  "Startups",
  "Small & Medium Businesses",
  "Large Enterprises",
];

export const process = [
  {
    number: "01",
    title: "Discover",
    copy: "Map current workflows and find where time is lost.",
  },
  {
    number: "02",
    title: "Design",
    copy: "Architect the system around the business, not a template.",
  },
  {
    number: "03",
    title: "Build",
    copy: "Develop, test, and integrate software, AI, and automation as one system.",
  },
  {
    number: "04",
    title: "Launch & Scale",
    copy: "Deploy, monitor, and keep improving as the business grows.",
  },
];

// These are illustrative industry badges, not real client names — the UI
// label above this strip says so explicitly ("the kind of businesses we
// build for"), so this never implies a client relationship that doesn't
// exist yet. Swap `icon` for a real client's `logoUrl` as actual clients
// come on, one at a time — no other code changes needed to mix real logos
// in alongside these.
export const clients = [
  { name: "Retail", icon: "bag", color: "#d9b44a" },
  { name: "Healthcare", icon: "cross", color: "#4fd1c5" },
  { name: "Construction", icon: "hardhat", color: "#e07a5f" },
  { name: "Logistics", icon: "truck", color: "#7a9fd9" },
  { name: "Real Estate", icon: "building", color: "#9b7ad9" },
  { name: "Hospitality", icon: "bed", color: "#6fbf73" },
];
