# Client Presentation Guide For The Leela Knowledge Base

## Purpose

This document explains how to present the three Leela knowledge-base folders to a client, what each folder proves, how to demo it, and what questions are likely to arise.

The three folders reviewed are:

- `metadata/knowledge_base/leela_whatsapp_chat_agent`
- `metadata/knowledge_base/leela_digital_concierge`
- `metadata/knowledge_base/leela_arrival_intelligence_agent`

## Executive Positioning

Present this work as a three-agent hospitality AI architecture, not as a simple chatbot demo.

The strongest client narrative is:

> We are not replacing The Leela's service teams. We are creating an agentic layer that captures guest intent, protects brand tone, routes requests into existing workflows, and prepares human associates with better context.

The three knowledge bases show coverage across the guest lifecycle:

| Knowledge Base | Audience | Role In Demo | Best Client Framing |
| --- | --- | --- | --- |
| WhatsApp Chat Agent | WhatsApp guests and prospects | Lead capture and assisted guest messaging | Converts WhatsApp interest into structured enquiries, brochures, callbacks, and booking leads. |
| Digital Concierge | Website visitors and public guest support | Public-facing concierge | Answers broad guest questions safely and guides users toward official booking, offers, events, dining, spa, loyalty, and support flows. |
| Arrival Intelligence Agent | Hotel staff, front office, guest relations, leadership | Internal operations assistant | Reads guest, booking, loyalty, preference, feedback, and service-risk data to prepare arrival briefs and next-best actions. |

## How To Present This To The Client

### 1. Start With The Business Problem

Open with the operational pain, not the technology.

Client-safe framing:

> Luxury hospitality teams receive high-value requests across WhatsApp, website chat, calls, reservation systems, events teams, dining teams, and in-stay channels. The problem is not lack of software. The problem is fragmented guest context, delayed response, and risk of inconsistent messaging.

Then position the solution:

> These agents sit above existing systems and channels. They do three things: answer safely, capture structured details, and route the right context to the right team.

### 2. Show The Three-Agent Journey

Use this storyline:

1. A prospect asks for a Leela Palace brochure on WhatsApp.
2. The WhatsApp Agent collects name, phone, city preference, and explicit WhatsApp consent.
3. The backend sends the correct brochure type, such as `leela_palace_hotel`.
4. The guest later asks about rooms, dining, offers, or a wedding.
5. The Digital Concierge handles public questions and routes live confirmation to reservations or specialists.
6. Before arrival, the Arrival Intelligence Agent prepares the team by surfacing VIP status, allergies, special occasions, complaints, service requests, and upgrade opportunities.

This makes the demo feel like an operating model, not a single chat window.

### 3. Demo The Highest-Value Scenarios

Use these demos in order:

| Demo Scenario | Folder Used | Why It Matters |
| --- | --- | --- |
| Send The Leela Palace brochure on WhatsApp | WhatsApp Chat Agent | Shows consent, brochure routing, and lead capture. |
| Wedding enquiry for Udaipur or Jaipur | WhatsApp Chat Agent + Digital Concierge | Shows high-value lead qualification and specialist handoff. |
| Ask which Leela hotel is best for honeymoon/business/wedding | Digital Concierge | Shows destination matching and brand-safe recommendations. |
| Ask for rates or availability | Digital Concierge | Shows safe refusal to invent live rates and routing to official reservations. |
| Today's VIP arrivals and service risks | Arrival Intelligence Agent | Shows internal decision intelligence, guest recognition, and risk prevention. |
| Guest with allergy, complaint, or VIP privacy request | All three | Shows escalation discipline and luxury service protection. |

### 4. Emphasize Guardrails

The client will care about brand risk. Make the guardrails a feature.

Key rules to mention:

- The agents do not confirm rates, availability, upgrades, venues, tables, spa slots, refunds, or compensation without verified backend or human confirmation.
- The agents never collect card details, OTPs, passwords, or sensitive identity documents.
- WhatsApp brochure sending requires explicit consent.
- Allergies, medical, accessibility, VIP, privacy, complaints, refunds, and payment issues escalate to humans.
- Internal arrival intelligence does not expose sensitive scoring or lifetime value in guest-facing messages.

