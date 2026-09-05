/**
 * =============================================================================
 * TripNova Database Connection Manager
 * =============================================================================
 * Supports MySQL (Default / Production) with auto-creation of database and tables,
 * plus SQLite zero-config fallback.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');

const DB_TYPE = (process.env.DB_TYPE || 'mysql').toLowerCase();

let mysqlPool = null;
let sqliteDb = null;
let isInitialized = false;

// =============================================================================
// 1. MySQL Implementation
// =============================================================================
async function initMySQL() {
  const mysql = require('mysql2/promise');

  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'tripnova_db';

  console.log(`🔌 Attempting MySQL connection to ${user}@${host}:${port}...`);

  // Step 1: Connect to MySQL Server without specifying DB to ensure database exists
  try {
    const rootConn = await mysql.createConnection({
      host,
      port,
      user,
      password
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();
    console.log(`✅ MySQL Database \`${database}\` verified / created.`);
  } catch (err) {
    console.warn(`⚠️ Could not auto-create database (might lack root privileges or DB already exists):`, err.message);
  }

  // Step 2: Create Connection Pool to the specific database
  const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
  });

  // Verify connection
  const conn = await pool.getConnection();
  conn.release();
  console.log(`🚀 MySQL Connected successfully to \`${database}\` on ${host}:${port}`);

  return pool;
}

// Bootstrap MySQL Schema
async function bootstrapMySQL(pool) {
  const tableQueries = [
    // 1. Users (Tourists / Consumers)
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      username VARCHAR(64) UNIQUE,
      password VARCHAR(255),
      email VARCHAR(128) UNIQUE,
      full_name VARCHAR(128) NOT NULL,
      avatar_url TEXT,
      dob DATE,
      age INT DEFAULT 0,
      gender VARCHAR(32) DEFAULT 'Male',
      blood_group VARCHAR(16) DEFAULT 'O+',
      allergies TEXT,
      medical_conditions TEXT,
      disability TEXT,
      address TEXT,
      govt_id_type VARCHAR(64) DEFAULT 'Aadhaar Card',
      govt_id_number VARCHAR(64),
      govt_id_state VARCHAR(128),
      languages_known JSON,
      preferred_language VARCHAR(64) DEFAULT 'English',
      native_currency VARCHAR(16) DEFAULT 'INR',
      current_location VARCHAR(255),
      location_coordinates JSON,
      trusted_contacts JSON,
      interested_top_picks JSON,
      is_registered BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_email (email),
      INDEX idx_user_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // 2. Service Providers (Partners)
    `CREATE TABLE IF NOT EXISTS service_providers (
      id VARCHAR(64) PRIMARY KEY,
      username VARCHAR(64) UNIQUE,
      password VARCHAR(255),
      email VARCHAR(128),
      phone VARCHAR(64),
      provider_name VARCHAR(128) NOT NULL,
      business_name VARCHAR(128) NOT NULL,
      category VARCHAR(64) NOT NULL,
      operating_city VARCHAR(128),
      operating_state VARCHAR(128),
      native_currency VARCHAR(16) DEFAULT 'INR',
      is_verified BOOLEAN DEFAULT TRUE,
      transport_details JSON,
      tour_guide_details JSON,
      homestay_details JSON,
      emergency_medical_details JSON,
      rental_agency_details JSON,
      registered_at DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_provider_category (category),
      INDEX idx_provider_username (username),
      INDEX idx_provider_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // 3. Locations
    `CREATE TABLE IF NOT EXISTS locations (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      state VARCHAR(128) NOT NULL DEFAULT 'Tamil Nadu',
      country VARCHAR(128) NOT NULL DEFAULT 'India',
      currency_code VARCHAR(16) NOT NULL DEFAULT 'INR',
      description TEXT,
      latitude DECIMAL(10, 6),
      longitude DECIMAL(10, 6),
      region VARCHAR(64) DEFAULT 'Southern',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // 4. Places
    `CREATE TABLE IF NOT EXISTS places (
      id VARCHAR(64) PRIMARY KEY,
      location_id VARCHAR(64) NOT NULL,
      name VARCHAR(128) NOT NULL,
      category VARCHAR(64) NOT NULL,
      avg_rating DECIMAL(3, 2) DEFAULT 0.00,
      review_count INT DEFAULT 0,
      entry_fee DECIMAL(10, 2) DEFAULT 0.00,
      opening_hours VARCHAR(128),
      latitude DECIMAL(10, 6),
      longitude DECIMAL(10, 6),
      map_url TEXT,
      description TEXT,
      best_season VARCHAR(128),
      avg_visit_time VARCHAR(128),
      transport TEXT,
      nearby_hotels TEXT,
      nearby_restaurants TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // 5. Trips & Itineraries
    `CREATE TABLE IF NOT EXISTS trips (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      title VARCHAR(128) NOT NULL,
      destination VARCHAR(128),
      start_date DATE,
      end_date DATE,
      itinerary_data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    // 6. Safety Contacts
    `CREATE TABLE IF NOT EXISTS safety_contacts (
      id VARCHAR(64) PRIMARY KEY,
      location_id VARCHAR(64) NOT NULL,
      service_type VARCHAR(64) NOT NULL,
      contact_number VARCHAR(64) NOT NULL,
      operating_hours VARCHAR(64) DEFAULT '24/7',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  ];

  for (const q of tableQueries) {
    try {
      await pool.query(q);
    } catch (err) {
      console.warn('⚠️ Table bootstrap notice:', err.message);
    }
  }

  // Seed sample tourist if empty
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO users (id, username, password, email, full_name, dob, age, gender, blood_group, native_currency, preferred_language, is_registered)
        VALUES ('usr_demo_kamesh', 'kamesh_traveler', 'kamesh123', 'kamesh.travel@gmail.com', 'Kameshwaram S', '2001-05-14', 25, 'Male', 'O+', 'INR', 'English', 1)
      `);
      console.log('🌱 Seeded default demo tourist in MySQL.');
    }
  } catch (e) {
    // Ignore seed errors
  }
}

// =============================================================================
// 2. SQLite Fallback Implementation
// =============================================================================
function initSQLite() {
  const sqlite3 = require('sqlite3').verbose();
  const dbDir = path.resolve(__dirname, '../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbFilePath = path.resolve(__dirname, '../database/tripnova.db');
  const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) console.error('❌ Failed to open SQLite:', err.message);
    else console.log(`📁 SQLite Database active at: ${dbFilePath}`);
  });

  return db;
}

function runSqliteQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    const trimmed = sql.trim().toUpperCase();
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA') || trimmed.startsWith('SHOW')) {
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

async function bootstrapSqlite(db) {
  const ddl = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT UNIQUE,
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      dob TEXT,
      age INTEGER DEFAULT 0,
      gender TEXT DEFAULT 'Male',
      blood_group TEXT DEFAULT 'O+',
      allergies TEXT,
      medical_conditions TEXT,
      disability TEXT,
      address TEXT,
      govt_id_type TEXT DEFAULT 'Aadhaar Card',
      govt_id_number TEXT,
      govt_id_state TEXT,
      languages_known TEXT,
      preferred_language TEXT DEFAULT 'English',
      native_currency TEXT DEFAULT 'INR',
      current_location TEXT,
      location_coordinates TEXT,
      trusted_contacts TEXT,
      interested_top_picks TEXT,
      is_registered INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS service_providers (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT,
      phone TEXT,
      provider_name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      category TEXT NOT NULL,
      operating_city TEXT,
      operating_state TEXT,
      native_currency TEXT DEFAULT 'INR',
      is_verified INTEGER DEFAULT 1,
      transport_details TEXT,
      tour_guide_details TEXT,
      homestay_details TEXT,
      emergency_medical_details TEXT,
      rental_agency_details TEXT,
      registered_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT NOT NULL,
      destination TEXT,
      start_date TEXT,
      end_date TEXT,
      itinerary_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT 'Tamil Nadu',
      country TEXT NOT NULL DEFAULT 'India',
      currency_code TEXT NOT NULL DEFAULT 'INR',
      description TEXT,
      latitude REAL,
      longitude REAL,
      region TEXT DEFAULT 'Southern',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      location_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      avg_rating REAL DEFAULT 0.0,
      review_count INTEGER DEFAULT 0,
      entry_fee REAL DEFAULT 0.0,
      opening_hours TEXT,
      latitude REAL,
      longitude REAL,
      map_url TEXT,
      description TEXT,
      best_season TEXT,
      avg_visit_time TEXT,
      transport TEXT,
      nearby_hotels TEXT,
      nearby_restaurants TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    );
  `;

  const statements = ddl.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await runSqliteQuery(db, stmt);
  }
}

// =============================================================================
// Unified Database Interface
// =============================================================================
const db = {
  engine: 'none',

  async init() {
    if (isInitialized) return;

    if (DB_TYPE === 'mysql') {
      try {
        mysqlPool = await initMySQL();
        await bootstrapMySQL(mysqlPool);
        this.engine = 'mysql';
        isInitialized = true;
        return;
      } catch (err) {
        console.error('❌ MySQL Connection Failed:', err.message);
        console.log('🔄 Falling back to SQLite local storage mode so your app continues working smoothly.');
      }
    }

    // Fallback or explicit sqlite
    sqliteDb = initSQLite();
    await bootstrapSqlite(sqliteDb);
    this.engine = 'sqlite';
    isInitialized = true;
  },

  async query(sql, params = []) {
    if (!isInitialized) {
      await this.init();
    }

    if (this.engine === 'mysql' && mysqlPool) {
      const [rows] = await mysqlPool.query(sql, params);
      return rows;
    } else if (sqliteDb) {
      return runSqliteQuery(sqliteDb, sql, params);
    }

    throw new Error('No active database engine connected.');
  },

  getEngine() {
    return this.engine;
  }
};

module.exports = db;
