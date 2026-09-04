-- =============================================================================
-- Smart India Hackathon (SIH) - Tourism Platform Backend Database Seed Data
-- Dataset Scope   : Tamil Nadu Starter Kit (Chennai & Thanjavur)
-- Target DBMS     : MySQL 8.0+ / MariaDB 10.5+ / Aiven Cloud MySQL
-- Encoding        : utf8mb4
-- Collation       : utf8mb4_unicode_ci
-- =============================================================================

-- Temporarily disable foreign key constraints to allow clean idempotent seeding
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

-- Clean existing data in dependent tables before re-seeding
DELETE FROM `personalized_suggestions`;
DELETE FROM `trips`;
DELETE FROM `user_history`;
DELETE FROM `user_favorites`;
DELETE FROM `reviews`;
DELETE FROM `safety_contacts`;
DELETE FROM `cultural_rules`;
DELETE FROM `places`;
DELETE FROM `locations`;
DELETE FROM `users`;

-- -----------------------------------------------------------------------------
-- 1. Seed Users
-- Test personas: Solo traveler, cultural connoisseur, budget backpacker
-- -----------------------------------------------------------------------------
INSERT INTO `users` (
    `id`,
    `google_id`,
    `email`,
    `full_name`,
    `avatar_url`,
    `home_currency`,
    `travel_style`,
    `created_at`,
    `updated_at`
) VALUES
(
    'usr-priya-01',
    'google-oauth2|1092837465928172001',
    'priya.sharma@example.com',
    'Priya Sharma',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'INR',
    'solo',
    '2026-08-15 08:30:00',
    '2026-08-15 08:30:00'
),
(
    'usr-alex-02',
    'google-oauth2|2093847561928374002',
    'alex.miller@example.co.uk',
    'Alex Miller',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'GBP',
    'cultural',
    '2026-08-18 11:15:00',
    '2026-08-18 11:15:00'
),
(
    'usr-rahul-03',
    NULL,
    'rahul.verma@example.in',
    'Rahul Verma',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'INR',
    'budget',
    '2026-08-20 14:45:00',
    '2026-08-20 14:45:00'
);

-- -----------------------------------------------------------------------------
-- 2. Seed Locations
-- Chennai (Gateway to South India) & Thanjavur (Chola Architectural Capital)
-- -----------------------------------------------------------------------------
INSERT INTO `locations` (
    `id`,
    `name`,
    `state`,
    `country`,
    `currency_code`,
    `description`,
    `created_at`,
    `updated_at`
) VALUES
(
    'loc-chn',
    'Chennai',
    'Tamil Nadu',
    'India',
    'INR',
    'The cultural capital of South India, known for its historic Dravidian temples, classical Carnatic music festivals, vibrant coastal promenade, and British colonial landmarks along the Coromandel Coast.',
    '2026-08-01 00:00:00',
    '2026-08-01 00:00:00'
),
(
    'loc-tnj',
    'Thanjavur',
    'Tamil Nadu',
    'India',
    'INR',
    'The legendary capital of the Imperial Chola Dynasty, world-renowned for the UNESCO World Heritage Great Living Chola Temples, classical Tanjore paintings, brass and bronze sculptures, and rich agricultural heritage along the Cauvery Delta.',
    '2026-08-01 00:00:00',
    '2026-08-01 00:00:00'
);

-- -----------------------------------------------------------------------------
-- 3. Seed Places
-- Marina Beach, Kapaleeshwarar Temple, and Brihadisvara (Big) Temple
-- -----------------------------------------------------------------------------
INSERT INTO `places` (
    `id`,
    `location_id`,
    `name`,
    `category`,
    `latitude`,
    `longitude`,
    `avg_rating`,
    `review_count`,
    `entry_fee`,
    `opening_hours`,
    `image_url`,
    `created_at`,
    `updated_at`
) VALUES
(
    'plc-marina-beach',
    'loc-chn',
    'Marina Beach',
    'beach',
    13.0499520,
    80.2824030,
    4.50,
    2,
    0.00,
    '24 Hours (Best visited: 05:00 - 08:30 & 16:30 - 20:30)',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    '2026-08-05 06:00:00',
    '2026-08-05 06:00:00'
),
(
    'plc-kapaleeshwarar-temple',
    'loc-chn',
    'Kapaleeshwarar Temple',
    'religious',
    13.0334810,
    80.2698650,
    4.80,
    2,
    0.00,
    '05:30 - 12:00, 16:00 - 21:00 (Closed mid-day)',
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800',
    '2026-08-05 06:00:00',
    '2026-08-05 06:00:00'
),
(
    'plc-brihadisvara-temple',
    'loc-tnj',
    'Brihadisvara Temple',
    'historical',
    10.7828060,
    79.1318440,
    4.90,
    2,
    0.00,
    '06:00 - 12:30, 16:00 - 20:30',
    'https://images.unsplash.com/photo-1600100397608-f010e4785461?w=800',
    '2026-08-05 06:00:00',
    '2026-08-05 06:00:00'
);