### 5. Clarify What Is Demo Versus Production

Be transparent:

| Area | Demo State | Production Need |
| --- | --- | --- |
| Public hotel content | Curated from official-style Leela content and public sources | Client validation and periodic content review. |
| Arrival intelligence data | Synthetic demo content | Integration with PMS, CRM, loyalty, service request, feedback, and dining systems. |
| WhatsApp sending | Backend endpoint and WATI/Meta-style flow defined | Hosted PDF URL, approved WhatsApp template, production WATI/Meta credentials. |
| Rates and availability | Guarded, not live-confirmed | Booking engine or CRS/PMS availability API. |
| Events and weddings | Lead capture and handoff | CRM/event-sales integration and venue availability workflow. |

## Folder-By-Folder Client Summary

## 1. WhatsApp Chat Agent

Path:

`metadata/knowledge_base/leela_whatsapp_chat_agent`

### What It Contains

This folder defines a WhatsApp-first guest conversation agent. It covers:

- Agent purpose and positioning.
- Brand tone and WhatsApp message style.
- Intent detection and lead capture.
- Backend action contracts.
- Pre-arrival and in-stay workflows.
- Rooms, dining, spa, transport, loyalty, and offers.
- Weddings, events, and MICE enquiries.
- Guardrails, privacy, and compliance.
- Leela Palace hotel brochure content and send flow.
- Assistents.ai setup checklist.

### How To Present It

Present it as the conversion and service-routing layer for WhatsApp.

Best phrase:

> This agent turns unstructured WhatsApp messages into structured hotel enquiries while preserving The Leela's tone and consent requirements.

### Strong Client Points

- It supports common WhatsApp requests: brochure, booking lead, callback, wedding enquiry, dining, spa, transfer, loyalty, pre-arrival preferences, and in-stay service triage.
- It already defines backend actions: `send_whatsapp_brochure`, `schedule_callback`, `create_enquiry`, and `create_booking_lead`.
- It includes explicit WhatsApp consent handling.
- It includes a polished Leela Palace brochure PDF and brochure type: `leela_palace_hotel`.

### Likely Client Questions

| Question | Recommended Answer |
| --- | --- |
| Can the agent send the PDF brochure directly on WhatsApp? | Yes, if the PDF is hosted at a public URL and the WhatsApp provider/template supports sending a link or document. The backend already maps `brochureType` to a brochure URL. |
| Does the knowledge base itself send the brochure? | No. The knowledge base teaches the agent when and how to send it. The actual send happens through the backend action and WhatsApp provider. |
| Why does the agent ask for consent? | WhatsApp follow-up and brochure sending should be consent-based. The KB explicitly requires `whatsappConsent=true`. |
| Can it confirm room rates or availability? | Not unless connected to a verified booking or availability API. Until then it captures a lead and routes to official reservations. |
| Can it handle complaints? | It can acknowledge, collect context, and escalate. It must not promise refunds or compensation. |
| Can it handle in-stay service requests? | Yes at triage level, but operational fulfilment needs integration with service request/task systems. |
| Can it speak in Hindi or other languages? | The tone guide allows multilingual handling if the model can respond accurately, with structured fields kept backend-friendly. |

## 2. Digital Concierge

Path:

`metadata/knowledge_base/leela_digital_concierge`

### What It Contains

This folder is a broader public-facing concierge knowledge base for website chat, web forms, and approved messaging channels. It covers:

- Full system prompt for The Leela Digital Concierge.
- Hotel overview and destination matching.
- Room types and suite guidance.
- Offers and packages.
- Weddings and events.
- Dining, spa, and wellness.
- Leela DISCOVERY loyalty.
- Booking, cancellation, payment, guest policy, and fraud safety.
- Public FAQs and human-handoff triggers.

### How To Present It

Present it as the public guest-support and discovery layer.

