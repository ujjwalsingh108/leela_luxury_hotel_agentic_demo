# Leela Public-Facing Agent: Step-by-Step Implementation Guide

This guide expands `metadata/leela-smart-agent-integration-plan.md` into an execution checklist for building a public website concierge that can capture visitor details, send brochures on WhatsApp, schedule calls, answer enquiries, and help with hotel room booking.

## Objective

Build a public-facing agent for the Leela website:

`The Leela Digital Concierge`

It should support:

- Website visitor chat
- Lead capture
- WhatsApp brochure sending
- Call scheduling
- Enquiry handling
- Room booking assistance
- Human handoff
- Audit trail for consent and actions

Keep this separate from the existing internal agent:

`The Leela Royal Arrival Intelligence Agent`

The internal agent is for hotel staff workflows such as VIP arrivals, service risks, upgrade opportunities, and escalation decisions. The public agent is for guests and prospects.

## Phase 1: Confirm Current Assets

### Step 1.1: Confirm Local Website

Run:

```bat
npm run serve:theleela
```

Open:

```text
http://localhost:4173/
```

Expected result:

- Leela homepage loads.
- Floating contact widget appears.
- Current widget has `Enquire`, `Phone Call`, and `Live Chat`.

### Step 1.2: Confirm Assistents.ai Workspace

Login:

```text
https://internal-workflow.assistents.ai/
```

Workspace:

```text
WhiteGlove AI
```

Existing internal agent:

```text
The Leela Royal Arrival Intelligence Agent
```

Useful IDs:

```text
Organization ID: bb5dd90c-f6aa-45a1-9db9-4b9f21bdc6d4
Workspace ID: 1c3d84cd-f6bc-4fc5-a0ed-80b954bf2af1
Internal Agent ID: 26dc79ac-422a-4486-9492-29bf2daa6a99
```

### Step 1.3: Decide Demo vs Production Scope

For the demo, implement:

- Local chat UI
- Local backend mock APIs
- Simulated WhatsApp sending
- Simulated call scheduling
- Booking lead capture with redirect to Leela reservations

For production, add:

- Real Assistents.ai public agent API or embed
- Real WhatsApp Business API
- Real CRM or lead database
- Real calendar/call scheduler
- Real booking engine/PMS integration

## Phase 2: Create Public Agent in Assistents.ai

### Step 2.1: Create New Agent

In Assistents.ai:

1. Go to `Agents`.
2. Click `Create Agent`.
3. Set name:

```text
The Leela Digital Concierge
```

4. Suggested agent ID:

```text
the-leela-digital-concierge
```

5. Set description:

```text
A public-facing luxury hospitality concierge for The Leela website. It helps visitors choose hotels, request brochures, schedule calls, submit enquiries, and start room booking journeys. It collects contact details with consent, uses approved WhatsApp and booking workflows, and hands off to the reservations or guest relations team when needed.
```

### Step 2.2: Configure Greeting

Use:

```text
Namaste, welcome to The Leela. I can help you plan a stay, request a brochure on WhatsApp, schedule a call, explore offers, or start a room booking enquiry. How may I assist you today?
```

### Step 2.3: Add Conversation Starters

Add:

```text
Send me a brochure on WhatsApp.
I want to book rooms.
Schedule a call with reservations.
I have a wedding or event enquiry.
Show me current offers.
Help me choose the right Leela hotel.
```

### Step 2.4: Add Public-Facing System Prompt

Use this as the core system prompt:

```text
You are The Leela Digital Concierge, a public-facing luxury hospitality assistant for The Leela website.

Your role is to help website visitors with brochures, enquiries, call scheduling, hotel selection, offers, weddings and events, dining, spa, loyalty, and room booking guidance.

Tone:
- Warm, polished, discreet, and concise.
- Luxury hospitality style.
- Never overpromise.
- Never sound robotic.
- Ask only for the next necessary detail.

Primary goals:
1. Understand the visitor's intent.
2. Collect required details with consent.
3. Trigger the right action through configured tools.
4. Confirm the next step clearly.
5. Escalate to a human when needed.

Required lead fields:
- full_name
- phone_number with country code
- email when available
- preferred_hotel_or_city
- intent
- whatsapp_consent when WhatsApp is requested

For brochure requests:
- Ask for full name.
- Ask for WhatsApp number with country code.
- Ask which brochure they want: rooms, weddings/events, dining/spa, offers, or hotel overview.
- Ask for consent to send WhatsApp communication.
- Call send_whatsapp_brochure only after consent is true.

For call scheduling:
- Ask for full name.
- Ask for phone number with country code.
- Ask for preferred date/time and timezone.
- Ask what they want to discuss.
- Call schedule_callback.

For enquiries:
- Ask for name, phone, email, preferred hotel/city, and enquiry message.
- Call create_enquiry.

For room booking:
- Ask destination/hotel, check-in, check-out, rooms, adults, children, and any preference.
- Create a booking lead.
- Do not collect card details.
- Do not guarantee availability or price unless confirmed by an approved booking API.
- Send the official reservation link or hand off to reservations.

Safety:
- Never collect payment card details.
- Never claim a booking is confirmed unless an approved booking system returns a confirmation number.
- Always ask WhatsApp consent before sending messages.
- Escalate complaint, refund, special rate, VIP, allergy, accessibility, medical, or safety issues to a human.
```

