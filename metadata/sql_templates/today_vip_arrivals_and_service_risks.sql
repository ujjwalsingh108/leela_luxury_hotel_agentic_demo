-- The Leela Royal Arrival Intelligence Agent
-- Query template for: "Show me today's VIP arrivals and service risks."
-- PostgreSQL-compatible.
--
-- Notes:
-- - metadata/leela_demo_date_refresh.sql marks arrivals on CURRENT_DATE as
--   "Checked In", so today must include both Confirmed and Checked In.
-- - Risk level is computed in a CTE, then sorted in the outer query. This avoids
--   referencing a SELECT alias inside another ORDER BY expression.

WITH critical_preferences AS (
  SELECT
    guest_id,
    STRING_AGG(DISTINCT preference_value, ', ' ORDER BY preference_value) AS critical_preferences
  FROM guest_preferences
  WHERE critical_flag IS TRUE
  GROUP BY guest_id
),
latest_feedback AS (
  SELECT DISTINCT ON (guest_id)
    guest_id,
    nps_score AS latest_nps,
    sentiment AS latest_sentiment,
    comment AS latest_feedback_comment,
    stay_date AS latest_feedback_date
  FROM feedback
  ORDER BY guest_id, stay_date DESC
),
open_service_request_rows AS (
  SELECT
    booking_id,
    department || ': ' || request_type || ' (' || status || ')' AS request_label
  FROM service_requests
  WHERE status IN ('Escalated', 'In Progress')
  GROUP BY booking_id, department, request_type, status
),
open_service_requests AS (
  SELECT
    booking_id,
    STRING_AGG(request_label, ', ' ORDER BY request_label) AS open_service_requests
  FROM open_service_request_rows
  GROUP BY booking_id
),
arrival_risks AS (
  SELECT
    g.full_name AS guest,
    h.hotel_name AS hotel,
    b.arrival_date::date AS arrival,
    b.status,
    b.room_type AS booked_room,
    b.booking_channel,
    lp.tier,
    lp.lifetime_spend_inr,
    CONCAT_WS(', ',
      CASE WHEN g.vip_flag THEN 'VIP' END,
      CASE WHEN b.occasion IS NOT NULL THEN b.occasion END,
      CASE WHEN lp.tier IN ('Diamond', 'Titanium') THEN lp.tier || ' Member' END,
      CASE WHEN lp.lifetime_spend_inr > 750000 THEN 'High Lifetime Spend' END,
      CASE WHEN osr.open_service_requests IS NOT NULL THEN 'Open Service Request' END,
      CASE WHEN lf.latest_nps <= 7 THEN 'Low/Watchlist NPS' END,
      CASE WHEN lf.latest_sentiment = 'Negative' THEN 'Negative Feedback' END
    ) AS key_signals,
    cp.critical_preferences,
    osr.open_service_requests,
    lf.latest_nps,
    lf.latest_sentiment,
    lf.latest_feedback_comment,
    CASE
      WHEN cp.critical_preferences IS NOT NULL THEN 'Critical'
      WHEN osr.open_service_requests ILIKE '%Escalated%' THEN 'Critical'
      WHEN lf.latest_nps < 7 THEN 'High'
      WHEN lf.latest_sentiment = 'Negative' THEN 'High'
      WHEN osr.open_service_requests IS NOT NULL THEN 'High'
      WHEN g.vip_flag OR lp.tier IN ('Diamond', 'Titanium') THEN 'High'
      WHEN b.occasion IS NOT NULL OR lp.tier = 'Platinum' OR lf.latest_nps = 7 THEN 'Medium'
      ELSE 'Low'
    END AS risk_level,
    CASE
      WHEN cp.critical_preferences IS NOT NULL THEN 'Create critical F&B allergy briefing before guest engagement.'
      WHEN osr.open_service_requests IS NOT NULL THEN 'Review unresolved service request and assign department owner.'
      WHEN lf.latest_nps <= 7 OR lf.latest_sentiment = 'Negative' THEN 'Guest Relations should review prior feedback before arrival.'
      WHEN g.vip_flag OR lp.tier IN ('Diamond', 'Titanium') THEN 'Ensure senior host awareness and preference-led arrival readiness.'
      WHEN b.occasion IS NOT NULL THEN 'Prepare occasion-led recognition subject to property approval.'
      ELSE 'Prepare standard preference-led arrival readiness.'
    END AS recommended_action
  FROM bookings AS b
  JOIN guests AS g
    ON b.guest_id = g.guest_id
  JOIN hotels AS h
    ON b.hotel_id = h.hotel_id
  LEFT JOIN loyalty_profiles AS lp
    ON b.guest_id = lp.guest_id
  LEFT JOIN critical_preferences AS cp
    ON g.guest_id = cp.guest_id
  LEFT JOIN latest_feedback AS lf
    ON g.guest_id = lf.guest_id
  LEFT JOIN open_service_requests AS osr
    ON b.booking_id = osr.booking_id
  WHERE
    b.arrival_date::date = CURRENT_DATE
    AND b.status IN ('Confirmed', 'Checked In')
    AND (
      g.vip_flag IS TRUE
      OR lp.tier IN ('Diamond', 'Titanium', 'Platinum')
      OR b.occasion IS NOT NULL
      OR lp.lifetime_spend_inr > 500000
      OR cp.critical_preferences IS NOT NULL
      OR osr.open_service_requests IS NOT NULL
      OR lf.latest_nps <= 7
      OR lf.latest_sentiment = 'Negative'
    )
)
SELECT
  guest AS "Guest",
  hotel AS "Hotel",
  arrival AS "Arrival",
  status AS "Status",
  booked_room AS "Booked Room",
  tier AS "Tier",
  key_signals AS "Key Signals",
  critical_preferences AS "Critical Preferences",
  open_service_requests AS "Open Service Requests",
  latest_nps AS "Latest NPS",
  latest_sentiment AS "Latest Sentiment",
  risk_level AS "Risk Level",
  recommended_action AS "Recommended Action"
FROM arrival_risks
ORDER BY
  CASE risk_level
    WHEN 'Critical' THEN 1
    WHEN 'High' THEN 2
    WHEN 'Medium' THEN 3
    ELSE 4
  END,
  lifetime_spend_inr DESC NULLS LAST,
  guest
LIMIT 100;
