# VICE CITY — AFTER DARK

## What we're building

Build a premium, cinematic **GTA/Vice City-inspired interactive web experience** for the Unlayer Build With Image Editor challenge.

This is NOT a normal dashboard or image-editor demo.

The user should feel like they have launched a fictional AAA crime game in their browser.

The **React Image Editor must be a core gameplay mechanic**, not an isolated feature.

---

## Core Concept

The player is an underground photographer/newsroom operator in a fictional neon coastal city.

Gameplay loop:

```text
BOOT
→ MAIN MENU
→ START GAME
→ MISSION
→ RECEIVE PHOTO
→ OPEN IMAGE EDITOR
→ EDIT / ANNOTATE PHOTO
→ SUBMIT
→ REWARD / REPUTATION
→ PHOTO APPEARS IN NEWSROOM
→ CITY REACTS
→ NEXT MISSION
```

The player's edited image should actually be reused inside the experience, especially in the Newsroom.

---

# 1. MAIN EXPERIENCE

### Boot Screen

Cinematic startup sequence:

```text
INITIALIZING...
CITY NETWORK      ONLINE
CAMERA GRID       ONLINE
NEWSROOM          ONLINE
ARCHIVE           ONLINE
```

Then reveal:

```text
VICE CITY
AFTER DARK
```

Finally:

```text
PRESS ENTER
```

Add subtle sound effects, ambient city audio, grain, glow and smooth transitions.

---

# 2. MAIN MENU

Full-screen game-style menu.

Options:

```text
START GAME
PHOTO MODE
NEWSROOM
CONTACTS
OPTIONS
CREDITS
QUIT
```

Requirements:

* keyboard navigation
* mouse interaction
* hover sounds
* selection sounds
* smooth animations
* animated/parallax background
* cinematic typography
* no generic SaaS UI

---

# 3. GAME HUB

Show:

```text
PLAYER
R. ARCHER

CASH
$1,480

REP
LVL 02

CURRENT MISSION
THE BOAT
```

Also show:

* active mission
* reputation
* unlocked contacts
* recent story
* city/news ticker

Keep this visually like an in-game HUD/dashboard.

---

# 4. MISSIONS

Start with **3 polished missions**, not 20 shallow ones.

### Mission 01 — THE BOAT

Player receives a suspicious marina photograph.

Objective:

> Find what matters.

User must use the Image Editor to:

* crop
* draw/highlight
* add text/annotation

Then submit the edited image.

---

### Mission 02 — FRONT PAGE

Take the mission photograph and turn it into a publishable newspaper image.

Use:

* crop
* adjustments/filter
* text
* framing/stamp

The final edited image appears inside a fictional newspaper article.

---

### Mission 03 — THE PACKAGE

A photograph contains a hidden clue.

Player must inspect, zoom/crop and annotate the important detail.

Completing the mission unlocks the next story/contact.

---

# 5. IMAGE EDITOR

This is the MOST IMPORTANT part.

Integrate the React Image Editor directly into the mission experience.

Do NOT make it feel like:

> "Open editor"

Instead transition into it like an in-world system:

```text
OPENING RAW CAPTURE...
LOADING FRAME...
```

Editor should support whichever relevant tools are available:

* crop
* rotate
* zoom
* drawing
* text
* filters/adjustments
* annotations
* export

Show the current mission objective beside the editor.

Track editor actions so the mission can verify that the player actually performed the required edits.

Example:

```text
required:
crop
draw
text
```

---

# 6. SUBMISSION / RESULT

After submitting:

```text
TRANSMITTING EDITED FRAME...
```

Then show:

```text
MISSION COMPLETE

+$320
+18 REP

NEW CONTACT UNLOCKED
NEW STORY AVAILABLE
```

The exported edited image must be saved and reused in the UI.

---

# 7. NEWSROOM

Create a fictional newspaper/newsroom.

The user's edited image becomes the article's actual hero image.

Example:

```text
VICE CITY HERALD

MYSTERY AT THE MARINA

11:42 PM
SOURCE: UNKNOWN
```

This is important because it proves the Image Editor affects the rest of the application.

---

# 8. OPTIONAL SIDE SCREENS

Build after the core experience is polished:

### Photo Mode

Free-form image editor playground.

### Contacts

Character dossiers.

### Vice Social

Fake social feed reacting to the player's published stories.

### Options

Audio, reduced motion, screen effects, reset progress.

---

# 9. VISUAL DIRECTION

**Overall feeling:**

* neon nightlife
* crime/noir
* luxury
* cinematic
* retro-futuristic
* photographic
* mysterious
* premium

Use original assets and branding. Take inspiration from Vice City-style aesthetics, but do NOT copy GTA/Rockstar assets, logos, characters, music or UI directly.

### Colors

Mostly:

* black
* charcoal
* off-white

Accents:

* pink
* cyan
* orange
* occasional green

Neon should be used as an accent, not everywhere.

### Typography

Use:

1. bold condensed display font
2. monospace/system font

---

# 10. MOTION + AUDIO

Motion is a major part of the experience.

Use:

* fade/slide transitions
* parallax
* glow
* subtle distortion
* film grain
* scanlines
* image zoom transitions
* menu hover movement
* loading animations

Sound effects:

* menu hover/select
* camera shutter
* editor actions
* notifications
* mission start
* mission complete
* export/save

Use original or properly licensed audio only.

Include reduced-motion and audio controls.

---

# 11. TECH STACK

Use:

```text
React
TypeScript
Vite
React Image Editor
Framer Motion
CSS/Tailwind
localStorage
```

Avoid unnecessary backend infrastructure.

Persist:

* progress
* cash
* reputation
* completed missions
* settings

---

# 12. Architecture

Suggested structure:

```text
src/
  components/
    boot/
    menu/
    hub/
    missions/
    editor/
    newsroom/
    contacts/
    social/
  data/
    missions.ts
    contacts.ts
    articles.ts
  hooks/
  services/
  store/
  styles/
  assets/
```

Keep mission data and content separate from UI code.

---

# 13. UX PRIORITIES

Priority order:

### P0

Boot → Menu → Mission → Image Editor → Submit → Result

### P1

Newsroom → Sound → Animations → Persistence → Contacts

### P2

Social feed → Photo Mode → Easter eggs → branching story

If time is limited, **cut P2. Never sacrifice P0 polish.**

---

# 14. Definition of Success

The finished project should make a visitor think:

> "This looks like an actual game."

Then:

> "Wait, I'm using the image editor to play it."

And finally:

> "My edited image actually changed the experience."

Every design and implementation decision should reinforce those three reactions.

---

# 15. Critical Rule

Do NOT build a generic website with game colors.

Do NOT build a generic image editor with a fictional story around it.

Build the **game experience first**, with the Image Editor functioning as one of its core systems.

