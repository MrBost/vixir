---
inclusion: fileMatch
fileMatchPattern: "apps/web/**,packages/ui/**"
---
# UI and design rules

- Match the Vixir canvas designs (screen codes in structure.md). Light theme for app pages; dark theme for lab workspaces.
- Tokens: primary #2448D8, ink #0E1726, muted #5B6576, surface #FFFFFF, page #F5F7FA, border #E3E8EF; lab dark bg #0B1220, panel #121A2B, line #22304A; accents: physics #93B4FF, chemistry #FDBA74, biology #4ADE80, electronics #2DD4BF, engineering #D8B4FE; warning #C2410C, success #15803D.
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (readings, numbers, code).
- Lab shell layout: header (back, title, lab switcher, Call Vix, next step) · tool rail 64 px · apparatus tray · bench · instrument dock · event log · data panel. Panels wrap/stack under 900 px.
- Readings and numbers always in JetBrains Mono with units.
- Animated SVG for all lab benches and biology models; must respect prefers-reduced-motion (pause animations, show a static state).
- No emoji in UI; icons are inline stroke SVGs (lucide-react).
