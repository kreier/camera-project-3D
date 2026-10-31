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

- ⚡ **Ultra-Fast Instant Startup**: Boots with `MobileNet v2 Lite` (~17.7 MB) accelerated by browser `CacheStorage` for instant sub-second reload on return visits.
- 🌐 **Dataset Switcher (COCO & Objects365)**: Toggle between standard **COCO (80 classes)** and the massive **Objects365 (365 classes)** dataset with a single click.
- 🔄 **On-Demand Browser Model Switching**:
  
  #### COCO Models (80 Classes)
  | Model | Size | Engine | Latency (approx) | Best For |
  | :--- | :--- | :--- | :--- | :--- |
  | **MobileNet v2 Lite** *(Default)* | ~17.7 MB | TensorFlow.js / WebGL + CacheStorage | 15–30 ms | Instant startup, mobile devices, low memory |
  | **MobileNet v2 Standard** | ~64.6 MB | TensorFlow.js / WebGL | 30–50 ms | Standard 17-shard model, stable bounding boxes |
  | **MobileNet v1 Deep** | ~26.3 MB | TensorFlow.js / WebGL | 60–90 ms | High-accuracy detection in crowded scenes |
  | **MediaPipe EfficientDet-Lite0** | ~6.9 MB | MediaPipe / WebAssembly | 25–45 ms | EfficientNet mobile vision architecture |
  | **MediaPipe EfficientDet-Lite2** | ~11.6 MB | MediaPipe / WebAssembly | 45–75 ms | High-resolution (448×448) fine-grained detection |

  #### Objects365 Models (365 Classes - Rich Daily Vocabulary)
  | Model | Size | Engine | Latency (approx) | Best For |
  | :--- | :--- | :--- | :--- | :--- |
  | **YOLO11s-O365 (Full FP32)** *(Default)* | ~36.7 MB | ONNX Runtime Web / Multi-Threaded WASM SIMD | 60–90 ms | Flagship Ultralytics YOLO11 model in full precision across all 365 categories |
  | **D-FINE-S O365 (Quantized Q4)** | ~23.1 MB | ONNX Runtime Web / Multi-Threaded WASM SIMD | 30–55 ms | Compact end-to-end vision transformer with block quantization and zero integer op conflicts |
  | **D-FINE-S O365 (Full FP32)** | ~40.2 MB | ONNX Runtime Web / Multi-Threaded WASM SIMD | 50–80 ms | Full-precision DETR transformer with 300 query slots and maximum detection fidelity |

- 🎯 **Target Class Filtering & Presets**:
  - **COCO Presets**: Top 10 Focus Classes (`person`, `cell phone`, `book`, `car`, `cat`, `dog`, `chair`, `bottle`, `laptop`, `bicycle`), Assistive Obstacles, and All 80 classes.
  - **Objects365 Presets**: Daily Focus 15 (`Person`, `Cell Phone`, `Laptop`, `Chair`, `Glasses`, `Book`, `Desk`, `Cabinet`, `Cup`, `Bottle`, `Door`, `Stairs`, `Key`), Assistive Mobility & Hazards (`Stairs`, `Walking Stick`, `Door`, `Traffic cone`, `Barrier`, `Street Lights`, `Wheelchair`), Indoor Household, and All 365 classes.
  - **Interactive Class Grid & Search**: One-click toggling of any individual class tag across both datasets.
- 🔊 **Assistive Audio Guidance (Text-to-Speech)**: Integrated Web Speech API announces detected objects and directional placement (*"Person ahead"*, *"Stairs on your right"*, *"Key on your left"*) with customizable interval throttling.
- 📹 **Full Camera Control**:
  - Device selector for switching between front/rear cameras or external USB webcams.
  - Horizontal flip (mirror view) toggle.
  - One-click snapshot export with bounding boxes and confidence score overlay.
- 📊 **Real-Time Telemetry**: Live FPS counter, active dataset badge, inference latency in milliseconds, active model size, and object counts.

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

# Run live detection with default COCO lightweight YOLO model
python3 detection.py --dataset coco

# Run live detection with Objects365 models (365 classes)
python3 detection.py --dataset objects365 --model yolov8n-o365.pt

# Optional CLI flags:
python3 detection.py --camera 0 --conf 0.45
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
