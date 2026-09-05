# 🌍 TripNova — Smart AI Travel Companion & Tourist Safety Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TypeScript-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20MySQL%20(1%2C417%20Spots)-orange?logo=sqlite)](https://www.sqlite.org/)
[![Coverage](https://img.shields.io/badge/Coverage-36%20States%20%26%20UTs%20Across%20India-success)](#-database--dataset-support)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**TripNova** is a modern, high-performance web and API platform designed for tourist safety, smart AI trip planning, anti-scam fare estimation, real-time multi-language voice translation, all-India spots discovery (1,417+ attractions), and digital emergency tourist passes.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Quick Start Guide (Run Locally)](#-quick-start-guide-run-locally)
  - [Prerequisites](#prerequisites)
  - [1. Running the Frontend (React + Vite)](#1-running-the-frontend-react--vite)
  - [2. Running the Backend API Server (Node.js + Express)](#2-running-the-backend-api-server-nodejs--express)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📡 API Overview](#-api-overview)
- [🗄️ Database & Master Dataset](#️-database--master-dataset)
- [📦 Production Build](#-production-build)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features

- 🗺️ **Smart Tourist Dashboard**: Live destination weather, SOS emergency triggers, verified safety zones, and curated destination guides.
- 📍 **Interactive Spots & Destination Explorer**: Real-time hierarchical search (Country ➔ State ➔ District ➔ Spot) across **1,417+ verified attractions** across all 36 Indian States and Union Territories with entry fees, timings, coordinates, Google Map integration, and travel ratings.
- 🗣️ **26-Language Smart Voice & Text Translator**: Real-time translation across 10 Indian and 16 Global languages with Speech-to-Text (STT) and crystal-clear audio broadcast (TTS).
- 📻 **Two-Way Walkie-Talkie Mode**: Speak-and-translate live conversation between tourist and local residents.
- 🛡️ **Anti-Scam Fare Guard**: Distance calculator, official government rates vs. quoted price scam meter, and regional bargaining phrases.
- 🪪 **Digital Emergency Tourist Pass**: Vital health data, blood group, emergency contacts, and one-tap emergency audio broadcasting.
- 📅 **AI Smart Trip Planner**: Budget estimator, duration planner, packing checklist, and customized itineraries.
- 👤 **Profile Management**: Profile creation, view & edit, multi-tier geolocation engine, and registration management.

---

## 🏗️ System Architecture

```text
TripNova/
├── src/                      # Frontend Application (React 18 + TypeScript + Vite)
│   ├── components/           # UI Components (SpotsExplorer, Translator, Pass, Emergency, etc.)
│   ├── data/                 # Static fallbacks and local datasets
│   ├── utils/                # API client, storage helpers, geolocation & audio engine
│   ├── App.tsx               # Main application layout and view switcher
│   └── main.tsx              # React DOM entrypoint
├── backend/                  # Backend API Server (Node.js + Express)
│   ├── config/               # Database connection (SQLite zero-config + MySQL)
│   ├── database/             # Schema, seed.sql (1,417 spots), and raw CSV/XLSX datasets
│   ├── middleware/           # API Key authentication middleware
│   ├── routes/               # API endpoints (locations, places, auth, trips, safety, ai)
│   ├── scripts/              # Dataset sync & coordinate fix scripts
│   └── server.js             # Express application entrypoint
├── package.json              # Frontend dependencies and scripts
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start Guide (Run Locally)

### Prerequisites
Make sure you have **Node.js** (v18.0 or higher) and **npm** installed:
- [Download Node.js](https://nodejs.org/)

---

### 1. Running the Frontend (React + Vite)

Open a terminal in the project root directory:

```bash
# 1. Install frontend dependencies
npm install

# 2. Start Vite dev server
npm run dev
```

The frontend will start at: **`http://localhost:5173/`**

---

### 2. Running the Backend API Server (Node.js + Express)

Open a **second terminal window** and run:

```bash
# 1. Navigate into the backend directory
cd backend

# 2. Install backend dependencies
npm install

# 3. Start the Express API server
node server.js
```

The backend server will start at: **`http://localhost:5000/`**

> **Note:** On startup, the backend automatically connects to SQLite (`tripnova.db`) or MySQL and synchronizes **229 destination districts** and **1,417 tourist places** with complete coordinates and metadata!

---

## ⚙️ Environment Configuration

The backend uses a `.env` configuration file. A template is provided at [`backend/.env.example`](backend/.env.example).

To customize backend settings:
```bash
cd backend
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
| `POST` | `/api/trips/plan` | Generate AI-assisted trip itineraries |
| `POST` | `/api/ai/chat` | AI travel assistant query endpoint |

> **Authentication:** Secure endpoints accept API keys via header `x-api-key: tripnova_live_api_key_2026` or `Authorization: Bearer <API_KEY>`.

---

## 🗄️ Database & Master Dataset

TripNova supports zero-configuration local **SQLite** (`tripnova.db`) out-of-the-box as well as **MySQL** for cloud production deployment:
- **Comprehensive Master Dataset**: Pre-loaded with **229 destination districts** and **1,417 tourist attractions** across all 36 Indian States and Union Territories.
- **Data Attributes Included**: Exact coordinates (latitude/longitude), Google Maps URLs, categories, average ratings, visit times, best travel seasons, nearby hotel/restaurant recommendations, and local transit advice.
- **Dataset Re-Synchronization**:
  ```bash
  python backend/scripts/syncDatasets.py
  ```

---

## 📦 Production Build

To build the frontend for production deployment:

```bash
npm run build
```
The optimized static bundle will be generated in the `dist/` directory, ready to be deployed to Vercel, Netlify, Cloudflare Pages, or an Nginx/Express server.

---

## 🤝 Contributing & License
Distributed under the **MIT License**. Created with ❤️ for tourist safety and smart tourism.
