"""
Fix coordinates for places_2.csv and locations_kl.csv
Updates each place with its actual Google Maps coordinates instead of
using the district headquarters' coordinates.
Also adds latitude/longitude columns to locations_kl.csv.
"""
import csv
import os

# =============================================================================
# Actual Google Maps coordinates for each place in places_2.csv
# Format: place_id -> (latitude, longitude)
# =============================================================================
PLACES_2_COORDS = {
    # --- Chengalpattu (loc-cgl) ---
    "plc-shore-temple":        (12.6168, 80.1993),
    "plc-pancha-rathas":       (12.6109, 80.1933),
    "plc-arjunas-penance":     (12.6162, 80.1927),
    "plc-krishnas-butterball": (12.6154, 80.1937),
    "plc-mamallapuram-lh":     (12.6175, 80.1991),
    "plc-tiger-cave":          (12.5719, 80.1934),
    "plc-crocodile-park-mml":  (12.7800, 80.2390),
    "plc-vedanthangal":        (12.5466, 79.8541),
    "plc-muttukadu-chgl":      (12.8227, 80.2419),
    "plc-koovathur":           (12.4973, 80.1667),

    # --- Kanchipuram (loc-kpm) ---
    "plc-kailasanathar":       (12.8459, 79.6999),
    "plc-ekambareswarar":      (12.8491, 79.7003),
    "plc-varadharaja":         (12.8338, 79.7149),
    "plc-kamakshi-amman":      (12.8418, 79.7047),
    "plc-kanchi-kudil":        (12.8401, 79.7049),
    "plc-silk-centre":         (12.8342, 79.7036),
    "plc-vedanthangal-kpm":    (12.5466, 79.8541),
    "plc-ulagalanda":          (12.8310, 79.6966),
    "plc-pandava-dootha":      (12.8470, 79.7004),
    "plc-jain-kanchi":         (12.8450, 79.7010),

    # --- Tiruvannamalai (loc-tvm) ---
    "plc-annamalaiyar":        (12.2314, 79.0684),
    "plc-girivalam":           (12.2300, 79.0700),
    "plc-virupaksha-cave":     (12.2361, 79.0612),
    "plc-skanda-ashram":       (12.2375, 79.0622),
    "plc-ramanasramam":        (12.2130, 79.0625),
    "plc-sathanur-dam":        (12.2345, 78.8722),
    "plc-javadu-hills":        (12.2500, 78.8300),
    "plc-parvathamalai":       (12.3100, 79.0700),
    "plc-arunachalesvara-car": (12.2314, 79.0684),
    "plc-yogi-ram-surat":      (12.2130, 79.0625),

    # --- Vellore (loc-vel) ---
    "plc-vellore-fort":        (12.9213, 79.1325),
    "plc-jalakandeshwarar":    (12.9215, 79.1327),
    "plc-golden-temple-vel":   (12.8665, 79.0699),
    "plc-amirthi-zoological":  (12.7785, 79.0834),
    "plc-yelagiri-hills":      (12.5795, 78.6346),
    "plc-punganur-lake":       (12.5800, 78.6380),
    "plc-jalakandeswarar-museum": (12.9213, 79.1325),
    "plc-assumption-cathedral": (12.9277, 79.1338),
    "plc-virinjipuram":        (12.9561, 79.1517),
    "plc-rathinagiri-hill":    (12.9250, 79.1400),

    # --- Nilgiris (loc-nlg) ---
    "plc-ooty-lake":           (11.4096, 76.6951),
    "plc-botanical-garden":    (11.4147, 76.7057),
    "plc-doddabetta":          (11.4020, 76.7358),
    "plc-nilgiri-mountain":    (11.3421, 76.7950),
    "plc-sim-park":            (11.3479, 76.7990),
    "plc-dolphin-nose":        (11.3375, 76.7900),
    "plc-pykara-falls":        (11.4585, 76.6020),
    "plc-rose-garden-ooty":    (11.4100, 76.7100),
    "plc-stone-house":         (11.4130, 76.6990),
    "plc-toda-village":        (11.4200, 76.7200),

    # --- Salem (loc-slm) ---
    "plc-yercaud-lake":        (11.7770, 78.2060),
    "plc-lady-seat":           (11.7678, 78.2109),
    "plc-kiliyur-falls":       (11.7840, 78.2340),
    "plc-pagoda-point":        (11.7700, 78.2100),
    "plc-shevaroy-temple":     (11.7960, 78.2200),
    "plc-mettur-dam":          (11.7900, 77.8020),
    "plc-sugavaneswarar":      (11.6643, 78.1460),
    "plc-kurumbapatti-zoological": (11.6413, 78.2105),
    "plc-sankagiri-fort":      (11.4700, 77.8672),
    "plc-salem-steel-plant":   (11.6500, 78.2200),

    # --- Tiruchirappalli (loc-try) ---
    "plc-rockfort":            (10.8050, 78.6968),
    "plc-srirangam":           (10.8625, 78.6869),
    "plc-jambukeswarar":       (10.8558, 78.7056),
    "plc-mukkombu":            (10.8880, 78.7670),
    "plc-kallanai-try":        (10.8350, 78.8250),
    "plc-puliyancholai":       (10.9625, 78.5070),
    "plc-samayapuram":         (10.8700, 78.7267),
    "plc-thiruverumbur":       (10.7683, 78.7142),
    "plc-lourdes-church":      (10.7960, 78.6830),
    "plc-uraiyur-temple":      (10.7900, 78.7150),

    # --- Dindigul (loc-dgl) ---
    "plc-kodaikanal-lake":     (10.2340, 77.4907),
    "plc-pillar-rocks":        (10.2125, 77.4703),
    "plc-coakers-walk":        (10.2286, 77.4903),
    "plc-bryants-park":        (10.2310, 77.4930),
    "plc-berijam-lake":        (10.2075, 77.4380),
    "plc-dindigul-fort":       (10.3750, 77.9650),
    "plc-thadicombu-perumal":  (10.3500, 77.9400),
    "plc-sirumalai-hills":     (10.2800, 78.0100),
    "plc-palani-murugan":      (10.4385, 77.5162),
    "plc-silver-cascade":      (10.2400, 77.4800),

    # --- Kanyakumari (loc-kkm) ---
    "plc-vivekananda-rock":    (8.0783,  77.5536),
    "plc-thiruvalluvar-statue":(8.0780,  77.5520),
    "plc-kanyakumari-temple":  (8.0784,  77.5504),
    "plc-sunset-point-kkm":    (8.0810,  77.5460),
    "plc-gandhi-mandapam":     (8.0772,  77.5524),
    "plc-padmanabhapuram":     (8.2424,  77.3270),
    "plc-thirparappu-falls":   (8.3000,  77.2750),
    "plc-mathoor-aqueduct":    (8.4000,  77.3700),
    "plc-baywatch-beach-kkm":  (8.0820,  77.5500),
    "plc-wax-museum-kkm":      (8.0790,  77.5490),

    # --- Ramanathapuram (loc-rmd) ---
    "plc-ramanathaswamy":      (9.2885,  79.3173),
    "plc-dhanushkodi":         (9.1720,  79.4162),
    "plc-agni-theertham":      (9.2878,  79.3198),
    "plc-pamban-bridge":       (9.2787,  79.2143),
    "plc-kalam-memorial":      (9.2809,  79.2310),
    "plc-ariyaman-beach":      (9.2680,  79.2180),
    "plc-gandhamadana":        (9.2900,  79.3120),
    "plc-vilundy-theertham":   (9.2500,  79.3050),
    "plc-kothanda-ramar":      (9.2100,  79.3800),
    "plc-nambu-nayagiamman":   (9.3640,  78.8400),

    # --- Tenkasi (loc-tks) ---
    "plc-courtallam-main":     (8.9313,  77.2733),
    "plc-courtallam-old":      (8.9367,  77.2675),
    "plc-courtallam-peraruvi": (8.9280,  77.2700),
    "plc-kasiviswanathar":     (8.9600,  77.3130),
    "plc-manimuthar-dam":      (8.8200,  77.3800),
    "plc-shenbaga-devi":       (8.8700,  77.2400),
    "plc-aintharuvi":          (8.9380,  77.2650),
    "plc-honey-falls":         (8.9320,  77.2740),
    "plc-agasthiyar-falls":    (8.6600,  77.3000),
    "plc-papanasam-dam":       (8.6800,  77.3200),

    # --- Tirunelveli (loc-tnv) ---
    "plc-nellaiappar":         (8.7219,  77.7069),
    "plc-krishnapuram-palace": (8.7180,  77.7050),
    "plc-mukkoodal-beach":     (8.5000,  78.0000),
    "plc-courtallam-tnv":      (8.9313,  77.2733),
    "plc-kalakkad-mundanthurai":(8.5500, 77.3500),
    "plc-sothavilai-beach":    (8.2000,  77.5000),
    "plc-mandapam-temple":     (8.7300,  77.7100),
    "plc-thamirabarani-origin":(8.6900,  77.4000),
    "plc-ambasamudram-falls":  (8.7100,  77.4500),
    "plc-sankar-nagar-dam":    (8.8500,  77.4000),

    # --- Theni (loc-tni) ---
    "plc-meghamalai":          (9.6250,  77.4400),
    "plc-suruli-falls":        (9.8100,  77.4500),
    "plc-vaigai-dam-theni":    (10.0167, 77.6000),
    "plc-kambam-valley":       (9.7500,  77.2800),
    "plc-sothuparai":          (10.0500, 77.5600),
    "plc-kurangani":           (9.6400,  77.3500),
    "plc-mavoothu":            (10.0000, 77.5000),
    "plc-shanmuganathi":       (10.0300, 77.4900),

    # --- Cuddalore (loc-cud) ---
    "plc-pichavaram":          (11.4200, 79.7700),
    "plc-chidambaram-temple":  (11.3994, 79.6937),
    "plc-silver-beach":        (11.7400, 79.7600),
    "plc-padaleeswarar":       (11.7280, 79.7540),
    "plc-veeranam-lake":       (11.3500, 79.5700),
    "plc-vada-lour-sabai":     (11.5182, 79.5722),
    "plc-bhuvanagiri":         (11.4469, 79.6501),
    "plc-devanatha-perumal":   (11.3500, 79.7300),
    "plc-srimushnam":          (11.4000, 79.4000),
    "plc-fort-st-david":       (11.7500, 79.7650),

    # --- Sivaganga (loc-svg) ---
    "plc-chettinad-palace":    (10.1700, 78.7800),
    "plc-athangudi-palace":    (10.1573, 78.8016),
    "plc-pillayarpatti":       (10.1200, 78.6600),
    "plc-kundrakudi":          (10.0200, 78.6700),
    "plc-vairavanpatti":       (10.0800, 78.7000),
    "plc-thirumayam-fort":     (10.2408, 78.7481),
    "plc-thousand-windows":    (10.1700, 78.7750),
    "plc-ariyakudi":           (10.1300, 78.8200),
    "plc-kollangudi":          (10.0500, 78.7200),
    "plc-vettangudi":          (10.1000, 78.6000),

    # --- Mayiladuthurai (loc-myd) ---
    "plc-fort-dansborg":       (11.0290, 79.8504),
    "plc-danish-museum":       (11.0285, 79.8500),
    "plc-tranquebar-beach":    (11.0267, 79.8517),
    "plc-new-jerusalem":       (11.0280, 79.8490),
    "plc-mayuranathar":        (11.1035, 79.6547),
    "plc-vaitheeswaran":       (11.2327, 79.6539),
    "plc-thirukadaiyur":       (11.0500, 79.7800),
    "plc-poompuhar-beach":     (11.2400, 79.8600),
    "plc-sirkazhi-temple":     (11.2367, 79.7347),
    "plc-thirumanancheri":     (11.0700, 79.7000),

    # --- Nagapattinam (loc-ngp) ---
    "plc-velankanni-church":   (10.6830, 79.8387),
    "plc-velankanni-beach":    (10.6800, 79.8410),
    "plc-nagore-dargah":       (10.8229, 79.8412),
    "plc-point-calimere":      (10.2947, 79.8652),
    "plc-calimere-lighthouse": (10.2947, 79.8652),
    "plc-kayarohanaswami":     (10.7650, 79.8480),
    "plc-soundararaja":        (10.7700, 79.8300),
    "plc-sikkal-singaravelan": (10.8550, 79.7600),
    "plc-nagapattinam-beach":  (10.7672, 79.8449),
    "plc-kodiakkarai-beach":   (10.2900, 79.8700),

    # --- Thoothukudi (loc-tut) ---
    "plc-tiruchendur":         (8.4936,  78.1505),
    "plc-tiruchendur-beach":   (8.4942,  78.1522),
    "plc-snows-basilica":      (8.7642,  78.1348),
    "plc-hare-island":         (8.7600,  78.1700),
    "plc-manapad-church":      (8.3655,  78.2006),
    "plc-kulasekharapatnam":   (8.3800,  78.0800),
    "plc-kattabomman-fort":    (8.6200,  77.8900),
    "plc-kalugumalai":         (9.1545,  77.7088),
    "plc-korkai-site":         (8.5700,  78.0800),
    "plc-kayathar-memorial":   (8.9500,  77.7800),

    # --- Dharmapuri (loc-dpi) ---
    "plc-hogenakkal-falls":    (12.1152, 77.7777),
    "plc-hogenakkal-boat":     (12.1152, 77.7777),
    "plc-theerthamalai":       (12.1500, 78.2300),
    "plc-kottai-kovil-dpi":    (12.1300, 78.1600),
    "plc-vathalmalai":         (12.2400, 78.4300),
    "plc-shiva-memorial":      (12.1100, 78.1700),
    "plc-nagavathi-dam":       (12.0900, 78.2400),
    "plc-thoppur-temple":      (12.0500, 78.0600),
    "plc-adhiyamankottai":     (12.1277, 78.1580),
    "plc-hanumanthathirtham":  (12.1000, 77.7800),

    # --- Erode (loc-erd) ---
    "plc-bhavani-sangam":      (11.4455, 77.6826),
    "plc-kodiveri-dam":        (11.5597, 77.5428),
    "plc-thindal-murugan":     (11.3494, 77.7033),
    "plc-chennimalai":         (11.1700, 77.6100),
    "plc-vellode-birds":       (11.3400, 77.7500),
    "plc-bhavanisagar-dam":    (11.4500, 77.1000),
    "plc-museum-erode":        (11.3410, 77.7172),
    "plc-periyar-memorial":    (11.3472, 77.7264),
    "plc-brough-church":       (11.3450, 77.7200),
    "plc-kodumudi":            (11.0700, 77.8800),
}