-- -----------------------------------------------------------------------------
-- 4. Seed Cultural Rules
-- Dress codes, footwear protocols, sanctum photography, and safety regulations
-- -----------------------------------------------------------------------------
INSERT INTO `cultural_rules` (
    `id`,
    `location_id`,
    `rule_type`,
    `title`,
    `description`,
    `severity`,
    `created_at`,
    `updated_at`
) VALUES
(
    'cr-chn-01',
    'loc-chn',
    'dress_code',
    'Temple Dress Code Regulations',
    'Visitors entering Kapaleeshwarar and other heritage shrines must adhere to the Tamil Nadu HR&CE department dress code: Men should wear dhotis, pyjamas, or formal trousers with shirts; women must wear sarees, half-sarees, or salwar-kameez with dupatta. Shorts, lungis, capris, and sleeveless tops are strictly prohibited.',
    'mandatory',
    '2026-08-05 07:00:00',
    '2026-08-05 07:00:00'
),
(
    'cr-chn-02',
    'loc-chn',
    'footwear',
    'Footwear Removal Protocol',
    'All footwear (shoes, sandals, socks) must be removed before entering the sacred perimeter. Free and nominal paid shoe-keeping stalls are available near the East and West Gopuram entrances. Never carry footwear in bags inside the sanctum.',
    'mandatory',
    '2026-08-05 07:00:00',
    '2026-08-05 07:00:00'
),
(
    'cr-chn-03',
    'loc-chn',
    'photography',
    'Inner Sanctum Photography Restriction',
    'Mobile photography, video cameras, and tripods are strictly prohibited inside the inner sanctum (Garbhagriha). Photography of the outer courtyard architecture and gopurams is allowed for personal non-commercial use.',
    'strict',
    '2026-08-05 07:00:00',
    '2026-08-05 07:00:00'
),
(
    'cr-chn-04',
    'loc-chn',
    'behavior',
    'Marina Beach Swimming Prohibition',
    'Strong underwater undercurrents and sudden beach drop-offs make the Marina coastline hazardous. Entering the sea for bathing or swimming is strictly prohibited by the Greater Chennai Police.',
    'strict',
    '2026-08-05 07:00:00',
    '2026-08-05 07:00:00'
),
(
    'cr-tnj-01',
    'loc-tnj',
    'dress_code',
    'UNESCO Monument Attire Decorum',
    'Brihadisvara is both an active place of worship and a UNESCO monument. Modest, respectful clothing covering knees and shoulders is required. Beachwear or revealing clothing is not permitted.',
    'mandatory',
    '2026-08-05 07:00:00',
    '2026-08-05 07:00:00'
),
(
    'cr-tnj-02',
    'loc-tnj',
    'footwear',
    'Granite Courtyard Footwear Etiquette',
    'Footwear must be deposited at the ASI shoe counter before crossing the Maratha entrance gate. During sunny hours (11:00 AM - 03:30 PM), the granite stones become very hot; visitors should walk along the coir pathways laid across the courtyard.',
    'standard',
    '2026-08-05 07:00:00',
    '2026-08-05 07:00:00'
),
(
    'cr-tnj-03',
    'loc-tnj',
    'temple_etiquette',
    'Chola Fresco & Pillar Preservation',
    'Touching ancient 11th-century Chola and Nayak mural paintings or defacing monolithic granite carvings is a penal offence under the Ancient Monuments and Archaeological Sites and Remains Act. Flash photography is banned inside cloister corridors.',
    'strict',
    '2026-08-05 07:00:00',
    '2026-08-05 07:00:00'
);