## Phase 3: Prepare Knowledge Base

### Step 3.1: Create Guest-Facing KB Documents

Create or upload Markdown/PDF docs for:

- `hotel_overview.md`
- `room_types_and_suites.md`
- `offers_and_packages.md`
- `dining_spa_wellness.md`
- `weddings_and_events.md`
- `booking_cancellation_payment_policy.md`
- `leela_discovery_loyalty.md`
- `faq_public_guest_support.md`

Avoid internal-only content such as:

- VIP scoring logic
- guest risk signals
- internal escalation thresholds
- staff-only pricing approval rules
- synthetic PMS data unless needed for demo

### Step 3.2: Upload Documents

In Assistents.ai:

1. Go to `Knowledge Base`.
2. Open `Documents`.
3. Upload public docs.
4. Wait for processing.
5. Ensure status is `Completed`.

If a document fails:

1. Convert PDF to Markdown.
2. Remove very large tables or images.
3. Re-upload smaller files.

### Step 3.3: Attach KB to Agent

In agent edit:

1. Open `Knowledge Base`.
2. Attach the public guest-facing docs.
3. Save the agent.

Test prompt:

```text
Which Leela hotels are best for a palace stay?
```

Expected response:

- Uses KB.
- Asks for travel city/date if needed.
- Does not invent live availability.

## Phase 4: Define Backend Actions

The browser must not directly call WhatsApp, booking, calendar, CRM, or Assistents.ai secrets.

Create backend endpoints:

```text
POST /api/leela/chat
POST /api/leela/send-brochure
POST /api/leela/schedule-call
POST /api/leela/enquiry
POST /api/leela/booking-lead
POST /api/leela/check-availability
POST /api/leela/wati/webhook
```

### Step 4.1: Define Common Lead Object

Use this shape across all actions:

```json
{
  "leadId": "lead_123",
  "source": "leela_website",
  "sourcePage": "http://localhost:4173/",
  "intent": "brochure",
  "fullName": "Guest Name",
  "phone": "+919999999999",
  "email": "guest@example.com",
  "preferredHotelOrCity": "The Leela Palace Bengaluru",
  "message": "Interested in rooms and offers",
  "whatsappConsent": true,
  "createdAt": "2026-06-29T00:00:00.000Z"
}
```

### Step 4.2: Brochure Endpoint

Endpoint:

```text
POST /api/leela/send-brochure
```

Request:

```json
{
  "fullName": "Guest Name",
  "phone": "+919999999999",
  "preferredHotelOrCity": "The Leela Palace Bengaluru",
  "brochureType": "rooms",
  "whatsappConsent": true
}
```

Backend behavior:

1. Validate phone number.
2. Validate consent.
3. Create lead record.
4. Send WhatsApp template message.
5. Return success.

Response:

```json
{
  "ok": true,
  "leadId": "lead_123",
  "message": "Brochure sent on WhatsApp."
}
```

### Step 4.3: Schedule Call Endpoint

Endpoint:

```text
POST /api/leela/schedule-call
```

Request:

```json
{
  "fullName": "Guest Name",
  "phone": "+919999999999",
  "email": "guest@example.com",
  "preferredDateTime": "2026-07-01 16:00 Asia/Kolkata",
  "topic": "Room booking at The Leela Palace Udaipur"
}
```

Backend behavior:

1. Validate name and phone.
2. Save lead.
3. Create task in CRM or calendar.
4. Optional: send confirmation WhatsApp/SMS/email.

Response:

```json
{
  "ok": true,
  "leadId": "lead_124",
  "message": "A reservations specialist will call at the requested time."
}
```

### Step 4.4: Enquiry Endpoint

Endpoint:

```text
POST /api/leela/enquiry
```

Request:

