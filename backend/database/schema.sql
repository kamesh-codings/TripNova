-- =============================================================================
-- Smart India Hackathon (SIH) - Tourism Platform Backend Database Schema
-- Database Engine : MySQL 8.0+ / MariaDB 10.5+ / Aiven Cloud MySQL
-- Encoding        : utf8mb4
-- Collation       : utf8mb4_unicode_ci
-- Storage Engine  : InnoDB
-- =============================================================================

-- Disable foreign key checks and unique checks during setup to ensure clean execution
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
SET NAMES utf8mb4;

-- -----------------------------------------------------------------------------
-- Drop existing tables in reverse dependency order (with FK guard active)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `personalized_suggestions`;
DROP TABLE IF EXISTS `trips`;
DROP TABLE IF EXISTS `user_history`;
DROP TABLE IF EXISTS `user_favorites`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `safety_contacts`;
DROP TABLE IF EXISTS `cultural_rules`;
DROP TABLE IF EXISTS `places`;
DROP TABLE IF EXISTS `locations`;
DROP TABLE IF EXISTS `users`;

-- -----------------------------------------------------------------------------
-- Table 1: users
-- Stores registered tourists, OAuth profiles, preferences, and travel styles
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
    `id` VARCHAR(64) NOT NULL,
    `google_id` VARCHAR(128) DEFAULT NULL,
    `email` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `avatar_url` VARCHAR(512) DEFAULT NULL,
    `home_currency` VARCHAR(3) NOT NULL DEFAULT 'INR',
    `travel_style` ENUM(
        'budget',
        'backpacker',
        'luxury',
        'cultural',
        'adventure',
        'solo',
        'family',
        'relaxed'
    ) NOT NULL DEFAULT 'solo',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`),
    UNIQUE KEY `uk_users_google_id` (`google_id`),
    KEY `idx_users_travel_style` (`travel_style`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 2: locations
-- Represents administrative cities/districts hosting tourist destinations
-- -----------------------------------------------------------------------------
CREATE TABLE `locations` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    `country` VARCHAR(100) NOT NULL DEFAULT 'India',
    `currency_code` VARCHAR(3) NOT NULL DEFAULT 'INR',
    `description` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_locations_name_state` (`name`, `state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 3: places
-- Tourist attractions, heritage monuments, beaches, temples, and eateries
-- -----------------------------------------------------------------------------
CREATE TABLE `places` (
    `id` VARCHAR(64) NOT NULL,
    `location_id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `category` ENUM(
        'historical',
        'religious',
        'beach',
        'nature',
        'museum',
        'cultural',
        'food_dining',
        'shopping',
        'entertainment',
        'other'
    ) NOT NULL,
    `avg_rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `entry_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `opening_hours` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_places_location_id` (`location_id`),
    KEY `idx_places_category` (`category`),
    KEY `idx_places_name` (`name`),
    KEY `idx_places_location_category_rating` (`location_id`, `category`, `avg_rating` DESC),
    KEY `idx_places_rating` (`avg_rating` DESC),
    CONSTRAINT `fk_places_location` FOREIGN KEY (`location_id`)
        REFERENCES `locations` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `chk_places_rating` CHECK (`avg_rating` BETWEEN 0.00 AND 5.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 4: cultural_rules
-- Local etiquette, dress codes, footwear norms, and photography protocols
-- -----------------------------------------------------------------------------
CREATE TABLE `cultural_rules` (
    `id` VARCHAR(64) NOT NULL,
    `location_id` VARCHAR(64) NOT NULL,
    `rule_type` ENUM(
        'dress_code',
        'footwear',
        'photography',
        'behavior',
        'temple_etiquette',
        'dining_etiquette',
        'tipping',
        'general'
    ) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `severity` ENUM(
        'advisory',
        'standard',
        'mandatory',
        'strict'
    ) NOT NULL DEFAULT 'standard',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_cultural_rules_location_id` (`location_id`),
    KEY `idx_cultural_rules_severity` (`severity`),
    KEY `idx_cultural_rules_location_severity` (`location_id`, `severity`),
    CONSTRAINT `fk_cultural_rules_location` FOREIGN KEY (`location_id`)
        REFERENCES `locations` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 5: safety_contacts
-- Emergency contacts, tourist police booths, hospitals, and helplines
-- -----------------------------------------------------------------------------
CREATE TABLE `safety_contacts` (
    `id` VARCHAR(64) NOT NULL,
    `location_id` VARCHAR(64) NOT NULL,
    `service_type` VARCHAR(100) NOT NULL,
    `contact_number` VARCHAR(50) NOT NULL,
    `operating_hours` VARCHAR(100) NOT NULL DEFAULT '24/7',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_safety_contacts_location_id` (`location_id`),
    CONSTRAINT `fk_safety_contacts_location` FOREIGN KEY (`location_id`)
        REFERENCES `locations` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 6: reviews
-- Traveler reviews, 1-5 star ratings, and experiential feedback
-- -----------------------------------------------------------------------------
CREATE TABLE `reviews` (
    `id` VARCHAR(64) NOT NULL,
    `place_id` VARCHAR(64) NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `rating` TINYINT UNSIGNED NOT NULL,
    `comment` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_reviews_place_id` (`place_id`),
    KEY `idx_reviews_user_id` (`user_id`),
    KEY `idx_reviews_place_rating` (`place_id`, `rating` DESC),
    KEY `idx_reviews_created_at` (`created_at` DESC),
    CONSTRAINT `fk_reviews_place` FOREIGN KEY (`place_id`)
        REFERENCES `places` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `chk_reviews_rating` CHECK (`rating` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 7: user_favorites
-- Saved attractions and bucket list items with custom notes & priority
-- -----------------------------------------------------------------------------
CREATE TABLE `user_favorites` (
    `id` VARCHAR(64) NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `place_id` VARCHAR(64) NOT NULL,
    `priority_rank` INT NOT NULL DEFAULT 1,
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_place_favorite` (`user_id`, `place_id`),
    KEY `idx_user_favorites_user_priority` (`user_id`, `priority_rank` ASC),
    KEY `idx_user_favorites_place_id` (`place_id`),
    CONSTRAINT `fk_user_favorites_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_user_favorites_place` FOREIGN KEY (`place_id`)
        REFERENCES `places` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 8: user_history
-- Telemetry & audit logs for views, navigation, searches, and behavioral analysis
-- -----------------------------------------------------------------------------
CREATE TABLE `user_history` (
    `id` VARCHAR(64) NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `location_id` VARCHAR(64) DEFAULT NULL,
    `place_id` VARCHAR(64) DEFAULT NULL,
    `action_type` ENUM(
        'view_place',
        'search',
        'view_location',
        'add_favorite',
        'remove_favorite',
        'create_trip',
        'rate_place',
        'navigate'
    ) NOT NULL,
    `metadata` JSON DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_history_user_timeline` (`user_id`, `created_at` DESC),
    KEY `idx_user_history_action` (`action_type`),
    KEY `idx_user_history_location_id` (`location_id`),
    KEY `idx_user_history_place_id` (`place_id`),
    CONSTRAINT `fk_user_history_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_user_history_location` FOREIGN KEY (`location_id`)
        REFERENCES `locations` (`id`)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT `fk_user_history_place` FOREIGN KEY (`place_id`)
        REFERENCES `places` (`id`)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 9: trips
-- User travel itineraries with planned start/end dates and full day-by-day JSON
-- -----------------------------------------------------------------------------
CREATE TABLE `trips` (
    `id` VARCHAR(64) NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `location_id` VARCHAR(64) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `itinerary_data` JSON DEFAULT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_trips_user_dates` (`user_id`, `start_date` ASC),
    KEY `idx_trips_location_id` (`location_id`),
    CONSTRAINT `fk_trips_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_trips_location` FOREIGN KEY (`location_id`)
        REFERENCES `locations` (`id`)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT `chk_trips_date_order` CHECK (`end_date` >= `start_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table 10: personalized_suggestions
-- AI and rule-driven recommendations (solo-friendly tips, timing, crowd alerts)
-- -----------------------------------------------------------------------------
CREATE TABLE `personalized_suggestions` (
    `id` VARCHAR(64) NOT NULL,
    `user_id` VARCHAR(64) NOT NULL,
    `location_id` VARCHAR(64) NOT NULL,
    `place_id` VARCHAR(64) DEFAULT NULL,
    `suggestion_type` ENUM(
        'solo_friendly',
        'early_morning',
        'evening_sunset',
        'cultural_experience',
        'budget_saving',
        'crowd_avoidance',
        'culinary',
        'safety_tip'
    ) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `advice` TEXT NOT NULL,
    `recommended_time_slot` VARCHAR(100) DEFAULT NULL,
    `relevance_score` DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    `is_dismissed` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_suggestions_user_active_ranked` (`user_id`, `is_dismissed`, `relevance_score` DESC),
    KEY `idx_suggestions_location_id` (`location_id`),
    KEY `idx_suggestions_place_id` (`place_id`),
    KEY `idx_suggestions_type` (`suggestion_type`),
    CONSTRAINT `fk_suggestions_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_suggestions_location` FOREIGN KEY (`location_id`)
        REFERENCES `locations` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_suggestions_place` FOREIGN KEY (`place_id`)
        REFERENCES `places` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `chk_suggestions_relevance` CHECK (`relevance_score` BETWEEN 0.00 AND 100.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Restore previous session state
-- -----------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
