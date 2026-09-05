import sqlite3

conn = sqlite3.connect('backend/database/tripnova.db')
c = conn.cursor()
c.execute("SELECT id, name, latitude, longitude, map_url FROM places WHERE location_id = 'loc-chn' ORDER BY name")
rows = c.fetchall()

print(f"Total Chennai Places: {len(rows)}")
for pid, name, lat, lng, map_url in rows:
    print(f"{pid:<36} | {name:<35} | {lat}, {lng} | {map_url}")

conn.close()