# =============================================================================
# Actual Google Maps coordinates for Kerala districts (locations_kl.csv)
# =============================================================================
KERALA_LOCATIONS = {
    "loc-trv": (8.5241,  76.9366),
    "loc-klm": (8.8932,  76.6141),
    "loc-pta": (9.2648,  76.7870),
    "loc-alp": (9.4981,  76.3388),
    "loc-ktm": (9.5916,  76.5222),
    "loc-idk": (9.8528,  76.9710),
    "loc-ekm": (9.9816,  76.2999),
    "loc-tsr": (10.5276, 76.2144),
    "loc-pkd": (10.7867, 76.6548),
    "loc-mlp": (11.0510, 76.0711),
    "loc-kkd": (11.2588, 75.7804),
    "loc-wyd": (11.6854, 76.1320),
    "loc-knr": (11.8745, 75.3704),
    "loc-ksd": (12.4996, 74.9869),
}


def fix_places_2():
    """Fix coordinates in places_2.csv"""
    input_path = os.path.join("backend", "database", "datasets", "places_2.csv")

    with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    updated = 0
    not_found = []
    for row in rows:
        pid = row["id"]
        if pid in PLACES_2_COORDS:
            lat, lng = PLACES_2_COORDS[pid]
            row["latitude"] = str(lat)
            row["longitude"] = str(lng)
            updated += 1
        else:
            not_found.append(pid)

    with open(input_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"places_2.csv: Updated {updated}/{len(rows)} places")
    if not_found:
        print(f"  NOT FOUND in coordinate map: {not_found}")


def fix_locations_kl():
    """Add latitude/longitude columns to locations_kl.csv"""
    input_path = os.path.join("backend", "database", "datasets", "locations_kl.csv")

    with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    # Add latitude, longitude, region columns if missing
    new_fieldnames = list(fieldnames)
    if "latitude" not in new_fieldnames:
        idx = new_fieldnames.index("description") + 1
        new_fieldnames.insert(idx, "latitude")
        new_fieldnames.insert(idx + 1, "longitude")
    if "region" not in new_fieldnames:
        idx_lat = new_fieldnames.index("longitude") + 1
        new_fieldnames.insert(idx_lat, "region")

    updated = 0
    for row in rows:
        lid = row["id"]
        if lid in KERALA_LOCATIONS:
            lat, lng = KERALA_LOCATIONS[lid]
            row["latitude"] = str(lat)
            row["longitude"] = str(lng)
            row["region"] = "Southern"
            updated += 1

    with open(input_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=new_fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"locations_kl.csv: Updated {updated}/{len(rows)} locations (added lat/lng/region)")


if __name__ == "__main__":
    fix_places_2()
    fix_locations_kl()
    print("\nDone! All coordinates updated.")
