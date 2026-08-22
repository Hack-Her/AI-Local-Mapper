# AI Local Mapper — Intelligent Location Discovery Platform

**AI Local Mapper** is an AI-powered intelligent location discovery and recommendation web application. Users describe their place requirements in plain natural language (e.g. quiet cafes for working, romantic dinner spots, or central meeting locations for group outings). The application extracts preferences, searches nearby locations, analyzes review sentiments, calculates a weighted AI Match Score, and displays ranked recommendations on an interactive Leaflet map.

---

## Key Features

- 🧠 **AI Natural Language Understanding**: Extracts place type, budget, amenities, environment, and duration from user prompts.
- 📍 **Browser Geolocation**: Automatic location detection with fallback city input.
- ⚖️ **Weighted AI Match Score Engine**: Calculates 0-100% personalized match scores based on preference match, distance, rating, budget, amenities, and sentiment.
- 🗺️ **Interactive Leaflet Map**: Marker selection syncs with place cards, popups, and detail overlays.
- 👥 **Group Outing Fair Location Planner**: Calculates geographic centroids to minimize average travel distance for groups.
- ✨ **Potential Hidden Gem Finder**: Identifies highly-rated, lower review count locations.
- 🔐 **JWT Authentication & User Profiles**: Full register/login flow, password hashing with bcrypt, search history, and saved favorites.
- 🌓 **Dark / Light Mode**: Fully responsive, clean modern UI supporting system and toggleable themes.

---

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router DOM, Axios, React Leaflet & Leaflet, Lucide React icons.
- **Backend**: Node.js, Express.js, JWT authentication, `bcryptjs`, Cors, Helmet, Rate Limiting, Morgan.
- **Database**: MongoDB Atlas / Mongoose.
- **AI Service**: Pluggable `aiService.js` (Google Gemini API with smart heuristic fallback).

---

## Project Structure

```text
ai-local-mapper/
├── client/          # React Vite Frontend Application
│   ├── src/
│   │   ├── api/     # Centralized Axios client
│   │   ├── components/ # Navbar, Map, PlaceCard, SearchBar, Details modal, etc.
│   │   ├── context/ # AuthContext & ThemeContext
│   │   ├── hooks/   # useAuth & useLocation
│   │   ├── pages/   # Home, Explore, Favorites, History, Profile, GroupPlanner, etc.
│   │   └── utils/   # Helper functions
│   └── package.json
├── server/          # Express REST API Backend
│   ├── config/      # Database connection
│   ├── controllers/ # Auth, Places, User, Favorites, History, Group controllers
│   ├── middleware/  # JWT auth, error handler, input validation
│   ├── models/      # User, Favorite, SearchHistory, GroupPlan models
│   ├── routes/      # Express API endpoints
│   ├── services/    # AI extraction, Places search, Sentiment analysis, Recommendations
│   └── server.js
└── README.md
```

---

## Environment Variables Setup

### Server (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_local_mapper?retryWrites=true&w=majority
JWT_SECRET=ai_local_mapper_jwt_super_secret_key_2026
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
PLACES_API_KEY=your_places_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## How to Run locally

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Start Servers

**Backend:**
```bash
cd server
npm run dev
```
*(Runs on `http://localhost:5000`)*

**Frontend:**
```bash
cd client
npm run dev
```
*(Runs on `http://localhost:5173`)*
