# Song Rating Dashboard

A full-stack application for browsing, searching, rating, and visualizing song metadata.

- **Backend:** Flask + SQLAlchemy (serves normalized songs, supports rating)
- **Frontend:** React + Material UI (sortable table, search, CSV export, charts, star ratings)
- **Docker:** Images for both services, Compose to run together
- **Tests:** Frontend unit tests with Jest + React Testing Library

---

## Features

### Backend
- REST endpoints to:
  - Fetch paginated songs
  - Fetch a single song by **title** (case-insensitive)
  - Update a song’s **rating** (0–5)
- Normalized dataset with common audio features (danceability, energy, tempo, etc.)
- SQLAlchemy models
- Dockerized for easy local spin-up

### Frontend
- Data table with:
  - **Pagination** (client-side next/prev over API pages)
  - **Sorting** (including **rating**)
  - **CSV export** (current table view)
- **Search**:
  - “Get” by **exact title** (case-insensitive)
  - **Empty search** resets to full list
- **Star ratings** persisted to backend
- **Charts** (Recharts):
  - Scatter: Danceability vs. Energy
  - Histogram: Duration (seconds)
  - Bars: Top Acousticness, Top Tempo
- Frontend unit tests (SearchBar, RatingStars, DataTable, App)

---

## Tech Stack

- **Backend:** Python 3.13, Flask, SQLAlchemy
- **Frontend:** React, Material UI (MUI), Recharts
- **Database:** SQLite (dev)
- **Tests:** Jest + React Testing Library (frontend)
- **Containers:** Docker, Docker Compose

---

## Quick Start (Local)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
python3 run.py                     # serves on http://localhost:5001
```
### Frontend
```
cd frontend
npm install
npm start                         # serves on http://localhost:3000
```
---

## Quick Start (Docker)

### from repository root

### Build and run both services together:
```bash
docker compose build
docker compose up

Frontend: http://localhost:3000

Backend API: http://localhost:5001/songs
```

### Stop all containers:
```bash
docker compose down
```