-- -----------------------------------------------------------------------------
-- 5. Seed Safety Contacts
-- Tourist police booths, emergency helplines, coastal security, and hospitals
-- -----------------------------------------------------------------------------
INSERT INTO `safety_contacts` (
    `id`,
    `location_id`,
    `service_type`,
    `contact_number`,
    `operating_hours`,
    `created_at`,
    `updated_at`
) VALUES
(
    'sc-chn-01',
    'loc-chn',
    'Tourist Police Facilitation Counter',
    '+91 44 2846 0000',
    '24/7',
    '2026-08-05 07:30:00',
    '2026-08-05 07:30:00'
),
(
    'sc-chn-02',
    'loc-chn',
    'Tamil Nadu Women Helpline',
    '1091',
    '24/7',
    '2026-08-05 07:30:00',
    '2026-08-05 07:30:00'
),
(
    'sc-chn-03',
    'loc-chn',
    'State Integrated Emergency Response (ERSS)',
    '112',
    '24/7',
    '2026-08-05 07:30:00',
    '2026-08-05 07:30:00'
),
(
    'sc-chn-04',
    'loc-chn',
    'Marina Beach Coastal Security & Lifeguards',
    '+91 44 2464 1211',
    '06:00 - 20:00',
    '2026-08-05 07:30:00',
    '2026-08-05 07:30:00'
),
(
    'sc-tnj-01',
    'loc-tnj',
    'Thanjavur Tourist Police Helpdesk',
    '+91 4362 230100',
    '08:00 - 20:00',
    '2026-08-05 07:30:00',
    '2026-08-05 07:30:00'
),
(
    'sc-tnj-02',
    'loc-tnj',
    'Raja Mirasdar Government Hospital (Emergency)',
    '+91 4362 230400',
    '24/7',
    '2026-08-05 07:30:00',
    '2026-08-05 07:30:00'
),
(
    'sc-tnj-03',
    'loc-tnj',
    'Thanjavur Medical Emergency Ambulance',
    '108',
    '24/7',
    '2026-08-05 07:30:00',
    '2026-08-05 07:30:00'
);

-- -----------------------------------------------------------------------------
-- 6. Seed Reviews
-- Authentic reviews testing rating aggregations and experiential commentary
-- -----------------------------------------------------------------------------
INSERT INTO `reviews` (
    `id`,
    `place_id`,
    `user_id`,
    `rating`,
    `comment`,
    `created_at`,
    `updated_at`
) VALUES
(
    'rev-001',
    'plc-marina-beach',
    'usr-priya-01',
    5,
    'Visited during sunrise around 6:00 AM. The cool breeze, filter coffee from local beach vendors, and watching fishing catamarans head out into the Bay of Bengal was unforgettable. Very safe for solo women on the main promenade during morning hours.',
    '2026-08-22 07:15:00',
    '2026-08-22 07:15:00'
),
(
    'rev-002',
    'plc-marina-beach',
    'usr-rahul-03',
    4,
    'Terrific street food vibe in the late afternoon (steaming spicy sundal, roasted corn, chili bhajis). Easy on a student budget. Be mindful of personal belongings when crowds peak after sunset.',
    '2026-08-23 19:30:00',
    '2026-08-23 19:30:00'
),
(
    'rev-003',
    'plc-kapaleeshwarar-temple',
    'usr-priya-01',
    5,
    'An oasis of peace and spirituality in the heart of Mylapore. The rainbow-colored Dravidian gopuram sculptures are intricately detailed. Traditional attire is strictly checked at the entrance, which preserves the sanctity of the temple.',
    '2026-08-24 09:45:00',
    '2026-08-24 09:45:00'
),
(
    'rev-004',
    'plc-kapaleeshwarar-temple',
    'usr-alex-02',
    5,
    'A magnificent immersion into living heritage. I visited during the evening puja ceremony when nadaswaram and thavil music echoed throughout the courtyard. The ancient temple tank illuminated under moonlight is stunning.',
    '2026-08-25 18:20:00',
    '2026-08-25 18:20:00'
),
(
    'rev-005',
    'plc-brihadisvara-temple',
    'usr-alex-02',
    5,
    'A masterpiece of human creative genius. The 216-foot monolithic granite tower (vimana) and the 20-ton single-rock Nandi sculpture showcase peerless 11th-century engineering. Hiring an ASI-accredited guide is essential to decode the stone inscriptions.',
    '2026-08-27 10:30:00',
    '2026-08-27 10:30:00'
),
(
    'rev-006',
    'plc-brihadisvara-temple',
    'usr-rahul-03',
    5,
    'Free entry to one of India’s most awe-inspiring monuments! Came around 5:00 PM and stayed until sunset; the golden hour lighting against the granite exterior creates unbelievable photography opportunities.',
    '2026-08-28 18:45:00',
    '2026-08-28 18:45:00'
);