Best phrase:

> The Digital Concierge helps guests choose the right hotel, understand services, and move safely toward official booking or specialist follow-up without inventing live commercial terms.

### Strong Client Points

- It is designed for public-facing channels, not only WhatsApp.
- It handles a wide range of guest questions: destinations, rooms, offers, weddings, meetings, dining, spa, loyalty, booking support, cancellation, payment safety, and FAQs.
- It contains clear official-channel routing for reservations and fraud protection.
- It supports destination recommendation use cases: honeymoon, business travel, palace stay, beach, backwaters, city weddings, conventions, airport convenience, and long stay.
- It uses conservative language for offers, rates, benefits, and availability.

### Likely Client Questions

| Question | Recommended Answer |
| --- | --- |
| Is this meant for website chat or WhatsApp? | Both are possible, but this folder is the broader public concierge. The WhatsApp folder is more channel-specific and lead-action oriented. |
| Can it answer current offers? | It can explain offer categories and route to the official offers page. For active validity, blackout dates, inclusions, or exact pricing, it needs live official offer data. |
| Can it recommend a hotel? | Yes. It has destination-matching rules for palace stays, honeymoon, business travel, beach, backwaters, nature, conventions, weddings, and long stays. |
| Can it make bookings? | It can collect booking intent and route to official reservations. It cannot confirm booking without live booking-system integration. |
| How does it avoid wrong policy answers? | It uses guardrails: cancellation, payment, ID, outside food, allergies, and booking terms are routed to official confirmation when property/date/rate-specific. |
| Does it know loyalty benefits? | It can explain Leela DISCOVERY at a high level. It cannot verify a member's tier, balance, eligibility, or benefits without account integration. |
| Can it handle payment links or fraud questions? | Yes. It directs guests to official Leela channels and avoids validating unknown links or phone numbers. |

## 3. Arrival Intelligence Agent

Path:

`metadata/knowledge_base/leela_arrival_intelligence_agent`

### What It Contains

This folder is for internal hotel teams. It is not primarily guest-facing. It covers:

- Room categories and upgrade rules.
- Synthetic Leela DISCOVERY tier rules.
- Dining, spa, transport, and butler service details.
- Brand tone and service standards for executives and staff.
- Escalation policies for VIPs, allergies, pricing, and complaints.
- Extensive system prompt for the Royal Arrival Intelligence Agent.

### How To Present It

Present it as operational intelligence for guest readiness.

Best phrase:

> This agent prepares the team before the guest arrives. It highlights who needs attention, what risks must be handled, and which actions require human approval.

### Strong Client Points

- It separates guest-facing automation from staff-facing intelligence.
- It can create arrival readiness summaries for front office, guest relations, F&B, spa, concierge, butler, revenue, and leadership.
- It identifies VIP and loyalty recognition opportunities.
- It flags critical allergies, unresolved service requests, negative feedback, payment disputes, privacy concerns, and complaints.
- It makes approval-gated recommendations instead of auto-confirming upgrades or compensation.

### Likely Client Questions

| Question | Recommended Answer |
| --- | --- |
| Is this based on real Leela policy? | No, the folder explicitly says it is synthetic demo content. Production would need official client policy validation. |
| What systems does it need? | PMS/booking, CRM, loyalty, guest preferences, feedback/NPS, service requests, revenue transactions, local events, and possibly dining/spa/task systems. |
| Can it automatically upgrade guests? | No. It can recommend upgrade consideration, but approvals remain with Front Office, Revenue Manager, GM, or Rooms Director depending on sensitivity. |
| Can staff trust the recommendations? | The agent should show data used, data missing, assumptions, and approval gates. It must never invent availability, occupancy, pricing, or guest facts. |
| Does it expose sensitive guest value data? | Internally it may use loyalty and spend signals carefully. Guest-facing drafts must not mention lifetime spend, VIP scoring, or internal classification. |
| Can it create tasks? | In production, yes if connected to a task/service system. In the current KB it defines what should become a task and the priority level. |
| How does it handle allergies? | Critical allergies are immediate escalation items. It should flag F&B/kitchen/in-room dining and avoid saying the allergy is handled until acknowledged. |

