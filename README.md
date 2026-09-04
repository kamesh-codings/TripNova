# 🌍 TripNova — Smart AI Travel Companion & Tourist Safety Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TypeScript-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20MySQL-orange?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**TripNova** is a modern, high-performance web and API platform designed for tourist safety, smart AI trip planning, anti-scam fare estimation, real-time multi-language voice translation, spots discovery, and digital emergency tourist passes.

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
- [🗄️ Database & Dataset Support](#️-database--dataset-support)
- [📦 Production Build](#-production-build)

---

## ✨ Key Features

- 🗺️ **Smart Tourist Dashboard**: Live destination weather, SOS emergency trigger, verified safety zones, and curated destination guides.
- 📍 **Interactive Spots & Places Explorer**: Real-time search and filter across curated tourist spots, cultural heritage sites, hill stations, and nature reserves with entry fees, timings, and ratings.
- 🗣️ **26-Language Smart Voice & Text Translator**: Real-time translation across 10 Indian and 16 Global languages with Speech-to-Text (STT) and crystal-clear audio broadcast (TTS).
- 📻 **Two-Way Walkie-Talkie Mode**: Speak-and-translate live conversation between tourist and local resident.
- 🛡️ **Anti-Scam Fare Guard**: Distance calculator, official government rates vs. quoted price scam meter, and regional bargaining phrases.
- 🪪 **Digital Emergency Tourist Pass**: Vital health data, blood group, emergency contacts, and one-tap emergency audio broadcasting.
- 📅 **AI Smart Trip Planner**: Budget estimator, duration planner, packing checklist, and customized itineraries.
- 👤 **Profile Management**: Profile creation, view & edit, and tourist pass management.

---

## 🏗️ System Architecture

```text
TripNova/
├── src/                      # Frontend Application (React 18 + TypeScript + Vite)
│   ├── components/           # UI Components (SpotsExplorer, Translator, Pass, etc.)
│   ├── utils/                # API helpers, constants, and utilities
│   ├── App.tsx               # Main application container
│   └── main.tsx              # React DOM entrypoint
├── backend/                  # Backend API Server (Node.js + Express)
│   ├── config/               # Database connection (SQLite / MySQL)
│   ├── database/             # Schema, seeds, and CSV datasets
│   ├── middleware/           # API Key authentication middleware
│   ├── routes/               # API endpoints (locations, places, trips, safety, ai)
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

Open a terminal in the root `TripNova` directory:

```powershell
# 1. Navigate to the project root directory
cd d:\TripNova

# 2. Install frontend dependencies
npm install

# 3. Start Vite dev server
npm run dev
```

The frontend will start at: **`http://localhost:5173/`**

---

### 2. Running the Backend API Server (Node.js + Express)

Open a **second terminal window** and run:

```powershell
# 1. Navigate into the backend directory
cd d:\TripNova\backend

# 2. Install backend dependencies
npm install

# 3. Start the Express API server
npm run dev
```

The backend server will start at: **`http://localhost:5000/`**

> **Note:** On first startup, the backend automatically initializes SQLite and seeds the database with tourist locations and verified spots from the included datasets!

---

## ⚙️ Environment Configuration

The backend uses a `.env` configuration file. A template is provided at [`backend/.env.example`](backend/.env.example).

To customize backend settings:
```powershell
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
| `GET` | `/api/health` | Service health, database status, and uptime |
| `GET` | `/api/locations` | List all tourist destinations / districts |
| `GET` | `/api/locations/:id` | Get details for a specific location |
| `GET` | `/api/places` | Filter tourist spots by state, category, or search query |
| `GET` | `/api/places/:id` | Get detailed spot information, entry fees, and timings |
| `GET` | `/api/safety/contacts` | Emergency helpline numbers & police contacts |
| `GET` | `/api/safety/alerts` | Active regional travel and weather advisories |
| `POST` | `/api/trips/plan` | Generate AI-assisted trip itineraries |
| `POST` | `/api/ai/chat` | AI travel assistant query endpoint |

> **Authentication:** Secure endpoints accept API keys via header `x-api-key: tripnova_live_api_key_2026` or `Authorization: Bearer <API_KEY>`.

---

## 🗄️ Database & Dataset Support

TripNova supports zero-configuration local **SQLite** (`tripnova.db`) out-of-the-box as well as **MySQL** for production deployment:
- **Seed Datasets**: Pre-loaded with hundreds of verified tourist spots, emergency contacts, and regional guides across Tamil Nadu and Kerala.
- **Auto-Migration**: Tables and indexes are created automatically on server startup.

---

## 📦 Production Build

To build the frontend for production deployment:

```powershell
npm run build
```
The optimized static bundle will be generated in the `dist/` directory, ready to be deployed to Vercel, Netlify, Cloudflare Pages, or an Nginx/Express server.

---

## 🤝 Contributing & License
Distributed under the **MIT License**. Created with ❤️ for tourist safety and smart tourism.
