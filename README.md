# Vice City — After Dark

A cinematic neon-noir browser game where the player steps into the role of a photojournalist and fixer in a fictional crime city. The experience blends story, progression, and image editing into one flow: players receive suspicious photographs, use the official Unlayer image editor to edit them, and then use the finished result to move the story forward.

---

## What this project is

This is a playable web experience inspired by stylish crime-world storytelling and newsroom drama. The player is not just using an editor — they are solving a case through the lens of a fictional city and its underworld media machine.

The project is designed to feel like a premium game experience, with:

- cinematic menu and boot screens
- mission-based progression
- in-world photo investigation
- image editing as a core mechanic
- newsroom publishing and story payoff
- reputation, rewards, and unlockable content

---

## Core gameplay loop

```text
Boot screen
→ Main menu
→ Start game
→ Receive mission photo
→ Open image editor
→ Crop, highlight, annotate, and refine the image
→ Submit the edited result
→ Earn rewards and reputation
→ Publish the photo in the newsroom
→ Unlock the next story
```

The final edited image matters. It is reused in the story and progression, not treated as a disposable export.

---

## Mission concept

The game is built around a small set of polished missions.

### The Boat
A suspicious marina photograph contains evidence. The player must isolate the important area, highlight it, and submit the corrected image.

### Front Page
The mission image becomes a story asset. The player frames it, improves it, and turns it into a publishable newspaper image.

### The Package
A hidden clue is buried in the photo. The player must inspect the image carefully, crop the key detail, and annotate it to reveal the truth.

---

## Why the image editor matters

This project uses the official Unlayer React Image Editor as a real gameplay tool.

The player is expected to:

- crop important details
- highlight suspicious evidence
- add annotations and text
- improve composition and clarity
- submit a final result that affects the game

The image editor is an essential part of the game loop, not a decorative side feature.

---

## Visual style

The aesthetic is inspired by noir crime stories and neon nightlife:

- dark, cinematic backgrounds
- neon pink, cyan, and orange accents
- mystery-driven atmosphere
- premium HUD design
- dramatic motion and atmospheric transitions

---

## Tech stack

- React
- Vite
- TypeScript
- Unlayer React Image Editor
- Framer Motion
- CSS styling
- localStorage for player progression and settings

---

## Getting started

```bash
npm install
npm run dev
```

Then open the project in your browser and start exploring the mission flow and editor-driven gameplay.

---

## Project goal

The finished experience should feel like a fictional crime city mystery where photo editing is part of solving the case, shaping the story, and publishing the truth.