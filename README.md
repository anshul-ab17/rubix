# Rubix — 3D Rubik's Cube Solver & Scanner

> **Scan your cube. Build it virtually. Solve it step by step.**

**Rubix** is a modern, interactive Rubik's Cube solver built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Three.js**, **Zustand**, and **Kociemba's Two-Phase Optimal 3×3 Algorithm**.

---

## ✨ Features

1. **📸 Computer Vision & Camera Scanner**
   - Guided 6-face capture sequence with physical cube orientation instructions.
   - Live camera detection with 3×3 alignment overlay + Image upload support.
   - CIELAB & HSV delta-E color classification.
   - Interactive sticker correction tool with confidence ratings before solving.

2. **🎨 Interactive Virtual 2D & 3D Cube Editor**
   - Unfolded 2D net layout (U, L, F, R, B, D) with active color palette and face fill tools.
   - Interactive 3D cube with mouse/touch drag rotation and raycasting sticker painting.
   - Split view mode (2D + 3D simultaneously synchronized).
   - Real-time physical cube legality validator (sticker counts, piece pairing, corner twist parity, edge flip parity).

3. **🧠 Optimal Kociemba Two-Phase Solver Engine**
   - Computes near-optimal 18–24 move solutions in milliseconds directly in the browser (100% client-side, zero backend dependencies).
   - Instant solved-state detection.
   - Full diagnostic feedback on impossible or invalid cube states.

4. **👨‍🏫 Step-by-Step Interactive Guide**
   - Move notation card (`R`, `U'`, `F2`, etc.) with 3D animation synchronization.
   - Beginner-friendly natural language instructions ("Turn the Right face clockwise by 90°").
   - Pro fingertrick tips for each turn.
   - Interactive timeline / move pills carousel with jump-to-step support.
   - Play, pause, speed adjustment (0.5s to 2.0s), and keyboard shortcuts (`Space`, `←`, `→`).
   - Celebration confetti on solve completion.

5. **⏱️ Speedcubing Timer & Free Play**
   - Spacebar hold-to-ready timer with millisecond precision.
   - Official WCA scrambles generator.
   - Live 3D cube with on-screen move pad.
   - Solves session history tracking with Best Time and Average of 5 (Ao5).

6. **📖 Beginner Notation Reference**
   - Built-in cheat sheet explaining standard moves (`U, D, L, R, F, B`), prime inverse moves, and double turns.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm

### Installation & Development

```bash
# Clone or navigate to the repository
cd rubix

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start solving!

### Production Build

```bash
npm run build
npm run start
```

---

## 🏗️ Architecture

```text
src/
├── app/
│   ├── layout.tsx         # Root layout with dark aesthetic & fonts
│   ├── page.tsx           # Main application view with mode tabs
│   └── globals.css        # Tailwind styles & keyframe animations
├── components/
│   ├── cube/
│   │   ├── Cube3D.tsx     # Three.js 3D WebGL Cube
│   │   ├── CubeEditor.tsx # 2D Net & Split Editor
│   │   ├── CubeFace.tsx   # 3x3 Facelet grid
│   │   └── ColourPalette.tsx # Color selection bar
│   ├── scanner/
│   │   ├── FaceScanner.tsx   # 6-face guided scanner
│   │   ├── CameraCapture.tsx # Live webcam capture
│   │   └── ImageUploader.tsx # File drag-and-drop
│   ├── solver/
│   │   ├── SolutionViewer.tsx # Step-by-step playback view
│   │   ├── MoveControls.tsx   # Autoplay & navigation controls
│   │   └── ProgressBar.tsx    # Step progress & move pills
│   ├── timer/
│   │   └── CubeTimer.tsx      # Spacebar timer & WCA scramble pad
│   └── guide/
│       └── NotationGuide.tsx  # Modal notation cheat sheet
├── lib/
│   ├── cube/
│   │   ├── cube-state.ts     # State representation & cloning
│   │   ├── cube-moves.ts     # 18 standard 3x3 move permutations
│   │   ├── cube-validator.ts # Physical legality & parity validation
│   │   └── cube-notation.ts  # Human explanations & fingertrick tips
│   ├── scanner/
│   │   └── colour-detection.ts # CIELAB / HSV vision algorithms
│   └── solver/
│       └── solver-adapter.ts   # Kociemba 2-phase solver adapter
├── stores/
│   └── cube-store.ts         # Zustand global state manager
└── types/
    ├── cube.ts               # Core Rubik's cube types
    └── cubejs.d.ts           # Solver types
```

---

## 📜 License

MIT License.
