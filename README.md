# 🌍 TripNova — Smart AI Travel Companion & Tourist Safety Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TypeScript-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20MySQL%20(1%2C417%20Spots)-orange?logo=sqlite)](https://www.sqlite.org/)
[![Coverage](https://img.shields.io/badge/Coverage-36%20States%20%26%20UTs%20Across%20India-success)](#-database--master-dataset)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**TripNova** is a modern, high-performance web platform designed for tourist safety, smart AI trip planning, anti-scam fare estimation, real-time multi-language voice translation, all-India destination discovery (1,417+ verified attractions), and digital emergency tourist passes.

---

## ⚡ How to Open & Run This Webpage (For New Users from GitHub ZIP)

If you just downloaded the project as a **ZIP file** from GitHub, follow these simple steps to run the complete webpage and backend on your computer:

---

### 📋 Prerequisites (One-Time Setup)

Make sure you have **Node.js** installed on your computer.
- Download & install **Node.js (v18 or higher)** from [https://nodejs.org/](https://nodejs.org/)
- *Node.js comes bundled with `npm` automatically.*

---

### 📥 Step 1: Download & Extract the ZIP

1. On GitHub, click the green **Code** button and select **Download ZIP**.
2. Locate the downloaded file (usually named `TripNova-main.zip` in your `Downloads` folder).
3. **Extract / Unzip** the file:
   - **Windows**: Right-click the `.zip` file ➔ click **Extract All...** ➔ Choose a destination folder and click **Extract**.
   - **Mac / Linux**: Double-click the `.zip` file or run `unzip TripNova-main.zip`.
4. Open the extracted **`TripNova`** (or `TripNova-main`) folder.

---

### 🖥️ Step 2: Open Terminal / Command Prompt in the Folder

- **Windows**: Inside the extracted folder, click on the address bar at the top, type `cmd` or `powershell`, and press **Enter** (or open the folder in VS Code and press `Ctrl + ~` to open the integrated terminal).
- **Mac / Linux**: Right-click the folder and choose **Open in Terminal** (or `cd path/to/TripNova`).

---

### 🚀 Step 3: Start the Frontend (Web Page)

In your terminal, run the following commands:

```bash
# 1. Install frontend packages (takes ~10-20 seconds on first run)
npm install

# 2. Start the local web development server
npm run dev
```

You will see output similar to:
```text
  VITE v6.x.x  ready in 450 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

👉 **Open your browser (Chrome, Edge, Safari, Firefox) and go to:**  
### **[http://localhost:5173/](http://localhost:5173/)**

---

### 🔌 Step 4: Start the Backend Server (For Database, AI, SOS & Registration)

TripNova includes a zero-configuration SQLite backend loaded with **1,417 tourist spots and all 36 Indian States/UTs**.

1. Open a **second terminal / command prompt window**.
2. Navigate into the `backend` folder and start the server:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install backend dependencies (first time only)
npm install

# 3. Start the backend API server
node server.js
```

You will see:
```text
🚀 TripNova API Server running on port 5000
   URL: http://localhost:5000
   Database: SQLite (Loaded 229 locations & 1417 spots)
```

The frontend will automatically connect to the backend at `http://localhost:5000/api`.

---

## 🎯 Quick Usage Tips for Viewers

- **Explore Mode**: You can immediately browse tourist spots, use the 26-language voice translator, calculate fair taxi fares, and test the AI planner without creating an account.
- **Registration**: Click **Register as Tourist** or **Guest Explore** to access the digital Tourist Emergency Pass and SOS broadcasts.
- **Microphone & Voice**: Click the 🎙️ **Voice** buttons on search bars, translator, or distress notes to speak in your native language (allow microphone access when prompted by your browser).
- **Live Location & Maps**: Click **View on Maps** or type any landmark to instantly view the exact spot on Google Maps.

---

## 📑 Table of Contents
- [⚡ How to Open & Run (GitHub ZIP)](#-how-to-open--run-this-webpage-for-new-users-from-github-zip)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📡 API Overview](#-api-overview)
- [🗄️ Database & Master Dataset](#️-database--master-dataset)
- [📦 Production Build](#-production-build)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features

- 🗺️ **Smart Tourist Dashboard**: Real-time GPS location lock, dynamic Google Maps navigation, weather updates, safety zone badges, and local guide highlights.
- 📍 **Interactive Spots & Destination Explorer**: Hierarchical search (State ➔ District ➔ Spot) across **1,417+ verified attractions** across all 36 Indian States and Union Territories with entry fees, timings, coordinates, Google Map integration, and travel ratings.
- 🗣️ **26-Language Smart Voice & Text Translator**: Real-time translation across 10 Indian and 16 Global languages with Speech-to-Text (STT) and crystal-clear audio broadcast (TTS).
- 📻 **Two-Way Walkie-Talkie Mode**: Speak-and-translate live conversation between tourist and local residents.
- 🛡️ **Anti-Scam Fare Guard**: Distance calculator, official government rates vs. quoted price scam meter, and regional bargaining phrases.
- 🪪 **Digital Emergency Tourist Pass**: Vital health data, blood group, emergency contacts, and one-tap emergency audio broadcasting.
- 🚨 **Emergency SOS System**: Instant email distress alerts with exact location links, custom voice notes, and direct contact dispatch.
- 📅 **AI Smart Trip Planner**: Budget estimator, duration planner, packing checklist, and customized itineraries.
- 👤 **Flexible Authentication**: Log in with either email or username and password, with persistent guest mode support.

---

## 🏗️ System Architecture

```text
TripNova/
├── src/                      # Frontend Application (React 18 + TypeScript + Vite)
│   ├── components/           # UI Components (Dashboard, SpotsExplorer, Translator, Pass, SOS, etc.)
│   ├── data/                 # Static fallbacks, mock data & regional datasets
│   ├── utils/                # API client, storage helpers, geolocation & speech engine
│   ├── App.tsx               # Main application layout and tab navigation
│   └── main.tsx              # React DOM entrypoint
├── backend/                  # Backend API Server (Node.js + Express)
│   ├── config/               # Database connection (SQLite zero-config + MySQL)
│   ├── database/             # Schema, seed.sql (1,417 spots), and raw CSV/XLSX datasets
│   ├── middleware/           # API Key authentication & validation middleware
│   ├── routes/               # API endpoints (locations, places, auth, trips, safety, ai, sos)
│   ├── scripts/              # Dataset sync & coordinate verification scripts
│   └── server.js             # Express application entrypoint
├── package.json              # Frontend dependencies and scripts
└── README.md                 # Project documentation
```

---

## ⚙️ Environment Configuration

The backend uses an optional `.env` file for custom ports and database connections. A template is provided at [`backend/.env.example`](backend/.env.example).

To customize backend settings:
```bash
cd backend
# Windows: copy .env.example .env
# Mac/Linux:
cp .env.example .env
```

Default settings in `.env`:
```env
# Server Port
PORT=5000

# API Security Keys
API_KEY=tripnova_live_api_key_2026
CLIENT_API_KEY=tripnova_client_key_9921
ALLOWED_API_KEYS=tripnova_live_api_key_2026,tripnova_client_key_9921,demo_key_tripnova

# Database Configuration (supports 'sqlite' or 'mysql')
DB_TYPE=sqlite
DB_FILE=./database/tripnova.db
```

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health, database connectivity status, and loaded record counts |
| `GET` | `/api/locations` | List all 229 destination districts across India |
| `GET` | `/api/locations/:id` | Get details for a specific location |
| `GET` | `/api/places` | Query 1,417+ tourist spots with filters (`?state=`, `?category=`, `?search=`, `?limit=`) |
| `GET` | `/api/places/:id` | Get detailed spot information, entry fees, coordinates, and timings |
| `GET` | `/api/safety/contacts` | Emergency helpline numbers & police contacts by location |
| `GET` | `/api/safety/rules` | Cultural etiquette, rules, and precautions by location |
| `POST` | `/api/auth/register-tourist` | Tourist profile registration |
| `POST` | `/api/auth/login` | Tourist login via email/username & password |
| `POST` | `/api/sos/send-email` | Dispatch emergency SOS distress email to contacts |
| `POST` | `/api/trips/plan` | Generate AI-assisted trip itineraries |
| `POST` | `/api/ai/chat` | AI travel assistant query endpoint |

> **Authentication:** Secure endpoints accept API keys via header `x-api-key: tripnova_live_api_key_2026` or `Authorization: Bearer <API_KEY>`.

---

## 🗄️ Database & Master Dataset

TripNova includes an automated local **SQLite** (`tripnova.db`) database pre-configured out-of-the-box:
- **Coverage**: **229 destination districts** and **1,417 tourist attractions** across all 36 Indian States and Union Territories.
- **Attributes Included**: Accurate latitude/longitude coordinates, Google Maps navigation links, category classification, ticket entry fees, visiting hours, best seasons, nearby food/stay recommendations, and local transportation guidelines.
- **Re-Syncing Datasets** (Optional):
  ```bash
  python backend/scripts/syncDatasets.py
  ```

---

## 📦 Production Build

To compile and optimize the frontend for production hosting:

```bash
npm run build
```
The production bundle will be generated in the `dist/` directory, ready to deploy to Vercel, Netlify, Render, GitHub Pages, or an Nginx web server.

---

## 🤝 Contributing & License
Distributed under the **MIT License**. Created with ❤️ for tourist safety, smart exploration, and frictionless travel.
