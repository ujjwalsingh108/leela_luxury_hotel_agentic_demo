# Backend Actions, API Contracts, And Webhooks

## Current Public Ngrok Base URL

Use the current ngrok tunnel from `.env`:

```text
https://degraded-mower-obedient.ngrok-free.dev
```

## Backend Endpoints

The WhatsApp agent should use these backend endpoints through Assistents.ai Outbound API Integrations.

### send_whatsapp_brochure

Method:

```text
POST
```

URL:

```text
https://degraded-mower-obedient.ngrok-free.dev/api/leela/send-brochure
```

Use when:

- Guest requests a brochure.
- Required lead details are collected.
- WhatsApp consent is explicitly true.

Request body:

```json
{
  "fullName": "{fullName}",
  "phone": "{phone}",
  "preferredHotelOrCity": "{preferredHotelOrCity}",
  "brochureType": "{brochureType}",
  "whatsappConsent": "{whatsappConsent}",
  "source": "whatsapp_agent",
  "sourcePage": "whatsapp"
}
```

### schedule_callback

URL:

```text
https://degraded-mower-obedient.ngrok-free.dev/api/leela/schedule-call
```

Request body:

```json
{
  "fullName": "{fullName}",
  "phone": "{phone}",
  "preferredDateTime": "{preferredDateTime}",
  "topic": "{topic}",
  "preferredHotelOrCity": "{preferredHotelOrCity}",
  "source": "whatsapp_agent"
}
```

### create_enquiry

URL:

```text
https://degraded-mower-obedient.ngrok-free.dev/api/leela/enquiry
```

Request body:

```json
{
  "fullName": "{fullName}",
  "phone": "{phone}",
  "email": "{email}",
  "preferredHotelOrCity": "{preferredHotelOrCity}",
  "enquiryType": "{intent}",
  "message": "{message}",
  "source": "whatsapp_agent"
}
```

### create_booking_lead

URL:

```text
https://degraded-mower-obedient.ngrok-free.dev/api/leela/booking-lead
```

Request body:

```json
{
  "fullName": "{fullName}",
  "phone": "{phone}",
  "email": "{email}",
  "hotelOrCity": "{hotelOrCity}",
  "checkIn": "{checkIn}",
  "checkOut": "{checkOut}",
  "rooms": "{rooms}",
  "adults": "{adults}",
  "children": "{children}",
  "preferences": "{preferences}",
  "source": "whatsapp_agent"
}
```

## WATI Incoming Webhook

Configure this URL in WATI for incoming WhatsApp events:

```text
https://degraded-mower-obedient.ngrok-free.dev/api/leela/wati/webhook
```

The current backend receives and stores inbound WATI events. For true two-way WhatsApp auto-reply, the production bridge should be:

1. WATI sends inbound message to webhook.
2. Backend normalizes sender, message, timestamp, and conversation ID.
3. Backend calls Assistents.ai Agent API for the WhatsApp agent.
4. Assistents.ai returns reply and any action/tool decision.
5. Backend sends the reply through WATI.
6. Backend stores audit record.

## Required Headers For Outbound API Integrations

Always include:

```text
Content-Type: application/json
```

If `ACTION_SECRET` is configured in the backend, also include:

```text
Authorization: Bearer <ACTION_SECRET>
```

Do not put WATI API tokens inside Assistents.ai prompts or public website JavaScript. WATI credentials belong only in backend environment variables.

## Ngrok Warning Header

For testing public ngrok API endpoints, callers may need:

```text
ngrok-skip-browser-warning: true
```

WATI webhook posts usually do not require this header, but if WATI receives an ngrok warning page instead of JSON, move the demo to a paid/static ngrok domain, DigitalOcean, or add the header if WATI supports custom headers.

