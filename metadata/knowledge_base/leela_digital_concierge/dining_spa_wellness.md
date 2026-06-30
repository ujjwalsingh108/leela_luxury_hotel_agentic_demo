# The Leela Digital Concierge Knowledge Base
# Dining, Spa, and Wellness

Document status: Production-ready public-facing knowledge base draft  
Audience: Website visitors, restaurant/spa prospects, hotel guests, reservations leads  
Last reviewed: 2026-06-29  
Primary public sources:
- https://www.theleela.com/wellness
- https://www.theleela.com/
- https://www.theleela.com/general-terms-and-conditions

## Purpose

Use this document when guests ask about restaurants, dining, spa, wellness, Ayurveda, yoga, treatments, dietary preferences, allergies, celebrations, romantic meals, family dining, or wellness enquiries.

Dining and spa offerings vary by property. The agent should provide high-level guidance and collect lead details, then route to the property team for confirmed venue names, timings, menus, treatment availability, and prices.

## Dining Overview

The Leela public experience includes culinary offerings across hotels and resorts. Dining may include:

- Indian fine dining
- All-day dining
- Regional cuisine
- International cuisine
- Bars and lounges
- Private dining
- Celebration meals
- Banquet and event catering

The concierge should not assume that a specific restaurant exists at every property.

Safe language:

"Dining venues and menus vary by property. I can help identify the right dining experience and share your request with the team for confirmation."

## Dining Use Cases

### Romantic Dinner

Collect:

- Property or city
- Preferred date
- Number of guests
- Occasion
- Dietary requirements
- Indoor/outdoor preference if any
- Contact details

Agent response:

"A romantic dinner can be a lovely way to mark the occasion. May I know the property, date, number of guests, and any dietary preferences so I can share the request with the dining team?"

### Family Dining

Collect:

- Adults and children
- Child ages if relevant
- Meal preference
- Date/time
- Dietary needs
- Property

Agent guidance:

- Suggest all-day dining or family-friendly options when venue information is not confirmed.
- Avoid promising kids menus unless verified.

### Business Meal

Collect:

- Property
- Date/time
- Number of guests
- Privacy requirement
- Meal type: breakfast, lunch, dinner, lounge, meeting meal
- Contact details

Agent guidance:

- Offer private dining or quiet lounge request, subject to property confirmation.

### Celebration Meal

Collect:

- Occasion
- Date/time
- Guest count
- Cake/flowers/amenity request
- Dietary restrictions
- Property

Agent guidance:

- Create dining enquiry.
- Do not promise complimentary amenities.

## Dietary Preference Guidance

The concierge may capture preferences such as:

- Vegetarian
- Vegan
- Jain
- Gluten-free preference
- No egg
- Low spice
- Halal preference
- Specific cuisine preference

The concierge should say:

"I will note this carefully for the dining team. Final menu suitability should be confirmed by the property team."

## Allergy Safety Guidance

The official terms note that food and beverage operations may involve potential allergens such as nuts, shellfish, seafood, soy, milk, wheat, and other ingredients. Guests with allergies or sensitivities should inform hotel management before arrival.

Agent rules:

- Treat allergy mentions as sensitive and important.
- Do not guarantee allergen-free food.
- Do not say "no problem" for serious allergies.
- Ask for the specific allergy and severity.
- Route to human dining/reservations team.
- Add allergy flag to enquiry/booking lead.

Safe response:

"Thank you for telling me. I will note the allergy clearly, but the property team should confirm what can be safely arranged before dining or arrival."

Escalate immediately for:

- Severe allergy
- Anaphylaxis
- Medical dietary need
- Pregnancy-related spa/wellness question
- Clinical treatment request
- Child allergy

## Spa and Wellness Overview

The Leela wellness positioning includes holistic wellness, tranquil settings, traditional and modern therapies, skilled therapists, Ayurveda-inspired experiences, yoga, skin treatments, fitness facilities, and rejuvenation programs depending on property.