```json
{
  "fullName": "Guest Name",
  "phone": "+919999999999",
  "email": "guest@example.com",
  "preferredHotelOrCity": "Jaipur",
  "enquiryType": "wedding",
  "message": "Looking for a wedding venue for 200 guests in December."
}
```

Response:

```json
{
  "ok": true,
  "leadId": "lead_125",
  "message": "Your enquiry has been shared with the team."
}
```

### Step 4.5: Booking Lead Endpoint

Endpoint:

```text
POST /api/leela/booking-lead
```

Request:

```json
{
  "fullName": "Guest Name",
  "phone": "+919999999999",
  "email": "guest@example.com",
  "hotelOrCity": "Udaipur",
  "checkIn": "2026-08-12",
  "checkOut": "2026-08-15",
  "rooms": 1,
  "adults": 2,
  "children": 0,
  "preferences": "Lake view suite if available"
}
```

Response:

```json
{
  "ok": true,
  "leadId": "lead_126",
  "reservationUrl": "https://reservations.theleela.com?chain=23514",
  "message": "I have prepared your booking enquiry. Please continue on the official reservations page or wait for our team to contact you."
}
```

## Phase 5: Configure Assistents.ai Tools

### Step 5.1: Enable External API

In Assistents.ai agent edit:

1. Open `Tools`.
2. Find `External API`.
3. Enable it.
4. Save.

### Step 5.2: Add Outbound API Integrations

Open `Outbound API Integrations`.

Create these actions:

```text
send_whatsapp_brochure
schedule_callback
create_enquiry
create_booking_lead
check_room_availability
```

For local demo, point actions to your local or tunnelled backend.

Example with ngrok:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/send-brochure
```

Production should use your real backend domain:

```text
https://api.yourdomain.com/api/leela/send-brochure
```

### Step 5.3: Add Tool Descriptions

Use clear descriptions so the agent knows when to call each action.

`send_whatsapp_brochure`:

```text
Send an approved Leela brochure to a guest on WhatsApp. Use only after collecting full name, phone number with country code, brochure type, preferred hotel/city when available, and explicit WhatsApp consent.
```

`schedule_callback`:

```text
Create a callback request for reservations or guest relations. Use after collecting full name, phone number with country code, preferred date/time, timezone, and topic.
```

`create_enquiry`:

```text
Create a general guest enquiry lead for reservations, weddings, dining, spa, offers, or hotel information. Use after collecting contact details and enquiry message.
```

`create_booking_lead`:

```text
Create a booking lead before redirecting the user to the official reservations page. Use after collecting destination/hotel, check-in, check-out, rooms, adults, children, contact details, and preferences.
```

### Step 5.4: Configure Authentication

Use server-to-server authentication.

Recommended:

```text
Authorization: Bearer <BACKEND_ACTION_SECRET>
```

Do not put WhatsApp tokens or booking credentials inside the agent prompt.

### Step 5.5: Test Each Tool From Chat

Test prompts:

```text
Please send me the rooms brochure on WhatsApp.
```

```text
Schedule a call tomorrow at 4 PM about rooms in Udaipur.
```

```text
I want to enquire about a wedding for 200 guests.
```

```text
I want to book one room in Bengaluru from 12 August to 15 August.
```

Expected:

- Agent collects missing details.
- Agent asks consent for WhatsApp.
- Agent calls correct tool only after required fields are present.
- Agent confirms next step.

## Phase 6: Build Backend Proxy

The current project is static. For integration, add a backend server. The simplest path is Express.

### Step 6.1: Install Backend Dependencies

Recommended packages:

```bat
npm install express cors dotenv
```

Optional later:

```bat
npm install zod
```

### Step 6.2: Add Environment Variables

Create `.env` locally:

```text
PORT=4174
ACTION_SECRET=replace_me
ASSISTENTS_API_BASE=https://internal-workflow.assistents.ai
ASSISTENTS_AGENT_ID=the_public_agent_id_after_creation
WHATSAPP_PROVIDER=mock
WATI_API_BASE=replace_with_wati_tenant_api_base
WATI_API_TOKEN=replace_with_wati_api_token
WATI_BROCHURE_TEMPLATE=leela_brochure_send
WATI_BROADCAST_NAME=leela_brochure_send
BROCHURE_ROOMS_URL=https://example.com/leela-rooms-brochure.pdf
BROCHURE_EVENTS_URL=https://example.com/leela-events-brochure.pdf
RESERVATION_URL=https://reservations.theleela.com?chain=23514
```

Do not commit `.env`.

### Step 6.3: Backend Behavior

Backend responsibilities:

- Validate input.
- Store consent.
- Call WhatsApp provider.
- Create CRM/calendar records.
- Call Assistents.ai chat API or use embed/API when available.
- Return simple responses to frontend.

### Step 6.4: Local Demo Mode

If real WhatsApp is not ready, make the endpoint return:

```json
{
  "ok": true,
  "mode": "mock",
  "message": "Demo: brochure would be sent on WhatsApp."
}
```

This lets the frontend and agent workflow be tested before provider approval.

## Phase 7: WhatsApp Setup

### Step 7.1: Choose Provider

Options:

- WATI
- WhatsApp Business Cloud API
- Gupshup
- Twilio WhatsApp

For this demo, use WATI because the organization already has a WATI demo account. Use mock mode first if the WATI token or approved template is not ready.

### Step 7.1A: Configure WATI For Brochure Sending

The agent should call your backend action:

```text
POST https://your-public-backend-url/api/leela/send-brochure
```

The backend then calls WATI privately.

Backend environment:

```powershell
$env:PORT = "4174"
$env:ACTION_SECRET = "replace_with_agent_to_backend_secret"
$env:WHATSAPP_PROVIDER = "wati"
$env:WATI_API_BASE = "https://replace-with-your-wati-tenant-base-url"
$env:WATI_API_TOKEN = "replace_with_wati_api_token"
$env:WATI_BROCHURE_TEMPLATE = "leela_brochure_send"
$env:WATI_BROADCAST_NAME = "leela_brochure_send"
npm run serve:leela-api
```

Keep WATI credentials on the backend only. Do not paste WATI tokens into the agent prompt, website JavaScript, or public configuration.

### Step 7.1B: Give TL The WATI Incoming Webhook URL

After exposing the backend with ngrok:

```bat
ngrok http 4174
```

Give this URL to your TL for WATI webhook configuration:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/wati/webhook
```

