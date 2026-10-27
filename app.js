/**
 * app.js - Main Application Controller for Vision3D Assistive Detector
 * Part of Camera-Project-3D Agentic Repository
 */

import {
  COCO_CLASSES,
  CLASS_PRESETS,
  MODEL_REGISTRY,
  loadModel,
  detectObjects
} from './models.js';

// DOM Element References
const videoEl = document.getElementById('webcamVideo');
const canvasEl = document.getElementById('detectionCanvas');
const ctx = canvasEl.getContext('2d');
const viewportOverlay = document.getElementById('viewportOverlay');
const overlayMessage = document.getElementById('overlayMessage');
const progressBarFill = document.getElementById('progressBarFill');

const fpsCounter = document.getElementById('fpsCounter');
const latencyCounter = document.getElementById('latencyCounter');
const objectsCounter = document.getElementById('objectsCounter');
const activeModelBadge = document.getElementById('activeModelBadge');
const modelStatusDot = document.getElementById('modelStatusDot');
const modelStatusText = document.getElementById('modelStatusText');
const streamStatus = document.getElementById('streamStatus');

const toggleWebcamBtn = document.getElementById('toggleWebcamBtn');
const webcamBtnText = document.getElementById('webcamBtnText');
const flipCameraBtn = document.getElementById('flipCameraBtn');
const captureSnapshotBtn = document.getElementById('captureSnapshotBtn');
const cameraSelect = document.getElementById('cameraSelect');

const modelPickerList = document.getElementById('modelPickerList');
const classBadgeContainer = document.getElementById('classBadgeContainer');
const classSearchInput = document.getElementById('classSearchInput');
const selectAllClassesBtn = document.getElementById('selectAllClassesBtn');
const clearAllClassesBtn = document.getElementById('clearAllClassesBtn');
const presetButtons = document.querySelectorAll('.preset-btn');

const confidenceSlider = document.getElementById('confidenceSlider');
const confidenceValue = document.getElementById('confidenceValue');
const audioGuidanceToggle = document.getElementById('audioGuidanceToggle');
const speechThrottleSlider = document.getElementById('speechThrottleSlider');
const speechThrottleValue = document.getElementById('speechThrottleValue');

// Application State
const state = {
  currentModelId: 'lite_mobilenet_v2', // Starts fast with the lightest model
  isWebcamActive: false,
  isFlipped: false,
  isDetecting: false,
  minConfidence: 0.40,
  selectedClasses: new Set(CLASS_PRESETS.essential10.classes),
  activePreset: 'essential10',
  availableCameras: [],
  selectedCameraId: '',
  
  // Performance telemetry
  lastFrameTime: performance.now(),
  frameCount: 0,
  fps: 0,
  latency: 0,
  lastDetections: [],
  
  // Audio Speech Synthesis
  audioEnabled: false,
  speechIntervalSec: 3.0,
  lastSpeechTime: 0,
  speechSynth: window.speechSynthesis || null,
};

// Vibrant Class Colors for Distinct Bounding Boxes
const CLASS_COLORS = {
  'person': '#3b82f6',      // Blue
  'cell phone': '#ec4899',  // Pink
  'book': '#10b981',        // Emerald
  'car': '#f59e0b',         // Amber
  'cat': '#8b5cf6',         // Purple
  'dog': '#06b6d4',         // Cyan
  'chair': '#6366f1',       // Indigo
  'bottle': '#14b8a6',      // Teal
  'laptop': '#d946ef',      // Fuchsia
  'bicycle': '#84cc16',     // Lime
  'default': '#f43f5e'      // Rose
};

function getClassColor(className) {
  return CLASS_COLORS[className] || CLASS_COLORS['default'];
}

/* ==========================================================================
   1. Webcam Stream Lifecycle
   ========================================================================== */

async function initWebcam(deviceId = '') {
  try {
    if (videoEl.srcObject) {
      videoEl.srcObject.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        facingMode: deviceId ? undefined : 'user',
        deviceId: deviceId ? { exact: deviceId } : undefined
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoEl.srcObject = stream;

    return new Promise((resolve) => {
      videoEl.onloadedmetadata = () => {
        videoEl.play();
        syncCanvasDimensions();
        state.isWebcamActive = true;
        updateStreamStatus('Active', 'status-ready');
        webcamBtnText.textContent = 'Pause Camera';
        resolve();
      };
    });
  } catch (err) {
    console.error('Camera initialization error:', err);
    updateStreamStatus('Camera Error', 'status-ready');
    showOverlayError(`Camera access denied or unavailable: ${err.message}`);
  }
}

async function enumerateCameras() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    state.availableCameras = videoDevices;

    cameraSelect.innerHTML = '<option value="">Default Camera</option>';
    videoDevices.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || `Camera ${index + 1}`;
      if (device.deviceId === state.selectedCameraId) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.warn('Could not enumerate cameras:', e);
  }
}

