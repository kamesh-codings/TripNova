import csv

# Additional coordinates for the 78 missing IDs
ADDITIONAL_COORDS = {
    # --- Chengalpattu (loc-cgl) ---
    "plc-arjuna-penance":     (12.6162, 80.1927),
    "plc-butter-ball":        (12.6154, 80.1937),
    "plc-mahabs-lighthouse":  (12.6175, 80.1991),
    "plc-varaha-cave":        (12.6158, 80.1930),
    "plc-seashell-museum":    (12.6194, 80.1977),
    "plc-mahabs-beach":       (12.6200, 80.1985),

    # --- Kanchipuram (loc-kpm) ---
    "plc-vaikunta-perumal":   (12.8495, 79.7030),
    "plc-ulagalantha":        (12.8310, 79.6966),
    "plc-trilokyanatha":      (12.8450, 79.7010),
    "plc-kachabeswarar":      (12.8400, 79.7020),
    "plc-kanchi-silk-park":   (12.8342, 79.7036),

    # --- Nilgiris (loc-nlg) ---
    "plc-botanical-ooty":     (11.4147, 76.7057),
    "plc-sims-park":          (11.3479, 76.7990),
    "plc-dolphins-nose":      (11.3375, 76.7900),
    "plc-toy-train":          (11.3421, 76.7950),
    "plc-tea-museum-ooty":    (11.4000, 76.7600),
    "plc-avalanche-lake":     (11.3700, 76.5800),

    # --- Dindigul (loc-dgl) ---
    "plc-kodai-lake":         (10.2340, 77.4907),
    "plc-bryant-park":        (10.2310, 77.4930),
    "plc-pine-forest":        (10.2060, 77.4850),
    "plc-guna-caves":         (10.2170, 77.4750),
    "plc-mannavanur":         (10.1900, 77.4260),

    # --- Kanyakumari (loc-kkm) ---
    "plc-triveni-sangam":     (8.0784, 77.5504),
    "plc-bhagavathy-temple":  (8.0784, 77.5504),
    "plc-vattakottai":        (8.1300, 77.4800),
    "plc-suchindram":         (8.1520, 77.4680),
    "plc-mathur-aqueduct":    (8.4000, 77.3700),
    "plc-chothavilai":        (8.2000, 77.5200),

    # --- Tiruchirappalli (loc-try) ---
    "plc-thiruvanaikaval":    (10.8558, 78.7056),
    "plc-butterfly-park":     (10.8630, 78.6860),
    "plc-lourdu-church":      (10.7960, 78.6830),
    "plc-museum-trichy":      (10.8100, 78.6900),
    "plc-vayalur-murugan":    (10.7500, 78.7500),
    "plc-gunaseelam":         (10.8900, 78.6500),

    # --- Ramanathapuram (loc-rmd) ---
    "plc-rameshwaram-temple": (9.2885, 79.3173),
    "plc-kothandaramaswamy":  (9.2100, 79.3800),
    "plc-ram-setu-point":     (9.2300, 79.3900),
    "plc-villundi-theertham": (9.2500, 79.3050),
    "plc-kurusadai-island":   (9.2400, 79.2600),

    # --- Tiruvannamalai (loc-tvm) ---
    "plc-girivalam-path":     (12.2300, 79.0700),
    "plc-ramana-ashram":      (12.2130, 79.0625),
    "plc-skandasramam":       (12.2375, 79.0622),
    "plc-yogi-ashram":        (12.2130, 79.0625),
    "plc-javadi-hills":       (12.2500, 78.8300),
    "plc-beemanmadavu":       (12.2200, 79.0200),

    # --- Tirunelveli (loc-tnv) ---
    "plc-manimuthar-falls":   (8.8200, 77.3800),
    "plc-kmtr-tiger":         (8.5500, 77.3500),
    "plc-krishnapuram":       (8.7180, 77.7050),
    "plc-science-centre-tnv": (8.7300, 77.7100),
    "plc-uvari-church":       (8.3500, 78.0300),
    "plc-manjolai":           (8.5700, 77.3000),
    "plc-koonthankulam":      (8.6000, 77.7500),
    "plc-trinity-cathedral":  (8.7200, 77.7350),

    # --- Tenkasi (loc-tks) ---
    "plc-five-falls":         (8.9313, 77.2733),
    "plc-old-courtallam":     (8.9367, 77.2675),
    "plc-kasi-viswanathar":   (8.9600, 77.3130),
    "plc-tiger-falls":        (8.9350, 77.2680),
    "plc-gundar-dam":         (8.9000, 77.3400),
    "plc-shenbaga-falls":     (8.8700, 77.2400),
    "plc-thirumalai-kovil":   (8.9200, 77.2900),
    "plc-ayikudi-balan":      (8.9100, 77.2800),

    # --- Salem (loc-slm) ---
    "plc-ladys-seat":         (11.7678, 78.2109),
    "plc-kottai-mariamman":   (11.6643, 78.1460),
    "plc-kurumbapatti":       (11.6413, 78.2105),
    "plc-1008-shiva":         (11.5900, 78.1800),
    "plc-mettur-park":        (11.7900, 77.8020),

    # --- Vellore (loc-vel) ---
    "plc-golden-temple":      (12.8665, 79.0699),
    "plc-jalakandeswarar":    (12.9215, 79.1327),
    "plc-museum-vellore":     (12.9213, 79.1325),
    "plc-amirthi-zoo":        (12.7785, 79.0834),
    "plc-assumption-church":  (12.9277, 79.1338),
    "plc-mordhana-dam":       (12.7500, 78.6000),
    "plc-vallimalai":         (12.8800, 79.1700),
    "plc-padavedu":           (12.4800, 79.1400),

    # --- Theni (loc-tni) ---
    "plc-kumbakkarai":        (10.2200, 77.4600),
    "plc-chinna-suruli":      (9.8500, 77.4200),
    "plc-kuchanur":           (9.8800, 77.5200),
    "plc-veerapandi":         (10.0000, 77.4800),
}

input_path = "backend/database/datasets/places_2.csv"
with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

updated = 0
for row in rows:
    pid = row["id"]
    if pid in ADDITIONAL_COORDS:
        lat, lng = ADDITIONAL_COORDS[pid]
        row["latitude"] = str(lat)
        row["longitude"] = str(lng)
        updated += 1

with open(input_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("Additional update: Fixed " + str(updated) + " more places")

# Verify - check if any are still using district HQ coords
with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

loc_coords = {}
with open("backend/database/datasets/locations_tn.csv", "r", encoding="utf-8", errors="ignore") as f:
    for row in csv.DictReader(f):
        loc_coords[row["id"]] = (row["latitude"], row["longitude"])

dupes = 0
for row in rows:
    loc_id = row["location_id"]
    if loc_id in loc_coords:
        loc_lat, loc_lng = loc_coords[loc_id]
        if row["latitude"] == loc_lat and row["longitude"] == loc_lng:
            dupes += 1
            print("  STILL SAME AS DISTRICT: " + row["id"] + " | " + row["name"] + " -> lat=" + row["latitude"] + ", lng=" + row["longitude"])

print("Places still using district HQ coords: " + str(dupes))
