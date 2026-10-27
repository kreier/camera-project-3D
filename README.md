# Camera-Project-3D 👁️⚡

[![Deploy GitHub Pages](https://github.com/kreier/camera-project-3D/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/kreier/camera-project-3D/actions/workflows/deploy-pages.yml)
[![CI & Code Quality](https://github.com/kreier/camera-project-3D/actions/workflows/ci.yml/badge.svg)](https://github.com/kreier/camera-project-3D/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agentic Repo](https://img.shields.io/badge/Agentic%20Repo-Ready-emerald.svg)](AGENTS.md)

> **Real-Time Edge Computer Vision & 3D LIDAR Guidance for the Visually Impaired.**
> 
> 🌐 **Live Web Application**: [https://kreier.github.io/camera-project-3D/](https://kreier.github.io/camera-project-3D/)

---

## 🌟 Overview

**Camera-Project-3D** is an open-source assistive technology initiative designed to guide blind and visually impaired individuals using real-time edge computer vision and time-of-flight (ToF) 3D LIDAR depth sensing.

The repository includes:
1. **In-Browser Web Application (GitHub Pages)**: Runs client-side object detection directly in any modern browser via your webcam—zero installation, zero cloud servers required.
2. **Local Python Edge Pipeline**: Interfaces with the **STEVAL-VL53L9 ToF 3D LIDAR camera** and local YOLO inference engines for hardware depth guidance.
3. **Agentic Architecture**: Fully configured for AI coding agents (Antigravity, Claude, Copilot, Cursor) with CI workflows, strict guidelines, and test automation.

---

## 🚀 Key Features

- ⚡ **Ultra-Fast Instant Startup**: Automatically boots with the lightest available model (`MobileNet v2 Lite`, ~2.5 MB), achieving immediate real-time video streaming without waiting for massive weights to download.
- 🔄 **On-Demand Browser Model Switching**: Seamlessly download and switch between 5 different vision models directly in the browser:
  | Model | Size | Engine | Latency (approx) | Best For |
  | :--- | :--- | :--- | :--- | :--- |
  | **MobileNet v2 Lite** *(Default)* | ~2.5 MB | TensorFlow.js / WebGL | 15–30 ms | Instant boot, low memory, mobile devices |
  | **MobileNet v2 Standard** | ~5.5 MB | TensorFlow.js / WebGL | 30–50 ms | Balanced precision & bounding box stability |
  | **MobileNet v1 Deep** | ~27.0 MB | TensorFlow.js / WebGL | 60–90 ms | High-accuracy detection in crowded scenes |
  | **MediaPipe EfficientDet-Lite0** | ~4.4 MB | MediaPipe / WebAssembly | 25–45 ms | EfficientNet mobile architecture |
  | **MediaPipe EfficientDet-Lite2** | ~7.2 MB | MediaPipe / WebAssembly | 45–75 ms | High-resolution (448×448) small-object detection |
- 🎯 **Target Class Filtering & Presets**:
  - **Top 10 Focus Classes**: Focused on daily navigation and assistance: `person`, `cell phone` (smartphone), `book`, `car`, `cat`, `dog`, `chair`, `bottle`, `laptop`, `bicycle`.
  - **Assistive & Obstacle Alerts**: Fast filtering for hazards and pedestrians: `person`, `car`, `bicycle`, `motorcycle`, `bus`, `truck`, `dog`, `chair`, `stop sign`, `traffic light`.
  - **All 80 COCO Classes**: Full object vocabulary.
  - **Interactive Class Grid & Search**: One-click toggling of any individual class tag.
- 🔊 **Assistive Audio Guidance (Text-to-Speech)**: Integrated Web Speech API announces detected objects and directional placement (*"Person ahead"*, *"Smartphone on your right"*, *"Book on your left"*) with customizable interval throttling.
- 📹 **Full Camera Control**:
  - Device selector for switching between front/rear cameras or external USB webcams.
  - Horizontal flip (mirror view) toggle.
  - One-click snapshot export with bounding boxes and confidence score overlay.
- 📊 **Real-Time Telemetry**: Live FPS counter, inference latency in milliseconds, active model size, and object counts.

---

## 🛠️ Quick Start

### 1. In-Browser Web Application

#### Option A: Visit the Live Site
Open **[https://kreier.github.io/camera-project-3D/](https://kreier.github.io/camera-project-3D/)** in any modern desktop or mobile browser.

#### Option B: Run Locally
Clone the repository and launch a local web server:

```bash
# Clone the repository
git clone https://github.com/kreier/camera-project-3D.git
cd camera-project-3D

# Launch preview server (Zero dependencies required)
npm start
# OR using Python
python3 -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

---

### 2. Local Python YOLO Detection

To run local inference via Python and OpenCV:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run live detection with default lightweight YOLO nano model
python3 detection.py

# Optional CLI flags:
python3 detection.py --camera 0 --model yolo26n.pt --conf 0.45
```

---

## 🤖 Agentic Architecture

This repository conforms to modern agentic standards:
- **[AGENTS.md](AGENTS.md)**: Agent Operating Manual specifying architecture, boundaries, verification workflows, and coding rules.
- **[CLAUDE.md](CLAUDE.md)**: Compact reference guide for Claude, Cursor, and Copilot.
- **[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)**: Continuous Deployment to GitHub Pages on every push to `main`.
- **[.github/workflows/ci.yml](.github/workflows/ci.yml)**: Automated syntax and integrity checks for JavaScript and Python.
- **Structured Issue & PR Templates**: Formatted templates for bug reports, feature requests, and agent verification checklists.

### Verification Commands
```bash
# Validate JavaScript syntax
npm test

# Validate Python script
python3 -m py_compile detection.py
```

---

## 🎯 Assistive Guidance & 3D LIDAR Roadmap

- [x] In-browser real-time webcam object detection with sub-second startup.
- [x] On-demand switching between ultra-light and sophisticated vision models.
- [x] Class filtering with Top 10 focus classes (person, book, car, smartphone, cat, dog, etc.).
- [x] Directional Text-to-Speech audio cues for low-vision navigation.
- [x] Automated CI/CD deployment to GitHub Pages.
- [ ] Interface browser with WebSerial / WebUSB for live STEVAL-VL53L9 ToF 3D LIDAR data.
- [ ] Fuse 2D bounding boxes with 3D LIDAR point clouds for millimeter-accurate distance estimation.
- [ ] Haptic feedback belt / vibration motor guidance integration.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
