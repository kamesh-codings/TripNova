import urllib.request
import json

test_ids = [
    'plc-covelong-beach',
    'plc-adventure-sports-at-covelong-bea',
    'plc-scuba-diving-at-covelong-beach',
    'plc-dakshinachitra',
    'plc-dakshinachitra-museum',
    'plc-muttukadu',
    'plc-water-activities-at-muttukadu',
    'plc-egmore-museum',
    'plc-national-art-gallery',
    'plc-connemara-library',
    'plc-marina-beach',
    'plc-barracuda-bayfishing',
    'plc-mahabalipuram'
]

print("=== VERIFYING EXACT SAME LINKS FOR CONSTANT CHENNAI PLACES VIA API ===")
for pid in test_ids:
    url = f"http://localhost:5000/api/places/{pid}"
    req = urllib.request.Request(url)
    req.add_header('x-api-key', 'tripnova_live_api_key_2026')
    try:
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read().decode('utf-8'))
        p = data.get('data', {})
        print(f"  {pid:<36} | {p.get('name'):<35} | {p.get('map_url')}")
    except Exception as e:
        print(f"  {pid}: Error {e}")