-- -----------------------------------------------------------------------------
-- 7. Seed User Favorites
-- Saved places with custom priority rankings and traveler notes
-- -----------------------------------------------------------------------------
INSERT INTO `user_favorites` (
    `id`,
    `user_id`,
    `place_id`,
    `priority_rank`,
    `notes`,
    `created_at`,
    `updated_at`
) VALUES
(
    'fav-001',
    'usr-priya-01',
    'plc-kapaleeshwarar-temple',
    1,
    'Plan visit during morning darshan (06:30 AM). Grab filter coffee and ghee podi dosa at Rayar’s Mess in Mylapore right after.',
    '2026-08-22 10:00:00',
    '2026-08-22 10:00:00'
),
(
    'fav-002',
    'usr-priya-01',
    'plc-marina-beach',
    2,
    'Ideal for morning sunrise run and meditation near the lighthouse.',
    '2026-08-22 10:05:00',
    '2026-08-22 10:05:00'
),
(
    'fav-003',
    'usr-alex-02',
    'plc-brihadisvara-temple',
    1,
    'Primary target for photographic documentary. Dedicate both early morning and golden hour.',
    '2026-08-25 12:00:00',
    '2026-08-25 12:00:00'
);

-- -----------------------------------------------------------------------------
-- 8. Seed User History
-- Activity audit log testing JSON telemetry, view counts, and search patterns
-- -----------------------------------------------------------------------------
INSERT INTO `user_history` (
    `id`,
    `user_id`,
    `location_id`,
    `place_id`,
    `action_type`,
    `metadata`,
    `created_at`
) VALUES
(
    'hist-001',
    'usr-priya-01',
    'loc-chn',
    'plc-kapaleeshwarar-temple',
    'view_place',
    '{"source": "explore_feed", "device": "mobile_android", "session_id": "sess_chn_001"}',
    '2026-08-21 16:10:00'
),
(
    'hist-002',
    'usr-priya-01',
    'loc-chn',
    'plc-marina-beach',
    'view_place',
    '{"source": "search", "query": "safe sunrise spots in chennai", "device": "mobile_android"}',
    '2026-08-21 16:25:00'
),
(
    'hist-003',
    'usr-priya-01',
    'loc-chn',
    'plc-kapaleeshwarar-temple',
    'add_favorite',
    '{"priority_assigned": 1, "custom_note_length": 115}',
    '2026-08-22 10:00:00'
),
(
    'hist-004',
    'usr-alex-02',
    'loc-tnj',
    'plc-brihadisvara-temple',
    'view_place',
    '{"source": "unesco_featured_banner", "device": "desktop_mac"}',
    '2026-08-24 14:00:00'
),
(
    'hist-005',
    'usr-alex-02',
    'loc-tnj',
    'plc-brihadisvara-temple',
    'rate_place',
    '{"rating": 5, "has_photo": false, "review_length": 234}',
    '2026-08-27 10:30:00'
);

-- -----------------------------------------------------------------------------
-- 9. Seed Trips
-- Structured travel itinerary linking users, locations, and day-by-day JSON plans
-- -----------------------------------------------------------------------------
INSERT INTO `trips` (
    `id`,
    `user_id`,
    `location_id`,
    `title`,
    `start_date`,
    `end_date`,
    `itinerary_data`,
    `created_at`,
    `updated_at`
) VALUES
(
    'trip-priya-tn-01',
    'usr-priya-01',
    'loc-chn',
    'Solo Heritage Trail: Coastal Temples & Chola Architecture',
    '2026-10-10',
    '2026-10-13',
    '{
        "trip_name": "Solo Heritage Trail: Coastal Temples & Chola Architecture",
        "travel_style": "solo",
        "budget_estimate_inr": 12500,
        "days": [
            {
                "day_number": 1,
                "city": "Chennai",
                "schedule": [
                    {
                        "time": "06:00 AM",
                        "place_id": "plc-marina-beach",
                        "activity": "Sunrise walk along the promenade and authentic South Indian breakfast near Mylapore"
                    },
                    {
                        "time": "08:30 AM",
                        "place_id": "plc-kapaleeshwarar-temple",
                        "activity": "Temple darshan, Dravidian gopuram photography, and shopping in the traditional four Mada streets"
                    },
                    {
                        "time": "05:00 PM",
                        "place_id": "plc-marina-beach",
                        "activity": "Evening lighthouse visit and sampling traditional sundal by the shore"
                    }
                ]
            },
            {
                "day_number": 2,
                "city": "Transit Chennai to Thanjavur",
                "schedule": [
                    {
                        "time": "06:00 AM",
                        "activity": "Board Cholan Express / Vande Bharat from Chennai Egmore to Thanjavur Junction"
                    },
                    {
                        "time": "04:30 PM",
                        "place_id": "plc-brihadisvara-temple",
                        "activity": "Golden hour arrival at Brihadisvara Temple, exploring inner sanctum and illuminated night vistas"
                    }
                ]
            },
            {
                "day_number": 3,
                "city": "Thanjavur",
                "schedule": [
                    {
                        "time": "09:00 AM",
                        "activity": "Visit Thanjavur Maratha Palace complex, Art Gallery, and Saraswathi Mahal Library"
                    },
                    {
                        "time": "02:30 PM",
                        "activity": "Witness classical Tanjore painting craftsmen and lost-wax Chola bronze sculptors"
                    }
                ]
            }
        ]
    }',
    '2026-08-25 15:00:00',
    '2026-08-25 15:00:00'
);

