"""
Regenerate seed.sql from CSV datasets.
Reads locations_tn.csv, locations_kl.csv, places_1.csv, places_2.csv
and generates a fresh seed.sql with all correct coordinates.
"""
import csv
import os
import re

def escape_sql(val):
    """Escape single quotes for SQL strings."""
    if val is None or val == "":
        return "NULL"
    val = str(val).replace("'", "''").replace("\\", "\\\\")
    return "'" + val + "'"

def escape_text(val):
    """Escape text fields, return NULL for empty."""
    if val is None or val.strip() == "":
        return "NULL"
    val = str(val).replace("'", "''").replace("\\", "\\\\")
    return "'" + val + "'"

def escape_num(val):
    """Return numeric value or NULL."""
    if val is None or str(val).strip() == "":
        return "NULL"
    return str(val).strip()

def read_csv(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        return list(reader)

def main():
    seed_path = os.path.join("backend", "database", "seed.sql")

    # Read all datasets
    locations_tn = read_csv(os.path.join("backend", "database", "datasets", "locations_tn.csv"))
    locations_kl = read_csv(os.path.join("backend", "database", "datasets", "locations_kl.csv"))
    places_1 = read_csv(os.path.join("backend", "database", "datasets", "places_1.csv"))
    places_2 = read_csv(os.path.join("backend", "database", "datasets", "places_2.csv"))

    lines = []
    lines.append("-- =============================================================================")
    lines.append("-- TripNova - Tourism Platform Seed Data")
    lines.append("-- Auto-generated from CSV datasets")
    lines.append("-- =============================================================================")
    lines.append("")
    lines.append("SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;")
    lines.append("SET NAMES utf8mb4;")
    lines.append("")

    # ----- LOCATIONS -----
    lines.append("-- -----------------------------------------------------------------------------")
    lines.append("-- Locations: Tamil Nadu Districts")
    lines.append("-- -----------------------------------------------------------------------------")

    all_locations = locations_tn + locations_kl
    batch_size = 50

    for batch_start in range(0, len(all_locations), batch_size):
        batch = all_locations[batch_start:batch_start + batch_size]
        lines.append("INSERT INTO `locations` (`id`, `name`, `state`, `country`, `currency_code`, `description`, `latitude`, `longitude`, `region`, `created_at`, `updated_at`) VALUES")
        value_lines = []
        for loc in batch:
            vid = escape_sql(loc["id"])
            vname = escape_sql(loc["name"])
            vstate = escape_sql(loc["state"])
            vcountry = escape_sql(loc["country"])
            vcurrency = escape_sql(loc["currency_code"])
            vdesc = escape_text(loc.get("description", ""))
            vlat = escape_num(loc.get("latitude", ""))
            vlng = escape_num(loc.get("longitude", ""))
            vregion = escape_sql(loc.get("region", "Southern"))
            vca = escape_sql(loc.get("created_at", "2026-09-04 00:00:00"))
            vua = escape_sql(loc.get("updated_at", "2026-09-04 00:00:00"))
            value_lines.append("(" + ", ".join([vid, vname, vstate, vcountry, vcurrency, vdesc, vlat, vlng, vregion, vca, vua]) + ")")

        lines.append(",\n".join(value_lines) + ";")
        lines.append("")

    # ----- PLACES -----
    lines.append("-- -----------------------------------------------------------------------------")
    lines.append("-- Places: Tourist Attractions")
    lines.append("-- -----------------------------------------------------------------------------")

    all_places = places_1 + places_2

    # Split into batches of 10 for readability
    batch_size = 10
    for batch_start in range(0, len(all_places), batch_size):
        batch = all_places[batch_start:batch_start + batch_size]
        lines.append("INSERT INTO `places` (`id`, `location_id`, `name`, `category`, `avg_rating`, `review_count`, `entry_fee`, `opening_hours`, `latitude`, `longitude`, `description`, `best_season`, `avg_visit_time`, `transport`, `nearby_hotels`, `nearby_restaurants`, `created_at`, `updated_at`) VALUES")
        value_lines = []
        for plc in batch:
            vid = escape_sql(plc["id"])
            vloc = escape_sql(plc["location_id"])
            vname = escape_sql(plc["name"])
            vcat = escape_sql(plc["category"])
            vrating = escape_num(plc.get("avg_rating", "0"))
            vreview = escape_num(plc.get("review_count", "0"))
            vfee = escape_num(plc.get("entry_fee", "0"))
            vhours = escape_text(plc.get("opening_hours", ""))
            vlat = escape_num(plc.get("latitude", ""))
            vlng = escape_num(plc.get("longitude", ""))
            vdesc = escape_text(plc.get("description", ""))
            vseason = escape_text(plc.get("best_season", ""))
            vvisit = escape_text(plc.get("avg_visit_time", ""))
            vtrans = escape_text(plc.get("transport", ""))
            vhotels = escape_text(plc.get("nearby_hotels", ""))
            vrest = escape_text(plc.get("nearby_restaurants", ""))
            vca = escape_sql(plc.get("created_at", "2026-09-04 00:00:00"))
            vua = escape_sql(plc.get("updated_at", "2026-09-04 00:00:00"))
            value_lines.append("(" + ", ".join([vid, vloc, vname, vcat, vrating, vreview, vfee, vhours, vlat, vlng, vdesc, vseason, vvisit, vtrans, vhotels, vrest, vca, vua]) + ")")

        lines.append(",\n".join(value_lines) + ";")
        lines.append("")

    lines.append("-- -----------------------------------------------------------------------------")
    lines.append("-- Restore FK checks")
    lines.append("-- -----------------------------------------------------------------------------")
    lines.append("SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;")
    lines.append("")

    with open(seed_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("seed.sql regenerated successfully!")
    print("  Locations: " + str(len(all_locations)))
    print("  Places: " + str(len(all_places)))

if __name__ == "__main__":
    main()
