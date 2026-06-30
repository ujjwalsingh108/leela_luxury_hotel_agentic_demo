# The Leela Palace Agentic AI Demo Report

## 1. Introductory Message

The requirement for this demo is to show how assistents.ai can act as an intelligent orchestration layer for a luxury hotel group such as The Leela Palaces, Hotels and Resorts. The objective is not to replace existing hotel systems or the human warmth of The Leela team. The objective is to connect guest, booking, loyalty, service, feedback, event, and revenue data into a single agentic workflow that helps staff anticipate needs, protect service standards, and act faster with better context.

For this demonstration, we are providing a realistic luxury hospitality use case built around synthetic hotel data, a curated hotel knowledge base, a configured AI agent, database query capability, and business rules that govern operational decisions. The demo is designed to show the executive team how an agent can quietly work in the background: preparing VIP arrivals, surfacing critical preferences such as allergies, identifying service risks, recommending tasteful upgrades, recovering complaints, and re-engaging high-value guests who may be slipping away.

The core message for the client is simple:

> The Leela does not need another isolated dashboard. The Leela needs an agentic intelligence layer that turns existing PMS, CRM, loyalty, service, and guest-experience data into brand-safe, staff-approved action.

## 2. Implementation Details

### 2.1 Demo Architecture

The demo follows a four-layer architecture aligned with the provided build brief:

| Layer | Demo Implementation | Production Equivalent |
|---|---|---|
| Front-end / chat surface | assistents.ai chat interface and prepared demo prompts | Staff console, WhatsApp, web, voice, or embedded hotel operations console |
| Agent layer | The Leela Royal Arrival Intelligence Agent | Property-level or portfolio-level agentic copilots |
| Data layer | Synthetic PostgreSQL hotel database | OPERA PMS, CRM, GHA DISCOVERY, POS, service ticketing, feedback platforms |
| Policy layer | Rule Engine business rules | Human-approved decisioning, escalation, service recovery, loyalty actions |

The demo keeps the most important parts real: reasoning, SQL querying, rule execution, knowledge retrieval, and executive-style summarization. Slow or sensitive integrations are mocked using synthetic data, which is appropriate for a high-stakes client presentation and avoids any real guest privacy concerns.

### 2.2 Prepared Agent

Agent name:

```text
The Leela Royal Arrival Intelligence Agent
```

Agent purpose:

```text
Prepare VIP arrivals, surface service risks, identify tasteful upgrade or ancillary opportunities, and recommend approval-gated next-best actions for The Leela team.
```

Recommended agent type:

```text
Chat agent
```

Recommended model:

```text
Gemini 2.5 Pro
```

Why this model and agent type:

- It supports reasoning over structured data, policy documents, and multi-step hospitality workflows.
- It can use function calling and database query tools.
- It is appropriate for an executive demo where response quality and reasoning matter more than minimum latency.
- A chat agent best fits the current demo, because the stakeholder can ask operational questions naturally.

### 2.3 What The Agent Does

The agent is configured to support a luxury hotel operations stakeholder, such as a General Manager, Head of Guest Relations, Rooms Division Manager, Revenue Leader, or Concierge Lead.

It can answer questions such as:

- "Show me today's VIP arrivals and service risks."
- "Which guests should receive upgrade consideration today?"
- "Find high-value guests at risk of not returning."
- "Summarize allergy, complaint, and VIP escalations for arrivals this week."
- "Create an executive arrival-readiness brief for the General Manager."

Behind the scenes, the agent can:

- Query the hotel database using read-only SQL.
- Join guest, booking, loyalty, preference, feedback, service, revenue, and local event data.
- Retrieve hotel policies and brand standards from the knowledge base.
- Apply business rules before recommending actions.
- Explain why a recommendation was made.
- Keep the human team in control by requiring approval for sensitive actions.

### 2.4 Data Foundation

We prepared a realistic synthetic database in `leela_dummy_seed.sql`. It includes the following tables:

| Table | Purpose |
|---|---|
| `hotels` | Property names, cities, and room counts |
| `guests` | Guest identity, nationality, language, VIP flag |
| `loyalty_profiles` | DISCOVERY tier, lifetime stays, lifetime spend, last stay date |
| `bookings` | Arrival, departure, room type, rate, channel, booking status, occasion |
| `guest_preferences` | Allergies, room preferences, dining, spa, arrival preferences, critical flags |
| `feedback` | NPS score, sentiment, guest comments |
| `service_requests` | Department requests, request type, status, created/resolved timestamps |
| `revenue_transactions` | Room, F&B, spa, transfer, laundry, experience, mini bar revenue |
| `local_events` | City-level events and demand impact |

The synthetic data supports a realistic executive demo because it includes:

