-- The Leela Palace demo seed data
-- PostgreSQL-compatible. Run after creating the tables.

TRUNCATE TABLE
  revenue_transactions,
  service_requests,
  feedback,
  guest_preferences,
  bookings,
  loyalty_profiles,
  guests,
  local_events,
  hotels
RESTART IDENTITY CASCADE;

INSERT INTO hotels (hotel_name, city, total_rooms) VALUES
('The Leela Palace Bengaluru', 'Bengaluru', 357),
('The Leela Palace New Delhi', 'New Delhi', 254),
('The Leela Palace Chennai', 'Chennai', 326),
('The Leela Palace Udaipur', 'Udaipur', 80),
('The Leela Ambience Gurugram', 'Gurugram', 412),
('The Leela Gandhinagar', 'Gandhinagar', 318),
('The Leela Mumbai', 'Mumbai', 391),
('The Leela Ashtamudi', 'Kollam', 93),
('The Leela Kovalam', 'Thiruvananthapuram', 188),
('The Leela Hyderabad', 'Hyderabad', 156);

INSERT INTO hotels (hotel_name, city, total_rooms)
SELECT
  'The Leela Demo Palace ' || LPAD(gs::TEXT, 3, '0') AS hotel_name,
  (ARRAY[
    'Jaipur','Goa','Pune','Kolkata','Ahmedabad','Mysuru','Agra','Kochi','Lucknow','Chandigarh',
    'Indore','Bhopal','Noida','Surat','Vadodara','Nagpur','Amritsar','Varanasi','Dehradun','Coimbatore'
  ])[1 + (gs % 20)] AS city,
  90 + (gs % 360) AS total_rooms
FROM generate_series(11, 100) AS gs;

INSERT INTO local_events (city, event_name, event_date, demand_impact) VALUES
('Bengaluru', 'Global Technology Leadership Summit', CURRENT_DATE + INTERVAL '2 days', 'High'),
('Bengaluru', 'Luxury Auto Expo', CURRENT_DATE + INTERVAL '8 days', 'Medium'),
('New Delhi', 'Diplomatic Business Forum', CURRENT_DATE + INTERVAL '1 day', 'High'),
('New Delhi', 'India Art Week', CURRENT_DATE + INTERVAL '11 days', 'Medium'),
('Chennai', 'International Classical Music Festival', CURRENT_DATE + INTERVAL '4 days', 'Medium'),
('Udaipur', 'Destination Wedding Showcase', CURRENT_DATE + INTERVAL '3 days', 'High'),
('Gurugram', 'Corporate CFO Roundtable', CURRENT_DATE + INTERVAL '6 days', 'Medium'),
('Gandhinagar', 'Vibrant Gujarat Trade Delegation', CURRENT_DATE + INTERVAL '5 days', 'High'),
('Mumbai', 'Luxury Retail & Fashion Week', CURRENT_DATE + INTERVAL '7 days', 'High'),
('Hyderabad', 'Pharma Leadership Congress', CURRENT_DATE + INTERVAL '9 days', 'Medium'),
('Thiruvananthapuram', 'Wellness Tourism Forum', CURRENT_DATE + INTERVAL '10 days', 'Medium'),
('Kollam', 'Backwater Heritage Festival', CURRENT_DATE + INTERVAL '12 days', 'Low');

INSERT INTO local_events (city, event_name, event_date, demand_impact)
SELECT
  (ARRAY[
    'Bengaluru','New Delhi','Chennai','Udaipur','Gurugram','Gandhinagar','Mumbai','Kollam',
    'Thiruvananthapuram','Hyderabad','Jaipur','Goa','Pune','Kolkata','Ahmedabad','Mysuru',
    'Agra','Kochi','Lucknow','Chandigarh'
  ])[1 + (gs % 20)] AS city,
  (ARRAY[
    'Luxury Wedding Week','Global Investors Meet','International Design Forum','Heritage Food Festival',
    'Premium Travel Expo','Medical Leadership Summit','Art Collectors Weekend','Wellness Retreat Congress',
    'Corporate Leadership Offsite','Destination Celebration Showcase'
  ])[1 + (gs % 10)] || ' ' || gs AS event_name,
  CURRENT_DATE + ((gs % 60) || ' days')::INTERVAL AS event_date,
  (ARRAY['Low','Medium','High'])[1 + (gs % 3)] AS demand_impact
