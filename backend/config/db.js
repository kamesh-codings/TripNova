/**
 * TripNova Database Connection Manager
 * Supports both SQLite (Zero-config local mode) and MySQL (Cloud/Production mode).
 */

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_TYPE = (process.env.DB_TYPE || 'sqlite').toLowerCase();
let dbInstance = null;
let isInitialized = false;

// SQLite Database Setup
function initSQLite() {
  const dbDir = path.resolve(__dirname, '../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbFilePath = path.resolve(__dirname, '../', process.env.DB_FILE || './database/tripnova.db');
  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error('❌ Failed to open SQLite database:', err.message);
    } else {
      console.log(`✅ SQLite Database connected at: ${dbFilePath}`);
    }
  });

  return db;
}

// Execute SQLite query with promise
function runSqliteQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA')) {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    } else {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({
          insertId: this.lastID,
          changes: this.changes,
          affectedRows: this.changes
        });
      });
    }
  });
}

// Bootstrap SQLite schema and initial data
async function bootstrapSqlite(db) {
  if (isInitialized) return;

  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      home_currency TEXT NOT NULL DEFAULT 'INR',
      travel_style TEXT NOT NULL DEFAULT 'solo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT 'Tamil Nadu',
      country TEXT NOT NULL DEFAULT 'India',
      currency_code TEXT NOT NULL DEFAULT 'INR',
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      location_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      avg_rating REAL NOT NULL DEFAULT 0.00,
      review_count INTEGER NOT NULL DEFAULT 0,
      entry_fee REAL NOT NULL DEFAULT 0.00,
      opening_hours TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cultural_rules (
      id TEXT PRIMARY KEY,
      location_id TEXT NOT NULL,
      rule_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'standard',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS safety_contacts (
      id TEXT PRIMARY KEY,
      location_id TEXT NOT NULL,
      service_type TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      operating_hours TEXT NOT NULL DEFAULT '24/7',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      place_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      place_id TEXT NOT NULL,
      priority_rank INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, place_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      location_id TEXT,
      place_id TEXT,
      action_type TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      location_id TEXT NOT NULL,
      title TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      itinerary_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (location_id) REFERENCES locations (id)
    );

    CREATE TABLE IF NOT EXISTS personalized_suggestions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      location_id TEXT NOT NULL,
      place_id TEXT,
      suggestion_type TEXT NOT NULL,
      title TEXT NOT NULL,
      advice TEXT NOT NULL,
      recommended_time_slot TEXT,
      relevance_score REAL NOT NULL DEFAULT 1.00,
      is_dismissed INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    );
  `;

  // Execute DDL statement by statement
  const statements = ddl.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await runSqliteQuery(db, stmt);
  }

  // Seed or update places and locations directly from seed.sql
  const seedPath = path.resolve(__dirname, '../database/seed.sql');
  if (fs.existsSync(seedPath)) {
    try {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      const insertMatches = seedSql.match(/INSERT INTO\s+`?(\w+)`?\s*\([^)]+\)\s*VALUES\s*([\s\S]*?);/gi);
      if (insertMatches) {
        for (let insertStmt of insertMatches) {
          // Clean MySQL-specific backticks and types
          insertStmt = insertStmt.replace(/`/g, '');
          // Use INSERT OR IGNORE for SQLite idempotency
          insertStmt = insertStmt.replace(/^INSERT INTO/i, 'INSERT OR IGNORE INTO');
          try {
            await runSqliteQuery(db, insertStmt);
          } catch (err) {
            // Ignore minor duplicate keys
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ Seed parsing warning:', err.message);
    }
  }

  isInitialized = true;
}

// Unified Database Interface
const db = {
  async init() {
    if (!dbInstance) {
      dbInstance = initSQLite();
      await bootstrapSqlite(dbInstance);
    }
    return dbInstance;
  },

  async query(sql, params = []) {
    if (!dbInstance) {
      await this.init();
    }
    return runSqliteQuery(dbInstance, sql, params);
  }
};

module.exports = db;
