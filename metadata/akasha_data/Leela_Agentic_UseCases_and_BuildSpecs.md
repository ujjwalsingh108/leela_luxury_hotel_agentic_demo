# The Leela — Agentic AI Use-Case List + 2 Build Specs (for the dev)

**Purpose:** a ranked list of agentic use cases for The Leela, and **two demo-ready build specs** your
agentic developer can build on the **assistents platform** (Context Engine → Semantic Layer → Action Engine).
**Built per:** `ConsultingOS_Sandbox_POC_Playbook.md`. **Prepared by:** SC.

> Luxury rule throughout: **AI works in the background, augmenting staff — never a front-desk bot.**
> Maturity: **Available Today / Configurable / Requires Development**. For the demo, **mock** slow
> integrations (PMS/CRM), keep **real** the AI reasoning + conversation. Use **synthetic guest data** (DPDP/privacy).

---

## 1. The agentic use-case list (ranked: luxury-safe × impact × demo-ability)

| # | Use case | Surface | Luxury-safe | Demo-able | Maturity |
|---|---|---|---|---|---|
| **1** | **Host / Concierge Copilot** — unified guest-360 + next-best-action for staff | Staff console | ★★★ | ★★★ | Configurable |
| **2** | **Pre-Arrival Personalization Agent** — anticipatory, multilingual outreach + prep | WhatsApp/email | ★★★ | ★★★ | Configurable |
| 3 | **24/7 Guest Request Agent** — in-stay requests, routed to staff for the human touch | WhatsApp/in-room | ★★ | ★★★ | Configurable |
| 4 | **Weddings & MICE Enquiry Agent** — enquiry → proposal → coordination | Web/email | ★★★ | ★★ | Configurable |
| 5 | **Operations Orchestrator** — housekeeping/maintenance by occupancy; dept coordination | Back office | ★★★ | ★★ | Configurable→Dev |
| 6 | **Reputation Agent** — reviews monitored, sentiment, drafts, flag to GMs | Back office | ★★★ | ★★ | Configurable |
| 7 | **Loyalty/CRM Personalization** — cross-stay preference reuse, offers | Back office | ★★ | ★★ | Configurable |
| 8 | **Staff SOP/Knowledge Copilot** — institutional knowledge across palaces | Staff app | ★★★ | ★★ | Available→Configurable |
| 9 | **Real-time Decisioning** — late-checkout/upgrade vs PMS + loyalty (rules + human) | Staff console | ★★ | ★★ | Configurable |

> **Recommended to build for the demo: #1 + #2** — they tell one continuous story (the AI *anticipates*
> for the guest, then *empowers* the host), are the most luxury-safe, and demo beautifully on synthetic data.

---

## 2. SHARED build foundation (set up once, both use cases reuse)
- **Context Engine (mock for demo):** a sample **Guest Profile store** (PMS + CRM/loyalty merged) — JSON of
  ~6 synthetic guests with: name, loyalty tier, stay history, preferences (room, pillow, beverage), dietary/
  **allergies (critical)**, special occasions, language, notes. Plus a **Hotel Knowledge Base** (room types,
  dining venues, spa, experiences, policies) for RAG.
- **Semantic Layer:** guest-profile schema · preference taxonomy · loyalty rules · **brand service standards**
  (tone: warm, discreet) · next-best-action logic.
- **Action Engine:** generate briefs/recommendations · create department tasks · send WhatsApp/email ·
  update the (mock) profile · everything **human-in-the-loop**.
- **Channels:** staff web console; WhatsApp/chat (sandbox) for guest; multilingual TTS/STT optional (Sarvam).
- **What's REAL vs MOCK in the demo:** REAL = the AI reasoning, briefs, recommendations, the conversation,
  preference capture, RAG answers. MOCK = PMS/CRM (the sample store), task write-backs (a dashboard panel),
  WhatsApp (sandbox number/sim).

---

## 3. BUILD SPEC — Use Case 1: Host / Concierge Copilot  *(the luxury-safe hero)*
**What it is:** a staff member searches a guest → gets an instant, AI-written **guest brief + next-best-actions**,
and can trigger actions with one click. Makes a new host as capable as a veteran; nothing is missed.

**Front-end (demo surface):** a "Guest 360" staff console — search box → guest card.

