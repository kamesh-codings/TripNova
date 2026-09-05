import sqlite3

# Accurate Google Maps coordinates for all Chennai places
CHENNAI_COORDS = {
    # --- From places_1.csv (already corrected) ---
    "plc-san-thome":              (13.03361, 80.27778),   # San Thome Basilica
    "plc-elliots-beach":          (12.99953, 80.27241),   # Edward Elliot's Beach
    "plc-fort-st-george":         (13.07972, 80.28694),   # Fort St. George & Museum
    "plc-egmore-museum":          (13.0706,  80.2567),    # Government Museum Chennai
    "plc-guindy-park":            (13.0089,  80.2406),    # Guindy National Park
    "plc-vandalur-zoo":           (12.87917, 80.08167),   # Arignar Anna Zoological Park
    "plc-dakshinachitra":         (12.82242, 80.2431),    # DakshinaChitra Heritage Museum
    "plc-valluvar-kottam":        (13.05441, 80.24175),   # Valluvar Kottam
    "plc-parthasarathy":          (13.0506,  80.2739),    # Arulmigu Parthasarathy Temple
    "plc-ashtalakshmi":           (12.9931,  80.2686),    # Ashtalakshmi Temple
    "plc-marundeeswarar":         (12.98556, 80.26139),   # Marundeeswarar Temple
    "plc-kalakshetra":            (12.9881,  80.265),     # Kalakshetra Foundation
    "plc-birla-planetarium":      (13.012,   80.2437),    # Birla Planetarium
    "plc-theosophical":           (13.0036,  80.2581),    # Theosophical Society Gardens
    "plc-semmozhi-poonga":        (13.009,   80.2406),    # Semmozhi Poonga
    "plc-vadapalani-murugan":     (13.0528,  80.2136),    # Vadapalani Murugan Temple
    "plc-ripon-building":         (13.0825,  80.2715),    # Ripon Building & Victoria Public Hall
    "plc-st-thomas-mount":        (12.9972,  80.1639),    # St. Thomas Mount
    "plc-rail-museum":            (13.0897,  80.2606),    # Chennai Rail Museum
    "plc-connemara-library":      (13.07056, 80.25667),   # Connemara Public Library
    "plc-covelong-beach":         (12.7896,  80.2542),    # Covelong (Kovalam) Beach
    "plc-croc-bank":              (12.78,    80.239),     # Madras Crocodile Bank Trust
    "plc-vivekananda-house":      (13.0447,  80.2789),    # Vivekananda House (Illam)
    "plc-muttukadu":              (12.8227,  80.2419),    # Muttukadu Boat House
    "plc-cholamandal":            (12.92222, 80.25194),   # Cholamandal Artists' Village
    "plc-chetpet-eco-park":       (13.07412, 80.24238),   # Chetpet Eco Park
    "plc-thiruvanmiyur-beach":    (12.9736,  80.2665),    # Thiruvanmiyur Beach
    "plc-kalikambal":             (13.0872,  80.2889),    # Kalikambal Temple George Town
    "plc-thousand-lights":        (13.0547,  80.2422),    # Thousand Lights Mosque
    "plc-anna-nagar-tower":       (13.08678, 80.21435),   # Anna Nagar Tower Park

    # --- From Excel dataset (need fixing) ---
    "plc-marina-beach":           (13.0500,  80.2824),    # Marina Beach (already OK)
    "plc-national-art-gallery":   (13.0697,  80.2573),    # National Art Gallery (was 88.3473 !)
    "plc-pondy-bazaar":           (13.0399,  80.2388),    # Pondy Bazaar T. Nagar
    "plc-pulicat-lake":           (13.4167,  80.3167),    # Pulicat Lake (north of Chennai)
    "plc-barracuda-bayfishing":   (13.0500,  80.2850),    # Barracuda Bay Fishing (off Marina)
    "plc-dakshinachitra-museum":  (12.8224,  80.2431),    # DakshinaChitra Museum (same as plc-dakshinachitra)
    "plc-mahabalipuram":          (12.6208,  80.1994),    # Mahabalipuram (corrected coords)
    "plc-mgr-film-city":          (12.9470,  80.2360),    # MGR Film City Taramani
    "plc-adventure-sports-at-covelong-bea": (12.7870, 80.2504),  # Covelong Adventure Sports
    "plc-scuba-diving-at-covelong-beach":   (12.7870, 80.2504),  # Covelong Scuba Diving
    "plc-queensland-amusement-park":        (13.0300, 80.2403),  # Queensland Amusement Park
    "plc-ubbalamadugu-falls":     (13.6042,  79.9711),    # Ubbalamadugu Falls (Tada Falls, near Tada)
    "plc-water-activities-at-muttukadu":    (12.8270, 80.2419),  # Muttukadu Water Activities
}

conn = sqlite3.connect("backend/database/tripnova.db")
c = conn.cursor()

updated = 0
for pid, (lat, lng) in CHENNAI_COORDS.items():
    c.execute("UPDATE places SET latitude = ?, longitude = ? WHERE id = ?", (lat, lng, pid))
    if c.rowcount > 0:
        updated += 1

conn.commit()
print("Updated " + str(updated) + " Chennai places in SQLite database.")

# Verify
c.execute("SELECT id, name, latitude, longitude FROM places WHERE location_id = 'loc-chn' ORDER BY name")
rows = c.fetchall()
print("\nVerification - All Chennai places:")
for r in rows:
    flag = ""
    if r[2] is None or r[3] is None:
        flag = " *** MISSING COORDS ***"
    elif abs(r[3]) > 81 or abs(r[3]) < 79:
        flag = " *** SUSPICIOUS LNG ***"
    print("  " + str(r[0]) + " | " + str(r[1]) + " | lat=" + str(r[2]) + ", lng=" + str(r[3]) + flag)

conn.close()
