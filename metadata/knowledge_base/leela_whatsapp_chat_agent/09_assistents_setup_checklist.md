# Assistents.ai Setup Checklist For WhatsApp Agent

## 1. Create Agent

Use `08_agent_form_values.md` for the Create New Agent wizard.

## 2. Attach Knowledge Base

Upload all Markdown files in:

```text
metadata/knowledge_base/leela_whatsapp_chat_agent
```

## 3. Enable External API Tool

In the agent edit screen:

```text
Tools -> External API -> Enable
```

## 4. Configure Outbound API Integrations

Create these endpoints:

1. `send_whatsapp_brochure`
2. `schedule_callback`
3. `create_enquiry`
4. `create_booking_lead`
5. `check_room_availability`, optional

Use the endpoint URLs in `03_actions_api_and_webhooks.md`.

## 5. Configure Authentication

Add header:

```text
Content-Type: application/json
```

If `ACTION_SECRET` is set:

```text
Authorization: Bearer <ACTION_SECRET>
```

Never add WATI token to Assistents.ai. WATI token stays in backend `.env`.

## 6. Configure WhatsApp Channel

There are two possible paths.

### Preferred if Assistents.ai supports native WhatsApp channel

Use:

```text
Channels -> Add Channel -> WhatsApp
```

Assign:

```text
The Leela WhatsApp Concierge
```

### Current backend bridge path

Configure WATI webhook:

```text
https://degraded-mower-obedient.ngrok-free.dev/api/leela/wati/webhook
```

Then extend backend to:

1. Receive inbound WATI message.
2. Call Assistents.ai Agent API for this WhatsApp agent.
3. Send the generated response back through WATI.

## 7. Test Scenarios

Brochure:

```text
Send me a wedding brochure for Udaipur.
```

Expected:

- Agent asks name, phone, brochure type/property if missing.
- Agent asks WhatsApp consent.
- Agent calls `send_whatsapp_brochure`.

Booking:

```text
I want to book two rooms in Jaipur next weekend.
```

Expected:

- Agent collects dates, rooms, guests, name, phone, email.
- Agent calls `create_booking_lead`.
- Agent does not confirm price or availability.

Wedding:

```text
I am planning a wedding for 250 guests in December.
```

Expected:

- Agent collects city/property, event date/month, guest count, room needs, name, phone, email.
- Agent calls `create_enquiry`.
- Agent escalates to events team.

Dining allergy:

```text
I want dinner and one guest has a nut allergy.
```

Expected:

- Agent treats allergy as critical.
- Agent collects property/date/time/guest count.
- Agent escalates to dining team.

Complaint:

```text
I had a bad experience and want a refund.
```

Expected:

- Agent apologizes briefly.
- Agent collects contact/property/context.
- Agent escalates.
- Agent does not promise refund or compensation.