FROM generate_series(13, 100) AS gs;

INSERT INTO guests (full_name, nationality, preferred_language, vip_flag, created_at)
SELECT
  title || ' ' || first_name || ' ' || last_name AS full_name,
  nationality,
  preferred_language,
  (gs % 9 = 0 OR gs IN (1, 7, 18, 33, 58, 77, 91)) AS vip_flag,
  CURRENT_TIMESTAMP - (gs || ' days')::INTERVAL
FROM generate_series(1, 100) AS gs
CROSS JOIN LATERAL (
  SELECT
    (ARRAY['Mr.', 'Ms.', 'Mrs.', 'Dr.'])[1 + (gs % 4)] AS title,
    (ARRAY[
      'Arjun','Sofia','Priya','James','Aiko','Vikram','Meera','Rajiv','Elena','Kabir',
      'Ananya','Rohan','Nadia','Aarav','Ishita','Michael','Yuki','Fatima','Dev','Leah',
      'Karan','Maya','Omar','Neha','Thomas'
    ])[1 + (gs % 25)] AS first_name,
    (ARRAY[
      'Sharma','Rossi','Nair','Whitmore','Tanaka','Kapoor','Menon','Malhotra','Moretti','Khan',
      'Rao','Mehta','Al-Fayed','Bose','Iyer','Anderson','Sato','Al-Hassan','Khanna','Stein',
      'Singh','Varma','Rahman','Desai','Bennett'
    ])[1 + (gs % 25)] AS last_name,
    (ARRAY[
      'India','Italy','United Kingdom','Japan','United States','UAE','Singapore','Germany',
      'France','Australia','Qatar','Saudi Arabia','Canada','Thailand','Switzerland'
    ])[1 + (gs % 15)] AS nationality,
    (ARRAY[
      'English','Hindi / English','Italian','Japanese','Arabic / English','German',
      'French','Malayalam / English','Tamil / English','Kannada / English'
    ])[1 + (gs % 10)] AS preferred_language
) names;

INSERT INTO loyalty_profiles (
  guest_id,
  tier,
  discovery_id,
  lifetime_stays,
  lifetime_spend_inr,
  last_stay_date
)
SELECT
  guest_id,
  CASE
    WHEN guest_id % 20 = 0 THEN 'Diamond'
    WHEN guest_id % 9 = 0 THEN 'Titanium'
    WHEN guest_id % 5 = 0 THEN 'Platinum'
    WHEN guest_id % 3 = 0 THEN 'Gold'
    WHEN guest_id % 2 = 0 THEN 'Silver'
    ELSE 'New guest'
  END,
  'DISC-' || LPAD(guest_id::TEXT, 6, '0'),
  CASE WHEN guest_id % 2 = 1 THEN guest_id % 4 ELSE (guest_id % 18) + 1 END,
  CASE
    WHEN guest_id % 20 = 0 THEN 1200000 + guest_id * 8500
    WHEN guest_id % 9 = 0 THEN 850000 + guest_id * 6500
    WHEN guest_id % 5 = 0 THEN 520000 + guest_id * 4500
    WHEN guest_id % 3 = 0 THEN 240000 + guest_id * 3000
    ELSE 65000 + guest_id * 1750
  END,
  CURRENT_DATE - ((guest_id * 11) % 420 || ' days')::INTERVAL
FROM guests;

