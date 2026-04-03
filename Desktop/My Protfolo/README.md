# Guruprasad's Portfolio

This repository contains the full **Guruprasad** portfolio website, developed as a responsive, single-page portfolio for showing personal branding, skills, work experience and contact information. It uses plain HTML with embedded CSS and JavaScript for animation, plus icons and social links.

## Repository details
- GitHub: `https://github.com/guruprasadgodamgave400-design/Git`
- Branch: `main`
- Project root: `index.html`, image assets, README
- Primary technologies: HTML, CSS, JavaScript (Typed.js animation), Live Server (npm)

## Features implemented

1. **Responsive Navigation**
   - Sticky top nav with gradient background and hover states
   - Links: Home, About, Services, Projects, Contact
   - Media query for mobile breaks nav into stacked layout

2. **Hero Section (Top)**
   - Intro text: "Hi, My name is Guruprasad"
   - Highlighted purple text for names and roles
   - Typed.js animated role text in element `#element`
   - CV and GitHub action buttons

3. **Section Anchors**
   - `#languages` for About link scrolling
   - `#services` and `#projects` placeholders available for future sections
   - `#contact` placeholder for Contact button scroll

4. **Skills/Work Experience Panel**
   - Timeline cards with icon markers and role titles
   - Includes: HTML, Node.js, React, MongoDB, Python, DSA
   - White timeline bar across cards

5. **Footer Connect Block**
   - Centered block with “Connect with me” title
   - Social icon links (LinkedIn, Instagram, Gmail)
   - Brand icons used (visible and recognizable)

6. **Download/Contact actions**
   - Resume download button points to Google Drive share link
   - Email button opens `mailto:guruprasdgodamgave400@gmail.com`

## File structure

- `index.html` - full markup + CSS + script integration
- `package.json` - npm dev script for live-server (local hosting)
- `README.md` - this documentation
- `*.png` - image icons for sections and cards

## Setup and local run

### Option 1: direct static server (recommended)

```powershell
cd "C:\Users\GURUPRASAD\Desktop\My Protfolo"
python -m http.server 5500
```
Open: `http://localhost:5500`

### Option 2: npm live-server

```powershell
cd "C:\Users\GURUPRASAD\Desktop\My Protfolo"
npm install
npm run dev
```

Live server will start on an available port, e.g., `http://127.0.0.1:55125`

## GitHub flow used

```bash
git status
git add .
git commit -m "Update portfolio with responsive nav, anchor links, social footer, and live-ready setup"
git push origin main
```

## GitHub Pages deployment
1. Open repository Settings -> Pages
2. Source: `main` branch (root)
3. Publish and access at: `https://guruprasadgodamgave400-design.github.io/Git/`

## Known limitations / TODO
- Add real `Services`, `Projects`, and `Contact` sections for completeness.
- `#contact` anchor currently placeholder; add contact form section for full behavior.
- Ensure image filenames are available in root, otherwise update asset path.
- Improve accessibility with `alt` text and ARIA labels (partially already available).

## Contact info
- LinkedIn: https://www.linkedin.com/in/guruprasad-godamgave-b6ba21314?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
- Instagram: https://www.instagram.com/its_photographer_guru/
- Email: guruprasdgodamgave400@gmail.com


---

Created and maintained by **Guruprasad**. This repo is a live portfolio deployment and static site demo.