This webhook receives WhatsApp delivery/reply events from WATI and stores them locally in:

```text
metadata/runtime/wati_inbound.jsonl
```

This is different from the Assistents.ai outbound action URL:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/send-brochure
```

### Step 7.2: Create Approved Templates

Template examples:

`leela_brochure_send`:

```text
Namaste {{name}}, thank you for your interest in The Leela. Here is the {{brochure_type}} brochure: {{brochure_url}}. Our team will be happy to assist you further.
```

`leela_callback_confirmation`:

```text
Namaste {{1}}, your callback request with The Leela has been received for {{2}}. Our team will contact you on this number.
```

### Step 7.3: Consent Logging

Store:

- name
- phone
- consent text shown
- consent accepted true/false
- timestamp
- page URL
- IP/user agent when legally appropriate
- lead ID

## Phase 8: Booking Flow

### Step 8.1: Demo Booking Flow

Use this behavior:

1. Agent collects booking details.
2. Backend creates booking lead.
3. Agent gives official reservation URL:

```text
https://reservations.theleela.com?chain=23514
```

4. Human team follows up if the user provided phone/email.

### Step 8.2: Production Booking Flow

Integrate official booking/PMS API when available.

Required API capabilities:

- search hotels
- check room availability
- fetch rates
- create hold or booking
- payment link or redirect
- retrieve confirmation number

Until that is available:

- Do not claim availability.
- Do not quote final rates.
- Do not confirm booking.

## Phase 9: Replace Website Widget

### Step 9.1: Remove Existing Static Contact Launcher

Current launcher in local HTML is around:

```html
<div class="tl-connect__link ...">
```

Replace or override it with a new chat widget.

### Step 9.2: New Widget Features

The new widget should include:

- Floating Leela concierge button
- Chat window
- Quick action buttons
- Message list
- Lead capture fields
- WhatsApp consent checkbox
- Booking form state
- Human handoff button
- Minimize/close

Quick actions:

```text
Send brochure
Schedule call
Enquire
Book rooms
Offers
Wedding/event
```

### Step 9.3: Frontend Chat API

Frontend should call:

```text
POST /api/leela/chat
```

Payload:

```json
{
  "sessionId": "browser_session_id",
  "message": "I want to book rooms",
  "pageUrl": "http://localhost:4173/",
  "lead": {
    "fullName": "",
    "phone": "",
    "email": "",
    "whatsappConsent": false
  }
}
```

Response:

```json
{
  "reply": "Certainly. Which Leela hotel or city are you considering?",
  "requiredFields": ["hotelOrCity", "checkIn", "checkOut"],
  "quickActions": ["Send brochure", "Schedule call"]
}
```

### Step 9.4: Frontend Validation

Validate before action:

- Phone includes country code.
- WhatsApp consent is true for brochure.
- Dates are valid for booking.
- Email format is valid when required.

## Phase 10: Connect Assistents.ai Chat

There are two possible approaches.

### Option A: Use Web Embedding

Use this if Assistents.ai provides a production embed snippet.

Steps:

1. Open agent edit.
2. Go to `Web Embedding`.
3. Generate or copy embed code.
4. Add embed code to Leela website.
5. Configure allowed domains.
6. Test chat.

Pros:

- Fastest.
- Hosted UI and chat handling.

Cons:

- Less control over luxury Leela UI.
- Harder to customize lead forms and booking UX.

### Option B: Use Backend Proxy and Agent API

Recommended for production.

Steps:

1. Open agent edit.
2. Go to `Agent API Access`.
3. Generate API key/token if available.
4. Store it only on backend.
5. Frontend calls your backend.
6. Backend calls Assistents.ai.
7. Backend handles action calls and secrets.

Pros:

- Full UI control.
- Secure.
- Easier to integrate WhatsApp, CRM, booking, analytics.

Cons:

- Requires backend implementation.

## Phase 11: Human Handoff

Add handoff triggers:

- user asks for a human
- complaint/refund issue
- VIP/special rate request
- accessibility or medical need
- booking uncertainty
- agent confidence is low
- WhatsApp/call action fails

Handoff payload:

```json
{
  "leadId": "lead_123",
  "reason": "human_requested",
  "summary": "Guest wants help booking Udaipur palace stay for 2 adults.",
  "contact": {
    "name": "Guest Name",
    "phone": "+919999999999",
    "email": "guest@example.com"
  }
}
```

## Phase 12: Analytics and Tracking

Track:

- widget opened
- quick action clicked
- lead captured
- WhatsApp consent accepted
- brochure sent
- callback scheduled
- enquiry created
- booking lead created
- reservation link clicked
- human handoff
- failed actions

Minimum event schema:

```json
{
  "event": "brochure_sent",
  "sessionId": "session_123",
  "leadId": "lead_123",
  "intent": "brochure",
  "hotel": "The Leela Palace Bengaluru",
  "timestamp": "2026-06-29T00:00:00.000Z"
}
```

## Phase 13: Testing Checklist

### Test 13.1: Brochure Flow

Prompt:

```text
Send me a brochure on WhatsApp.
```

Expected:

- Agent asks name.
- Agent asks WhatsApp number.
- Agent asks brochure type.
- Agent asks consent.
- Action called after consent.
- User receives confirmation.

### Test 13.2: Schedule Call Flow

Prompt:

```text
I want someone to call me tomorrow.
```

Expected:

- Agent asks name, phone, topic, time.
- Creates callback.
- Confirms timing.

### Test 13.3: Enquiry Flow

Prompt:

```text
I am planning a wedding for 200 guests.
```

Expected:

- Agent collects city/hotel, date/month, guest count, name, phone, email.
- Creates enquiry.
- Does not promise availability.

### Test 13.4: Booking Flow

Prompt:

```text
Book a room in Udaipur for two adults from 12 August to 15 August.
```

Expected:

- Agent asks missing contact details.
- Creates booking lead.
- Gives official reservation URL.
- Does not collect payment card.
- Does not confirm booking unless booking API confirms.

### Test 13.5: Safety Flow

Prompt:

```text
I want a guaranteed discount and free suite upgrade.
```

Expected:

- Agent politely avoids guarantee.
- Offers to create request or connect with reservations.

### Test 13.6: WhatsApp Consent Failure

Prompt:

```text
Send brochure to +919999999999.
```

Expected:

- Agent asks consent before sending.
- Does not call brochure action until consent is true.

## Phase 14: Deployment Checklist

Before launch:

- Public agent created.
- Public KB docs uploaded and completed.
- External API enabled.
- Action endpoints configured.
- Backend deployed over HTTPS.
- WhatsApp templates approved.
- CRM/calendar connected.
- Booking lead flow tested.
- Widget installed on site.
- Domain allowlist configured.
- Consent logging enabled.
- Analytics events enabled.
- Human handoff process confirmed.
- No secrets in frontend.
- QA completed on desktop and mobile.

## Phase 15: Final Definition of Done

The objective is complete when:

1. A website visitor can open the Leela chat widget.
2. The agent can answer public hotel questions.
3. The agent can collect details for brochure/call/enquiry/booking.
4. WhatsApp brochure action works or is clearly mocked in demo.
5. Schedule call action creates a real or demo callback record.
6. Enquiry action creates a lead record.
7. Booking flow creates a booking lead and redirects to official reservations.
8. Consent is captured before WhatsApp.
9. Human handoff exists.
10. No private tokens or credentials are exposed in browser code.
