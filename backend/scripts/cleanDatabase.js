const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database/tripnova.db');

console.log('📁 Connecting to SQLite at:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to open database:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  console.log('🧹 Purging all registered user accounts and records...');

  db.run('DELETE FROM users', function (err) {
    if (err) console.error('❌ Error clearing users:', err.message);
    else console.log(`✅ Cleared users table (deleted ${this.changes} rows)`);
  });

  db.run('DELETE FROM trips', function (err) {
    if (err) console.error('❌ Error clearing trips:', err.message);
    else console.log(`✅ Cleared trips table (deleted ${this.changes} rows)`);
  });

  db.run('DELETE FROM service_providers', function (err) {
    if (err) console.error('❌ Error clearing service_providers:', err.message);
    else console.log(`✅ Cleared service_providers table (deleted ${this.changes} rows)`);
  });

  // Physically reclaim disk space and wipe ghost traces from the binary file
  db.run('VACUUM', function (err) {
    if (err) {
      console.error('❌ Error running VACUUM:', err.message);
    } else {
      console.log('✅ SQLite file vacuumed and compacted on disk.');
    }

    db.all('SELECT count(*) as count FROM users', (err, rows) => {
      if (err) console.error(err);
      else console.log('📊 Current users in database:', rows[0].count);

      db.all('SELECT count(*) as count FROM locations', (err, locRows) => {
        console.log('📊 Master locations (intact):', locRows[0].count);

        db.all('SELECT count(*) as count FROM places', (err, placeRows) => {
          console.log('📊 Master tourist places (intact):', placeRows[0].count);
          db.close();
          console.log('🎉 Database is clean and ready for new account creations.');
        });
      });
    });
  });
});
