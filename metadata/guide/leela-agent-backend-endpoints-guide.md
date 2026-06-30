# Leela Digital Concierge Backend Endpoint Guide

This guide explains how to connect `The Leela Digital Concierge` agent to backend endpoints for WhatsApp brochure, callback scheduling, enquiries, booking leads, and availability checks.

## Local Backend Created

Backend script:

```text
tools/leela-api-server.mjs
```

Run:

```bat
npm run serve:leela-api
```

Local base URL:

```text
http://localhost:4174
```

Health check:

```text
GET http://localhost:4174/api/leela/health
```

Implemented endpoints:

```text
POST /api/leela/chat
POST /api/leela/send-brochure
POST /api/leela/schedule-call
POST /api/leela/enquiry
POST /api/leela/booking-lead
POST /api/leela/check-availability
POST /api/leela/wati/webhook
```

Runtime records are written to:

```text
metadata/runtime/*.jsonl
```

## Important: Localhost Cannot Be Called By Assistents.ai

Assistents.ai cannot call:

```text
http://localhost:4174
```

because that address exists only on your machine.

For testing from Assistents.ai, expose the local backend with a public tunnel such as ngrok or Cloudflare Tunnel.

Example:

```bat
ngrok http 4174
```

Then use the generated HTTPS URL:

```text
https://your-ngrok-url.ngrok-free.app
```

Your Assistents.ai endpoint URL becomes:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/send-brochure
```

The WATI webhook URL to give your TL becomes:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/wati/webhook
```

These are two different integrations:

- Assistents.ai outbound action: the agent calls `/api/leela/send-brochure` when the visitor asks for a brochure.
- WATI inbound webhook: WATI calls `/api/leela/wati/webhook` when a WhatsApp event or reply arrives.

## Endpoint 1: Send Brochure On WhatsApp

### URL

```text
POST /api/leela/send-brochure
```

### Purpose

Use this action after the agent has collected:

- full name
- WhatsApp phone number with country code
- brochure type
- preferred hotel/city, if available
- explicit WhatsApp consent

### Request Schema

```json
{
  "fullName": "Demo Guest",
  "phone": "+919999999999",
  "preferredHotelOrCity": "Udaipur",
  "brochureType": "weddings_events",
  "whatsappConsent": true,
  "source": "leela_website",
  "sourcePage": "https://www.theleela.com/"
}
```

### Allowed brochureType Values

```text
rooms
weddings_events
dining_spa
offers
hotel_overview
```

### Success Response

```json
{
  "ok": true,
  "leadId": "lead_...",
  "brochureUrl": "https://www.theleela.com/weddings",
  "whatsapp": {
    "mode": "mock",
    "providerMessageId": "mock_whatsapp_..."
  },
  "message": "Demo mode: brochure send was recorded. Configure WhatsApp Cloud API to send a real message."
}
```

### Validation Errors

If phone does not include country code:

```json
{
  "ok": false,
  "error": "Phone number must include country code, for example +919999999999."
}
```

If consent is missing:

```json
{
  "ok": false,
  "error": "WhatsApp consent is required before sending a brochure."
}
```

## How To Configure send_whatsapp_brochure In Assistents.ai

In your agent:

```text
https://internal.assistents.ai/agents/abbe2124-ce07-45e5-8e11-f4451794fada/edit
```

### Step 1: Enable External API Tool

1. Open agent edit page.
2. Go to `Tools`.
3. Enable `External API`.
4. Save.

### Step 2: Open Outbound API Integrations

1. Go to `Outbound API Integrations`.
2. Add a new REST API action.

### Step 3: Configure Action

Action name:

```text
send_whatsapp_brochure
```

Method:

```text
POST
```

URL:

```text
https://your-public-backend-url/api/leela/send-brochure
```

