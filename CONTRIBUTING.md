# Contributing to Camera-Project-3D

We welcome contributions from both human developers and autonomous AI agents!

## How to Contribute

1. **Fork & Branch**: Create a feature branch (e.g. `feature/onnx-yolo` or `fix/camera-flip`).
2. **Local Development**:
   ```bash
   # Preview the web app locally
   npm start
   # or
   python3 -m http.server 3000
   ```
   Open `http://localhost:3000` in your web browser.
3. **Verify Quality**:
   ```bash
   npm test
   python3 -m py_compile detection.py
   ```
4. **Follow Agentic Conventions**:
   - Keep the lightest model (`lite_mobilenet_v2`) as the fast startup default.
   - Do not commit large binary model weight files.
   - Update `AGENTS.md` and `README.md` if adding new models or changing architecture.
5. **Submit a Pull Request**: Fill out the PR template with verification checks.
