# IMAGE EDITOR — IMPORTANT

We are using **Unlayer's official React Image Editor**.

Do NOT build a custom image editor.
Do NOT substitute another image-editing library.

## Official package

Install:

```bash
npm install @unlayer/react-image-editor
```

The package requires React 18+.

Official documentation:

https://docs.unlayer.com/builder/latest/image-editor

Official repository:

https://github.com/unlayer/react-image-editor

Read the official documentation/repository before implementing the editor integration.

---

## Basic React Integration

Use the official component:

```tsx
import ImageEditor from "@unlayer/react-image-editor";
import { useRef } from "react";

const editorRef = useRef(null);

<ImageEditor
  ref={editorRef}
  image={missionImage}
  options={{
    theme: "dark",
  }}
  onSave={({ dataUrl, blob }) => {
    // Store the edited image in game state
  }}
  onCancel={() => {
    // Return to mission
  }}
  onLoadError={() => {
    // Show in-world error state
  }}
  onError={(error) => {
    console.error(error);
  }}
/>
```

The `image` prop can be an image URL or base64 data URL. `onSave` returns the edited image as both a `dataUrl` and `blob`.

---

# How it fits into our game

The editor is part of the gameplay loop:

```text
MISSION
   ↓
SOURCE PHOTO
   ↓
OPEN IMAGE EDITOR
   ↓
USER EDITS PHOTO
   ↓
SAVE
   ↓
GAME RECEIVES EDITED IMAGE
   ↓
MISSION VALIDATION
   ↓
REWARD
   ↓
EDITED IMAGE USED ELSEWHERE
```

The editor must NOT simply open as an unrelated modal.

It should feel like the player is opening an in-world photography workstation.

---

# Mission Integration

Each mission defines required editing actions.

Example:

```ts
{
  id: "the-boat",
  title: "THE BOAT",
  objective: "Highlight the suspicious vehicle.",
  requiredActions: ["crop", "draw", "text"],
  image: "/missions/the-boat.jpg"
}
```

When the editor opens, show the mission objective beside it.

Example:

```text
MISSION OBJECTIVE

HIGHLIGHT THE VEHICLE
Add an annotation identifying anything suspicious.
```

---

# Tracking Editor Usage

Track the actions the player performs so the game can determine whether the mission objective was completed.

Example:

```ts
interface EditorSession {
  missionId: string;
  sourceImage: string;
  actions: string[];
  editedImage: string | null;
  submitted: boolean;
}
```

Possible action types:

```text
crop
resize
filter
draw
text
shape
sticker
frame
```

Do NOT modify the editor library internals just to create this tracking system.

Keep game state separate from the editor itself.

---

# Editor Tool Configuration

The editor currently provides:

* Filter
* Crop
* Resize
* Draw
* Text
* Shapes
* Stickers
* Frame

These tools can be enabled/disabled through:

```tsx
options={{
  features: {
    imageEditor: {
      tools: {
        crop: true,
        draw: true,
        text: true,
        filter: true,
      },
    },
  },
}}
```

The available tool configuration is documented by Unlayer. Decide the toolset before mounting because changing the `features` configuration causes the editor to remount.

For the first implementation, prefer a focused toolset rather than exposing every tool unnecessarily.

---

# Saving the Result

When the player saves:

```tsx
onSave={({ dataUrl, blob }) => {
  gameStore.completeEditorSession({
    missionId,
    editedImage: dataUrl,
  });
}}
```

The edited `dataUrl` should then be reused by the application.

For example:

```text
EDITOR RESULT
      ↓
MISSION RESULT
      ↓
NEWSROOM ARTICLE
      ↓
PLAYER'S PUBLISHED PHOTO
```

This is critical.

The edited image must visibly matter after leaving the editor.

---

# Using the Editor Ref

The official component exposes an editor instance through `ref`.

Useful methods include:

```ts
editorRef.current?.editor?.getImage();
editorRef.current?.editor?.hasChanges();
editorRef.current?.editor?.reset();
```

Use `getImage()` when the game needs the current canvas output outside the normal save callback.

---

# Important Architecture Rule

Do not make the entire game depend on the editor component's internal state.

Use:

```text
GAME STATE
    ↕
EDITOR SESSION
    ↕
UNLAYER IMAGE EDITOR
```

The game owns:

* mission
* objective
* rewards
* progression
* published image
* contacts
* story state

Unlayer owns:

* canvas
* editing tools
* undo/redo
* image manipulation

The integration layer connects the two.

---

# Editor Screen Design

The editor screen should NOT look like a normal website.

Wrap the Unlayer editor in our own game UI:

```text
┌──────────────────────────────────────────────┐
│ VICE CITY // PHOTO LAB        CASE_014       │
├──────────────────────────────────────────────┤
│                                              │
│            UNLAYER IMAGE EDITOR              │
│                                              │
│                                              │
├──────────────────────────────┬───────────────┤
│ RAW CAPTURE // 014           │ OBJECTIVE     │
│ MARINA DISTRICT              │               │
│ 23:47                        │ HIGHLIGHT     │
│                              │ THE VEHICLE   │
│                              │               │
│                              │ [ SUBMIT ]    │
└──────────────────────────────┴───────────────┘
```

The surrounding UI is ours.

The actual image editing surface is Unlayer.

---

# Do not fake the editor

Do not recreate crop/filter/drawing functionality with CSS or canvas just for visual similarity.

Use the actual Unlayer component and make the experience around it distinctive.

The challenge specifically expects React Image Editor to be a core part of the project, so the real editor must be visible and genuinely used.

---

# Documentation Rule

Before writing the editor integration, inspect the current official documentation and GitHub README because the editor API may change.

Prefer the official package/API over snippets copied from unrelated tutorials.

Official sources:

* https://docs.unlayer.com/builder/latest/image-editor
* https://github.com/unlayer/react-image-editor

