# The Leela — Developer Build Brief (build on the assistents platform)

**For:** the agentic developer. **Goal:** build two agents for The Leela demo on the **assistents platform**,
wired to the provided front-end (`Leela_Demo_App.html`). **Two agents:** (1) **Host Copilot**, (2) **Pre-Arrival
Personalization Agent**. They connect: Pre-Arrival writes preferences → Host Copilot reads them.

> Sandbox discipline (`ConsultingOS_Sandbox_POC_Playbook.md`): **mock** slow integrations (PMS/CRM, tasks,
> WhatsApp) for the demo; keep **real** the AI reasoning + conversation. **Synthetic guest data only (DPDP).**
> **Human-in-the-loop** stays visible. Maturity: Available Today / Configurable / Requires Development.

---

## 1. Architecture (4 layers)
| Layer | What | Demo | Production |
|---|---|---|---|
| **1. Front-end** | `Leela_Demo_App.html` — Host Console + Pre-Arrival chat (provided, runs in mock mode now) | as-is | host on Netlify/Vercel |
| **2. Glue** | `callAgent(intent, payload)` → POST to the assistents workflow webhook | set `CONFIG.mode='live'` + `assistentsWebhookUrl` | same |
| **3. assistents engine** | The 2 agents (Context → Semantic → Action) | **build this** | same |
| **4. Integrations** | Guest data (PMS/CRM), task system, WhatsApp | **mock** (sample store + panel) | Opera/CRM, real tasks, WhatsApp Business API |

The front-end already calls `callAgent(intent, payload)`. In live mode it POSTs JSON to your webhook — **your
job is to make the webhook return the contract below.**

## 2. The webhook contract (front-end ⇄ assistents)
**Intent `guest_brief`** — Host Console requests a guest's brief.
```
POST {assistentsWebhookUrl}
{ "intent":"guest_brief", "payload": { "id":"sharma" } }
→ 200 { "brief":"<html-safe string>", "actions":[ {"label":"...", "dept":"..."}, ... ] }
```
**Intent `do_action`** (optional live) — staff triggered an action → create the real task.
```
{ "intent":"do_action", "payload": {"guestId":"sharma","label":"Arrange anniversary amenity","dept":"F&B"} }
→ 200 { "ok":true, "taskId":"..." }
```
**Intent `prearrival_msg`** — guest replied in the chat.
```
{ "intent":"prearrival_msg", "payload": {"guestId":"rossi","message":"It's our honeymoon"} }
→ 200 { "reply":"<string>", "captured":{"occasion":"honeymoon"}, "quickReplies":[...], "tasks":[...] }
```
*(Keep the field names; the front-end's mock already uses this shape — match it and live mode "just works".)*

## 3. Build inside assistents — shared foundation
- **Context Engine (mock):** load the ~5 synthetic guest profiles from the front-end (`GUESTS`) as a sample
  **Guest store**. *Live:* connector to PMS (Opera) + CRM/loyalty — **Configurable**.
- **Knowledge Base (RAG):** ingest a **Hotel KB** — room types, dining venues, spa, experiences, policies,
  loyalty tiers — so agents answer accurately and recommend tastefully.
- **Semantic Layer:** guest-profile schema · preference taxonomy · **loyalty/upgrade-eligibility rules** ·
  **brand service standards (warm, discreet, never pushy)** · next-best-action logic · **critical-flag rules
  (allergies surfaced prominently)**.

## 4. Agent 1 — Host Copilot
- **Trigger:** webhook `intent:guest_brief`.
- **Flow:** retrieve guest (store) + relevant hotel info (RAG) → **Guest-Brief agent** writes a concise,
  brand-toned brief, **surfacing critical allergies** → **Next-Best-Action agent** proposes tasteful actions
  (occasion amenity, eligible upgrade per loyalty rules, kitchen allergy brief, preferred beverage) → return
  `{brief, actions}`.
- **Action execution** (`intent:do_action`): create a department task (mock = return ok; live = task system).
- **Guardrail:** recommend only — staff click to act (HITL).

## 5. Agent 2 — Pre-Arrival Personalization Agent
- **Trigger:** booking-confirmed event (live) OR webhook `intent:prearrival_msg` (demo chat).
- **Flow:** conversational, **multilingual** (Sarvam/GCP/AWS for the guest's language) → warm pre-arrival
  outreach → capture **occasion, dietary/allergies, requests** (RAG for questions) → **write back to the guest
  profile** (so Host Copilot is pre-briefed) → **orchestrate prep** (tasks: amenity, dining/spa, transfer) →
  **branch:** special/complex request → route to a human concierge with context.
- **Return** `{reply, captured, quickReplies, tasks}`.
- **The connection:** what this captures must update the same guest record Agent 1 reads — that's the demo's
  "magic moment" (chat → console pre-briefed).

## 6. Channels & models
- **Demo:** the provided web front-end (Host Console + chat). **Live:** WhatsApp Business API for pre-arrival;
  optional voice (STT/TTS) via Sarvam for Indian/multilingual. Customer-managed LLM keys.

## 7. Acceptance criteria (the demo must do this)
1. Host Console: select **Mr. Sharma** → brief shows Diamond, 5th stay, **anniversary**, **nut allergy
   (critical, highlighted)**, single malt → actions listed → click "Arrange anniversary amenity" → task appears.
2. Pre-Arrival: pick **Ms. Rossi** → agent converses (warm, anticipatory) → guest answers honeymoon /
   vegetarian / spa → captured.
3. **The connection:** after the chat, switch to Host Console → Rossi's card reflects the captured occasion +
   dietary + a pre-arrival task. (Chat → console pre-briefed.)
4. Runs reliably offline in demo mode; flipping `CONFIG.mode='live'` routes to the assistents webhook.

## 8. Guardrails (non-negotiable for this brand)
- **Synthetic data only** in the demo (no real guest PII; DPDP).
- **Human-in-the-loop visible** — AI recommends/prepares; staff decide; concierge handles special requests.
- **Brand tone** — warm, discreet, never pushy or "robotic." Encode it in the semantic layer + prompts.
- **Honest framing:** real PMS/CRM/WhatsApp integration is **Configurable** post-demo; the demo mocks it. AI
  **augments** staff — never replaces the human welcome.

## 9. Deliverables from the dev
- The two agents configured on assistents, reachable via one webhook honoring §2.
- The Hotel KB ingested; semantic schema + rules set.
- `CONFIG.mode='live'` + webhook URL wired in the front-end; deployed (Netlify/Vercel).
- A 6-minute happy-path runbook matching §7.

---

*Build brief per the sandbox POC bible. Front-end: `Leela_Demo_App.html` (provided, mock-mode working).
Companions: `Leela_Agentic_UseCases_and_BuildSpecs.md`, `../discovery_notes/LeelaPalace_Discovery_Brief.md`.*