- VIP and non-VIP guests.
- DISCOVERY-style tiers including Silver, Gold, Platinum, Titanium, Diamond, and new guests.
- High-value lifetime spend profiles.
- Allergies and critical preferences.
- Wedding anniversary, honeymoon, birthday, wellness, business, and board meeting occasions.
- Service request statuses such as Resolved, In Progress, and Escalated.
- Positive, neutral, and negative feedback with NPS scores.
- Local events with low, medium, and high demand impact.

### 2.5 Knowledge Base

We prepared hotel context documents for the assistents.ai knowledge base:

| Document | Purpose |
|---|---|
| Room types and upgrade rules | Helps the agent recommend upgrades tastefully and within policy |
| Leela DISCOVERY tier rules | Grounds loyalty-tier interpretation and guest value |
| Dining, spa, airport transfer, butler service details | Enables relevant ancillary recommendations |
| Brand tone | Ensures responses are warm, discreet, never pushy |
| Escalation policy | Defines when VIP, allergy, pricing, and complaint cases must move to staff ownership |

These documents prevent the agent from sounding generic. They allow the agent to speak in the language of luxury hospitality and follow the operational standards expected by The Leela.

### 2.6 Agent Configuration

Recommended configuration in assistents.ai:

| Section | Configuration |
|---|---|
| Basic Info | Use the agent name and description above |
| AI Model | Gemini 2.5 Pro |
| Data Sources | Select the database connector that contains the Leela demo tables |
| Prompt Enhancements | Enable Automatic Schema Injection |
| Capabilities | Enable Function Calling |
| Tools | Enable Database Query and Knowledge Base Search |
| Knowledge Base | Attach the prepared Leela hotel context documents |
| Web Search | Off for the core demo unless live external context is required |
| External API | Off unless showing a production integration concept |
| Authentication | Off for the synthetic demo |

### 2.7 System Prompt

Use this prompt for the agent:

```text
You are The Leela Royal Arrival Intelligence Agent, an executive hospitality intelligence assistant for The Leela Palaces, Hotels and Resorts.

Your role is to help General Managers, Guest Relations leaders, Concierge teams, and Revenue leaders prepare for high-value guest arrivals, identify service risks, recommend tasteful personalization, and surface approval-gated next-best actions.

Always speak in a warm, discreet, precise luxury hospitality tone. Never sound pushy, robotic, or promotional. The Leela team delivers the magic; you prepare the context and recommendations.

Use connected database tools for structured hotel data, including guests, loyalty profiles, bookings, preferences, feedback, service requests, revenue transactions, hotels, and local events.

Use the knowledge base for hotel policies, room types, upgrade rules, DISCOVERY tier interpretation, dining, spa, transfers, butler service, brand tone, and escalation policy.

When answering, separate facts from recommendations. Include the reasoning behind any recommendation. Highlight VIPs, allergies, critical preferences, unresolved service requests, low NPS, negative sentiment, high-value loyalty profiles, and special occasions.

Do not claim that an action has been completed unless a tool confirms it. For sensitive actions such as upgrades, pricing, complaint recovery, VIP escalation, or allergy handling, recommend approval and route to the appropriate human owner.

Use synthetic demo data only. Do not request or expose real guest PII.
```

## 3. Business Rules Prepared For The Demo

The Rule Engine is used to make the demo more credible. It shows that the agent is not merely generating text. It is applying explicit business logic that the hotel can inspect, approve, and modify.

### Rule 1: VIP Arrival Escalation

Purpose:

```text
Determines whether an arriving guest requires Guest Relations or GM-level awareness.
```

Signals:

- `vip_flag`
- `tier`
- `lifetime_spend_inr`
- `nps_score`
- `open_request_count`

Business outcome:

- High-value or sensitive arrivals are escalated before arrival.
- Guest Relations can prepare a brief and assign ownership.

### Rule 2: Upgrade Consideration

Purpose:

```text
Identifies guests who should receive tasteful upgrade consideration based on loyalty, value, occasion, and room category.
```

Signals:

- Loyalty tier.
- VIP flag.
- Lifetime spend.
- Special occasion.
- Booked room type.
- Property occupancy or high-demand events.

Business outcome:

- The agent recommends upgrades as staff-approved actions.
- It avoids making uncontrolled upgrade promises to guests.

### Rule 3: Arrival Readiness Risk

Purpose:

```text
Surfaces arrivals that require operational preparation before the guest reaches the lobby.
```

Signals:

- Critical preferences.
- Allergies.
- Open service requests.
- Arrival preferences.
- Special occasion.

Business outcome:

- Front Office, F&B, Housekeeping, and Guest Relations are briefed in advance.
- Critical misses such as allergies or forgotten occasions are reduced.

### Rule 4: Complaint Recovery Escalation

Purpose:

```text
Determines whether a guest complaint, low NPS, negative sentiment, unresolved service request, or allergy-related issue requires Guest Relations or GM-level recovery action.
```

