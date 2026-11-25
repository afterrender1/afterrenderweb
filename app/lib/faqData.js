// FAQ text shared by the FAQ sections (client components) and the FAQPage JSON-LD (server).
// Plain data only (no JSX / "use client"), so server components can read it for structured data.
// Keep the wording here identical to what the page shows: Google requires FAQ markup to match.

// Home (components/FAQ.jsx) and Pricing (components/PricingFAQ.jsx)
export const GENERAL_FAQS = [
  {
    question: "Did you help scale a social media presence to 100K+?",
    answer:
      "Yes, we have. We successfully helped two of our clients TMG and Regenerative Farmers of America, grow their social media accounts to over 100,000 followers.",
  },
  {
    question: "Do you work with coaches and business owners?",
    answer:
      "Yes, we do. We mainly work with coaches and business owners, and we help hundreds of them with their daily tasks. Our services are designed to support their business growth and make their work easier.",
  },
  {
    question: "Can you create a SaaS video for me?",
    answer:
      "Yes, we can. We just need your brand guidelines and a short meeting to understand your product and goals. After that, we will handle everything from idea to final video.",
  },
  {
    question: "What do I have to do from my side?",
    answer:
      "Minimal work from your end. You provide the brand voice, approve strategies, and show up for recording sessions (if applicable). We handle everything else—scripting, editing, posting, optimization, and reporting. It's designed to be completely done-for-you.",
  },
  {
    question: "How do you guys have an LTV of 2+ years with clients?",
    answer:
      "Simple—we deliver results consistently. Our clients stick with us because they see real ROI month after month. We focus on building long-term growth systems, not quick wins. Plus, our team becomes an extension of your business, deeply understanding your brand and audience over time.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "Our pricing is customized based on your specific needs and goals. We offer flexible packages for both one-time projects and ongoing retainers. Schedule a call with us to discuss a plan that works for your business.",
  },
  {
    question: "What differentiates you from other agencies?",
    answer:
      "We don't just create content—we build growth systems. With AI-powered workflows, proven frameworks, and a team that understands what actually drives results, we're operating 1-2 years ahead of traditional agencies. Plus, we only work with clients we know we can deliver massive value for.",
  },
];

// /website (components/WebsiteSections.jsx)
export const WEBSITE_FAQS = [
  {
    question: "How long does it take to build a website?",
    answer:
      "A landing page usually takes 5–7 days. A full business website takes 2–3 weeks depending on pages and features.",
  },
  {
    question: "Will my website work on mobile?",
    answer: "Yes. Every website we build is fully responsive and tested on mobile, tablet and desktop.",
  },
  {
    question: "Do you help with domain and hosting?",
    answer: "Yes, we can set up your domain, hosting and business email, or deploy to your existing setup.",
  },
  {
    question: "Can I edit the website myself later?",
    answer: "Absolutely. We can add a CMS so you can update text, images and blog posts without touching code.",
  },
  {
    question: "What happens after the website goes live?",
    answer: "We provide post-launch support and offer care plans for ongoing updates, fixes and new sections.",
  },
];

// /real-estate: industry chips in the last FAQ answer and in the lead form
export const REAL_ESTATE_INDUSTRIES = [
  "Realtors and real estate teams",
  "Mortgage brokers and loan officers",
  "Insurance agents",
  "Law firms and attorneys",
  "Dentists, med spas and clinics",
  "Chiropractors and physical therapists",
  "Gyms and personal trainers",
  "Restaurants, cafes and food trucks",
  "Salons, barbershops and beauty studios",
  "Home services (contractors, roofers, HVAC, landscapers)",
  "Auto dealerships and detailers",
  "Financial advisors and accountants",
  "Coaches and consultants",
  "E-commerce and local retail stores",
];

export const REAL_ESTATE_INDUSTRIES_INTRO = "We work with any business that wants to grow through video, especially:";
export const REAL_ESTATE_INDUSTRIES_OUTRO =
  "Don't see your industry? Reach out anyway. If you have customers to reach, we can make video work for you.";

// /real-estate (components/RealEstateFAQ.jsx). The last answer is rendered with chips on the page;
// `answer` here is its plain-text form for structured data.
export const REAL_ESTATE_FAQS = [
  {
    question: "Do I have to be in the videos?",
    answer:
      "No. Some clients love being on camera, others would rather we film the product, the space or the team. We'll plan around whatever you're comfortable with.",
  },
  {
    question: "What's the difference between mobile and cinema camera?",
    answer:
      "Mobile videos look native to Instagram and TikTok, which works really well for casual, behind-the-scenes content. Cinema camera footage has a richer, more professional look, which is better if you want your brand to feel premium.",
  },
  {
    question: "Can I make changes to the videos?",
    answer: "Yes. You'll review every video before it goes live, and revisions are included.",
  },
  {
    question: "What software do you use?",
    answer:
      "We edit in Adobe Premiere Pro and After Effects, and color grade in DaVinci Resolve. These are the same tools used for commercials and professional film work.",
  },
  {
    question: "What kinds of businesses do you work with?",
    answer: `${REAL_ESTATE_INDUSTRIES_INTRO} ${REAL_ESTATE_INDUSTRIES.join(", ")}. ${REAL_ESTATE_INDUSTRIES_OUTRO}`,
    industries: true,
  },
];
