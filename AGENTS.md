# Agentic Repository Manual: Camera-Project-3D

> **Welcome AI Agents & Engineers!**
> This repository is configured as an **agentic codebase**. Whether you are Antigravity, Claude, Copilot, Devin, Cursor, or a human contributor, follow the guidelines, architecture boundaries, and verification procedures outlined below.

---

## 1. Project Mission & Scope

**Camera-Project-3D** develops an open-source assistive guidance system designed to help blind and visually impaired individuals navigate indoor and outdoor spaces and locate critical daily objects (e.g., cane, smartphone, keys, doors, obstacles, stairs, cars, pedestrians).

### Dual Architecture
The project is built on two complementary layers:
1. **In-Browser Edge AI Web Application (`/index.html`, `/app.js`, `/models.js`)**:
   - Zero-install, high-speed computer vision running client-side via WebAssembly and WebGL/WebGPU.
   - Starts ultra-fast with lightweight models (`MobileNet v2 Lite`, ~2.5 MB).
   - Dynamically downloads and benchmarks alternative models (`MobileNet v2`, `MobileNet v1`, `MediaPipe EfficientDet`).
   - Interactive class filtering with focus presets (Person, Smartphone, Book, Car, Cat, Dog, etc.).
   - Text-to-Speech (TTS) directional audio feedback.
   - Automatically deployed to **GitHub Pages** via GitHub Actions.
2. **Hardware / Python Edge Pipeline (`/detection.py`, `/requirements.txt`)**:
   - Interfaces with the **STEVAL-VL53L9 ToF 3D LIDAR camera** and local YOLO inference engines for hardware depth guidance and spatial obstacle mapping.

---

## 2. Directory Structure

```
camera-project-3D/
├── .github/
│   ├── workflows/
│   │   ├── deploy-pages.yml      # Automated deployment to GitHub Pages
│   │   └── ci.yml                # CI syntax and file integrity checks
│   ├── ISSUE_TEMPLATE/           # Agent & human structured issue templates
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   └── pull_request_template.md  # Standard pull request checklist
├── .agent/
│   └── instructions.md           # Agent configuration & operating context
├── AGENTS.md                     # This file (Agent operating manual)
├── CLAUDE.md                     # Quick agent instructions for Claude & Cursor
├── CONTRIBUTING.md               # Contribution workflow
├── index.html                    # Web app entry point (GitHub Pages root)
├── styles.css                    # Responsive dark glassmorphism stylesheet
├── app.js                        # Webcam lifecycle, render loop, TTS, UI controller
├── models.js                     # Model registry, download manager, COCO classes
├── package.json                  # Local development scripts & validation
├── detection.py                  # Python OpenCV + YOLO webcam detector
├── requirements.txt              # Python dependencies
├── README.md                     # Primary repository documentation
├── LICENSE                       # MIT License
└── .gitignore                    # Build, model weights, venv, and cache rules
```

---

## 3. Agent Operating Principles

When an AI agent works on this codebase, adhere to the following rules:

### A. Non-Breaking Deployments
- `index.html` at the repository root must remain self-contained or use standard ES module imports so that GitHub Pages can deploy it directly without an obligatory build pipeline.
- If dependencies are added to `package.json`, ensure zero-dependency local development (`npm start`) remains functional.

### B. Lightweight First Strategy
- Always prioritize **speed of initial page load**.
- The default model must always be the lightest available (`lite_mobilenet_v2` or equivalent < 3 MB) to ensure instant startup on low-power devices.
- Larger models (MediaPipe, deeper MobileNets, YOLO ONNX) must be loaded on-demand with explicit user intent and progress feedback.

### C. Accessibility First (Blind & Low Vision Focus)
- All user-facing UI elements must have appropriate ARIA attributes, labels, high contrast ratios, and clear textual feedback.
- The assistive audio guidance (Text-to-Speech) module must throttle announcements to prevent audio collisions and cognitive overload.

### D. Model Weights & Data Storage
- **NEVER** commit `.pt`, `.onnx`, `.tflite`, or raw model weight files to git.
- Keep weights in `.gitignore`. Load browser models from CDNs or cloud storage; load Python models via automated downloading libraries (e.g. Ultralytics cache).

---

## 4. Development & Verification Commands

Agents must verify their changes locally before submitting:

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Start Local Web Server** | `npm start` or `python3 -m http.server 3000` | Serves web app at `http://localhost:3000` |
| **Validate JavaScript** | `npm test` or `node --check app.js && node --check models.js` | Checks JS syntax |
| **Validate Python** | `python3 -m py_compile detection.py` | Checks Python syntax |
| **Run Python YOLO** | `python3 detection.py --conf 0.4` | Tests native OpenCV/YOLO pipeline |

---

## 5. GitHub Pages Deployment Protocol

- **Target Branch**: `main`
- **Workflow**: `.github/workflows/deploy-pages.yml`
- **Deployment URL**: `https://<owner>.github.io/<repo>/` (e.g., `https://kreier.github.io/camera-project-3D/`)
- Ensure GitHub Pages is set to **GitHub Actions** in repository settings (`Settings` -> `Pages` -> `Build and deployment` -> `Source: GitHub Actions`).

---

## 6. Definition of Done (DoD) for Agent Tasks

Before closing an issue or finalizing a task:
1. [ ] JavaScript syntax validated (`node --check app.js && node --check models.js`).
2. [ ] Python syntax validated (`python3 -m py_compile detection.py`).
3. [ ] No unexpected files or model binaries staged (`git status`).
4. [ ] `.gitignore` rules respected.
5. [ ] Relevant documentation updated (`README.md`, `AGENTS.md`).
