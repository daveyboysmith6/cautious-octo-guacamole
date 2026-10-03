# NYRP Website

Static website handoff for New York Roleplay / FivePD.

## Quick start

No framework or dependency install is required to view the site.

From the repository root:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Build

A zero-dependency Node build is included for validation and clean deployment output:

```powershell
npm run build
```

The command syntax-checks the JavaScript, validates local page/CSS references, and writes the production-ready site to `build/`.

## Production pages

- `index.html` — home
- `departments.html` — departments
- `experience.html` — experience
- `gallery.html` — gallery
- `faq.html` — FAQ
- `callsign.html` — callsign utility

## Key files

- `styles.css` — primary site styles
- `polish-v14.css` — final visual/polish layer
- `app.js` — shared interactions and page behavior
- `gallery.js` — gallery behavior
- `callsign.js`, `callsign-core.js`, `callsign-data.json` — callsign utility
- `assets/` — logos, department art, fonts, imagery, and video

## Media

The home hero uses `assets/city-4k60-web.mp4` on larger displays and `assets/city-1080p60.mp4` on smaller displays. The larger `city-4k60.mp4` is retained as a source-quality media asset.

## Current external links

- FiveM join URI: `fivem://connect/pjr7oa`
- Discord: `https://discord.gg/SXyrwyjTrg`
- Instagram: `https://www.instagram.com/new_york_fivepd/`
- TikTok: `https://www.tiktok.com/@newyorkrp_fivepd`
- Application form: `https://forms.gle/WkksWyNHz5ct7SNs9`

## Deployment

This is a static site. Deploy the contents of `build/` to any static host, or serve the repository root directly. There is no backend, database, or environment-variable requirement in this handoff.

Run `npm run build` before deployment. A successful build means the shipped JavaScript parses and all local HTML/CSS file references resolve.