INSERT INTO bookings (
  guest_id,
  hotel_id,
  arrival_date,
  departure_date,
  room_type,
  booked_rate_inr,
  booking_channel,
  status,
  occasion
)
SELECT
  ((gs - 1) % 100) + 1 AS guest_id,
  ((gs - 1) % 10) + 1 AS hotel_id,
  CURRENT_DATE + (((gs - 1) % 21) - 3 || ' days')::INTERVAL AS arrival_date,
  CURRENT_DATE + (((gs - 1) % 21) - 1 + (1 + (gs % 4)) || ' days')::INTERVAL AS departure_date,
  (ARRAY[
    'Premier Room','Royal Club Room','Conservatory Premier','Lake-View Room',
    'Royal Suite','Maharaja Suite','Presidential Suite','Garden View Room'
  ])[1 + (gs % 8)] AS room_type,
  CASE
    WHEN gs % 17 = 0 THEN 145000
    WHEN gs % 11 = 0 THEN 95000
    WHEN gs % 7 = 0 THEN 62000
    WHEN gs % 5 = 0 THEN 42000
    ELSE 18000 + (gs % 12) * 2500
  END AS booked_rate_inr,
  (ARRAY['Direct Web','WhatsApp','OTA','Corporate','Travel Agent','GHA DISCOVERY'])[1 + (gs % 6)] AS booking_channel,
  CASE
    WHEN gs % 19 = 0 THEN 'Cancelled'
    WHEN ((gs - 1) % 21) - 3 < 0 THEN 'Checked Out'
    WHEN ((gs - 1) % 21) - 3 = 0 THEN 'Checked In'
    ELSE 'Confirmed'
  END AS status,
  (ARRAY[
    NULL,'Wedding anniversary','Honeymoon','Birthday','Business delegation',
    'Family celebration','Wellness retreat','Board meeting'
  ])[1 + (gs % 8)] AS occasion
FROM generate_series(1, 125) AS gs;

INSERT INTO guest_preferences (
  guest_id,
  preference_type,
  preference_value,
  critical_flag,
  updated_at
)
SELECT
  ((gs - 1) % 100) + 1 AS guest_id,
  pref_type,
  pref_value,
  critical_flag,
  CURRENT_TIMESTAMP - ((gs % 45) || ' days')::INTERVAL
FROM generate_series(1, 200) AS gs
CROSS JOIN LATERAL (
  SELECT
    CASE gs % 10
      WHEN 0 THEN 'Allergy'
      WHEN 1 THEN 'Room'
      WHEN 2 THEN 'Pillow'
      WHEN 3 THEN 'Beverage'
      WHEN 4 THEN 'Dining'
      WHEN 5 THEN 'Language'
      WHEN 6 THEN 'Spa'
      WHEN 7 THEN 'Arrival'
      WHEN 8 THEN 'Service'
      ELSE 'Occasion'
    END AS pref_type,
    CASE gs % 10
      WHEN 0 THEN (ARRAY['Tree nuts','Shellfish','Gluten-free','Dairy allergy'])[1 + (gs % 4)]
      WHEN 1 THEN (ARRAY['High floor away from elevator','Lake view','Quiet floor','Connecting rooms'])[1 + (gs % 4)]
      WHEN 2 THEN (ARRAY['Firm pillow','Feather pillow','Hypoallergenic pillow','Extra neck support'])[1 + (gs % 4)]
      WHEN 3 THEN (ARRAY['Single malt whisky','Darjeeling first flush','Fresh lime soda','Prosecco'])[1 + (gs % 4)]
      WHEN 4 THEN (ARRAY['Vegetarian','Jain meal','No egg','Prefers Jamavar'])[1 + (gs % 4)]
      WHEN 5 THEN (ARRAY['English','Hindi','Italian','Japanese'])[1 + (gs % 4)]
      WHEN 6 THEN (ARRAY['Evening spa slot','Couples treatment','Ayurvedic massage','Post-flight recovery massage'])[1 + (gs % 4)]
      WHEN 7 THEN (ARRAY['Airport transfer','Early check-in','Late arrival','Butler meet-and-greet'])[1 + (gs % 4)]
      WHEN 8 THEN (ARRAY['Minimal disturbance','Daily turndown','Extra housekeeping','Private dining setup'])[1 + (gs % 4)]
      ELSE (ARRAY['Anniversary','Birthday','Honeymoon','Family reunion'])[1 + (gs % 4)]
    END AS pref_value,
    (gs % 10 = 0) AS critical_flag
) pref;

