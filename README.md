# 🛡️ CyberShield — Gamified Cybersecurity Training Platform

## Tech Stack
- **Frontend**: React.js + Framer Motion + Three.js + Recharts + Zustand
- **Backend**: Node.js + Express.js + Socket.io
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcryptjs
- **AI**: Google Gemini API (dynamic question generation)
- **Real-time**: Socket.io WebSockets

## 🚀 Quick Start (Hackathon Setup — 10 minutes)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas free tier)
- Gemini API key (optional — has fallback to static questions)

---

### Step 1: Clone and Install

```bash
# Install all dependencies
cd cybershield
npm install
npm install --prefix client
npm install --prefix server
```

### Step 2: Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=any_random_secret_string_here
GEMINI_API_KEY=your_key_here   # Optional
CLIENT_URL=http://localhost:5173
```

### Step 3: Start MongoDB

```bash
# If using local MongoDB
mongod
# OR use MongoDB Atlas (cloud) — paste connection string in .env
```

### Step 4: Run the App

```bash
# From root cybershield/ folder
npm run dev
# This starts BOTH client (port 5173) and server (port 5000)
```

Open: **http://localhost:5173**

---

## 🎮 Features

| Feature | Description |
|---|---|
| 10 Attack Categories | Phishing, Popup, URL, Password, Social Engineering, Ransomware, QR Code, Vishing, Insider Threats, Wi-Fi Honeypots |
| 50+ Questions | Detailed scenarios with red flag explanations |
| AI Generation | Gemini API generates fresh questions every session |
| Real-time Leaderboard | Live scoring via Socket.io WebSockets |
| Adaptive Timer | 30-second countdown with pressure mechanics |
| Streak System | Multiplier bonuses for consecutive correct answers |
| Badge System | 10 achievements to earn |
| Radar Chart | Visual skill breakdown per attack category |
| User Profiles | Full stats, history, XP, rank progression |

## 📁 Project Structure

```
cybershield/
├── client/                  ← React Frontend
│   └── src/
│       ├── pages/
│       │   ├── AuthPage.jsx      ← Login/Register
│       │   ├── HomePage.jsx      ← 3D Globe + Mode Select + Leaderboard
│       │   ├── GamePage.jsx      ← Core Game Engine
│       │   └── ResultPage.jsx    ← Score + Radar + Badges
│       ├── hooks/
│       │   └── useSocket.js      ← Real-time Socket.io
│       ├── store.js              ← Zustand global state
│       └── App.jsx
│
└── server/                  ← Node.js Backend
    ├── index.js              ← Express + Socket.io server
    ├── models/User.js        ← MongoDB User schema
    ├── routes/
    │   ├── auth.js           ← Register/Login/JWT
    │   ├── game.js           ← Questions, Answers, Results
    │   ├── leaderboard.js    ← Global rankings
    │   └── user.js           ← Profile + Stats
    ├── socket/gameSocket.js  ← Real-time events
    ├── ai/questionGenerator.js ← Gemini AI integration
    └── data/questions.js     ← 50-question static bank
```

## 🏆 Hackathon Demo Tips

1. **Open two browser tabs** — shows real-time leaderboard updating live
2. **Play a game** — demonstrate the timer pressure and streak bonuses
3. **Show the results page** — radar chart + badge system impresses judges
4. **Explain the AI angle** — "Questions are generated fresh by Gemini — never the same game twice"
5. **Social impact** — "91% of cyberattacks start with phishing. This trains people to spot them for free."

## 🔮 Future Scope

- Mobile app (React Native) with push notification attack simulations
- Organization admin dashboard with team analytics
- Shareable LinkedIn certification on completion
- AI-generated deepfake voice clips for vishing training
- Multiplayer competitive mode (race to answer first)
