# Metadata - Leela Palace

### Tables

* hotels
* local_events
* guests
* loyalty_profiles
* bookings
* guest_preferences
* feedback
* service_requests
* revenue_transactions

### Mock SQL Queries

__Query 1__: _VIP arrivals needing immediate service preparation_

__[vip_arrival_readiness]__

```
SELECT
  b.booking_id,
  g.full_name,
  lp.tier,
  lp.lifetime_stays,
  lp.lifetime_spend_inr,
  b.arrival_date,
  b.room_type,
  b.occasion,
  STRING_AGG(
    CASE WHEN gp.critical_flag THEN gp.preference_type || ': ' || gp.preference_value END,
    '; '
  ) AS critical_flags,
  AVG(f.nps_score) AS avg_nps_last_3_stays,
  COUNT(sr.request_id) FILTER (WHERE sr.status <> 'Resolved') AS open_service_items
FROM bookings b
JOIN guests g ON g.guest_id = b.guest_id
LEFT JOIN loyalty_profiles lp ON lp.guest_id = g.guest_id
LEFT JOIN guest_preferences gp ON gp.guest_id = g.guest_id
LEFT JOIN feedback f ON f.guest_id = g.guest_id
LEFT JOIN service_requests sr ON sr.booking_id = b.booking_id
WHERE b.arrival_date = CURRENT_DATE
  AND b.status = 'Confirmed'
  AND (g.vip_flag = TRUE OR lp.tier IN ('Platinum', 'Titanium', 'Diamond'))
GROUP BY b.booking_id, g.full_name, lp.tier, lp.lifetime_stays,
         lp.lifetime_spend_inr, b.arrival_date, b.room_type, b.occasion
ORDER BY lp.lifetime_spend_inr DESC NULLS LAST;
```

__Query 2__: _Occupancy and event-led upgrade opportunity_

__[occupancy_upgrade_opportunity]__

```
SELECT
  h.hotel_name,
  b.arrival_date,
  COUNT(b.booking_id) AS occupied_rooms,
  h.total_rooms,
  ROUND(COUNT(b.booking_id)::NUMERIC / h.total_rooms * 100, 1) AS occupancy_pct,
  AVG(b.booked_rate_inr) AS avg_booked_rate,
  COUNT(*) FILTER (WHERE lp.tier IN ('Platinum', 'Titanium', 'Diamond')) AS elite_arrivals,
  STRING_AGG(DISTINCT le.event_name, ', ') AS demand_events
FROM hotels h
JOIN bookings b ON b.hotel_id = h.hotel_id
LEFT JOIN loyalty_profiles lp ON lp.guest_id = b.guest_id
LEFT JOIN local_events le
  ON le.city = h.city
 AND le.event_date BETWEEN b.arrival_date AND b.departure_date
WHERE b.arrival_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '14 days'
  AND b.status IN ('Confirmed', 'Checked In')
GROUP BY h.hotel_name, h.total_rooms, b.arrival_date
HAVING COUNT(b.booking_id)::NUMERIC / h.total_rooms >= 0.70
ORDER BY b.arrival_date, occupancy_pct DESC;
```

__Query 3__: _High-value guests at risk of not returning_

__[lapsed_high_value_guests]__

```
SELECT
  g.full_name,
  lp.tier,
  lp.lifetime_spend_inr,
  lp.last_stay_date,
  MAX(f.nps_score) AS latest_nps,
  STRING_AGG(DISTINCT f.comment, ' | ') AS recent_feedback,
  SUM(rt.amount_inr) FILTER (WHERE rt.category IN ('Spa', 'F&B', 'Transfer')) AS ancillary_spend
FROM guests g
JOIN loyalty_profiles lp ON lp.guest_id = g.guest_id
LEFT JOIN feedback f ON f.guest_id = g.guest_id
LEFT JOIN bookings b ON b.guest_id = g.guest_id
LEFT JOIN revenue_transactions rt ON rt.booking_id = b.booking_id
WHERE lp.lifetime_spend_inr >= 500000
  AND lp.last_stay_date < CURRENT_DATE - INTERVAL '180 days'
GROUP BY g.full_name, lp.tier, lp.lifetime_spend_inr, lp.last_stay_date
ORDER BY lp.lifetime_spend_inr DESC;
```