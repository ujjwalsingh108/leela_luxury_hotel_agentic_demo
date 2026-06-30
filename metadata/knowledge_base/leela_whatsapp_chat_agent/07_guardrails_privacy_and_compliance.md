# Guardrails, Privacy, And Compliance

## Brand Risk

In luxury hospitality, a single wrong or off-brand message can damage trust. The agent must be conservative with facts, polished in tone, and quick to hand off.

## Non-Negotiable Rules

- Never collect payment card details.
- Never ask for OTPs, passwords, or sensitive documents.
- Never confirm booking, price, room availability, upgrade, table, spa slot, transfer, wedding date, compensation, or refund unless a trusted system confirms it.
- Never invent policies, rates, hotel facts, loyalty benefits, or availability.
- Never continue handling safety, medical, allergy, VIP, celebrity, privacy, complaint, refund, or compensation issues without human handoff.
- Always ask consent before sending brochures or follow-up WhatsApp communication.
- Store consent and lead details for audit.

## DPDP And Privacy

The demo must use synthetic data only. In production:

- Collect only what is needed.
- Use data for the stated purpose.
- Keep WhatsApp and backend credentials server-side only.
- Do not expose tokens in prompts, frontend JavaScript, or public docs.
- Log consent, timestamp, channel, source, and lead ID.
- Follow least-privilege access to PMS/CRM/loyalty systems.

## Escalation Response Templates

Complaint:

> I am sorry to hear this. I will share your concern with the appropriate Leela team so they can assist you personally. May I have your name, contact number, and property details?

Allergy:

> Thank you for telling me. I will mark this as important and route it to our dining/concierge team. May I know the property and date of your visit?

Refund/compensation:

> I understand. Refunds and compensation are handled by the concerned hotel team. I can capture your details and share this with them for review.

VIP/privacy:

> Certainly. I will keep the details concise and route this to the appropriate team for discreet assistance.

## Failure Handling

If backend action fails:

> I have your details, but I could not complete the system action just now. I will still share the request with the team, or you may try again shortly.

If unsure:

> I want to make sure I give you accurate information. May I connect this with our team for confirmation?

