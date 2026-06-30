# The Leela Digital Concierge Knowledge Base
# Offers and Packages

Document status: Production-ready public-facing knowledge base draft  
Audience: Website visitors, reservations leads, loyalty members  
Last reviewed: 2026-06-29  
Primary public sources:
- https://www.theleela.com/special-offers
- https://www.theleela.com/leela-discovery-loyalty-programme
- https://reservations.theleela.com

## Purpose

Use this document to guide guests asking about offers, packages, savings, member rates, complimentary nights, palace trails, wellness, meetings, and special promotions.

Offers are time-sensitive. The concierge must always direct the guest to the official offers page or reservations team for current validity, blackout dates, participating properties, inclusions, and terms.

## Core Rule

Never guarantee an offer, rate, inclusion, upgrade, or discount unless confirmed by the official booking engine, offer page, or reservations team.

Safe language:

"Offers change by date and property. I can guide you to the current offers page or help create an enquiry so the reservations team can confirm eligibility and inclusions."

## Current Offer Categories Observed on Official Site

As of the last review, the official offers page included examples such as:

- Royal Summer Escape - Pay 2 Stay 3
- Leela DISCOVERY Member Special - Double Rewards
- The Leela Palace Trail
- Time Travel with The Leela
- Lake and Beach Ecstasy
- Royal Meetings

These are examples from the public offers page and should be verified live before presenting as bookable.

## Offer Types

### Stay Offers

Used when guests ask:

- "Do you have any stay offers?"
- "Any discount for 3 nights?"
- "What packages are available?"
- "Any summer package?"

Possible inclusions, subject to live offer:

- Complimentary night structure
- Savings on stay
- Dining or spa inclusion
- Breakfast or meal benefit
- Flexible stay benefits

Agent guidance:

- Ask destination, dates, number of nights, and guest count.
- Route to official offers page or booking lead.
- Mention that specific terms depend on property and dates.

### Member Offers

Used when guests ask:

- "Do members get special rates?"
- "I am a Leela DISCOVERY member."
- "Can I earn rewards?"

Agent guidance:

- Explain that Leela DISCOVERY members may access member rates and earn/redeem DISCOVERY Dollars where eligible.
- Ask whether they are already a member.
- Offer official loyalty page or reservations flow.
- Do not calculate rewards unless live system confirms.

### Palace Trail or Multi-Destination Itinerary

Used when guests ask:

- "Can I visit multiple Leela properties?"
- "Plan a luxury India itinerary."
- "Tell me about palace trail."

Agent guidance:

- Ask travel duration, cities of interest, occasion, and preferred pace.
- Offer itinerary enquiry or callback.
- Do not produce final prices without travel desk/reservations.

### Wellness and Spa Packages

Used when guests ask:

- "Spa offers?"
- "Wellness retreat?"
- "Ayurveda package?"

Agent guidance:

- Ask destination, dates, number of guests, and wellness goals.
- Mention that wellness programs may include spa therapies, yoga, Ayurveda-inspired treatments, or fitness depending on property.
- Route medical/pregnancy/clinical questions to spa specialist.

### Meetings and Corporate Packages

Used when guests ask:

- "Corporate event package"
- "Residential meeting"
- "Conference offer"
- "Group booking"

Agent guidance:

- Ask city, dates, room block size, meeting format, attendees, venue needs, and meal requirements.
- If 10 or more rooms, route to group sales or reservations.
- Do not promise meeting space availability.

### Wedding and Celebration Packages

Used when guests ask:

- "Wedding package"
- "Destination wedding offer"
- "Celebration package"

Agent guidance:

- Ask destination, tentative dates, guest count, ceremonies/events, room requirements, and budget range if appropriate.
- Route to wedding specialist.
- Do not quote package price unless approved and current.

## Offer Qualification Questions

Ask:

1. Which Leela property or city are you considering?
2. What are your travel dates?
3. How many nights?
4. How many rooms and guests?
5. Are you a Leela DISCOVERY member?
6. Are you looking for stay, dining, spa, wedding/event, or meeting offers?
7. Would you like the current offers link or a reservations callback?

## Offer Response Patterns

### Generic offers

"The Leela offers curated stay and experience-led packages, and the active offers vary by property and date. May I know your preferred city and travel dates so I can guide you to the most relevant current offers?"

### Member offer

"Leela DISCOVERY members may receive access to member rates and earn or redeem DISCOVERY Dollars on eligible stays. Are you already a member, or would you like me to share the loyalty programme link?"

### Need discount

"I can help you check current offers and member rates. Final savings depend on the selected property, dates, and offer terms, so they should be confirmed on the official reservations page."

## Actions by Intent

| Intent | Agent Action |
| --- | --- |
| Wants current offer list | Share official offers page |
| Wants offer by dates | Collect dates and create booking lead |
| Wants member rate | Explain DISCOVERY and redirect/signpost |
| Wants package PDF | Send brochure on WhatsApp after consent |
| Wants corporate/wedding offer | Create enquiry and offer call |
| Wants final price | Redirect to official booking/reservations |

## WhatsApp Brochure Flow for Offers

Collect:

- Full name
- WhatsApp phone number with country code
- Preferred city/property
- Offer interest
- Travel dates if known
- Consent to receive WhatsApp updates

Then call:

`send_whatsapp_brochure`

Example tool payload:

```json
{
  "brochureType": "offers",
  "fullName": "Guest Name",
  "phone": "+919999999999",
  "preferredHotelOrCity": "Udaipur",
  "travelDates": "2026-08-12 to 2026-08-15",
  "whatsappConsent": true
}
```

## Guardrails

Do not:

- Say an expired offer is active.
- Promise eligibility.
- Promise up to X percent savings unless the current offer page confirms it.
- Stack offers unless official terms allow.
- Quote package prices from memory.
- Confirm benefits such as meals, transfers, spa credits, taxes, or upgrades unless the live offer confirms them.

Do:

- Ask for travel dates.
- Route to official offer page.
- Create lead for follow-up.
- Mention "subject to terms and availability."
- Ask for consent before WhatsApp.

## Retrieval Keywords

offers, packages, special offers, discounts, savings, member rates, Leela DISCOVERY, double rewards, summer escape, palace trail, pay 2 stay 3, spa offer, dining offer, wedding package, meeting package, corporate offer, current offers, promotion, brochure.

