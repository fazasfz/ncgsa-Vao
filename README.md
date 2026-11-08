# Virtual Astronomy Observatory (VAO)
**National Center of GIS and Space Applications (NCGSA) — Space & Astrophysics Research Lab (SARL) - Institute of Space Technology (IST) - Pakistan**

> **PROPRIETARY NOTICE**: **This is NOT an open-source project.** All source code, system architectures, research algorithms, and UI assets associated with the Virtual Astronomy Observatory (VAO) are the exclusive intellectual property of NCGSA, SARL, and the Institute of Space Technology (IST). Unauthorized copying, redistribution, modification, public hosting, or commercial use is strictly prohibited.

---

## 1. Executive Summary & Mission

The **Virtual Astronomy Observatory (VAO)** is an advanced digital astrophysics platform designed to advance astronomical exploration, live space telemetry analysis, planetary observation planning, and AI-assisted astrophysical research.

Developed under the **Space & Astrophysics Research Laboratory (SARL)** within the **National Center of GIS and Space Applications (NCGSA)** at the **Institute of Space Technology (IST)**, VAO bridges the gap between raw scientific datasets and interactive observational astrophysics.

VAO has completed its migration to a fully client-side platform: every module that computed on public, unauthenticated telemetry — including Deep Sky's SIMBAD/MAST catalog lookups — now runs entirely in the browser, calling 3rd-party APIs directly. There is no `pvao-backend` anymore. The one exception is AstroCopilot, which requires private/billing-linked LLM keys and a database, and is deployed as its own fully independent service outside this repository.

### Key Capabilities:
- **Real-Time Space Weather Monitoring**: Direct feeds from NOAA SWPC and NASA SDO instruments for solar flare indices, coronal loop imagery, planetary Kp indices, and solar wind velocity.
- **Precision Ephemeris & Orbital Mechanics**: High-accuracy lunar phase, illumination, and rise/set calculations, and JPL Horizons-based orbital mechanics for deep-space probes.
- **High-Resolution 3D Lunar & Planetary Visualization**: Topographic lunar globe with USGS crater gazetteers, real-time libration, and phase illumination.
- **Deep Sky Astrophotography & Catalogs**: Catalog querying across SIMBAD and MAST, called directly from the browser.
- **AI-Powered AstroCopilot Intelligence**: Real-time streaming assistant for interactive equation derivation (LaTeX / KaTeX), spectral analysis, and astronomical calculation validation — served entirely by a separate, independently-deployed AstroCopilot service (not part of this repo).
- **Dark Sky GIS Planning**: Interactive Bortle dark sky index mapping combined with NASA GIBS near-real-time satellite day/night imagery for ground observation planning.

---

## 2. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PVAO Frontend Client                                    │
│        React 18 • Vite • Vanilla CSS Modules • Three.js WebGL • KaTeX • Recharts        │
│                                                                                           │
│  Direct client-side calls to public, unauthenticated 3rd-party APIs (no backend at all):│
│   • NOAA SWPC (solar telemetry, cycle data, sunspots)                                   │
│   • NASA JPL Horizons (probe state vectors)                                             │
│   • NASA APOD (VITE_NASA_API_KEY, client-safe rate-limited key)                         │
│   • CDS MocServer (HiPS coverage)                                                       │
│   • SIMBAD & MAST (deep sky object lookups — direct browser calls, CORS confirmed)      │
│   • astronomy-engine npm package (lunar phase/illumination/rise-set — replaces          │
│     the old Skyfield/de440s.bsp backend calculation, validated within tolerance)        │
│   • Local static JSON (lunar feature gazetteer + haversine nearest-feature math)        │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ same-origin SSE endpoint
                                            ▼
                            ┌───────────────────────────────────────────┐
                            │ Vercel Serverless Function (/api/...)      │
                            ├─────────────────────────────────────────────┤
                            │ • Gemini streaming proxy                   │
                            │ • GEMINI_API_KEY (server-only secret)      │
                            └───────────────────────────────────────────┘