For local testing through ngrok:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/send-brochure
```

Headers:

```json
{
  "Content-Type": "application/json"
}
```

If you set `ACTION_SECRET` on backend, also add:

```json
{
  "Authorization": "Bearer your_action_secret"
}
```

### Step 4: Add Action Description

Use:

```text
Send an approved Leela brochure to a guest on WhatsApp. Use only after collecting the guest's full name, WhatsApp phone number with country code, brochure type, preferred hotel/city if available, and explicit WhatsApp consent. Do not call this action if whatsappConsent is not true.
```

### Step 5: Add JSON Body Schema

Use:

```json
{
  "type": "object",
  "required": ["fullName", "phone", "brochureType", "whatsappConsent"],
  "properties": {
    "fullName": {
      "type": "string",
      "description": "Guest full name"
    },
    "phone": {
      "type": "string",
      "description": "Guest WhatsApp phone number with country code, for example +919999999999"
    },
    "preferredHotelOrCity": {
      "type": "string",
      "description": "Preferred Leela hotel or city"
    },
    "brochureType": {
      "type": "string",
      "enum": ["rooms", "weddings_events", "dining_spa", "offers", "hotel_overview"],
      "description": "Type of brochure requested"
    },
    "whatsappConsent": {
      "type": "boolean",
      "description": "Must be true after explicit user consent"
    },
    "source": {
      "type": "string",
      "description": "Lead source, usually leela_website"
    },
    "sourcePage": {
      "type": "string",
      "description": "Page URL where the user requested the brochure"
    }
  }
}
```

### Step 6: Agent Prompt Rule

Add this to the public agent prompt:

```text
For brochure requests, collect fullName, phone with country code, brochureType, preferredHotelOrCity if known, and explicit WhatsApp consent. Only call send_whatsapp_brochure when whatsappConsent is true. If the user has not consented, ask: "May I send this brochure to you on WhatsApp?"
```

## WATI Production Setup

Your TL said the organization has a demo WATI account. In this setup, WATI is the WhatsApp Business provider. The agent should not store or call WATI credentials directly. The agent calls your backend, and your backend calls WATI.

Run the backend with:

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

Ask your TL for:

- WATI tenant API base URL
- WATI API token
- Approved WATI template name
- Template variable names, if different from `name`, `brochure_type`, and `brochure_url`

Default WATI template variables expected by this backend:

```text
name
brochure_type
brochure_url
```

Suggested WATI template body:

```text
Namaste {{name}}, thank you for your interest in The Leela. Here is the {{brochure_type}} brochure: {{brochure_url}}. Our team will be happy to assist you further.
```

If the approved WATI template uses different variable names, set:

```powershell
$env:WATI_NAME_PARAM = "guest_name"
$env:WATI_BROCHURE_TYPE_PARAM = "brochure"
$env:WATI_BROCHURE_URL_PARAM = "link"
```

## WATI Webhook For Incoming WhatsApp Messages

Give this URL to your TL after starting ngrok:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/wati/webhook
```

Local health check:

```text
GET http://localhost:4174/api/leela/wati/webhook
```

Incoming WATI events are stored in:

```text
metadata/runtime/wati_inbound.jsonl
```

Optional webhook secret:

```powershell
$env:WATI_WEBHOOK_SECRET = "replace_with_shared_webhook_secret"
```

If `WATI_WEBHOOK_SECRET` is set, WATI must send one of these:

```text
Header: x-wati-webhook-secret: replace_with_shared_webhook_secret
```

or:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/wati/webhook?secret=replace_with_shared_webhook_secret
```

Use the header option if WATI supports custom headers.

## Assistents.ai Modal Values For send_whatsapp_brochure

Use these values in the screens you shared.

### General Tab

API Name:

```text
send_whatsapp_brochure
```

Description:

```text
Send an approved Leela brochure to a guest on WhatsApp through the backend WATI integration. Use only after collecting full name, WhatsApp phone number with country code, brochure type, preferred hotel/city if available, and explicit WhatsApp consent.
```

API Type:

```text
Action / Write / Create
```

If the UI only shows `Read (GET data)` by default, open the dropdown and select the write/action option.

HTTP Method:

```text
POST
```

Endpoint URL:

```text
https://your-ngrok-url.ngrok-free.app/api/leela/send-brochure
```

Tags:

```text
whatsapp, brochure, lead
```

### Authentication Tab

Add:

```text
Header Name: Content-Type
Header Value: application/json
```

If `ACTION_SECRET` is set, add:

```text
Header Name: Authorization
Header Value: Bearer replace_with_agent_to_backend_secret
Encrypt this value: On
```

Do not add WATI API tokens in Assistents.ai. WATI credentials stay only on the backend.

### Request Tab

Configure JSON body fields:

```json
{
  "fullName": "{fullName}",
  "phone": "{phone}",
  "preferredHotelOrCity": "{preferredHotelOrCity}",
  "brochureType": "{brochureType}",
  "whatsappConsent": "{whatsappConsent}",
  "source": "leela_website",
  "sourcePage": "{sourcePage}"
}
```

Required fields:

```text
fullName
phone
brochureType
whatsappConsent
```

### Response Tab

Response format:

```text
JSON
```

Success status codes:

```text
200,201,204
```

Expected success response:

```json
{
  "ok": true,
  "leadId": "lead_...",
  "brochureUrl": "https://www.theleela.com/weddings",
  "whatsapp": {
    "mode": "wati",
    "providerMessageId": "..."
  },
  "message": "Brochure sent on WhatsApp."
}
```

### Test Tab

Use:

```json
{
  "fullName": "Demo Guest",
  "phone": "+919999999999",
  "preferredHotelOrCity": "Udaipur",
  "brochureType": "weddings_events",
  "whatsappConsent": true,
  "source": "leela_website",
  "sourcePage": "https://www.theleela.com/"
}
```

## WhatsApp Cloud API Alternative Setup

If WATI is not used later, the backend can also send through Meta WhatsApp Cloud API. Configure these environment variables:

```text
WHATSAPP_PROVIDER=cloud
WHATSAPP_TOKEN=your_meta_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_BROCHURE_TEMPLATE=leela_brochure_send
WHATSAPP_TEMPLATE_LANGUAGE=en
```

Template body expected by this backend:

```text
Namaste {{1}}, thank you for your interest in The Leela. Here is the {{2}} brochure: {{3}}. Our team will be happy to assist you further.
```

Template variables:

```text
{{1}} fullName
{{2}} brochureType
{{3}} brochureUrl
```

## Endpoint 2: Schedule Call

URL:

```text
POST /api/leela/schedule-call
```

Request:

```json
{
  "fullName": "Demo Guest",
  "phone": "+919999999999",
  "email": "guest@example.com",
  "preferredDateTime": "2026-07-01 16:00 Asia/Kolkata",
  "topic": "Room booking in Udaipur"
}
```

Assistents.ai action name:

```text
schedule_callback
```

## Endpoint 3: Enquiry

URL:

```text
POST /api/leela/enquiry
```

Request:

```json
{
  "fullName": "Demo Guest",
  "phone": "+919999999999",
  "email": "guest@example.com",
  "preferredHotelOrCity": "Jaipur",
  "enquiryType": "wedding",
  "message": "Planning a wedding for 200 guests in December."
}
```

Assistents.ai action name:

```text
create_enquiry
```

## Endpoint 4: Booking Lead

URL:

```text
POST /api/leela/booking-lead
```

Request:

```json
{
  "fullName": "Demo Guest",
  "phone": "+919999999999",
  "email": "guest@example.com",
  "hotelOrCity": "Udaipur",
  "checkIn": "2026-08-12",
  "checkOut": "2026-08-15",
  "rooms": 1,
  "adults": 2,
  "children": 0,
  "preferences": "Lake view if available"
}
```

Assistents.ai action name:

```text
create_booking_lead
```

## Endpoint 5: Check Availability

URL:

```text
POST /api/leela/check-availability
```

Request:

```json
{
  "hotelOrCity": "Udaipur",
  "checkIn": "2026-08-12",
  "checkOut": "2026-08-15",
  "rooms": 1,
  "adults": 2,
  "children": 0
}
```

Current behavior:

```text
mock only; returns official reservation URL
```

Assistents.ai action name:

```text
check_room_availability
```

## Local Test Commands

Health:

```powershell
Invoke-RestMethod http://localhost:4174/api/leela/health
```

Send brochure:

```powershell
$payload = @{
  fullName = "Demo Guest"
  phone = "+919999999999"
  preferredHotelOrCity = "Udaipur"
  brochureType = "weddings_events"
  whatsappConsent = $true
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:4174/api/leela/send-brochure `
  -ContentType "application/json" `
  -Body $payload
```

## Production Checklist

Before going live:

1. Deploy `tools/leela-api-server.mjs` logic as a real backend service.
2. Use HTTPS.
3. Set `ACTION_SECRET`.
4. Add Authorization header in Assistents.ai actions.
5. Configure WATI or WhatsApp Cloud API provider.
6. Get WhatsApp/WATI template approved.
7. Replace mock brochure URLs with real hosted PDF URLs.
8. Store leads in CRM/database instead of local JSONL.
9. Add alerting for failed WhatsApp sends.
10. Configure WATI inbound webhook if WhatsApp replies need to be tracked.
11. Test consent failure and invalid phone failure.
