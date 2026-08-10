# ClimateGuard AI

## Problem Statement
Climate-related hazards such as extreme heat, drought, abnormal rainfall, and flooding can develop rapidly. It is difficult for local governments and organizations to quickly parse complex climate data into actionable early warnings.

## Solution
ClimateGuard AI detects emerging climate hotspots and converts climate signals into explainable early warnings. It continuously monitors temperature, rainfall, and drought indices to identify rapidly developing climate anomalies, transforming complex climate signals into explainable insights using generative AI and weighted risk engines.

## Features
- **Live Command Center Dashboard**: Real-time KPI monitoring.
- **Interactive Climate Map**: Visualizing hotspots across the globe based on risk severity.
- **AI Climate Analyst**: Explains climate risk indicators and proposes recommended actions using generative AI.
- **Dynamic Risk Engine**: Configurable engine that weighs multiple climate indicators to assign a risk score from 0-100.
- **Historical Trends**: View how a climate hotspot's conditions have changed over the past week.
- **Automated Report Generation**: One-click generation of comprehensive AI risk assessments ready for printing or download.
- **Demonstration Mode**: Graceful fallback deterministic explanations when no AI key is provided.

## Architecture
```
User
 ↓
React Frontend (Vite, Tailwind, Recharts, Leaflet)
 ↓
REST API (Express, Node.js)
 ↓
Climate Risk Engine (Algorithmic weighted scoring)
 ↓
AI Analysis (OpenAI / Generative AI or Deterministic Fallback)
 ↓
Early Warning Recommendations
```

## Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Setup Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
### Backend
- `PORT`: Port the Express server runs on (default: 5000)
- `FRONTEND_URL`: URL of the frontend (for CORS in production)
- `AI_API_KEY`: Your OpenAI API key (leave empty to use demonstration mode deterministic fallback)
- `AI_MODEL`: Model to use (default: gpt-4)
- `AI_BASE_URL`: Base URL for the AI provider (default: OpenAI's endpoint)

### Frontend
- `VITE_API_URL`: URL to the backend API (default: http://localhost:5000/api)

## Deployment (Vercel)
The project includes a `vercel.json` file for unified deployment.
1. Connect your GitHub repository to Vercel.
2. Provide the necessary environment variables in the Vercel dashboard.
3. Vercel will automatically build the React frontend and deploy the Express backend as Serverless Functions.

## Hackathon Demo Flow (3 Minutes)
1. **Introduction (30s)**: Land on the homepage, explain the problem. "Climate anomalies develop rapidly, we need to detect them early."
2. **Dashboard Overview (30s)**: Navigate to the Dashboard. Highlight the KPI cards (Active Hotspots, Critical Alerts, Average Risk).
3. **Interactive Map (60s)**: Show the world map. Click on **Phoenix, Arizona (Critical Risk)**. Explain the climate indicators (Temp Anomaly, Drought Index).
4. **AI Analysis (30s)**: Click "Analyze with AI". Show how the AI (or fallback engine) converts raw numbers into explainable early warnings and recommended actions.
5. **Report Generation (30s)**: Go to the Reports page, generate a report for Phoenix, and show how it can be printed or downloaded for decision-makers.