**Agentic workflow (node-by-node):**
1. **Trigger** — staff searches a guest (name/room) on the console.
2. **Retrieve** — pull the guest profile (mock PMS/CRM) + relevant hotel info (RAG).
3. **Guest-Brief Agent** — generate a concise brief: *who they are, loyalty tier, stay count, occasion,
   preferences, and **critical flags (allergies)***. Brand-toned.
4. **Next-Best-Action Agent** — recommend tasteful actions: welcome amenity, room setup, dining suggestion,
   a remembered detail (their single malt), an upgrade if eligible (checks loyalty rules).
5. **Act (human-in-the-loop)** — staff clicks an action → **create a department task** (F&B/housekeeping/
   concierge) + notify; log the action.
6. **Log/learn** — write the interaction + any new preference back to the profile.

**Demo moment:** search *"Mr. Sharma, arriving today"* → brief appears: *"Returning Diamond guest, 5th stay,
**anniversary tomorrow**, prefers a high floor away from the elevator, **nut allergy — critical**, enjoys
single malt. Recommended: anniversary amenity · Lake-View upgrade (eligible) · brief F&B on the allergy ·
place his preferred whisky."* Staff clicks **"Arrange anniversary amenity"** → task created in the panel.

**Why it wins:** pure staff-empowerment (luxury-safe), shows the semantic layer, and the allergy-catch is a
visceral "this protects our guests" moment.

---

## 4. BUILD SPEC — Use Case 2: Pre-Arrival Personalization Agent  *(anticipatory, tasteful)*
**What it is:** before arrival, the AI reaches the guest in their language, warmly captures preferences &
occasions, answers questions, and **orchestrates the prep + briefs the host team** — so the stay is ready
before they walk in. Anticipation = the essence of luxury.

**Front-end (demo surface):** a WhatsApp/chat-style conversation + the staff console (Use Case 1) updating live.

**Agentic workflow (node-by-node):**
1. **Trigger** — booking confirmed / X days pre-arrival (from mock PMS).
2. **Pre-Arrival Agent (conversational, multilingual)** — warm, discreet outreach: confirm arrival time,
   ask about **occasion, dietary/allergies, preferences**, and offer (not push) spa/dining/experiences/transfer.
   Answers questions via **Hotel-KB RAG**.
3. **Capture & structure** — extract preferences/requests into the guest profile schema.
4. **Branch** — simple requests → auto-orchestrate; **special/complex** (private event, unusual ask) →
   **route to a human concierge** with context.
5. **Orchestrate prep** — create tasks: room setup, welcome amenity, **dining/spa reservation (mock)**,
   airport transfer; update the (mock) profile.
6. **Brief the host team** — feed it into the **Host Copilot (Use Case 1)** so staff are pre-briefed on arrival.

**Demo moment:** WhatsApp thread — Leela reaches the guest; guest replies *"celebrating our anniversary,
we're vegetarian, arriving ~3pm, would love a spa slot"* → agent warmly confirms, **books the spa (mock)**,
notes the anniversary & dietary → flip to the **staff console**: the guest card is now pre-briefed with the
anniversary, vegetarian flag, and the spa booking, with a welcome-amenity task created.

**Why it wins:** shows agentic *anticipation* and orchestration, multilingual, and it **connects to Use Case 1**
— one continuous narrative (AI anticipates → host delivers).

---

## 5. Developer notes
- **Build order:** shared foundation (sample guest store + hotel KB + schema) → Use Case 1 (console) →
  Use Case 2 (conversation) → wire #2's output into #1's profile so the demo flows end-to-end.
- **Keep human-in-the-loop visible** — staff approves actions; concierge handles special requests. (Luxury.)
- **Tone matters** — encode brand service standards in the semantic layer; warm, discreet, never pushy.
- **Synthetic data only** — never real guest PII in a demo (DPDP). Build ~6 rich sample profiles + a hotel KB.
- **Honest framing for the room:** real PMS/CRM integration (Opera etc.) = **Configurable** post-demo; the
  demo mocks it. Multilingual via Sarvam/GCP/AWS. It **augments** staff — say so.
- **The demo story to rehearse:** Pre-Arrival agent prepares the guest → Host Copilot lets the team deliver
  → "the AI did the coordinating; your people did the magic."

---

*Build spec per the sandbox POC bible. Companion: `../discovery_notes/LeelaPalace_Discovery_Brief.md`,
`notes/Leela_AgenticAI_Vision_Onepager.pdf`. After the discovery call, refine to their real systems/scenarios.*