The concierge may describe wellness as:

"The Leela offers wellness experiences designed around body, mind, and restorative wellbeing, with spa therapies, Ayurveda-inspired treatments, yoga, fitness, and rejuvenation options depending on the selected property."

## Wellness Interest Types

### Relaxation and Rejuvenation

Good for:

- Leisure guests
- Couples
- Weekend stays
- Guests asking for stress relief

Ask:

- Property
- Preferred date/time
- Single or couple treatment
- Treatment preference
- Medical considerations

### Ayurveda-Inspired Wellness

Good for:

- Guests asking for Ayurveda
- Wellness retreat interest
- Longer stays
- Kerala or resort stays

Ask:

- Wellness goal
- Duration of stay
- Prior Ayurveda experience
- Any health concerns

Guardrail:

- Do not provide medical advice.
- Route clinical questions to spa specialist.

### Yoga and Fitness

Good for:

- Guests asking for yoga sessions
- Fitness facility
- Private sessions
- Pilates or guided movement

Ask:

- Property
- Preferred date/time
- Private or group session
- Fitness level

### Couple Spa

Good for:

- Honeymoon
- Anniversary
- Romantic stay
- Celebration package

Ask:

- Property
- Date/time
- Treatment duration
- Occasion
- Contact details

## Spa and Wellness Lead Fields

For spa enquiry:

```json
{
  "intent": "spa_wellness_enquiry",
  "fullName": "",
  "phone": "",
  "email": "",
  "hotelOrCity": "",
  "preferredDate": "",
  "preferredTime": "",
  "guestCount": 1,
  "experienceType": "spa | wellness | ayurveda | yoga | fitness | couple",
  "medicalOrAllergyNotes": "",
  "message": ""
}
```

## Dining Lead Fields

For dining enquiry:

```json
{
  "intent": "dining_enquiry",
  "fullName": "",
  "phone": "",
  "email": "",
  "hotelOrCity": "",
  "preferredDate": "",
  "preferredTime": "",
  "guestCount": 2,
  "occasion": "",
  "dietaryPreferences": "",
  "allergyNotes": "",
  "message": ""
}
```

## Recommended Actions

| Guest Request | Action |
| --- | --- |
| Restaurant booking | Create dining enquiry |
| Spa appointment | Create spa/wellness enquiry |
| Severe allergy | Escalate to human/property team |
| Private dinner | Create enquiry and offer callback |
| Wedding menu | Route to weddings/events flow |
| Wellness package | Send brochure or create wellness lead |
| Wants immediate confirmation | Human handoff or property contact |

## Agent Response Examples

### Spa

"I would be happy to help arrange a wellness enquiry. May I know the Leela property, preferred date, number of guests, and whether you are looking for a spa therapy, Ayurveda-inspired experience, yoga, or fitness session?"

### Dining

"Certainly. May I know the property, date, number of guests, and whether this is for a celebration, business meal, or casual dining? Please also share any dietary preferences or allergies so the team can review them with care."

### Allergy

"Thank you for sharing that. I will note the allergy clearly, but the property dining team should confirm what can be safely arranged. May I know the specific allergy, severity, and the property or date of your visit?"

## Guardrails

Do not:

- Guarantee allergen-free meals.
- Provide medical advice.
- Confirm spa treatment availability without live system or property confirmation.
- Promise specific therapist, room, or venue.
- Quote exact menu or treatment prices without current source.
- Say all properties have the same spa/dining facilities.

Do:

- Collect details.
- Create enquiry.
- Offer callback.
- Use careful allergy language.
- Route to human for complex requests.

## Retrieval Keywords

dining, restaurant, table booking, dinner, lunch, breakfast, private dining, romantic dinner, celebration meal, allergy, vegetarian, vegan, Jain, gluten-free, spa, wellness, Ayurveda, yoga, fitness, massage, treatment, couple spa, relaxation, rejuvenation.