function syncCanvasDimensions() {
  if (videoEl.videoWidth && videoEl.videoHeight) {
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
  }
}

function toggleWebcam() {
  if (!videoEl.srcObject) {
    initWebcam(state.selectedCameraId);
    return;
  }

  const tracks = videoEl.srcObject.getVideoTracks();
  if (tracks.length > 0) {
    const isPaused = !tracks[0].enabled;
    tracks[0].enabled = isPaused;
    state.isWebcamActive = isPaused;
    webcamBtnText.textContent = isPaused ? 'Pause Camera' : 'Resume Camera';
    updateStreamStatus(isPaused ? 'Active' : 'Paused', 'status-ready');
  }
}

function toggleFlipCamera() {
  state.isFlipped = !state.isFlipped;
  videoEl.classList.toggle('flipped', state.isFlipped);
}

function updateStreamStatus(text, className) {
  streamStatus.textContent = text;
  streamStatus.className = `status-pill ${className}`;
}

function captureSnapshot() {
  if (!videoEl.videoWidth || !videoEl.videoHeight) return;

  const snapCanvas = document.createElement('canvas');
  snapCanvas.width = videoEl.videoWidth;
  snapCanvas.height = videoEl.videoHeight;
  const sCtx = snapCanvas.getContext('2d');

  // Draw video frame (respecting flip state)
  if (state.isFlipped) {
    sCtx.save();
    sCtx.scale(-1, 1);
    sCtx.drawImage(videoEl, -snapCanvas.width, 0, snapCanvas.width, snapCanvas.height);
    sCtx.restore();
  } else {
    sCtx.drawImage(videoEl, 0, 0, snapCanvas.width, snapCanvas.height);
  }

  // Draw active annotations
  renderDetections(sCtx, state.lastDetections, snapCanvas.width, snapCanvas.height, state.isFlipped);

  // Trigger download
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const link = document.createElement('a');
  link.download = `vision3d-detection-${timestamp}.png`;
  link.href = snapCanvas.toDataURL('image/png');
  link.click();
}

/* ==========================================================================
   2. Model Loading & Switching
   ========================================================================== */

async function switchModel(modelId) {
  if (modelId === state.currentModelId && state.isDetecting) return;

  state.currentModelId = modelId;
  renderModelPickerList();

  const modelInfo = MODEL_REGISTRY.find(m => m.id === modelId);
  activeModelBadge.textContent = `${modelInfo.name.split(' ')[0]} ${modelInfo.name.split(' ')[1] || ''}`;

  showOverlayProgress(`Loading ${modelInfo.name}...`, 30);
  modelStatusDot.className = 'status-indicator';
  modelStatusText.textContent = `Downloading ${modelInfo.name} (${modelInfo.sizeMB} MB)...`;

  try {
    const startTime = performance.now();
    await loadModel(modelId, (progress) => {
      if (progress.status === 'downloading') {
        showOverlayProgress(progress.text, 65);
      } else if (progress.status === 'compiling') {
        showOverlayProgress(progress.text, 90);
      }
    });

    const elapsed = Math.round(performance.now() - startTime);
    modelStatusDot.className = 'status-indicator ready';
    modelStatusText.textContent = `${modelInfo.name} ready (${elapsed}ms init)`;
    hideOverlay();
  } catch (err) {
    console.error('Failed to load model:', err);
    modelStatusDot.className = 'status-indicator';
    modelStatusText.textContent = `Error: ${err.message}`;
    showOverlayError(`Failed to load ${modelInfo.name}: ${err.message}`);
  }
}

function renderModelPickerList() {
  modelPickerList.innerHTML = '';
  MODEL_REGISTRY.forEach(model => {
    const item = document.createElement('div');
    item.className = `model-choice-item ${model.id === state.currentModelId ? 'active' : ''}`;
    item.innerHTML = `
      <div class="model-item-info">
        <div class="model-item-title">
          ${model.name}
          ${model.recommended ? '<span class="badge badge-success">Recommended</span>' : ''}
        </div>
        <div class="model-item-meta">${model.description}</div>
      </div>
      <div class="model-item-action">
        <span class="model-size-badge">${model.sizeMB} MB</span>
      </div>
    `;
    item.addEventListener('click', () => switchModel(model.id));
    modelPickerList.appendChild(item);
  });
}