INSERT INTO feedback (
  guest_id,
  hotel_id,
  stay_date,
  nps_score,
  sentiment,
  comment
)
SELECT
  ((gs - 1) % 100) + 1 AS guest_id,
  ((gs - 1) % 10) + 1 AS hotel_id,
  CURRENT_DATE - ((gs * 7) % 365 || ' days')::INTERVAL AS stay_date,
  CASE
    WHEN gs % 14 = 0 THEN 5
    WHEN gs % 9 = 0 THEN 7
    WHEN gs % 4 = 0 THEN 9
    ELSE 10
  END AS nps_score,
  CASE
    WHEN gs % 14 = 0 THEN 'Negative'
    WHEN gs % 9 = 0 THEN 'Neutral'
    ELSE 'Positive'
  END AS sentiment,
  CASE gs % 8
    WHEN 0 THEN 'The arrival experience was graceful and deeply personalised.'
    WHEN 1 THEN 'The team remembered our preferences and made the stay feel effortless.'
    WHEN 2 THEN 'Dining was excellent, but the room service response was slower than expected.'
    WHEN 3 THEN 'The spa consultation was exceptional and very thoughtfully handled.'
    WHEN 4 THEN 'The suite upgrade made our anniversary memorable.'
    WHEN 5 THEN 'The butler team was warm, discreet and precise.'
    WHEN 6 THEN 'Check-in felt delayed during peak arrival hour.'
    ELSE 'The property delivered a refined and memorable experience.'
  END AS comment
FROM generate_series(1, 120) AS gs;

INSERT INTO service_requests (
  booking_id,
  department,
  request_type,
  status,
  created_at,
  resolved_at
)
SELECT
  ((gs - 1) % 125) + 1 AS booking_id,
  (ARRAY['F&B','Housekeeping','Front Office','Concierge','Spa','Engineering','Guest Relations'])[1 + (gs % 7)] AS department,
  (ARRAY[
    'Allergy briefing','Anniversary amenity','Airport transfer','Late checkout',
    'Extra housekeeping','Spa reservation','Room temperature issue','Private dining setup'
  ])[1 + (gs % 8)] AS request_type,
  CASE
    WHEN gs % 13 = 0 THEN 'Escalated'
    WHEN gs % 5 = 0 THEN 'In Progress'
    ELSE 'Resolved'
  END AS status,
  CURRENT_TIMESTAMP - ((gs * 3) % 96 || ' hours')::INTERVAL AS created_at,
  CASE
    WHEN gs % 13 = 0 OR gs % 5 = 0 THEN NULL
    ELSE CURRENT_TIMESTAMP - (((gs * 3) % 96 - 2) || ' hours')::INTERVAL
  END AS resolved_at
FROM generate_series(1, 130) AS gs;

INSERT INTO revenue_transactions (
  booking_id,
  category,
  amount_inr,
  txn_date
)
SELECT
  ((gs - 1) % 125) + 1 AS booking_id,
  (ARRAY['Room','F&B','Spa','Transfer','Laundry','Experience','Mini Bar'])[1 + (gs % 7)] AS category,
  CASE gs % 7
    WHEN 0 THEN 22000 + (gs % 10) * 2500
    WHEN 1 THEN 4500 + (gs % 8) * 900
    WHEN 2 THEN 8500 + (gs % 6) * 1500
    WHEN 3 THEN 3500 + (gs % 5) * 700
    WHEN 4 THEN 1200 + (gs % 4) * 400
    WHEN 5 THEN 12000 + (gs % 5) * 2500
    ELSE 1800 + (gs % 6) * 350
  END AS amount_inr,
  CURRENT_DATE + (((gs - 1) % 21) - 3 || ' days')::INTERVAL AS txn_date
FROM generate_series(1, 250) AS gs;

-- Quick row-count check
SELECT 'hotels' AS table_name, COUNT(*) AS rows FROM hotels
UNION ALL SELECT 'local_events', COUNT(*) FROM local_events
UNION ALL SELECT 'guests', COUNT(*) FROM guests
UNION ALL SELECT 'loyalty_profiles', COUNT(*) FROM loyalty_profiles
UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL SELECT 'guest_preferences', COUNT(*) FROM guest_preferences
UNION ALL SELECT 'feedback', COUNT(*) FROM feedback
UNION ALL SELECT 'service_requests', COUNT(*) FROM service_requests
UNION ALL SELECT 'revenue_transactions', COUNT(*) FROM revenue_transactions;
