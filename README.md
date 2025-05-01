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
├── app/                       # React components (e.g., SimulationAnchorFeed)
├── public/
│   └── data/
│       └── anchors/          # Live simulation anchor .json files
├── tailwind.config.js        # UI theming and layout
├── package.json              # React + Tailwind dependencies
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
    "next": "13.4.12",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "^3.3.0",
    "clsx": "^1.2.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
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