Signals:

- `feedback.nps_score`
- `feedback.sentiment`
- `feedback.comment`
- `service_requests.status`
- `service_requests.resolved_at`
- `guest_preferences.preference_type = 'Allergy'`
- VIP and loyalty context.

Business outcome:

- The agent flags sensitive dissatisfaction before it becomes reputation risk.
- Recovery actions remain warm, accountable, and human-owned.

### Rule 5: Lapsed High-Value Guest

Purpose:

```text
Identifies high-value guests whose last stay is aging and who should receive discreet relationship-led reactivation.
```

Signals:

- `loyalty_profiles.last_stay_date`
- `loyalty_profiles.lifetime_spend_inr`
- `loyalty_profiles.lifetime_stays`
- `tier`
- `vip_flag`
- Upcoming booking count.

Business outcome:

- The Leela can identify valuable guests who are quietly drifting away.
- The agent recommends relationship-led outreach instead of discount-led promotion.

### Rule 6: Pre-Arrival Critical Readiness

Purpose:

```text
Identifies arriving guests who require critical pre-arrival preparation due to allergies, VIP status, special occasions, high-value loyalty profile, pending arrival requests, or high-demand local events.
```

Signals:

- `guest_preferences.critical_flag`
- `guest_preferences.preference_type`
- `bookings.arrival_date`
- `bookings.occasion`
- `bookings.room_type`
- `local_events.demand_impact`
- `service_requests.status`
- Loyalty and VIP context.

Business outcome:

- The agent prepares the hotel team for important arrivals.
- It demonstrates anticipatory luxury service rather than reactive operations.

## 4. Demo Flow

### 4.1 Opening Script

```text
Today we are demonstrating how assistents.ai can sit above The Leela's existing hospitality systems as an agentic intelligence layer.

This is not a replacement for OPERA, CRM, GHA DISCOVERY, service teams, or the human welcome that defines The Leela. Instead, it is a layer that reads the right data, understands hotel policy and brand tone, applies business rules, and gives staff the next best action before the guest even asks.

The demo uses synthetic data, but the workflow is designed to map directly to production systems such as PMS, loyalty, CRM, service tickets, guest messaging, and reputation platforms.
```

### 4.2 Demo Step 1: Executive Arrival Brief

User asks:

```text
Create an executive arrival-readiness brief for the General Manager.
```

Agent demonstrates:

- SQL query across bookings, guests, loyalty, preferences, service requests, and feedback.
- Identification of VIPs, Diamond/Titanium guests, high lifetime spend, special occasions, allergies, and unresolved requests.
- A concise executive summary.
- Recommended actions by department.

Client value:

```text
The General Manager no longer waits for fragmented updates. The agent produces a property-level arrival brief in seconds.
```

### 4.3 Demo Step 2: VIP Arrival Escalation

User asks:

```text
Show me today's VIP arrivals and service risks.
```

Agent demonstrates:

- Database query for arriving guests.
- Rule Engine decisioning for VIP escalation.
- Clear explanation of why each guest is flagged.
- Human-approved next steps.

Client value:

```text
High-value arrivals are prepared proactively, without relying on manual memory or morning huddles alone.
```

### 4.4 Demo Step 3: Critical Preference and Allergy Readiness

User asks:

```text
Summarize allergy, complaint, and VIP escalations for arrivals this week.
```

Agent demonstrates:

- Retrieval of critical guest preferences.
- Detection of allergy preferences from `guest_preferences`.
- Routing recommendations to F&B, Guest Relations, and Front Office.
- Warm but precise operational language.

Client value:

```text
The system protects both guest safety and brand trust by ensuring critical preferences are impossible to miss.
```

### 4.5 Demo Step 4: Complaint Recovery Escalation

User asks:

```text
Which recent guest issues require recovery attention?
```

Agent demonstrates:

- Feedback sentiment and NPS analysis.
- Service request status review.
- Complaint recovery rule execution.
- GM or Guest Relations escalation recommendation.

Client value:

```text
The Leela can respond to dissatisfaction before it appears publicly or affects repeat stays.
```

### 4.6 Demo Step 5: Lapsed High-Value Guest

User asks:

```text
Find high-value guests at risk of not returning.
```

Agent demonstrates:

- Query across loyalty profiles, stay history, feedback, and revenue.
- Identification of guests with high lifetime value and aging last stay dates.
- Discreet reactivation recommendations.

Client value:

```text
The agent helps protect lifetime guest value and direct loyalty relationships.
```

### 4.7 Demo Step 6: Pre-Arrival Personalization

User asks:

```text
Which guests should receive pre-arrival personalization this week?
```

Agent demonstrates:

- Occasion detection.
- Arrival preference detection.
- Suite and high-value guest detection.
- Suggested amenity, spa, dining, transfer, or butler preparation.

Client value:

