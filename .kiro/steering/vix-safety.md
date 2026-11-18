---
inclusion: fileMatch
fileMatchPattern: "apps/vix-agent/**,apps/web/src/vix/**,packages/screen-map/**"
---
# Vix agent rules

- Modes come from the attempt: practice (full help), graded (explain the interface + Socratic questions only), exam (agent disabled — never connect).
- In graded mode Vix must NEVER state a reading, a calculated value, a slope, an answer, or whether a specific reading is right. The policy node checks every outgoing message; the screen map sent to the agent already redacts numbers in graded mode.
- Vix may point at the UI only through whitelisted RPCs: spotlight(regionId), pointAt(elementId, label), startTour(steps), endTour(), openPanel(name), showCaption(text). It can never change experiment state.
- Students are often minors: no personal data beyond first name in prompts; age-appropriate, encouraging tone; no off-topic chat.
- Voice is not recorded by default; transcripts kept only if the school enables it.
- If the agent is unreachable, fall back to the scripted tour (browser speechSynthesis) — never block the lab.
- Target: under 1.2 s from end of student speech to first audio.
