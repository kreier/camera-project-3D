# AI Assistant Reference (CLAUDE / CURSOR / AGENTS)

## Project Overview
Camera-Project-3D provides real-time in-browser object detection via webcam and 3D ToF LIDAR assistance for blind and visually impaired users.

## Core Rules
- **Fast Startup First**: The default in-browser model is `lite_mobilenet_v2` (~2.5 MB). Always maintain instant startup.
- **Dual Datasets**: Supports both COCO (80 classes) and Objects365 (365 classes). Configure in `models.js` and `objects365.js`.
- **Static Deployment**: The web app runs statically from the root (`index.html`, `styles.css`, `app.js`, `models.js`, `objects365.js`). GitHub Actions deploys root directly to GitHub Pages without mandatory compile steps.
- **Model Weights**: Never commit binary weights (`.pt`, `.onnx`, `.tflite`). Keep them in `.gitignore`.

## Essential Commands
```bash
# Start local preview server (zero-dependencies)
npm start
# or
python3 -m http.server 3000

# Run syntax & integrity checks
npm test

# Python script
python3 -m py_compile detection.py
python3 detection.py --camera 0 --conf 0.4
```