-- -----------------------------------------------------------------------------
-- 10. Seed Personalized Suggestions
-- AI-tailored recommendations: solo-travel safety, golden hour timings, etiquette
-- -----------------------------------------------------------------------------
INSERT INTO `personalized_suggestions` (
    `id`,
    `user_id`,
    `location_id`,
    `place_id`,
    `suggestion_type`,
    `title`,
    `advice`,
    `recommended_time_slot`,
    `relevance_score`,
    `is_dismissed`,
    `created_at`,
    `updated_at`
) VALUES
(
    'sug-001',
    'usr-priya-01',
    'loc-chn',
    'plc-marina-beach',
    'early_morning',
    'Sunrise Stroll & Authentic Kumbakonam Degree Coffee',
    'Beat Chennai’s afternoon coastal humidity by visiting Marina Beach between 05:30 AM and 07:00 AM. Solo joggers and fitness groups gather around the lighthouse stretch, making it very safe. Enjoy fresh steaming filter coffee from seaside kiosks.',
    '05:30 - 07:30',
    96.50,
    FALSE,
    '2026-08-26 06:00:00',
    '2026-08-26 06:00:00'
),
(
    'sug-002',
    'usr-priya-01',
    'loc-chn',
    'plc-kapaleeshwarar-temple',
    'solo_friendly',
    'Mylapore Cultural Walking Trail & Silk Weaving Boutiques',
    'Explore the four Mada streets surrounding Kapaleeshwarar Temple on foot. Solo travelers find this cultural neighborhood welcoming, walkable, and safe. Sample hot crispy medu vadas at local heritage messes and admire age-old floral garland artisans.',
    '07:30 - 10:00',
    94.00,
    FALSE,
    '2026-08-26 06:00:00',
    '2026-08-26 06:00:00'
),
(
    'sug-003',
    'usr-alex-02',
    'loc-tnj',
    'plc-brihadisvara-temple',
    'evening_sunset',
    'Golden Hour Illumination at Brihadisvara',
    'Arrive at the Big Temple compound by 04:45 PM. The setting sun illuminates the thousand-year-old 216-foot granite vimana in warm ochre tones. At dusk, architectural floodlights highlight the ancient Tamil and Grantha inscriptions along the perimeter.',
    '16:45 - 19:00',
    98.50,
    FALSE,
    '2026-08-26 06:00:00',
    '2026-08-26 06:00:00'
),
(
    'sug-004',
    'usr-rahul-03',
    'loc-chn',
    'plc-marina-beach',
    'budget_saving',
    'Free Coastal Sunset & Budget Beachfront Delicacies',
    'Marina Beach has zero entry fees. Budget backpackers can experience sunset seaside panoramas, breezy kite displays, and hot roasted corn or seasoned sundal snacks for under INR 100.',
    '17:00 - 20:00',
    89.00,
    FALSE,
    '2026-08-26 06:00:00',
    '2026-08-26 06:00:00'
),
(
    'sug-005',
    'usr-alex-02',
    'loc-tnj',
    NULL,
    'cultural_experience',
    'UNESCO Living Chola Bronze Artisan Workshops',
    'Thanjavur is world-famous for its ancient lost-wax casting technique passed down since the Chola era. Visit local heritage artisan workshops near Thanjavur old town and Swamimalai to witness master bronze sculptors fashioning sacred iconography.',
    '10:00 - 13:00',
    91.50,
    FALSE,
    '2026-08-26 06:00:00',
    '2026-08-26 06:00:00'
);

-- -----------------------------------------------------------------------------
-- Restore previous session state
-- -----------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
