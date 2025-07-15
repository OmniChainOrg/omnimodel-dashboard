# 🌐 OmniModel Dashboard

> **OmniChain Visualization Layer** for AI model integrity, simulation hashes, and validator telemetry

---

## 🎯 Purpose

The OmniModel Dashboard is a real-time UI layer for **OmniChain DevNet-2** — serving as a public-facing explorer for:

- 📡 **Simulation Hash Anchors**
- 🧠 **AI Model Provenance**
- 🛰 **Subnet and Validator Activity**
- 🔬 **Digital Twin Feed Integration** (coming soon)

---

## 📁 Folder Structure

```
omnimodel-dashboard/
├── components/               # React components
├── hooks/                    # Shared hooks
├── lib/                      # Utility modules
├── pages/                    # Next.js pages and API routes
├── public/
│   └── data/
│       └── anchors/          # Live simulation anchor .json files
├── styles/                   # Global stylesheets
├── tailwind.config.js        # UI theming and layout
├── package.json              # Project dependencies
└── README.md                 # This file
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` to view the dashboard.

---

## 🧬 Anchor Feed (MVP)

Current anchors load from:
```bash
/public/data/anchors/*.json
```

And are rendered by `SimulationAnchorFeed.tsx` using:
```jsx
fetch('/data/anchors/chrono-liraglutide.json')
```

---

## 📦 package.json (React + Tailwind Scaffold)

```json
{
  "name": "omnimodel-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "framer-motion": "latest",
    "lucide-react": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "recharts": "latest",
    "sass": "latest",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@types/node": "22.15.3",
    "@types/react": "19.1.2",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.0.4",
    "react-icons": "^4.12.0"
  }
}
```

---

## 👩‍🚀 Contribute

This UI will soon power:
- Reproducible model viewers
- Twin lifecycle trackers
- Simulation audits
- DAO validator ranking
