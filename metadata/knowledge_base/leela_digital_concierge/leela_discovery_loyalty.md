# The Leela Digital Concierge Knowledge Base
# Leela DISCOVERY Loyalty Programme

Document status: Production-ready public-facing knowledge base draft  
Audience: Website visitors, loyalty members, booking prospects  
Last reviewed: 2026-06-29  
Primary public sources:
- https://www.theleela.com/leela-discovery-loyalty-programme
- https://www.ghadiscovery.com/

## Purpose

Use this document when guests ask about Leela DISCOVERY, member rates, loyalty benefits, points, DISCOVERY Dollars, tiers, earning, redemption, upgrades, global hotel alliance benefits, or joining the programme.

## Programme Overview

Leela DISCOVERY is linked to GHA DISCOVERY, a global loyalty programme. Members can access recognition, benefits, rewards, member rates, and DISCOVERY Dollars where eligible.

The concierge should avoid overpromising tier benefits, upgrades, or savings. Benefits depend on membership status, participating hotel, booking channel, rate eligibility, availability, and programme terms.

Safe response:

"Leela DISCOVERY members can access eligible member benefits and DISCOVERY Dollars. Exact benefits depend on tier, booking eligibility, property, and availability."

## Membership Levels

The public Leela DISCOVERY page describes four levels:

| Tier | Qualification Summary |
| --- | --- |
| Silver | Upon enrolment |
| Gold | 2 stays or USD 1,000 eligible spend |
| Platinum | 10 nights or USD 5,000 eligible spend or 2 brand stays |
| Titanium | 30 nights or USD 15,000 eligible spend or 3 brand stays |

Important:

- Programme terms can change.
- Always route exact qualification and benefit questions to official loyalty page.
- Do not calculate tier manually unless live account data is available.

## DISCOVERY Dollars

The official Leela DISCOVERY page describes DISCOVERY Dollars with:

```text
1 D$ = 1 USD
```

Members can earn and redeem D$ where eligible.

Agent guidance:

- Explain at high level.
- Do not confirm balance.
- Do not redeem manually.
- Direct members to login or official loyalty support for balance and redemption.

Safe response:

"DISCOVERY Dollars can be earned and redeemed on eligible stays and experiences. For your current balance or redemption eligibility, please sign in to your account or check with reservations."

## Benefits Mentioned Publicly

The public page references benefit categories such as:

- Member rates
- Earn and redeem D$
- Live Local experiences
- Room upgrade
- Recognition

Guardrail:

- Room upgrades are subject to tier, property, availability, and programme terms.
- Do not guarantee upgrade.
- Do not promise specific savings unless live offer confirms.

## Joining

If the guest asks how to join:

Response:

"You can join Leela DISCOVERY through the official Leela DISCOVERY page. Membership begins at Silver upon enrolment, and higher levels are earned through eligible stays, nights, spend, or brand stays."

Offer:

- Share loyalty page.
- Continue booking enquiry.
- Note member status in booking lead.

## Member Rates

If guest asks for member discount:

Response:

"Member rates may be available on eligible stays. The exact savings depend on the property, dates, room type, and booking terms shown on the official reservations page."

Do not say:

- "You will get 10% off" unless current official offer confirms for that booking.
- "You are eligible" without account verification.

## Upgrade Requests

If guest asks:

"Will I get an upgrade?"

Response:

"Room upgrades may be a benefit for eligible members, subject to tier, availability, and property policy. I can note your preference, but reservations or the property team will confirm what is available."

## Loyalty Lead Fields

If the user wants loyalty support:

```json
{
  "intent": "loyalty_enquiry",
  "fullName": "",
  "phone": "",
  "email": "",
  "membershipStatus": "member | not_member | unsure",
  "membershipTier": "Silver | Gold | Platinum | Titanium | unsure",
  "question": "",
  "bookingContext": ""
}
```

Do not ask for password, full account credentials, OTP, or sensitive account information.

## Loyalty Use Cases

### New Member

Guest asks:

"How do I join?"

Agent:

"You can join Leela DISCOVERY through the official loyalty page. Membership starts at Silver upon enrolment. Would you like the link, or shall I continue helping with your stay enquiry?"

### Existing Member Booking

Guest says:

"I am a Titanium member."

Agent:

"Thank you. I can note your Titanium membership status in the booking enquiry. Benefits are subject to programme terms and availability, and reservations can confirm the eligible benefits for your stay."

### D$ Redemption

Guest says:

"Can I use my D$?"

Agent:

"DISCOVERY Dollars may be redeemable on eligible stays and experiences. Please sign in to your account or confirm with reservations for the exact balance and redemption eligibility."

## GHA DISCOVERY Context

The public Leela DISCOVERY page references Global Hotel Alliance and a global collection of independent hospitality brands across many countries.

Agent guidance:

- Mention global recognition at a high level.
- Do not list all partner brands unless current source is available.
- Direct global benefit questions to official GHA DISCOVERY account page.

## Guardrails

Do not:

- Ask for loyalty password or OTP.
- Confirm tier without account login.
- Confirm D$ balance.
- Guarantee room upgrade.
- Guarantee savings.
- Apply member rate manually.
- Combine loyalty benefits with offers unless official terms allow.

Do:

- Explain tiers.
- Explain D$ at a high level.
- Ask if guest is a member.
- Capture membership tier if guest volunteers it.
- Direct to official loyalty page.
- Create booking lead with membership note.

## Retrieval Keywords

Leela DISCOVERY, loyalty, GHA DISCOVERY, member, membership, Silver, Gold, Platinum, Titanium, DISCOVERY Dollars, D$, member rates, earn, redeem, rewards, room upgrade, recognition, loyalty benefits, join, account, tier, balance.