```

**Migration status:** `pvao-backend` has been fully retired. Every observatory module — Solar Observatory, Astronomical Probe Tracker, APOD, Lunar Observatory, and Deep Sky Explorer (both coverage checks and SIMBAD/MAST object lookups) — runs in the browser. AstroCopilot uses a small same-origin Vercel serverless function to keep the Gemini provider key out of browser assets; the AI interaction UI and prompt logic remain in the frontend.


---

## 3. Detailed Module Breakdown

### 1. AstroCopilot Intelligence Workspace (`/astrocopilot`)
- Consumes server-sent text streams via `ReadableStream.getReader()` / `TextDecoder` from the same-origin `/api/astrocopilot` Vercel function. Gemini credentials are held in server-side environment variables.
- Real-time LaTeX/KaTeX formula rendering via `react-markdown`, `remark-math`, `rehype-katex`.

### 2. Solar Observatory (`/solar-observatory`) — frontend-only
- Live Solar Wind Velocity, Proton Density, X-ray Flux Class, Planetary Kp index — computed client-side from direct NOAA SWPC feeds.
- Solar Cycle 25 progression chart, sunspot regions.

### 3. Lunar Observatory (`/lunar-observatory`) — frontend-only
- 3D lunar globe, USGS crater gazetteer search (local JSON + haversine nearest-feature math).
- Live phase, illumination, distance, moonrise/moonset, and next new/full moon — computed client-side via `astronomy-engine`, validated against the prior Skyfield backend within tolerance (illumination ≤0.01%, timing ≤1.5 min).

### 4. Deep Sky Explorer (`/deep-sky-explorer`) — frontend-only
- Coverage checks (HiPS/CDS MocServer) and Messier/NGC/SIMBAD/MAST object lookups are both computed via direct browser calls — SIMBAD and MAST's public endpoints allow CORS, so no proxy was needed.

### 5. Zenith Virtual Planetarium (`/zenith`)
- Interactive star chart, local sidereal time, altitude/azimuth, transit times for Pakistan's coordinates.

### 6. Solar System Simulator (`/solar-system-simulator`)
- Keplerian orbital mechanics for the 8 major planets and dwarf planets.

### 7. Astronomical Probe Tracker (`/astronomical-probe-tracker`) — frontend-only
- Real-time trajectories (Voyager 1 & 2, Parker Solar Probe, JWST, New Horizons, ISS, Hubble) via direct JPL Horizons calls; orbital mechanics computed client-side.

### 8. Earth View & Observation Planner (`/earth-view`, `/observation-planner`)
- Bortle dark sky rating, NASA GIBS day/night satellite overlay.

### 9. Academic Data Sources & Astronomical Glossary (`/glossary`, `/data-sources`)
- 100+ astrophysics definitions; transparent citations for all scientific data sources.

---

## 4. Local Execution Guide (Internal Team)

### Step 1: Start the Frontend Application (`pvao-frontend`) — this is the entire platform
```bash
cd pvao-frontend
npm install
npm run dev
```
- Set `VITE_NASA_API_KEY` in `.env` (see `.env.example`).
- **Local Web Interface:** `http://localhost:5173`
- Every module except AstroCopilot works standalone with nothing else running — Solar, Lunar, Probe Tracker, Deep Sky, and Earth View all call NASA/NOAA/CDS/JPL/SIMBAD/MAST endpoints directly from the browser.

### Step 2 (optional): AstroCopilot
AstroCopilot uses a same-origin Vercel serverless function at `/api/astrocopilot`; no separate backend repository or second Gemini key is required. Configure the existing Gemini API key as `GEMINI_API_KEY` in the Vercel project’s server-side Environment Variables. Do not use a `VITE_` prefix: Vite variables are included in browser assets. After adding or changing the variable, redeploy the project.

To run the Vercel function locally, install/use the Vercel CLI and run `npx vercel dev` from `pvao-frontend`; set `GEMINI_API_KEY` in the local server environment (for example, an untracked `.env.local`). The regular `npm run dev` starts Vite only, so the `/api/astrocopilot` route is available locally only when using the Vercel CLI or an `VITE_ASTROCOPILOT_API_URL` override pointing to a compatible running endpoint.

