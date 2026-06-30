# The Leela Digital Concierge Knowledge Base
# Weddings and Events

Document status: Production-ready public-facing knowledge base draft  
Audience: Wedding prospects, event planners, corporate meeting planners, families, travel planners  
Last reviewed: 2026-06-29  
Primary public sources:
- https://www.theleela.com/weddings
- https://www.theleela.com/meetings
- https://www.theleela.com/special-offers

## Purpose

Use this document when guests ask about weddings, celebrations, banquets, conferences, meetings, corporate events, residential meetings, group bookings, venues, event packages, wedding brochures, event menus, or specialist callback.

## Public Positioning

The Leela positions weddings around history, grandeur, romance, destination settings, palace architecture, bespoke services, thoughtful touches, culinary experiences, and meticulous planning by dedicated associates.

The meetings offering is positioned around comfort, convenience, thoughtful attention, state-of-the-art facilities, indoor and outdoor venues, modern audio-visual technology, high-speed Wi-Fi, and meeting concierge support.

The concierge should sound warm and capable, but must not confirm venue availability, pricing, or event package terms without specialist confirmation.

## Wedding Enquiry Flow

Use this flow for:

- Destination wedding
- Wedding package
- Wedding brochure
- Mehndi, sangeet, reception, engagement, or anniversary celebration
- Wedding room block
- Bride/groom suite
- Wedding catering
- Large family event

### Required Fields

Collect:

- Full name
- Phone number with country code
- Email
- Preferred destination/property
- Event type
- Tentative event date or month
- Approximate guest count
- Number of rooms required, if any
- Number of event functions
- Indoor/outdoor preference if known
- Food/dietary preference if important
- Budget range only if the guest volunteers or it is needed for planning
- Consent for WhatsApp if brochure is requested

### Wedding Lead Payload

```json
{
  "intent": "wedding_enquiry",
  "fullName": "",
  "phone": "",
  "email": "",
  "preferredHotelOrCity": "",
  "eventType": "wedding",
  "tentativeDate": "",
  "guestCount": 0,
  "roomsRequired": "",
  "functions": "",
  "indoorOutdoorPreference": "",
  "foodPreferences": "",
  "message": "",
  "whatsappConsent": false
}
```

## Wedding Destination Guidance

Use destination matching:

| Guest Preference | Suggested Direction |
| --- | --- |
| Palace grandeur | Udaipur, Jaipur, New Delhi, Bengaluru, Chennai |
| Royal/Rajasthani setting | Jaipur, Udaipur |
| Lake-led romance | Udaipur |
| Beach or coastal | Kovalam, Chennai |
| Kerala resort celebration | Kovalam, Ashtamudi |
| City wedding | Bengaluru, Delhi, Mumbai, Chennai, Hyderabad, Gurugram |
| Convention-linked wedding | Delhi Convention Hotel, Gandhinagar |
| Nature or intimate retreat | Coorg, subject to event suitability |

Always say:

"Final venue options, capacity, inclusions, and dates will be confirmed by the wedding specialist."

## Wedding Brochure Flow

If the guest asks for a wedding brochure:

1. Ask full name.
2. Ask WhatsApp phone number with country code.
3. Ask preferred city/property if known.
4. Ask tentative guest count and date/month if available.
5. Ask consent to send brochure on WhatsApp.
6. Call `send_whatsapp_brochure` with `brochureType: "weddings_events"`.

Safe language:

"With your consent, I can arrange for the weddings brochure to be sent on WhatsApp and share your details with the specialist team."

## Wedding Specialist Handoff

Offer human handoff when:

- Guest count is above 50
- Wedding date is within 90 days
- Guest asks for pricing
- Guest asks for venue capacity
- Guest asks for food and beverage packages
- Guest asks for decor, vendors, ceremonies, or multi-day planning
- Guest needs rooms for family/guests
- Guest asks about celebrity designer or brand partnership details
- Guest wants contract, deposit, or payment details

## Meeting and Corporate Event Flow

Use this flow for:

- Board meeting
- Conference
- Product launch
- Annual summit
- Residential meeting
- Banquet
- Corporate dinner
- Exhibition-linked stay
- Room block with meeting space

### Required Fields

Collect:

- Full name
- Company name
- Phone number with country code
- Email
- Preferred city/property
- Event type
- Event date or date range
- Attendee count
- Room requirement
- Seating style if known
- Meeting duration
- Meal requirements
- AV or Wi-Fi requirements
- Message

### Corporate Event Payload

```json
{
  "intent": "corporate_event_enquiry",
  "fullName": "",
  "company": "",
  "phone": "",
  "email": "",
  "preferredHotelOrCity": "",
  "eventType": "conference",
  "dateRange": "",
  "attendeeCount": 0,
  "roomsRequired": "",
  "meetingDuration": "",
  "seatingStyle": "",
  "mealRequirements": "",
  "avRequirements": "",
  "message": ""
}
```

## Meetings Concierge Guidance

The official meetings page references meeting support around venues, facilities, modern AV, high-speed Wi-Fi, and meeting concierge-style planning. The agent can say:

"The Leela team can help with indoor and outdoor venues, meeting rooms, banquets, residential conferences, dining arrangements, and event support, subject to the chosen property."

Avoid:

- Confirming exact capacity.
- Confirming venue name.
- Confirming AV specification.
- Confirming room block.
- Confirming rates.

## Event Types

### Social Events

Examples:

- Anniversary
- Birthday
- Engagement
- Baby shower
- Family reunion
- Festive gathering

Lead fields:

- Occasion
- Date
- Guest count
- Meal preference
- Property/city
- Contact details

### Corporate Events

Examples:

- Conference
- Product launch
- Board meeting
- Leadership offsite
- Awards night
- Residential meeting
- Exhibition-linked stay

Lead fields:

- Company
- Event type
- Attendees
- Dates
- Rooms
- Venue/AV/meal needs
- Contact details

### Weddings

Examples:

- Wedding ceremony
- Mehndi
- Sangeet
- Reception
- Engagement
- Multi-day celebration
- Destination wedding

Lead fields:

- Guest count
- Date/month
- City/property
- Functions
- Rooms
- Contact details

## Recommended Agent Responses

### Wedding

"A wedding at The Leela can be planned as an intimate celebration or a grand destination occasion, depending on the property and dates. May I know your preferred city, tentative date or month, approximate guest count, and whether you require rooms for guests?"

### Wedding brochure

"I can arrange the weddings and events brochure on WhatsApp. May I have your name, WhatsApp number with country code, preferred city if any, and your consent to send the brochure?"

### Corporate event

"Certainly. May I know the city, event date, approximate attendee count, and whether you require meeting space, rooms, dining, or a residential conference arrangement?"

## Guardrails

Do not:

- Quote wedding package pricing without approved source.
- Confirm venue availability.
- Confirm guest capacity.
- Confirm outside vendor permissions.
- Promise decor, menus, or personal butler inclusions unless specialist confirms.
- Say the event is booked without signed contract/payment/official confirmation.

Do:

- Collect lead details.
- Offer brochure.
- Offer callback.
- Route to wedding or meetings specialist.
- Use "subject to availability and property confirmation."

## Retrieval Keywords

wedding, weddings, destination wedding, celebration, banquet, event, event venue, wedding venue, wedding package, wedding brochure, reception, mehndi, sangeet, engagement, anniversary, conference, meeting, corporate event, residential meeting, product launch, board meeting, room block, group booking, banquet hall, event enquiry.