## Client Questions That May Arise Across All Three Folders

### Strategy And Business Value

| Client Question | Suggested Response |
| --- | --- |
| What is the ROI? | Faster response, better lead capture, reduced missed enquiries, improved direct-booking support, better pre-arrival personalization, and fewer service failures from missed context. |
| Is this just a chatbot? | No. The knowledge bases define an agentic orchestration layer across guest messaging, public concierge, and internal arrival readiness. |
| What use case should we pilot first? | Start with WhatsApp brochure/enquiry capture and website concierge FAQs, then add arrival intelligence once internal data integrations are available. |
| Will this replace hotel staff? | No. The architecture repeatedly positions AI as preparing and routing work while humans approve, confirm, and deliver luxury service. |

### Data And Accuracy

| Client Question | Suggested Response |
| --- | --- |
| Who owns content updates? | Marketing should own public brand/service content; reservations should own booking policy; events should own wedding/MICE content; operations should own arrival workflows; compliance should approve privacy/payment guardrails. |
| How often should the KB be reviewed? | Public offers and policy pages should be reviewed frequently. Static brand and workflow guidance can be reviewed monthly or quarterly. |
| What happens when the agent does not know? | It says the property/reservations/specialist team can confirm and offers a handoff or official link. |
| Can it cite official sources? | The KB includes official Leela links. Production should connect source URLs and review dates to each content block. |

### Integration And Implementation

| Client Question | Suggested Response |
| --- | --- |
| What integrations are required for production? | WhatsApp provider, website chat, CRM/enquiry system, reservations/booking engine, PMS, loyalty, service/task management, event sales, dining/spa systems, and analytics. |
| Can we start without full PMS integration? | Yes. Start with lead capture, brochure sending, callback scheduling, and official-link routing. Add live availability and arrival intelligence later. |
| How is the brochure sent? | The PDF must be publicly hosted. The agent calls `send_whatsapp_brochure` with the correct `brochureType`, and the backend sends the URL through WATI/Meta. |
| Can this use Assistents.ai tools? | Yes. The WhatsApp folder includes Assistents.ai setup and outbound API integration guidance. |

### Risk, Compliance, And Brand

| Client Question | Suggested Response |
| --- | --- |
| How do we prevent hallucinated rates or confirmations? | The prompts explicitly prohibit confirming live commercial details without verified tool output. Tool output has higher priority than generated text. |
| What about DPDP/privacy? | The KB instructs minimum data collection, explicit consent, server-side credentials, audit logs, and human escalation for sensitive information. Production requires legal/compliance review. |
| Can guests share payment details? | The agent must refuse to collect card numbers, CVV, OTPs, passwords, or banking credentials. |
| How are complaints handled? | Acknowledge, collect context, escalate to a human, and avoid promising compensation or resolution. |

### Operational Ownership

| Client Question | Suggested Response |
| --- | --- |
| Who receives the leads? | Reservations for stays, events team for weddings/MICE, dining team for restaurants, spa team for wellness, concierge for transfers, guest relations for VIP/complaints. |
| How will staff know what the agent captured? | Leads and tasks should include structured fields plus a concise conversation summary. |
| Who approves upgrades? | Depending on the case: Front Office, Revenue Manager, General Manager, Rooms Director, or specialist owner. |
| What should be measured? | Lead conversion, response time, brochure sends, callback completion, booking leads, event enquiries, deflection of routine FAQs, escalation volume, and service-risk resolution. |

## Recommended Client Presentation Deck Structure

1. Title: The Leela Agentic Concierge And Arrival Intelligence
2. The current challenge: fragmented guest requests and context loss
3. The solution: three-agent architecture across guest lifecycle
4. Agent 1: WhatsApp Chat Agent
5. Agent 2: Digital Concierge
6. Agent 3: Arrival Intelligence Agent
7. Demo journey: brochure to booking enquiry to arrival readiness
8. Guardrails: brand, privacy, payment, allergy, VIP, complaint safety
9. Integrations needed: WhatsApp, CRM, reservations, PMS, loyalty, service tasks
10. Pilot recommendation and timeline
11. Client decisions required

