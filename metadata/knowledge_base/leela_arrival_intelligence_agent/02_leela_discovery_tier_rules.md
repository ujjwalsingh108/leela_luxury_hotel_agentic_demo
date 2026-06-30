# The Leela Demo Knowledge Base
# Leela DISCOVERY Tier Rules

Document purpose: Provide synthetic loyalty rules for the agent to interpret member status, direct-booking opportunities, and guest-recognition priorities.

Data classification: Synthetic demo content inspired by luxury hospitality loyalty patterns. Validate against official policy before production use.

## Loyalty Tiers Used In Demo

### New Guest
- No prior stay or not yet enrolled.
- Agent goal: encourage warm recognition and discreet enrolment opportunity.
- Recommended language: "May we ensure your preferences are remembered for future visits?"

### Silver
- Early loyalty tier.
- Typical signals: 1 to 2 stays or new GHA DISCOVERY member.
- Recommended action: recognize membership and capture preferences.
- Upgrade posture: do not recommend complimentary suite upgrade unless service recovery is needed.

### Gold
- Repeat guest.
- Typical signals: 3 to 5 stays or moderate lifetime spend.
- Recommended action: room preference memory, welcome note, priority issue resolution.
- Upgrade posture: consider room-view or club-category upgrade when occupancy allows.

### Platinum
- High-value repeat guest.
- Typical signals: 6 to 10 stays, direct bookings, meaningful ancillary spend.
- Recommended action: arrival brief, preference-led amenity, dining or spa suggestion.
- Upgrade posture: recommend premium room or club upgrade when available.

### Titanium
- Very high-value guest.
- Typical signals: 10 or more stays, high lifetime spend, strong direct-booking history.
- Recommended action: senior host awareness, arrival readiness, proactive issue prevention.
- Upgrade posture: suite consideration subject to Front Office or Revenue approval.

### Diamond
- Highest demo-recognition tier.
- Typical signals: top lifetime value, VIP flag, executive importance, or exceptional repeat loyalty.
- Recommended action: General Manager visibility if arriving today, critical-preference audit, tailored ritual.
- Upgrade posture: suite consideration subject to approval and availability.

## Loyalty Recognition Rules

Always surface:
- Tier.
- Lifetime stays.
- Lifetime spend.
- Last stay date.
- Direct versus OTA booking channel.
- Any preference that should be remembered from prior stay.

## Direct Booking Logic

Direct bookings are strategically valuable because they:
- Preserve margin compared with OTA bookings.
- Strengthen first-party guest relationship.
- Allow better preference capture.
- Support member-rate and loyalty engagement.

The agent may say:
"This guest booked direct, which makes the arrival a strong loyalty-deepening opportunity."

The agent must not say:
"OTA guests are lower priority."

## Lapsed High-Value Guest Rules

A guest should be flagged as lapsed if:
- Lifetime spend is above INR 500000.
- Last stay was more than 180 days ago.
- Feedback has declined or latest NPS is 7 or below.

Recommended action:
- Route to CRM or Guest Relations for a discreet re-engagement note.
- Personalize with remembered preferences.
- Avoid discount-first language.

## Loyalty Escalation

Escalate to Guest Relations lead when:
- Diamond or Titanium guest arrives today.
- VIP flag is true.
- Guest has a critical allergy.
- Guest has latest NPS below 7.
- Guest has unresolved service request.
- Guest has a special occasion and no amenity task exists.

## Loyalty-Safe Language

Use:
"Recognition opportunity"
"Preference-led arrival"
"Member-direct relationship"
"Discreet re-engagement"
"Approval-gated suite consideration"

Avoid:
"Target the guest"
"Exploit loyalty"
"Push upsell"
"Discount them back"
"Auto-upgrade"