function showOverlayProgress(msg, percent) {
  viewportOverlay.classList.remove('hidden');
  overlayMessage.textContent = msg;
  progressBarFill.style.width = `${percent}%`;
}

function hideOverlay() {
  viewportOverlay.classList.add('hidden');
}

function showOverlayError(msg) {
  viewportOverlay.classList.remove('hidden');
  overlayMessage.innerHTML = `<span style="color: #ef4444; font-weight: bold;">⚠️ ${msg}</span>`;
  progressBarFill.style.width = `100%`;
  progressBarFill.style.backgroundColor = '#ef4444';
}

/* ==========================================================================
   3. Class Filtering & Badges
   ========================================================================== */

function renderClassBadges(filterSearch = '') {
  classBadgeContainer.innerHTML = '';
  const search = filterSearch.trim().toLowerCase();

  COCO_CLASSES.forEach(className => {
    if (search && !className.includes(search)) return;

    const badge = document.createElement('span');
    const isSelected = state.selectedClasses.has(className);
    const isEssential = CLASS_PRESETS.essential10.classes.includes(className);

    badge.className = `class-badge ${isSelected ? 'selected' : ''} ${isEssential ? 'highlight' : ''}`;
    badge.textContent = className;
    badge.title = isEssential ? 'Focus class (Essential 10)' : className;

    badge.addEventListener('click', () => {
      if (state.selectedClasses.has(className)) {
        state.selectedClasses.delete(className);
      } else {
        state.selectedClasses.add(className);
      }
      state.activePreset = 'custom';
      updatePresetButtonStates();
      renderClassBadges(classSearchInput.value);
    });

    classBadgeContainer.appendChild(badge);
  });
}

function applyPreset(presetKey) {
  const preset = CLASS_PRESETS[presetKey];
  if (!preset) return;

  state.activePreset = presetKey;
  state.selectedClasses = new Set(preset.classes);
  updatePresetButtonStates();
  renderClassBadges(classSearchInput.value);
}

function updatePresetButtonStates() {
  presetButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === state.activePreset);
  });
}

/* ==========================================================================
   4. Object Detection Loop & Canvas Rendering
   ========================================================================== */

async function detectionLoop() {
  if (state.isWebcamActive && videoEl.readyState >= 2) {
    syncCanvasDimensions();

    const tStart = performance.now();
    try {
      const detections = await detectObjects(videoEl, state.minConfidence, state.selectedClasses);
      const tEnd = performance.now();
      state.latency = Math.round(tEnd - tStart);
      state.lastDetections = detections;

      // Clear & Draw
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      renderDetections(ctx, detections, canvasEl.width, canvasEl.height, state.isFlipped);

      // Assistive Audio Trigger
      triggerAudioGuidance(detections, canvasEl.width);

      // Update counters
      objectsCounter.textContent = detections.length;
      latencyCounter.textContent = `${state.latency} ms`;
    } catch (err) {
      console.warn('Detection frame skip:', err);
    }
  }

  // Calculate FPS
  state.frameCount++;
  const now = performance.now();
  if (now - state.lastFrameTime >= 1000) {
    state.fps = state.frameCount;
    state.frameCount = 0;
    state.lastFrameTime = now;
    fpsCounter.textContent = state.fps;
  }

  requestAnimationFrame(detectionLoop);
}

function renderDetections(targetCtx, detections, width, height, flipped) {
  detections.forEach(det => {
    let [x, y, w, h] = det.bbox;

    // Adjust for horizontal flip if active
    if (flipped) {
      x = width - (x + w);
    }

    const color = getClassColor(det.class);
    const scorePct = Math.round(det.score * 100);
    const labelText = `${det.class.toUpperCase()} ${scorePct}%`;

    // 1. Draw glowing bounding box
    targetCtx.save();
    targetCtx.strokeStyle = color;
    targetCtx.lineWidth = Math.max(2, Math.round(width / 400));
    targetCtx.shadowColor = color;
    targetCtx.shadowBlur = 8;
    targetCtx.strokeRect(x, y, w, h);
    targetCtx.restore();

    // 2. Corner accents
    const cornerSize = Math.min(16, w / 4, h / 4);
    targetCtx.save();
    targetCtx.strokeStyle = '#ffffff';
    targetCtx.lineWidth = targetCtx.lineWidth + 1;
    // Top-left corner
    targetCtx.beginPath();
    targetCtx.moveTo(x, y + cornerSize);
    targetCtx.lineTo(x, y);
    targetCtx.lineTo(x + cornerSize, y);
    targetCtx.stroke();
    // Bottom-right corner
    targetCtx.beginPath();
    targetCtx.moveTo(x + w, y + h - cornerSize);
    targetCtx.lineTo(x + w, y + h);
    targetCtx.lineTo(x + w - cornerSize, y + h);
    targetCtx.stroke();
    targetCtx.restore();

    // 3. Label tag banner
    targetCtx.save();
    const fontSize = Math.max(12, Math.round(width / 70));
    targetCtx.font = `bold ${fontSize}px system-ui, sans-serif`;
    const textMetrics = targetCtx.measureText(labelText);
    const padding = 5;
    const tagWidth = textMetrics.width + padding * 2;
    const tagHeight = fontSize + padding * 2;

    const tagY = y - tagHeight >= 0 ? y - tagHeight : y;
    targetCtx.fillStyle = color;
    targetCtx.fillRect(x, tagY, tagWidth, tagHeight);

    targetCtx.fillStyle = '#ffffff';
    targetCtx.textBaseline = 'top';
    targetCtx.fillText(labelText, x + padding, tagY + padding);
    targetCtx.restore();
  });
}