## Recommended Pilot Scope

### Phase 1: Public Concierge And WhatsApp Lead Capture

Deliver:

- WhatsApp brochure flow.
- Website/WhatsApp FAQ support.
- Booking lead capture.
- Wedding/event enquiry capture.
- Callback scheduling.
- Official reservations and offers routing.

Client inputs needed:

- Approved system prompt.
- Approved brochure PDFs and public URLs.
- WhatsApp provider and template approval.
- Final destination/property content.
- Enquiry routing owners.

### Phase 2: Operational Routing

Deliver:

- CRM/enquiry integration.
- Events lead routing.
- Dining/spa/transport lead routing.
- Consent and audit logging.
- Dashboard of enquiry categories and outcomes.

Client inputs needed:

- CRM fields.
- Department owner mapping.
- SLA rules.
- Escalation paths.

### Phase 3: Arrival Intelligence

Deliver:

- VIP arrival brief.
- Allergy and service-risk detection.
- Upgrade recommendation workflow.
- Staff task recommendations.
- Leadership summary reports.

Client inputs needed:

- PMS/CRM/loyalty/feed schema.
- Official upgrade policy.
- Official VIP/escalation policy.
- Task management integration.
- Data privacy approval.

## Questions To Ask The Client

Use these as discovery questions.

### Business Priorities

- Which channel matters most first: WhatsApp, website chat, reservations, or in-stay messaging?
- Is the first KPI lead capture, direct booking recovery, response time, event enquiry conversion, or arrival personalization?
- Which properties should be included in phase one?
- Should the pilot focus on palace hotels only or the wider Leela portfolio?

### Content And Brand

- Who approves public-facing content and tone?
- Which brochures are approved for sending?
- Which offers can be mentioned, and how often are they updated?
- What exact phrases should the agent avoid?
- Which languages should be supported at launch?

### Booking And Revenue

- Can the agent access live rates and availability?
- If not, should it only route to official reservations?
- What is the approved language for price, taxes, inclusions, cancellation, and upgrades?
- Who approves rate exceptions or upgrade recommendations?

### WhatsApp And Consent

- Which WhatsApp provider will be used: WATI, Meta Cloud API, or another provider?
- Are WhatsApp templates approved for brochure sending?
- Where will brochure PDFs be hosted?
- What consent language does legal/compliance prefer?
- How long should consent and conversation logs be retained?

### Operations

- Where should booking, wedding, dining, spa, and transport leads land?
- What fields are mandatory for each department?
- What SLA should apply to each lead type?
- Who owns escalations after business hours?
- Should the agent create tasks directly or only notify teams?

### Arrival Intelligence

- Which internal systems can provide arrivals, loyalty, preferences, feedback, and service requests?
- What is the official upgrade approval matrix?
- Which allergy and medical workflows are mandatory?
- Which VIP categories require GM or Guest Relations visibility?
- What data should never appear in staff summaries?

## Risks To Flag Before Client Demo

- Some Arrival Intelligence rules are synthetic demo rules and must not be represented as official Leela policy.
- Current offers, rates, inclusions, venue capacity, and availability are time-sensitive and need live official sources.
- The brochure PDF must be hosted publicly before WhatsApp can send it as a link.
- WhatsApp sending requires provider configuration and approved templates.
- Any production use of guest data requires privacy, access-control, retention, and audit design.
- Internal intelligence and guest-facing concierge content must remain separated.

## Suggested Closing Message To Client

Use this closing:

> The demo shows how The Leela can move from reactive guest messaging to proactive, context-aware service orchestration. The agent does not replace the concierge, reservations, events, or front-office team. It gives each team cleaner intent, better guest context, safer guardrails, and faster handoff.

