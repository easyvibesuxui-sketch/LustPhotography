// Legal and policy pages, rendered by app/legal/[slug]. Plain text only: each section is
// a heading, paragraphs, and an optional bullet list. Keep the footer links in sync.

export type LegalSection = { h: string; p?: string[]; list?: string[] };
export type LegalPage = { slug: string; title: string; eyebrow: string; intro: string; sections: LegalSection[]; form?: boolean };

export const LEGAL_UPDATED = "7 November 2026";

const REPORT = "the form on our Complaints & Content Removal page (/legal/complaints/)";

export const legalPages: LegalPage[] = [
  {
    slug: "terms",
    title: "Terms & Conditions",
    eyebrow: "The rules of the house",
    intro: "These terms govern your use of Lust Photography (lustyphotography.com). By entering the site, creating an account or buying a membership you agree to them. If you do not agree, please leave the site.",
    sections: [
      {
        h: "1. Adults only",
        p: [
          "The site contains sexually explicit material and is intended only for adults. You may use it only if you are at least 18 years old, and at least the age of majority where you live if that is higher.",
          "You must not use the site where viewing adult material is illegal, and you must not let anyone under 18 see it. By confirming the age gate you confirm both of these.",
        ],
      },
      {
        h: "2. What the content is",
        p: [
          "Every image and video on Lust Photography is created with artificial-intelligence tools in our studio. The people shown — our \"muses\" — are fictional characters, all depicted as adults. They do not exist, and no real person appears in our content.",
          "Any resemblance to a real person is unintended. If you believe something resembles you or someone you represent, tell us through " + REPORT + " and we will review it promptly.",
        ],
      },
      {
        h: "3. Accounts",
        list: [
          "Give a valid email address and keep your password private. You are responsible for activity on your account.",
          "One person per account. Do not share, sell or transfer access.",
          "We may suspend or close an account that breaks these terms, attempts to bypass access controls, or is used for fraud.",
          "You can ask us to close your account at any time through " + REPORT + ".",
        ],
      },
      {
        h: "4. Memberships",
        p: [
          "Content is offered at three levels — Dolce Vita (free), Boudoir and Privé. What each level includes is described on the Pricing page. Paid memberships, when available, are sold and billed as explained in our Billing Support page, and the price and renewal terms are shown before you pay.",
        ],
      },
      {
        h: "5. How you may use the content",
        list: [
          "Content is licensed to you for personal, private, non-commercial viewing on the site only.",
          "Do not download, copy, record, redistribute, resell, re-upload or publicly display it, and do not remove watermarks or notices.",
          "Do not use the content, or the names and likenesses of our muses, to train AI models or to create deepfakes or other material depicting real people.",
          "Do not scrape the site or use automated tools to access it.",
        ],
      },
      {
        h: "6. Intellectual property",
        p: ["The site, its design, text, characters, images and videos belong to Lust Photography or its licensors and are protected by intellectual-property law. Nothing in these terms transfers ownership to you."],
      },
      {
        h: "7. Prohibited conduct",
        list: [
          "Breaking any law, or using the site to harm, harass or defraud anyone.",
          "Attempting to access content above your membership level, other users' accounts, or our systems.",
          "Submitting false reports or other people's personal information.",
        ],
      },
      {
        h: "8. Reports and removals",
        p: ["We take reports about content seriously — especially anything that could appear to depict a minor, a real person, or non-consensual activity. See our Complaints & Content Removal page for how to report and what happens next."],
      },
      {
        h: "9. Availability and changes",
        p: [
          "We may add, change or remove content and features at any time, and the site may occasionally be unavailable for maintenance.",
          "We may update these terms. The date at the top of the page shows the latest version; if a change is significant, we will tell members by email or on the site. Continuing to use the site after a change means you accept it.",
        ],
      },
      {
        h: "10. Disclaimers and liability",
        p: [
          "The site is provided \"as is\". To the extent the law allows, we make no promise that it will be uninterrupted or error-free, and we are not liable for indirect or consequential losses arising from your use of it.",
          "Nothing in these terms limits any right you have under consumer law that cannot be limited by agreement.",
        ],
      },
      {
        h: "11. Contact",
        p: ["Questions about these terms can be sent through " + REPORT + " — choose \"Other\"."],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "What we keep, and why",
    intro: "We collect as little as we can. This policy explains what we hold about you, why, how long we keep it, and the choices you have.",
    sections: [
      {
        h: "What we collect",
        list: [
          "Account details — your email address and a securely hashed password (we never store or see the password itself), your membership level and when you joined.",
          "Sign-in sessions — a random session token, stored only as a hash, so you stay signed in.",
          "Newsletter and waitlist sign-ups — your email address, where you signed up, and which plan you asked about.",
          "Messages you send us — brand or creator enquiries and reports, with the details you choose to include.",
          "Security records — failed sign-in attempts for an email address, kept briefly to block password-guessing.",
          "Basic technical logs kept by our hosting provider (such as IP address and request time) for security and to keep the service running.",
        ],
      },
      {
        h: "What we do not do",
        list: [
          "We do not sell or rent your personal data.",
          "We do not run third-party advertising or analytics trackers on the site.",
          "We do not ask for your real name, address or identity document to browse.",
        ],
      },
      {
        h: "Why we use it",
        list: [
          "To run your account and give you the content your membership includes (performance of our agreement with you).",
          "To keep the site and your account secure and prevent abuse (our legitimate interests).",
          "To send the newsletter you asked for (your consent — you can unsubscribe at any time).",
          "To handle reports and comply with the law (legal obligation).",
        ],
      },
      {
        h: "Who processes it",
        p: [
          "The site, its database and media storage run on Cloudflare, which processes data on our behalf. When paid memberships launch, payments will be handled by a specialist payment processor; we will not receive or store your full card number. We name the processor on the Billing Support page once it is live.",
          "We may disclose information if the law requires it, or to protect people from harm.",
        ],
      },
      {
        h: "How long we keep it",
        list: [
          "Account data — for as long as your account is open, then deleted within 30 days of closure, except where we must keep records for legal or billing reasons.",
          "Sessions — until they expire (30 days) or you sign out.",
          "Failed sign-in records — a short period only.",
          "Reports — as long as needed to resolve them and to show how we handled them.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "Depending on where you live, you may have the right to access, correct, delete or export your data, to object to or restrict how we use it, and to withdraw consent. To make a request, use " + REPORT + " and choose \"Privacy request\". We will reply within one month.",
          "You can also complain to the data-protection authority where you live.",
        ],
      },
      {
        h: "Security",
        p: ["Passwords are hashed with PBKDF2, session tokens are stored only as hashes, cookies are HTTP-only and secure, and all traffic uses HTTPS. No system is perfectly secure, so please use a password you do not use elsewhere."],
      },
      {
        h: "Children",
        p: ["The site is for adults only. We do not knowingly collect data from anyone under 18; if we learn we have, we delete it."],
      },
      {
        h: "Changes",
        p: ["If we change this policy, we will update the date at the top and, for significant changes, let members know."],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookies Policy",
    eyebrow: "One cookie, a few preferences",
    intro: "We use the minimum needed to make the site work. There are no advertising or third-party tracking cookies, so there is nothing to opt out of.",
    sections: [
      {
        h: "The cookie we set",
        list: ["lp_session — keeps you signed in. Strictly necessary, HTTP-only and secure, expires after 30 days or when you sign out."],
      },
      {
        h: "Preferences stored in your browser",
        p: ["These never leave your device and are not sent to us:"],
        list: [
          "lp-age — remembers that you passed the 18+ age gate, for this browser session only.",
          "lp-sound — whether you muted the soundtrack.",
          "lp-veil and lp-prive — whether locked previews are veiled, depending on your membership.",
          "lp-modal — that you have already seen the newsletter pop-up this session.",
        ],
      },
      {
        h: "Fonts and other services",
        p: ["Fonts are served from our own domain, so loading a page does not contact Google or other font services. We do not embed social-media widgets or analytics scripts."],
      },
      {
        h: "Managing them",
        p: ["You can clear cookies and site data in your browser settings at any time. Clearing them will sign you out and bring back the age gate."],
      },
    ],
  },
  {
    slug: "billing",
    title: "Billing Support",
    eyebrow: "Memberships & payments",
    intro: "Here is how memberships are charged, and how to get help with a payment.",
    sections: [
      {
        h: "Current status",
        p: [
          "Dolce Vita is free. Paid memberships (Boudoir and Privé) are not on sale yet — you can join the waitlist from the Pricing page and we will email you when they open. No one is charged in the meantime.",
        ],
      },
      {
        h: "When paid memberships open",
        list: [
          "Payments will be taken by a specialist payment processor, which will be named here. The name on your card statement will be shown before you pay.",
          "The price, currency, billing period and renewal terms are shown before you confirm. Memberships renew automatically until cancelled.",
          "You will be able to cancel at any time; you keep access until the end of the period you paid for.",
        ],
      },
      {
        h: "Refunds",
        p: ["If you were charged by mistake, charged twice, or could not access what you paid for, contact us and we will put it right — including a refund where appropriate. Any rights you have under consumer law are not affected."],
      },
      {
        h: "Help with a payment",
        p: ["Use " + REPORT + " and choose \"Billing\". Include the email on your account and the date and amount of the charge — never send your full card number."],
      },
    ],
  },
  {
    slug: "compliance",
    title: "Compliance Statement",
    eyebrow: "How our content is made",
    intro: "Lust Photography publishes only AI-generated imagery of fictional adult characters. This statement explains what that means and the safeguards we apply.",
    sections: [
      {
        h: "No real people",
        p: [
          "All images and videos are created with generative AI tools. No photographs or recordings of real people are used, and no real performers appear on the site. Our muses are fictional characters, each described and depicted as an adult.",
          "We do not create content intended to resemble a real, identifiable person. If a likeness is reported, we review it and remove it where appropriate.",
        ],
      },
      {
        h: "Adults only — in every frame",
        p: ["Every character must clearly read as an adult. Before anything is published, each image and each video — every part of the clip, not only its cover — is reviewed individually. We do not publish anything where a character could appear to be under 18, including:"],
        list: [
          "youthful or childlike faces or bodies, braces, or school-style styling;",
          "school, graduation or similar settings;",
          "cartoon or anime styles that read as young;",
          "sleeping or unconscious people, or voyeuristic, non-consensual framing.",
        ],
      },
      {
        h: "Ongoing review",
        p: ["We re-review our library periodically and remove anything that no longer meets these standards. When in doubt, we leave it out."],
      },
      {
        h: "Access controls",
        p: ["The site is behind an 18+ age gate. Explicit material is available only to signed-in members of the relevant level; everyone else sees blurred previews."],
      },
      {
        h: "Reporting",
        p: ["If you see anything that concerns you, please report it through " + REPORT + ". Reports about content that may depict a minor are handled first."],
      },
    ],
  },
  {
    slug: "complaints",
    title: "Complaints & Content Removal",
    eyebrow: "Tell us, and we act",
    intro: "If something on the site concerns you — a possible minor, a resemblance to a real person, a copyright issue, a privacy or billing problem — tell us here. Every report is read by a person.",
    form: true,
    sections: [
      {
        h: "What happens next",
        list: [
          "Possible minor, non-consensual content or a real person's likeness: we take the content down while we review it, normally within 24 hours of the report.",
          "Other reports: we reply within 7 days.",
          "If we decide not to remove reported content, we will tell you why, and you can ask us to look again.",
        ],
      },
      {
        h: "What to include",
        list: [
          "A link to the page, image or video (copy it from your browser's address bar).",
          "What the problem is, in a sentence or two.",
          "An email address so we can reply. We use it only for this report.",
        ],
      },
      {
        h: "Copyright",
        p: ["If you believe content infringes your copyright, include a description of your work, where it appears on our site, and a statement that you are the rights holder or authorised to act for them, and that the information is accurate."],
      },
      {
        h: "Illegal content",
        p: ["If you believe you have found child sexual abuse material anywhere online, you can also report it directly to the Internet Watch Foundation (iwf.org.uk) or NCMEC's CyberTipline (report.cybertip.org)."],
      },
    ],
  },
  {
    slug: "anti-trafficking",
    title: "Anti-Trafficking Statement",
    eyebrow: "Zero tolerance",
    intro: "Lust Photography has zero tolerance for human trafficking, sexual exploitation and child sexual abuse in any form.",
    sections: [
      {
        h: "Our content",
        p: ["Because all of our content is generated with AI and depicts fictional adult characters, no real person is photographed, filmed or paid to perform for it. This removes the risk of trafficked or coerced performers in our own production."],
      },
      {
        h: "Our commitments",
        list: [
          "We never publish content that depicts, or could appear to depict, a minor, and we review every item individually before and after publication.",
          "We never publish content depicting real people without their consent, or non-consensual acts.",
          "We will remove content and cooperate with law enforcement wherever exploitation is suspected.",
          "We expect the same standards from anyone we work with, including brand and creator partners, and will end any relationship where they are not met.",
        ],
      },
      {
        h: "Report a concern",
        p: [
          "Use " + REPORT + " — reports of this kind are reviewed first.",
          "If someone is in immediate danger, contact your local emergency services.",
        ],
      },
    ],
  },
];

export const legalBySlug = (slug: string) => legalPages.find((p) => p.slug === slug);
