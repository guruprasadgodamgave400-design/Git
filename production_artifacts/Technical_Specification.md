# Technical Specification: Auralis - The Global Environment App

## Sensory Design Aesthetic
The application dictates a profound visual identity. Elements heavily lean into deep space hues (`#020108`) contrasted by hyper-luminous accents (Neon Blue `#4cc9f0` and Purple `#7209b7`). Interactive elements require pronounced soft shadow glassmorphism (translucency: `rgba(255,255,255,0.05)` coupled with `20-30px` rounded radii).

## Core Screens & Tab Interface
- **Home (Dashboard):** Provides the Auralis Index snapshot alongside an 'Echo Chamber' hardware simulator.
- **Circles:** A community-centric feed displaying localized pollution events tagged natively with user metrics.
- **Record (Floating Center Navigator):** Discards automatic measurements for interactive Sliders dictating Noise (`30-120dB`) and Light (`0-500 lux`) limits, calculating the master Auralis score mathematically.
- **Atlas:** Projecting the entire AsyncStorage user telemetry record onto a dark-mode native map environment mapping color-coded nodes dynamically. Features a **Real-time Pollution Radius** anchored to the user's GPS coordinates, visually representing the impact of the latest sensory reading via a dynamic `MapView.Circle` overlay.
- **Profile:** User gamification ledger monitoring tracking ratios, hotspots, and overall engagement logic.

## Engineering Architecture & Safeties
- `@react-navigation/bottom-tabs` reconfigured significantly to accommodate a custom glowing center button node.
- Abstracted UI Components (`GlassCard`, `GlowButton`, `ScoreCircle`) separated structurally from Screen Logic.
- **Strict Hardening:** Total removal of unparsed strings in geographical arrays. Explicit mapping of booleans. Zero tolerance for unhandled async exceptions in the Storage bridge.
- **Pollution Modeling:** Real-time calculation of pollution radius (100m-300m) based on sensory indices, using numeric primitives for high-precision rendering in `react-native-maps`.
