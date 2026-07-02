-- Refresh presentation-facing Leela demo dates without reseeding.
-- PostgreSQL-compatible. Run this before a demo to roll operational data
-- forward so arrivals, events and revenue land on today or in the future.

WITH booking_shift AS (
  SELECT COALESCE((CURRENT_DATE - MIN(arrival_date)::DATE) * INTERVAL '1 day', INTERVAL '0 days') AS delta
  FROM bookings
)
UPDATE bookings
SET
  arrival_date = arrival_date + booking_shift.delta,
  departure_date = departure_date + booking_shift.delta,
  status = CASE
    WHEN status = 'Cancelled' THEN 'Cancelled'
    WHEN arrival_date + booking_shift.delta = CURRENT_DATE THEN 'Checked In'
    ELSE 'Confirmed'
  END
FROM booking_shift;

WITH event_shift AS (
  SELECT COALESCE((CURRENT_DATE - MIN(event_date)::DATE) * INTERVAL '1 day', INTERVAL '0 days') AS delta
  FROM local_events
)
UPDATE local_events
SET event_date = event_date + event_shift.delta
FROM event_shift;

WITH revenue_shift AS (
  SELECT COALESCE((CURRENT_DATE - MIN(txn_date)::DATE) * INTERVAL '1 day', INTERVAL '0 days') AS delta
  FROM revenue_transactions
)
UPDATE revenue_transactions
SET txn_date = txn_date + revenue_shift.delta
FROM revenue_shift;

-- Optional freshness for timestamped operational records.
WITH preference_rows AS (
  SELECT ctid, ROW_NUMBER() OVER (ORDER BY ctid) AS row_num
  FROM guest_preferences
)
UPDATE guest_preferences
SET updated_at = CURRENT_TIMESTAMP - ((preference_rows.row_num % 24) || ' hours')::INTERVAL
FROM preference_rows
WHERE guest_preferences.ctid = preference_rows.ctid;

WITH request_rows AS (
  SELECT ctid, ROW_NUMBER() OVER (ORDER BY ctid) AS row_num
  FROM service_requests
)
UPDATE service_requests
SET
  created_at = CURRENT_TIMESTAMP - ((request_rows.row_num % 24) || ' hours')::INTERVAL,
  resolved_at = CASE
    WHEN status IN ('Escalated', 'In Progress') THEN NULL
    ELSE CURRENT_TIMESTAMP - (GREATEST((request_rows.row_num % 24) - 2, 0) || ' hours')::INTERVAL
  END
FROM request_rows
WHERE service_requests.ctid = request_rows.ctid;

-- Quick check: these should be today or later.
SELECT
  (SELECT MIN(arrival_date) FROM bookings) AS first_arrival_date,
  (SELECT MIN(event_date) FROM local_events) AS first_event_date,
  (SELECT MIN(txn_date) FROM revenue_transactions) AS first_revenue_date;
