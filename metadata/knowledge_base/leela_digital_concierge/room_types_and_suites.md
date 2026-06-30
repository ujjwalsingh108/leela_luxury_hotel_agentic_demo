# The Leela Digital Concierge Knowledge Base
# Room Types and Suites

Document status: Production-ready public-facing knowledge base draft  
Audience: Website visitors and booking prospects  
Last reviewed: 2026-06-29  
Primary public sources:
- https://www.theleela.com/
- https://reservations.theleela.com
- Individual property pages on https://www.theleela.com/

## Purpose

Use this document to help guests understand room and suite categories at a high level, collect booking preferences, and route live availability and rate confirmation to the official booking engine or reservations team.

Important: Room names, inclusions, views, layouts, sizes, and availability vary by property. The agent must never imply that every category exists at every hotel.

## Core Rule

The concierge may explain common category types, but must verify live room names, inclusions, rates, and availability through:

- Official booking engine
- Property page
- Reservations team
- Approved booking API, when integrated

Safe language:

"Room names and inclusions vary by property. I can help identify the right style of accommodation and guide you to live availability and rates."

## Common Accommodation Taxonomy

The public concierge can use this generic classification when property-specific data is not available.

### Rooms

Typical guest fit:

- Solo travellers
- Couples
- Short leisure stays
- Business stays
- Guests who want a refined base category

Possible features, subject to property:

- King or twin bedding
- Work desk
- Premium bathroom
- City, garden, pool, lake, sea, or resort views depending on property
- Wi-Fi
- In-room dining access

Agent guidance:

- Use "room" as the starting point for most booking enquiries.
- Ask whether the guest prefers king or twin beds.
- Ask if view, quiet location, accessibility, or connecting room matters.

### Club Rooms or Premium Rooms

Typical guest fit:

- Business travellers
- Repeat guests
- Guests who value added comfort or lounge-style benefits
- Short stays where convenience matters

Possible inclusions:

- Enhanced room positioning
- Access to club-style services when offered
- Premium amenities
- Priority or personalized service touchpoints

Agent guidance:

- Do not promise lounge access unless live property information confirms it.
- Ask whether the guest wants business convenience, lounge benefits, or a quieter room.

### View Rooms

Typical guest fit:

- Couples
- First-time leisure travellers
- Guests celebrating honeymoon, anniversary, or birthday
- Guests asking for lake, sea, garden, palace, city, or pool views

Agent guidance:

- Views are subject to room category and availability.
- Mention that final view allocation is confirmed through booking/reservations.
- If the guest has a celebration, create a note for reservations.

Safe language:

"I can note your preference for a lake-view room, subject to availability at the selected property."

### Suites

Typical guest fit:

- Honeymoon or anniversary
- Families
- Longer stays
- Guests wanting a separate living area
- Special occasions
- Senior executives or high-comfort travel

Possible features:

- Separate bedroom and living area
- Larger bathroom
- Dining or lounge area
- Enhanced views or privacy
- Butler or personalized services at select properties

Agent guidance:

- Use suites as a recommendation when the guest has an occasion, family need, privacy requirement, or longer stay.
- Do not promise butler service unless confirmed for the property and category.

### Signature, Royal, Presidential, or Palace Suites

Typical guest fit:

- Ultra-luxury stay
- Wedding principals
- Celebrity or dignitary
- Large celebration
- Exceptional privacy requirement

Agent guidance:

- Always route to reservations or a human specialist.
- Do not quote rates unless live API confirms.
- Do not guarantee availability.
- Do not use internal terms such as VIP or high value.

Safe language:

"For signature suites, I recommend connecting you with the reservations team so they can confirm availability, inclusions, and any privacy or arrival arrangements with care."

### Residences or Long-Stay Accommodation

Typical guest fit:

- Extended business stays
- Relocation or family stays
- Guests needing added space
- Guests asking for apartment-style living

Agent guidance:

- Ask length of stay, number of guests, kitchen/living-space needs, and preferred city.
- Route to property/reservations team for confirmed residence availability.

## Property-Specific Caution

The agent should not invent exact room names. If the guest asks "What room types does The Leela Palace Udaipur have?", use this response pattern:

"I can help with that. Room and suite names can vary by property and season, so I should check the live property page or reservations flow for the most accurate list. Are you looking for a room, suite, lake/view preference, or a special-occasion stay?"

If the integration has live inventory:

- Use `check_room_availability`.
- Return live categories exactly as provided.

If not:

- Provide category guidance only.
- Offer reservations link or callback.

## Booking Preference Questions

Ask only the next necessary question.

For a standard room enquiry:

1. Which city or Leela property are you considering?
2. What are your check-in and check-out dates?
3. How many rooms and guests?
4. Do you prefer king or twin beds?
5. Any view, accessibility, connecting room, or occasion preference?

For a suite enquiry:

1. Which property or destination?
2. Travel dates?
3. Number of guests?
4. Is this for a celebration, family stay, business stay, or privacy need?
5. Would you like a callback from reservations?

For family:

- Number of adults
- Number and ages of children
- Connecting rooms or suite preference
- Extra bed request
- Meal preference

For accessibility:

- Accessibility requirement
- Mobility assistance
- Bathroom support needs
- Elevator proximity or step-free access
- Human handoff required

## Room and Suite Recommendation Matrix

| Guest Scenario | Suggested Direction |
| --- | --- |
| Solo business stay | Room or club/premium room |
| Couple on leisure trip | Room with preferred view or suite |
| Honeymoon or anniversary | View room or suite, subject to availability |
| Family with children | Suite, connecting rooms, or larger category |
| Long stay | Residence or suite, subject to property |
| Wedding couple | Signature suite or premium suite via event specialist |
| Privacy-sensitive guest | Human reservations handoff |
| Accessibility need | Human handoff and confirmed accessible room |

## Guardrails

The concierge must not:

- Confirm availability without live source.
- Confirm price without live rate source.
- Guarantee upgrade.
- Guarantee room view.
- Guarantee early check-in or late check-out.
- Collect card information.
- Claim a booking is complete without confirmation number.
- Say all Leela hotels have the same room types.

The concierge may:

- Explain categories at a high level.
- Collect preferences.
- Create a booking lead.
- Redirect to official reservations.
- Schedule a call.
- Send a brochure with consent.

## Booking Lead Payload

When the guest wants room booking, collect:

```json
{
  "intent": "booking",
  "hotelOrCity": "",
  "checkIn": "",
  "checkOut": "",
  "rooms": 1,
  "adults": 2,
  "children": 0,
  "roomPreference": "",
  "viewPreference": "",
  "bedPreference": "",
  "occasion": "",
  "accessibilityNeeds": "",
  "fullName": "",
  "phone": "",
  "email": ""
}
```

## Recommended Agent Responses

### Room selection

"For your dates, I can help narrow the right accommodation style. Are you looking for a refined room, a room with a preferred view, or a suite with more space?"

### Suite enquiry

"A suite would be a graceful choice for a longer stay or special occasion. May I know the property, dates, and number of guests so I can prepare a booking enquiry or connect you with reservations?"

### Availability request

"I can guide you to the official reservations page for live availability and rates. If you share your dates and guest count, I can also prepare the enquiry details before you continue."

## Retrieval Keywords

room, rooms, suite, suites, royal suite, presidential suite, palace suite, view room, lake view, sea view, club room, premium room, family room, connecting rooms, long stay, residences, bed preference, king bed, twin beds, accessible room, booking, availability, rates.

