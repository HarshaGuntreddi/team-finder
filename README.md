# Team Finder

A polished, browser-based **Team & Talent Finder**, built from a team skills survey. It helps a
new joiner quickly discover **who does what**, **who's available**, and **which team fits their
needs** — and lets anyone keep the records up to date.

## Why it helps onboarding

- **Find My Team wizard** — a new joiner picks the skills/tools they need and gets a ranked list
  of the best-fit people, with a match score and one-click email contact.
- **People Directory** — search and filter everyone by skill, availability, or project.
- **Dashboard** — at-a-glance stats and charts (top skills, availability split, active projects).
- **Manage Data** — add/edit/delete people, import the survey export (`.xlsx`/`.csv`), and export
  the current data to Excel/CSV/JSON.

## Tech

- React 18 + TypeScript + Vite
- Tailwind CSS (light/dark mode), lucide-react icons
- recharts (charts), papaparse + SheetJS/xlsx (import/export)
- Data persists in the browser (`localStorage`) — no backend required.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

The app seeds itself with realistic sample data on first run. Use **Manage Data → Import** to load
the actual survey export; the survey columns (Employee ID, Employee Name, Email, "Are you
currently occupied on a project?", project description, Expertise, Remarks) are mapped
automatically. Use **Export** to save your changes or share them.

## Build for production

```bash
npm run build
npm run preview
```

## Data mapping

Free-text **Expertise** answers (e.g. _"CAD tools like 3D Experience, CATIA V5 and simulation
tools like ANSYS"_) are parsed into clean, normalized skill tags (CATIA V5, 3D Experience, ANSYS)
that power search, filtering, and the matching wizard.
