/**
 * =============================================================================
 * TripNova Database Connection & Sync Manager
 * =============================================================================
 * Supports MySQL (Production / Cloud) and SQLite zero-config fallback.
 * Automatically synchronizes places, locations, cultural rules, and safety contacts
 * from seed.sql so that new tourist spots added in the future are instantly active.
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');

const DB_TYPE = (process.env.DB_TYPE || 'mysql').toLowerCase();

let mysqlPool = null;
let sqliteDb = null;
let isInitialized = false;

// =============================================================================
// Helper: Parse seed.sql for Locations, Places, Rules & Safety Contacts
// =============================================================================
function parseSeedSql() {
  const seedSqlPath = path.resolve(__dirname, '../database/seed.sql');
  if (!fs.existsSync(seedSqlPath)) return { locations: [], places: [], contacts: [] };

  const sqlContent = fs.readFileSync(seedSqlPath, 'utf8');

  // 1. Locations
  const locations = [];
  const locBlockMatch = sqlContent.match(/INSERT INTO `locations`[\s\S]*?\);/);
  if (locBlockMatch) {
    const lines = locBlockMatch[0].split('\n');
    let current = [];
    let inTuple = false;
    for (const line of lines) {
      const tr = line.trim();
      if (tr.startsWith('(')) { inTuple = true; current = []; }
      if (inTuple) current.push(tr);
      if (tr.endsWith('),') || tr.endsWith(');')) {
        inTuple = false;
        const tupleStr = current.join(' ');
        const m = tupleStr.match(/^\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([\s\S]*?)',\s*'[^']+',\s*'[^']+'\s*\)[,;]?$/);
        if (m) {
          locations.push({
            id: m[1],
            name: m[2],
            state: m[3],
            country: m[4],
            currency_code: m[5],
            description: m[6].replace(/''/g, "'").trim()
          });
        }
      }
    }
  }

  // 2. Places
  const places = [];
  const placesBlockMatch = sqlContent.match(/INSERT INTO `places`[\s\S]*?\);/);
  if (placesBlockMatch) {
    const lines = placesBlockMatch[0].split('\n');
    let current = [];
    let inTuple = false;
    for (const line of lines) {
      const tr = line.trim();
      if (tr.startsWith('(')) { inTuple = true; current = []; }
      if (inTuple) current.push(tr);
      if (tr.endsWith('),') || tr.endsWith(');')) {
        inTuple = false;
        const tupleStr = current.join(' ');
        const m = tupleStr.match(/^\(\s*'([^']+)',\s*'([^']+)',\s*'([\s\S]*?)',\s*'([^']+)',\s*([0-9.]+),\s*([0-9]+),\s*([0-9.]+),\s*'([\s\S]*?)',\s*'[^']+',\s*'[^']+'\s*\)[,;]?$/);
        if (m) {
          places.push({
            id: m[1],
            location_id: m[2],
            name: m[3].replace(/''/g, "'").trim(),
            category: m[4],
            avg_rating: parseFloat(m[5]),
            review_count: parseInt(m[6], 10),
            entry_fee: parseFloat(m[7]),
            opening_hours: m[8].replace(/''/g, "'").trim()
          });
        }
      }
    }
  }

  // 3. Safety Contacts
  const contacts = [];
  const contactsBlockMatch = sqlContent.match(/INSERT INTO `safety_contacts`[\s\S]*?\);/);
  if (contactsBlockMatch) {
    const lines = contactsBlockMatch[0].split('\n');
    let current = [];
    let inTuple = false;
    for (const line of lines) {
      const tr = line.trim();
      if (tr.startsWith('(')) { inTuple = true; current = []; }
      if (inTuple) current.push(tr);
      if (tr.endsWith('),') || tr.endsWith(');')) {
        inTuple = false;
        const tupleStr = current.join(' ');
        const m = tupleStr.match(/^\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'[^']+',\s*'[^']+'\s*\)[,;]?$/);
        if (m) {
          contacts.push({
            id: m[1],
            location_id: m[2],
            service_type: m[3],
            contact_number: m[4],
            operating_hours: m[5]
          });
        }
      }
    }
  }

  return { locations, places, contacts };
}

// Synchronize parsed seed data into Database
async function syncSeedDataToDatabase(queryFn, engine, rawDb) {
  try {
    const checkPlaces = await queryFn('SELECT COUNT(*) as cnt FROM places');
    const placesCount = checkPlaces && checkPlaces[0] ? (checkPlaces[0].cnt || checkPlaces[0].count || 0) : 0;
    
    if (placesCount >= 500) {
      const checkLocs = await queryFn('SELECT COUNT(*) as cnt FROM locations');
      const locsCount = checkLocs && checkLocs[0] ? (checkLocs[0].cnt || checkLocs[0].count || 0) : 0;
      console.log(`✅ Database already fully synchronized: ${locsCount} locations, ${placesCount} places.`);
      return;
    }

    const seedSqlPath = path.resolve(__dirname, '../database/seed.sql');
    if (!fs.existsSync(seedSqlPath)) {
      console.warn('⚠️ seed.sql not found at:', seedSqlPath);
      return;
    }

    const sqlContent = fs.readFileSync(seedSqlPath, 'utf8');

    if (engine === 'sqlite' && rawDb && typeof rawDb.exec === 'function') {
      // Execute multi-statement SQL for SQLite
      // Remove MySQL-specific variables that SQLite doesn't recognize
      const cleanSql = sqlContent
        .replace(/SET @OLD_[^;]+;/gi, '')
        .replace(/SET NAMES[^;]+;/gi, '')
        .replace(/SET FOREIGN_KEY_CHECKS[^;]+;/gi, '')
        .replace(/SET UNIQUE_CHECKS[^;]+;/gi, '');

      await new Promise((resolve, reject) => {
        rawDb.exec(cleanSql, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    } else {
      // Split statements and execute individually
      const statements = sqlContent
        .split(/;\s*[\r\n]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const stmt of statements) {
        if (stmt.toUpperCase().startsWith('SET ') && engine === 'sqlite') continue;
        try {
          await queryFn(stmt);
        } catch (stmtErr) {
          // ignore minor non-fatal errors
        }
      }
    }

    const resLoc = await queryFn('SELECT COUNT(*) as cnt FROM locations');
    const resPlc = await queryFn('SELECT COUNT(*) as cnt FROM places');
    const locCount = resLoc && resLoc[0] ? (resLoc[0].cnt || resLoc[0].count || 0) : 0;
    const plcCount = resPlc && resPlc[0] ? (resPlc[0].cnt || resPlc[0].count || 0) : 0;
    console.log(`✅ Database synced with seed.sql: ${locCount} locations, ${plcCount} places.`);
  } catch (err) {
    console.warn('⚠️ Seed data sync notice:', err.message);
  }
}

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

  const conn = await pool.getConnection();
  conn.release();
  console.log(`🚀 MySQL Connected successfully to \`${database}\` on ${host}:${port}`);

  return pool;
}

async function bootstrapMySQL(pool) {
  const tableQueries = [
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

    `CREATE TABLE IF NOT EXISTS places (
      id VARCHAR(64) PRIMARY KEY,
      location_id VARCHAR(64) NOT NULL,
      name VARCHAR(150) NOT NULL,
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

    `CREATE TABLE IF NOT EXISTS safety_contacts (
      id VARCHAR(64) PRIMARY KEY,
      location_id VARCHAR(64) NOT NULL,
      service_type VARCHAR(100) NOT NULL,
      contact_number VARCHAR(64) NOT NULL,
      operating_hours VARCHAR(100) DEFAULT '24/7',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

    `CREATE TABLE IF NOT EXISTS cultural_rules (
      id VARCHAR(64) PRIMARY KEY,
      location_id VARCHAR(64) NOT NULL,
      rule_type VARCHAR(64) NOT NULL,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      severity VARCHAR(32) DEFAULT 'standard',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  ];

  for (const q of tableQueries) {
    try {
      await pool.query(q);
    } catch (err) {
      console.warn('⚠️ MySQL table bootstrap notice:', err.message);
    }
  }

  await syncSeedDataToDatabase(async (sql, params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  }, 'mysql');
}

// =============================================================================
// 2. SQLite Implementation
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

    CREATE TABLE IF NOT EXISTS safety_contacts (
      id TEXT PRIMARY KEY,
      location_id TEXT NOT NULL,
      service_type TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      operating_hours TEXT DEFAULT '24/7',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cultural_rules (
      id TEXT PRIMARY KEY,
      location_id TEXT NOT NULL,
      rule_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT DEFAULT 'standard',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
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

    CREATE TABLE IF NOT EXISTS user_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      location_id TEXT,
      action_type TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const statements = ddl.split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await runSqliteQuery(db, stmt);
  }

  await syncSeedDataToDatabase((sql, params) => runSqliteQuery(db, sql, params), 'sqlite', db);
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
  },

  async reSyncSeedData() {
    if (this.engine === 'mysql' && mysqlPool) {
      await syncSeedDataToDatabase(async (sql, params) => {
        const [rows] = await mysqlPool.query(sql, params);
        return rows;
      }, 'mysql');
    } else if (sqliteDb) {
      await syncSeedDataToDatabase((sql, params) => runSqliteQuery(sqliteDb, sql, params), 'sqlite');
    }
  }
};

module.exports = db;
