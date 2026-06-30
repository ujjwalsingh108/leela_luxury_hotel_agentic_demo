# The Leela Demo Knowledge Base
# Escalation Policy for VIPs, Allergies, Pricing, and Complaints

Document purpose: Define when the agent may act, when it may recommend, and when it must escalate to a human.

Data classification: Synthetic demo policy for assistents.ai demonstration.

## Escalation Principle

Escalation is a feature of luxury service, not a failure. The agent should preserve speed while ensuring sensitive moments are owned by the right human associate.

## Severity Levels

### Level 1: Informational
Agent may answer or recommend.

Examples:
- Room preference lookup.
- Dining venue description.
- Spa treatment overview.
- Airport transfer options.
- General loyalty explanation.

### Level 2: Staff Task Required
Agent may create a task for staff.

Examples:
- Vegetarian dining note.
- Anniversary amenity preparation.
- Airport transfer confirmation request.
- Pillow preference.
- Late-arrival snack preference.

### Level 3: Human Approval Required
Agent may recommend but must not confirm.

Examples:
- Complimentary upgrade.
- Paid upgrade with rate sensitivity.
- Late checkout during high occupancy.
- VIP amenity above threshold.
- Compensation or service recovery gesture.
- Any promise involving availability not checked in live system.

### Level 4: Immediate Escalation
Agent must route to human owner immediately.

Examples:
- Critical allergy.
- Medical issue.
- Guest safety concern.
- Angry complaint or threat to post publicly.
- Celebrity, dignitary, or confidential VIP.
- Payment dispute.
- Harassment, security, or privacy concern.

## VIP Escalation

Escalate VIP guest to Guest Relations lead when:
- vip_flag is true.
- Loyalty tier is Titanium or Diamond.
- Guest has lifetime spend above INR 750000.
- Guest is arriving today with a special occasion.
- Guest has unresolved request or latest NPS below 7.

Suggested note:
"VIP arrival requires host awareness. Please review guest preferences and confirm approval for any suite or amenity action."

## Allergy Escalation

Critical allergy examples:
- Tree nuts.
- Shellfish.
- Dairy allergy.
- Severe gluten allergy.

Required action:
- Surface allergy in executive summary.
- Create F&B task marked Critical.
- Notify kitchen and in-room dining.
- Do not confirm dining until F&B has acknowledged.

Suggested task:
"Critical allergy briefing required for guest before arrival. Confirm kitchen, in-room dining, and welcome amenity are aligned."

Never say:
"The allergy is handled."

Say:
"The allergy has been flagged for immediate F&B confirmation."

## Pricing and Revenue Escalation

Human approval required for:
- Rate changes.
- Complimentary upgrades.
- Suite upgrade during high demand.
- Special discount.
- OTA parity-sensitive conversation.
- Event-date inventory release.

Revenue Manager approval required when:
- Forecast occupancy is above 75 percent.
- Local event impact is High.
- Upgrade displaces paid demand.
- Guest asks for a rate match or price exception.

Suggested language:
"This is a revenue-sensitive recommendation and should be approved by the Revenue Manager before guest communication."

## Complaint Escalation

Escalate immediately when:
- Latest sentiment is Negative.
- NPS score is below 7.
- Guest mentions delay, cleanliness, safety, billing, privacy, or staff conduct.
- Service request is Escalated or unresolved.

Recommended recovery workflow:
1. Summarize the issue neutrally.
2. Identify guest impact.
3. Route to department owner.
4. Suggest recovery options for human approval.
5. Log follow-up requirement.

Do not:
- Blame the guest.
- Defend the property.
- Offer compensation without approval.
- Promise a final resolution before human review.

## Staff Task Priority Labels

Critical:
- Allergy.
- Safety.
- Medical.
- VIP privacy.
- Serious complaint.

High:
- VIP arrival.
- Special occasion today or tomorrow.
- Airport transfer for international guest.
- Suite approval pending.
- Unresolved in-stay request.

Medium:
- Preference setup.
- Spa hold.
- Dining reservation.
- Amenity preparation.

Low:
- General profile enrichment.
- Future CRM follow-up.
- Non-urgent preference confirmation.

## Agent Decision Rule

If unsure, choose the safer path:
- Answer facts from approved data.
- Recommend a human-owned action.
- Mark approval required.
- Avoid irreversible guest-facing promises.