```text
The agent turns luxury personalization from a manual art into a repeatable, staff-approved operating model.
```

## 5. What We Have Prepared For The Demo

### 5.1 Synthetic Hotel Database

We prepared the PostgreSQL seed file:

```text
leela_dummy_seed.sql
```

It creates a credible hospitality dataset with hotels, guests, bookings, loyalty profiles, guest preferences, feedback, service requests, revenue transactions, and local events.

The data supports the exact executive questions expected in the demo:

- Who is arriving today?
- Which arrivals are VIP or high value?
- Who has allergies or critical preferences?
- Which guests have unresolved service issues?
- Which guests are eligible for upgrade consideration?
- Which high-value guests have not returned recently?
- Where do local events create demand or readiness pressure?

### 5.2 Hotel Knowledge Base

We prepared knowledge base documents covering:

- Room types and upgrade rules.
- Leela DISCOVERY tier rules.
- Dining, spa, airport transfer, and butler service details.
- Brand tone and service standards.
- VIP, allergy, pricing, and complaint escalation policies.

These files should be uploaded individually into:

```text
Knowledge Base > Documents
```

Then attach them to the agent under the agent's Knowledge Base section.

### 5.3 assistents.ai Agent

We configured the demo concept around:

```text
The Leela Royal Arrival Intelligence Agent
```

The agent is positioned as an executive and staff-facing operational copilot. It is not a guest-facing bot for basic FAQ handling. This matters because luxury hospitality requires discretion, context, and human ownership.

### 5.4 Data Connection

The agent should be connected to the database connector that contains the Leela demo tables.

In the agent configuration:

- Select the database connector under Data Sources.
- Enable Database Query.
- Enable Automatic Schema Injection.
- Enable Function Calling.
- Keep the database access read-only for the demo.

This lets the agent query structured data while staying bounded by the schema.

### 5.5 Business Rules

We prepared a Rule Engine layer to support:

- VIP Arrival Escalation.
- Upgrade Consideration.
- Arrival Readiness Risk.
- Complaint Recovery Escalation.
- Lapsed High-Value Guest.
- Pre-Arrival Critical Readiness.

The rules demonstrate that assistents.ai can combine AI reasoning with deterministic business logic. This is important for executive trust because the client can see that sensitive actions are not left entirely to free-form generation.

### 5.6 Conversation Starters

Recommended conversation starters:

```text
Show me today's VIP arrivals and service risks.
Which guests should receive upgrade consideration today?
Find high-value guests at risk of not returning.
Summarize allergy, complaint, and VIP escalations for arrivals this week.
Create an executive arrival-readiness brief for the General Manager.
```

### 5.7 Demo Positioning

The demo has been deliberately framed around luxury-safe principles:

- AI augments staff; it does not replace the human welcome.
- Sensitive actions require approval.
- Recommendations are discreet and brand-aligned.
- Guest privacy is protected through synthetic data.
- The agent focuses on anticipation, service recovery, and operational excellence.

## 6. Broader Objective And Expansion Script

Use this script after the live demo:

```text
What we have shown today is one focused journey: preparing the hotel team for high-value arrivals and service-sensitive guests.

But the broader opportunity is larger. Once assistents.ai is connected to the right systems, the same architecture can support direct-booking recapture, pre-arrival upsell, in-stay digital butler workflows, MICE and wedding RFP handling, loyalty reactivation, reputation management, revenue intelligence, and associate knowledge support.

The important point is that this does not require replacing the systems The Leela already trusts. OPERA, GHA DISCOVERY, CRM, service systems, POS, and revenue platforms remain the systems of record. assistents.ai becomes the intelligent action layer above them: reading context, applying hotel policy, recommending the next best action, and escalating to the right human owner when judgment or discretion is required.

That means The Leela can scale from today's portfolio to the next phase of growth without diluting the service standard. The AI handles coordination, context retrieval, and repetitive analysis. The team remains focused on hospitality, judgment, and the moments guests remember.
```

## 7. Concluding Remark For The Client

```text
The solution we are presenting is designed around The Leela's reality: high-touch service, high-value guests, complex operations, and a brand promise that cannot be automated carelessly.

assistents.ai is not being positioned as a generic chatbot. It is a controlled, brand-safe, data-connected intelligence layer that helps The Leela's teams anticipate needs, protect guest trust, recover issues faster, and personalize service at scale.

In practical terms, this means every arrival can be better prepared, every VIP can be recognized with context, every allergy can be surfaced before risk, every complaint can be routed before escalation, and every high-value guest relationship can be nurtured with discretion.

That is the exact role AI should play in luxury hospitality: invisible coordination in the background, exceptional human service in the foreground.
```

## 8. Recommended Closing Line

```text
Our goal is not to make The Leela feel more automated. Our goal is to help The Leela feel even more personal, more prepared, and more consistent at scale.
```

