import re
import sqlite3

places_to_check = [
    'plc-national-art-gallery',
    'plc-pondy-bazaar',
    'plc-semmozhi-poonga',
    'plc-queensland-amusement-park',
    'plc-mgr-film-city',
    'plc-mahabalipuram',
    'plc-pulicat-lake',
    'plc-san-thome',
    'plc-marina-beach',
    'plc-dakshinachitra-museum',
    'plc-barracuda-bayfishing'
]

print("=== CHECKING SEED.SQL ===")
with open('backend/database/seed.sql', encoding='utf-8') as f:
    content = f.read()
    for pid in places_to_check:
        m = re.search(r"\('" + pid + r"'.*?\)", content)
        if m:
            print("  FOUND:", m.group(0)[:90] + "...")
        else:
            print("  NOT FOUND:", pid)

print("\n=== CHECKING SQLITE (tripnova.db) ===")
conn = sqlite3.connect('backend/database/tripnova.db')
c = conn.cursor()
for pid in places_to_check:
    c.execute('SELECT id, name, latitude, longitude FROM places WHERE id = ?', (pid,))
    print(" ", c.fetchone())
conn.close()
