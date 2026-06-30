# The Leela Demo Knowledge Base
# Dining, Spa, Airport Transfer, and Butler Service Details

Document purpose: Ground the agent on guest-facing services for recommendations, pre-arrival capture, and staff task creation.

Data classification: Synthetic demo content for assistents.ai demonstration.

## Dining Venues

### Jamavar
- Signature Indian fine-dining experience.
- Best for: anniversaries, international guests seeking Indian cuisine, business dinners.
- Recommendation logic: suggest for special occasions, vegetarian guests, or repeat guests who previously enjoyed Indian dining.
- Guardrail: if allergy exists, brief kitchen before confirming.

### Citrus
- All-day dining venue.
- Best for: family travelers, breakfast planning, business guests with flexible schedules.
- Recommendation logic: suggest for guests with children, early arrivals, or uncertain schedule.

### Library Bar
- Refined lounge and bar setting.
- Best for: business travelers, single malt preference, quiet evening meeting.
- Recommendation logic: suggest when guest preference includes whisky, wine, or discreet conversation.

### Royal Club Lounge
- Premium lounge for eligible guests.
- Best for: club room guests, corporate travelers, loyalty members.
- Recommendation logic: suggest for Platinum and above if included in room benefits.

## Dietary and Allergy Handling

Critical dietary flags:
- Tree nuts.
- Shellfish.
- Dairy allergy.
- Gluten allergy or strict gluten-free requirement.

Non-critical but important preferences:
- Vegetarian.
- Jain meal.
- No egg.
- Vegan.
- Low spice.

Rules:
- Critical allergy must create F&B task.
- Critical allergy must be visible in executive summary.
- Agent must not confirm a dining arrangement if allergy briefing has not been created.
- For Jain, vegan, or vegetarian preferences, agent may recommend pre-arrival menu personalization.

## Spa Services

### Arrival Recovery Massage
- Best for: long-haul international arrivals, jet lag, late afternoon arrival.
- Recommended timing: after check-in or next morning.

### Couples Treatment
- Best for: honeymoon, anniversary, romantic weekend.
- Recommended action: hold a slot, then request guest confirmation.

### Ayurvedic Massage
- Best for: wellness retreat guests, Indian wellness interest, longer stays.
- Recommended action: suggest consultation before treatment.

### Express Business Recovery
- Best for: corporate guests with meetings.
- Recommended timing: 45 to 60 minutes between meetings or early evening.

Spa guardrails:
- Do not guarantee availability without checking spa slots.
- Do not recommend intense treatment immediately before a formal event.
- Route medical or pregnancy-related wellness questions to spa specialist.

## Airport Transfer

Transfer types:
- Luxury sedan.
- Premium SUV.
- Chauffeur meet-and-greet.
- Family transfer with luggage assistance.

Recommendation logic:
- International first-time guest: recommend airport meet-and-greet.
- VIP or Diamond guest: create transfer-readiness task if arrival details are known.
- Family traveler: recommend SUV or larger vehicle.
- Late-night arrival: proactively confirm transfer and arrival snack preference.

Transfer guardrails:
- Do not quote final price unless rate source is available.
- Do not confirm pickup without flight number and arrival time.
- Escalate VIP transfers to Concierge lead.

## Butler Service Details

Butler role in demo:
- Human owner of high-touch arrival experience.
- Receives AI-generated brief and recommended tasks.
- Approves sensitive actions.
- Handles nuanced requests and private preferences.

Agent should recommend butler awareness for:
- VIP or Diamond guest.
- Honeymoon, anniversary, birthday, or family celebration.
- Critical allergy.
- Guest with prior complaint.
- Guest requesting privacy or minimal disturbance.
- Celebrity or dignitary.

Example butler brief:
"Ms. Rossi is a first-time international guest arriving for her honeymoon. She prefers vegetarian dining and has shown interest in a couples spa experience. Please prepare a warm but discreet welcome and confirm timing after arrival."

