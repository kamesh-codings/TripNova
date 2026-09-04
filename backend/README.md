# ⚙️ TripNova Backend API Documentation

The backend service for the **TripNova Tourism Platform & Tourist Safety System** is built with **Node.js**, **Express**, and **SQLite / MySQL**.

---

## 🚀 Getting Started

### 1. Install Dependencies
From the `backend/` directory:
```powershell
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env`:
```powershell
cp .env.example .env
```

Key environment variables:
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port on which the API server runs |
| `API_KEY` | `tripnova_live_api_key_2026` | Master API Key for secure routes |
| `CLIENT_API_KEY` | `tripnova_client_key_9921` | Client Key for frontend requests |
| `DB_TYPE` | `sqlite` | Database engine (`sqlite` or `mysql`) |
| `DB_FILE` | `./database/tripnova.db` | SQLite database file location |

---

### 3. Run the Backend Server
```powershell
# Development / Normal start
npm run dev

# Or
npm start
```

The server will automatically:
1. Initialize the SQLite database at `backend/database/tripnova.db`.
2. Create required tables (`users`, `locations`, `places`, `trips`, `emergency_contacts`, `safety_alerts`).
3. Seed the tables from SQL files and CSV datasets (`places_1.csv`, `places_2.csv`, `locations_tn.csv`, `locations_kl.csv`).

---

## 📡 API Endpoints

### 1. Public & Health Checks
- `GET /` — API service info & list of endpoints
- `GET /api/health` — Returns server uptime and database record counts

### 2. Locations & Destinations
- `GET /api/locations` — Get all tourist destination districts
- `GET /api/locations/:id` — Get details of a single destination

### 3. Places & Tourist Spots
- `GET /api/places` — Query places with optional filters:
  - `?state=Tamil Nadu`
  - `?category=heritage|nature|beach|temple`
  - `?search=Ooty`
- `GET /api/places/:id` — Get specific place details, entry fees, timings, and coordinates

### 4. Safety & Emergency Services
- `GET /api/safety/contacts` — Emergency helpline numbers & police station contacts
- `GET /api/safety/alerts` — Active travel safety advisories

### 5. Trips & AI Assistant
- `POST /api/trips/plan` — Create or calculate trip plans
- `POST /api/ai/chat` — AI Travel assistant endpoint

---

## 🔐 Authentication
Protected endpoints accept authentication via:
- **HTTP Header**: `x-api-key: tripnova_live_api_key_2026`
- **Bearer Token**: `Authorization: Bearer tripnova_live_api_key_2026`
- **Query Parameter**: `?api_key=tripnova_live_api_key_2026`
