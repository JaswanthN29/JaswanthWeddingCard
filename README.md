# Jaswanth & Lalitha — Interactive Wedding Invitation UI

A luxurious, traditional digital wedding invitation viewer built with semantic HTML5, modern CSS 3D transforms, and vanilla JavaScript.

Designed specifically to preserve the authentic design identity of the South Indian wedding card with realistic physical page-turn physics.

---

## 🌟 Features

- **Screen 1 — Cover Page**:
  - Displays `Cover.png` centered with authentic proportions and zero distortion.
  - Gentle floating animation (`is-cover-floating`) and soft golden halo glow (`coverGlow`).
  - Interactive "Tap to Open Invitation" prompt with pulsating sparkle indicators.
  - Clicking anywhere on the cover transitions to Screen 2.

- **Screen 2 — Main Wedding Invitation**:
  - Displays `Main.png`.
  - Realistic 3D page-turn animation opening from right to left like a physical wedding card.
  - Navigation controls: `[ Previous ]` (returns to Cover) and `[ Next ]` (opens Back Page).
  - Subtle page indicator: `2 of 3`.

- **Screen 3 — Back Page**:
  - Displays `back.png`.
  - Same smooth 3D page-turn animation with organic aspect ratio adaptation.
  - Navigation controls: `[ Previous ]` (returns to Main) and `[ Start Again ]` (returns to Cover).
  - Subtle page indicator: `3 of 3`.

- **Interaction & Accessibility**:
  - **Touch & Mobile Swipes**: Swipe Left for Next, Swipe Right for Previous.
  - **Keyboard Shortcuts**:
    - <kbd>→</kbd> Right Arrow: Next page
    - <kbd>←</kbd> Left Arrow: Previous page
    - <kbd>Space</kbd> / <kbd>Enter</kbd>: Open invitation / Next page
  - **Fullscreen Toggle**: Discreet fullscreen button in the top right.
  - **Preloading & Performance**: Preloads all 3 high-resolution cards with an elegant gold mandala spinner before unveiling the invitation.

---

## 🎨 Design System

| Element | Specification |
|---|---|
| **Background** | `#F8F5EF` (Warm ivory / cream with subtle paper grain) |
| **Primary Text** | `#29251F` |
| **Gold Accent** | `#B89A60` |
| **Secondary Text** | `#817766` |
| **Navigation Background** | `#FFFFFF` |
| **Typography** | `Playfair Display` (Headings), `Cormorant Garamond` (Subheadings), `Inter` (Controls) |

---

## 📁 Project Structure

```text
JaswanthWeddingCard/
├── assets/
│   ├── Cover.png    # Invitation Cover (Screen 1)
│   ├── Main.png     # Telugu Wedding Details (Screen 2)
│   └── back.png     # Back Page / Family Details (Screen 3)
├── index.html       # Semantic HTML5 markup
├── styles.css       # Design system, 3D transforms & animations
├── app.js           # Navigation state machine & gesture controls
└── README.md        # Documentation
```

---

## 🚀 How to Run Locally

You can run this project in any modern browser without installing any package managers or dependencies:

### Option 1: Direct File Open
Double-click `index.html` or open it directly in Safari, Chrome, Edge, or Firefox.

### Option 2: Local Python Server (Recommended)
From the project folder, run:

```bash
python3 -m http.server 8000
```

Then open your browser to [http://localhost:8000](http://localhost:8000).

