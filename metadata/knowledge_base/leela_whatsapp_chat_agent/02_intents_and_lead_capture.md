# Intent Detection And Lead Capture

## Intent Classifier

Classify guest messages into one intent, then collect only the missing fields required for that intent.

## Brochure

Trigger examples:

- Send me a brochure
- Wedding brochure
- Rooms brochure
- Please WhatsApp me details
- Can you send details for Udaipur?

Required fields:

- fullName
- phone with country code
- preferredHotelOrCity, if known
- brochureType
- whatsappConsent

Brochure types:

- rooms
- weddings_events
- dining_spa
- offers
- hotel_overview

Flow:

1. Ask for full name.
2. Ask for WhatsApp phone number with country code.
3. Ask which brochure type.
4. Ask preferred hotel or city if not already known.
5. Ask consent.
6. Call `send_whatsapp_brochure`.

## Schedule Call

Trigger examples:

- Call me
- Schedule a call
- I want reservations to call
- Can someone contact me?

Required fields:

- fullName
- phone with country code
- preferredDateTime
- topic
- preferredHotelOrCity, if relevant

Flow:

1. Ask name.
2. Ask phone with country code.
3. Ask preferred date/time and timezone.
4. Ask topic.
5. Call `schedule_callback`.

## General Enquiry

Trigger examples:

- I have a question
- Need information
- Contact hotel
- Need help

Required fields:

- fullName
- phone with country code
- email, when available
- preferredHotelOrCity, if relevant
- message

Flow:

1. Clarify the enquiry.
2. Ask for name.
3. Ask phone.
4. Ask email if follow-up is needed.
5. Ask hotel/city if relevant.
6. Call `create_enquiry`.

## Book Rooms

Trigger examples:

- I want to book
- Need rooms
- Stay in Udaipur
- Availability for two nights
- Book a room for family

Required fields:

- fullName
- phone with country code
- email
- hotelOrCity
- checkIn
- checkOut
- rooms
- adults
- children
- preferences, optional

Flow:

1. Ask hotel/city.
2. Ask check-in and check-out.
3. Ask rooms and guest count.
4. Ask name.
5. Ask phone and email.
6. Call `create_booking_lead`.
7. Share official reservations link for final availability and rates.

Never confirm booking, rate, upgrade, or availability without a verified booking API response.

## Offers

Trigger examples:

- Current offers
- Packages
- Deals
- Member offers
- Special offers

Required fields for lead:

- fullName, if follow-up needed
- phone/email, if follow-up needed
- preferredHotelOrCity
- travel dates, if known
- intent=offers

Response style:

- Provide general guidance.
- Offer to connect with reservations or send relevant brochure.
- Do not invent current offer terms if not in the knowledge base.

## Wedding Or Event

Trigger examples:

- Wedding enquiry
- Event at The Leela
- MICE
- Conference
- Corporate event
- Banquet
- Proposal

Required fields:

- fullName
- phone with country code
- email
- preferredHotelOrCity
- eventType
- eventDate or tentative month
- guestCount
- roomRequirement, if any
- budgetRange, optional
- message

Flow:

1. Ask city/property.
2. Ask event type.
3. Ask event date or tentative month.
4. Ask guest count.
5. Ask room requirement.
6. Ask name, phone, email.
7. Call `create_enquiry`.
8. Escalate to events team.

## Dining, Spa, Transport, Loyalty

Dining required fields:

- preferredHotelOrCity
- date/time
- guests
- dietary/allergy notes
- name and phone if reservation follow-up is needed

Spa required fields:

- preferredHotelOrCity
- preferred date/time
- guest count
- treatment interest, if known
- name and phone

Transport required fields:

- preferredHotelOrCity
- pickup/drop location
- date/time
- flight number, if airport transfer
- guest count and luggage
- name and phone

Loyalty required fields:

- question
- membership/tier details only if voluntarily shared
- do not ask for passwords, OTPs, payment, or sensitive identity documents

For these intents, answer from knowledge base when possible and create an enquiry if human follow-up is required.

