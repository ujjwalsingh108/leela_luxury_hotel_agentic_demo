# Leela Smart Agent Integration Plan

## Current State

- Local Leela site is served from `theleela_playwright_site` at `http://localhost:4173/`.
- The current Leela contact widget is a fixed launcher with three actions: Enquire, Phone Call, and Live Chat.
- Assistents.ai workspace: `WhiteGlove AI`.
- Assistents.ai agent: `The Leela Royal Arrival Intelligence Agent`.
- Agent ID: `26dc79ac-422a-4486-9492-29bf2daa6a99`.
- Organization ID: `bb5dd90c-f6aa-45a1-9db9-4b9f21bdc6d4`.
- Workspace ID: `1c3d84cd-f6bc-4fc5-a0ed-80b954bf2af1`.

## Existing Agent Capability

The existing agent is configured for internal hotel intelligence:

- VIP arrivals
- Service risks
- Upgrade opportunities
- Complaint and allergy escalation
- Executive arrival-readiness briefings
- Knowledge-base search
- Function calling
- Streaming chat

It is not yet configured as a public website concierge for lead capture, brochure sending, call scheduling, enquiry handling, and room booking.

## Recommended Public Website Agent

Create a separate public-facing agent named:

`The Leela Digital Concierge`

Purpose:

Capture visitor intent, collect guest details, send brochures on WhatsApp, schedule calls, answer enquiry questions, and guide room booking.

## Conversation Workflow

1. Greet
   - "Namaste, welcome to The Leela. Are you planning a stay, event, dining experience, spa visit, or would you like a brochure?"

2. Detect intent
   - Brochure
   - Schedule call
   - General enquiry
   - Book rooms
   - Offers
   - Wedding or event
   - Dining, spa, transport, loyalty

3. Collect lead details
   - Full name
   - WhatsApp phone number with country code
   - Email
   - Preferred hotel or city
   - Intent
   - Travel dates or preferred call time
   - Guests and rooms, when booking
   - Consent to contact on WhatsApp

4. Validate
   - Phone must include country code.
   - Ask for consent before WhatsApp communication.
   - Do not confirm paid booking without redirecting to official booking flow or human confirmation.

5. Route action
   - Brochure: call backend `send_whatsapp_brochure`.
   - Schedule call: call backend `schedule_callback`.
   - Enquiry: call backend `create_enquiry`.
   - Booking: call backend `create_booking_lead`, then deep-link to Leela reservations.

6. Confirm
   - Give a concise confirmation.
   - State next step and expected callback/WhatsApp timing.

## Backend Integration Required

Do not expose Assistents.ai tokens, WhatsApp tokens, calendar credentials, or booking credentials in frontend JavaScript.

Add a backend proxy:

- `POST /api/leela/chat`
- `POST /api/leela/send-brochure`
- `POST /api/leela/schedule-call`
- `POST /api/leela/enquiry`
- `POST /api/leela/booking-lead`

The local static demo currently uses `tools/serve-static.mjs`, which only serves files. For real integration, replace it with an Express/Next.js backend or deploy serverless API routes.

## Assistents.ai Configuration

In the agent edit screen, configure:

- Tools: enable `External API`.
- Outbound API Integrations:
  - `send_whatsapp_brochure`
  - `schedule_callback`
  - `create_enquiry`
  - `create_booking_lead`
  - optionally `check_room_availability`
- Authentication:
  - Configure server-to-server auth for the above endpoints.
- Knowledge Base:
  - Upload public guest-facing docs:
    - hotel overview
    - room categories
    - restaurants
    - spa/wellness
    - weddings/events
    - offers
    - cancellation and payment policies
    - FAQ
- Web Embedding or Agent API Access:
  - Use if the platform provides a production embed snippet.
  - If not, use the backend proxy approach.

## WhatsApp Integration

Use WhatsApp Business Cloud API or an approved provider such as Gupshup/Twilio.

Required:

- Approved message template for brochure.
- PDF or hosted brochure URL.
- Opt-in/consent record.
- Lead ID for audit trail.

Example WhatsApp action payload:

```json
{
  "name": "Guest Name",
  "phone": "+919999999999",
  "hotel": "The Leela Palace Bengaluru",
  "brochureType": "rooms",
  "consent": true
}
```

## Booking Integration

Short-term:

- Collect booking details.
- Create a booking lead.
- Send user to official reservation link:
  `https://reservations.theleela.com?chain=23514`

Production:

- Integrate with PMS/booking engine API if available.
- Check availability.
- Show room options and rates.
- Hold/reserve only after user confirmation and payment policy checks.

## Website Widget Changes

Replace the current fixed connect popover with a real chat panel:

- Floating Leela concierge button.
- Chat window with quick actions:
  - Send brochure
  - Schedule call
  - Enquire
  - Book rooms
- Lead form inside chat.
- WhatsApp consent checkbox.
- Handoff to human/reservations.

## Safety and Compliance

- Never collect payment card details in chat.
- Always ask consent before WhatsApp.
- Store audit trail of consent, source page, timestamp, phone, and intent.
- Human approval for VIP, complaint, refund, upgrade, and special-rate decisions.
- Use the internal `Royal Arrival Intelligence Agent` for staff operations, not public guest chat.

## Implementation Order

1. Create public-facing Leela Digital Concierge agent in Assistents.ai.
2. Add guest-facing knowledge-base docs.
3. Enable External API tool and configure actions.
4. Build backend proxy/API service.
5. Replace local Leela contact launcher with chat widget.
6. Connect widget to backend chat endpoint.
7. Connect WhatsApp provider and call scheduler.
8. Add booking lead flow and reservation redirect.
9. Test brochure, call scheduling, enquiry, and booking journeys.