The serverless endpoint proxies Gemini’s SSE response without sending provider credentials to the browser. Before opening the public endpoint to unrestricted use, configure platform-level rate limiting and/or application authentication to protect the Gemini quota. Session history is still placeholder-only; catalog and Zenith links navigate to their modules but do not sync data into the chat.

---

## 5. Deployment

VAO is deployed to Vercel as a Vite frontend plus the AstroCopilot serverless function. Configure `GEMINI_API_KEY` as a server-side Vercel Environment Variable. Before opening the public endpoint to unrestricted use, configure platform-level rate limiting and/or application authentication to protect the Gemini quota.


---

## 6. Intellectual Property & Non-Open-Source Status

**The Virtual Astronomy Observatory (VAO) is NOT an open-source project.**

- **Proprietary Ownership:** All source code, visual design elements, user interfaces, system architectures, database schemas, and mathematical simulation models contained in this repository belong exclusively to the Space & Astrophysics Research Lab (SARL) and the National Center of GIS and Space Applications (NCGSA) at the Institute of Space Technology (IST), Pakistan.
- **Licensing & Usage Restrictions:** No open-source license (such as MIT, Apache, or GPL) is granted for this repository. Code contained herein may not be copied, modified, redistributed, sublicensed, hosted publicly, or used for commercial or non-commercial external projects without explicit written authorization from NCGSA/SARL leadership.
- **Access Control:** Repository access is strictly reserved for designated engineering interns, research teams, and scientific supervisors affiliated with NCGSA/SARL.

---

## 7. Research Team & Academic Credits

The **Virtual Astronomy Observatory (VAO)** is developed under the auspices of:
- **National Center of GIS and Space Applications (NCGSA)**
- **Space & Astrophysics Research Lab (SARL)**
- **Institute of Space Technology (IST), Islamabad, Pakistan**

### Scientific & Research Supervisors:
- **Yawar Abbas** — *Scientific Supervisor (NCGSA / IST)*
- **Muhammad Junaid** — *Research Supervisor (NCGSA / IST)*

### Core Engineering & Research Team:
- **Syeda Fatima Zahra** — *Engineering Intern (Core Architecture, Frontend Layouts, Zenith, Lunar Observatory, Astro-Copilot Workspace)*
- **Simra Tanveer** — *Engineering Intern (Solar Observatory & Astronomical Probe Tracker Architecture)*
- **Qurat ul Ain** — *Research Intern (Solar Observatory & Astronomical probes research)*
- **Tehreem Azhar** — *Research Intern (Solar Observatory & Astronomical probe tracker)*
- **Mohib** — *Engineering Intern (Solar system Simulator)*
- **Radhiya** — *Research & Development Intern (End-to-end Exora)*
- **Saani-e-Zehra** — *Research Intern (Cosmic Object Cataloging & Earth View)*
- **Amna** — *Research & Development Intern (Deep Sky Explorer & backend & data architecture for Exora)*

---

## 8. Data Sources & Scientific Acknowledgments

We gratefully acknowledge the space agencies, archives, and scientific organizations providing open access to astronomical data:
- **NASA (National Aeronautics and Space Administration)** — APOD, Horizons System, SDO/AIA extreme UV imagery, and GIBS satellite layers.
- **NOAA SWPC (Space Weather Prediction Center)** — Real-time solar wind plasma data, magnetometer telemetry, and geomagnetic Kp indices.
- **MAST (Mikulski Archive for Space Telescopes)** — Multi-wavelength celestial imagery and spectral catalogs.
- **CDS (Centre de Données astronomiques de Strasbourg)** — SIMBAD Astronomical Database, MocServer HiPS coverage.
- **USGS Astrogeology Science Center** — Gazetteer of Planetary Nomenclature for lunar topography and nomenclature.
- **NASA JPL (Jet Propulsion Laboratory)** — Horizons ephemeris system.