/* ==========================================================================
   5. Assistive Text-to-Speech Guidance
   ========================================================================== */

function triggerAudioGuidance(detections, frameWidth) {
  if (!state.audioEnabled || !state.speechSynth || detections.length === 0) return;

  const now = performance.now();
  if (now - state.lastSpeechTime < state.speechIntervalSec * 1000) return;
  if (state.speechSynth.speaking) return;

  // Pick highest confidence detection
  const primary = detections[0];
  const centerX = primary.bbox[0] + primary.bbox[2] / 2;
  const ratio = centerX / frameWidth;

  let direction = 'ahead';
  if (ratio < 0.35) {
    direction = state.isFlipped ? 'on your right' : 'on your left';
  } else if (ratio > 0.65) {
    direction = state.isFlipped ? 'on your left' : 'on your right';
  }

  const utteranceText = `${primary.class} ${direction}`;
  const utterance = new SpeechSynthesisUtterance(utteranceText);
  utterance.rate = 1.1;
  utterance.pitch = 1.0;

  state.speechSynth.speak(utterance);
  state.lastSpeechTime = now;
}

/* ==========================================================================
   6. Event Listeners & Initialization
   ========================================================================== */

function setupEventListeners() {
  // Webcam Buttons
  toggleWebcamBtn.addEventListener('click', toggleWebcam);
  flipCameraBtn.addEventListener('click', toggleFlipCamera);
  captureSnapshotBtn.addEventListener('click', captureSnapshot);

  cameraSelect.addEventListener('change', (e) => {
    state.selectedCameraId = e.target.value;
    initWebcam(state.selectedCameraId);
  });

  // Presets
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyPreset(btn.dataset.preset);
    });
  });

  // Search & Batch Class Selection
  classSearchInput.addEventListener('input', (e) => {
    renderClassBadges(e.target.value);
  });

  selectAllClassesBtn.addEventListener('click', () => {
    state.selectedClasses = new Set(COCO_CLASSES);
    state.activePreset = 'all';
    updatePresetButtonStates();
    renderClassBadges(classSearchInput.value);
  });

  clearAllClassesBtn.addEventListener('click', () => {
    state.selectedClasses.clear();
    state.activePreset = 'custom';
    updatePresetButtonStates();
    renderClassBadges(classSearchInput.value);
  });

  // Tuning Sliders
  confidenceSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.minConfidence = val / 100;
    confidenceValue.textContent = `${val}%`;
  });

  speechThrottleSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    state.speechIntervalSec = val;
    speechThrottleValue.textContent = `${val.toFixed(1)}s`;
  });

  audioGuidanceToggle.addEventListener('change', (e) => {
    state.audioEnabled = e.target.checked;
    if (state.audioEnabled && state.speechSynth) {
      const intro = new SpeechSynthesisUtterance('Audio guidance active');
      state.speechSynth.speak(intro);
    }
  });

  window.addEventListener('resize', syncCanvasDimensions);
}

// Bootstrap Application
async function main() {
  setupEventListeners();
  renderModelPickerList();
  renderClassBadges();

  // 1. Fast start: Load lightest model first
  await switchModel(state.currentModelId);

  // 2. Start webcam
  await initWebcam();
  await enumerateCameras();

  // 3. Launch detection loop
  state.isDetecting = true;
  requestAnimationFrame(detectionLoop);
}

// Run on page load
window.addEventListener('DOMContentLoaded', main);
