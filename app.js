/**
 * app.js - Main Application Controller for Vision3D Assistive Detector
 * Supports COCO (80 Classes) and Objects365 (365 Classes)
 * Part of Camera-Project-3D (Version v0.1.2)
 */

import {
  DATASETS,
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
const activeDatasetBadge = document.getElementById('activeDatasetBadge');
const activeModelBadge = document.getElementById('activeModelBadge');
const modelStatusDot = document.getElementById('modelStatusDot');
const modelStatusText = document.getElementById('modelStatusText');
const streamStatus = document.getElementById('streamStatus');
const classFilterHint = document.getElementById('classFilterHint');
const activeClassCountBadge = document.getElementById('activeClassCountBadge');

const toggleWebcamBtn = document.getElementById('toggleWebcamBtn');
const webcamBtnText = document.getElementById('webcamBtnText');
const flipCameraBtn = document.getElementById('flipCameraBtn');
const captureSnapshotBtn = document.getElementById('captureSnapshotBtn');
const cameraSelect = document.getElementById('cameraSelect');

const tabCoco = document.getElementById('tabCoco');
const tabObjects365 = document.getElementById('tabObjects365');
const modelPickerList = document.getElementById('modelPickerList');
const presetButtonsContainer = document.getElementById('presetButtonsContainer');
const classBadgeContainer = document.getElementById('classBadgeContainer');
const classSearchInput = document.getElementById('classSearchInput');
const selectAllClassesBtn = document.getElementById('selectAllClassesBtn');
const clearAllClassesBtn = document.getElementById('clearAllClassesBtn');

const confidenceSlider = document.getElementById('confidenceSlider');
const confidenceValue = document.getElementById('confidenceValue');
const audioGuidanceToggle = document.getElementById('audioGuidanceToggle');
const speechThrottleSlider = document.getElementById('speechThrottleSlider');
const speechThrottleValue = document.getElementById('speechThrottleValue');

// Application State
const state = {
  activeDataset: 'coco', // 'coco' or 'objects365'
  currentModelId: 'lite_mobilenet_v2', // Starts fast with the lightest model
  isWebcamActive: false,
  isFlipped: false,
  isDetecting: false,
  minConfidence: 0.40,
  selectedClasses: new Set(DATASETS.coco.presets.essential10.classes),
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

// Distinct Class Colors for Guidance
const COLOR_PALETTE = [
  '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#6366f1', '#14b8a6', '#d946ef', '#84cc16',
  '#f97316', '#a855f7', '#e11d48', '#0284c7', '#059669'
];

function getClassColor(className) {
  let hash = 0;
  for (let i = 0; i < className.length; i++) {
    hash = className.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
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

  if (state.isFlipped) {
    sCtx.save();
    sCtx.scale(-1, 1);
    sCtx.drawImage(videoEl, -snapCanvas.width, 0, snapCanvas.width, snapCanvas.height);
    sCtx.restore();
  } else {
    sCtx.drawImage(videoEl, 0, 0, snapCanvas.width, snapCanvas.height);
  }

  renderDetections(sCtx, state.lastDetections, snapCanvas.width, snapCanvas.height, state.isFlipped);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const link = document.createElement('a');
  link.download = `vision3d-${state.activeDataset}-${timestamp}.png`;
  link.href = snapCanvas.toDataURL('image/png');
  link.click();
}

/* ==========================================================================
   2. Dataset & Model Switching
   ========================================================================== */

function switchDataset(datasetKey) {
  if (state.activeDataset === datasetKey) return;

  state.activeDataset = datasetKey;
  const ds = DATASETS[datasetKey];

  // Update tabs
  tabCoco.classList.toggle('active', datasetKey === 'coco');
  tabObjects365.classList.toggle('active', datasetKey === 'objects365');

  // Update telemetry, hint, and optimal confidence threshold
  if (datasetKey === 'coco') {
    activeDatasetBadge.textContent = 'COCO (80)';
    activeDatasetBadge.style.color = '#10b981';
    classFilterHint.textContent = 'COCO benchmark: 80 common object classes';
    state.minConfidence = 0.40;
    confidenceSlider.value = 40;
    confidenceValue.textContent = '40%';
  } else {
    activeDatasetBadge.textContent = 'Objects365 (365)';
    activeDatasetBadge.style.color = '#c084fc';
    classFilterHint.textContent = 'Objects365: 365 daily objects, stairs, appliances, tools & hazards';
    state.minConfidence = 0.25;
    confidenceSlider.value = 25;
    confidenceValue.textContent = '25%';
  }

  // Set default preset
  state.activePreset = ds.defaultPreset;
  state.selectedClasses = new Set(ds.presets[ds.defaultPreset].classes);

  renderPresetButtons();
  renderModelPickerList();
  renderClassBadges();

  // Switch to default model for this dataset
  switchModel(ds.defaultModel);
}

async function switchModel(modelId) {
  state.currentModelId = modelId;
  renderModelPickerList();

  const ds = DATASETS[state.activeDataset];
  let modelInfo = ds.models.find(m => m.id === modelId);
  if (!modelInfo) {
    // Look in other dataset if not found
    for (const d of Object.values(DATASETS)) {
      const f = d.models.find(m => m.id === modelId);
      if (f) { modelInfo = f; break; }
    }
  }

  if (modelInfo && modelInfo.family === 'onnx' && state.minConfidence > 0.25) {
    state.minConfidence = 0.25;
    confidenceSlider.value = 25;
    confidenceValue.textContent = '25%';
  }

  activeModelBadge.textContent = modelInfo ? modelInfo.name.split(' ')[0] : modelId;

  showOverlayProgress(`Loading ${modelInfo.name}...`, 25);
  modelStatusDot.className = 'status-indicator';
  modelStatusText.textContent = `Preparing ${modelInfo.name} (${modelInfo.sizeMB} MB)...`;

  try {
    const startTime = performance.now();
    await loadModel(modelId, (progress) => {
      showOverlayProgress(progress.text, progress.percent || 50);
      modelStatusText.textContent = progress.text;
    });

    const elapsed = Math.round(performance.now() - startTime);
    modelStatusDot.className = 'status-indicator ready';
    modelStatusText.textContent = `${modelInfo.name} active (${elapsed}ms ready)`;
    hideOverlay();
  } catch (err) {
    console.error('Failed to load model:', err);
    modelStatusDot.className = 'status-indicator';
    modelStatusText.textContent = `Notice: ${err.message}`;
    showOverlayError(`Failed to load ${modelInfo.name}: ${err.message}`);
  }
}

function renderModelPickerList() {
  modelPickerList.innerHTML = '';
  const currentDataset = DATASETS[state.activeDataset];

  currentDataset.models.forEach(model => {
    const item = document.createElement('div');
    const isActive = model.id === state.currentModelId;
    item.className = `model-choice-item ${isActive ? 'active' : ''}`;
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

function renderPresetButtons() {
  presetButtonsContainer.innerHTML = '';
  const ds = DATASETS[state.activeDataset];

  Object.values(ds.presets).forEach(preset => {
    const btn = document.createElement('button');
    btn.className = `preset-btn ${preset.id === state.activePreset ? 'active' : ''}`;
    btn.textContent = preset.name;
    btn.title = preset.description;
    btn.addEventListener('click', () => {
      state.activePreset = preset.id;
      state.selectedClasses = new Set(preset.classes);
      renderPresetButtons();
      renderClassBadges(classSearchInput.value);
    });
    presetButtonsContainer.appendChild(btn);
  });
}

function showOverlayProgress(msg, percent) {
  viewportOverlay.classList.remove('hidden');
  overlayMessage.textContent = msg;
  progressBarFill.style.width = `${percent}%`;
  progressBarFill.style.backgroundColor = 'var(--primary)';
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
  const ds = DATASETS[state.activeDataset];
  const search = filterSearch.trim().toLowerCase();

  let countVisible = 0;
  ds.classes.forEach(className => {
    const norm = className.toLowerCase();
    if (search && !norm.includes(search)) return;

    countVisible++;
    const badge = document.createElement('span');
    const isSelected = state.selectedClasses.has(className) || state.selectedClasses.has(norm);

    badge.className = `class-badge ${isSelected ? 'selected' : ''}`;
    badge.textContent = className;
    badge.title = `Click to toggle ${className}`;

    badge.addEventListener('click', () => {
      if (state.selectedClasses.has(className)) {
        state.selectedClasses.delete(className);
        state.selectedClasses.delete(norm);
      } else {
        state.selectedClasses.add(className);
      }
      state.activePreset = 'custom';
      renderPresetButtons();
      renderClassBadges(classSearchInput.value);
    });

    classBadgeContainer.appendChild(badge);
  });

  activeClassCountBadge.textContent = `${state.selectedClasses.size} Active`;
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

      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      renderDetections(ctx, detections, canvasEl.width, canvasEl.height, state.isFlipped);

      triggerAudioGuidance(detections, canvasEl.width);

      objectsCounter.textContent = detections.length;
      latencyCounter.textContent = `${state.latency} ms`;
    } catch (err) {
      console.warn('Detection frame skip:', err);
    }
  }

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
    targetCtx.beginPath();
    targetCtx.moveTo(x, y + cornerSize);
    targetCtx.lineTo(x, y);
    targetCtx.lineTo(x + cornerSize, y);
    targetCtx.stroke();

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
  // Webcam Controls
  toggleWebcamBtn.addEventListener('click', toggleWebcam);
  flipCameraBtn.addEventListener('click', toggleFlipCamera);
  captureSnapshotBtn.addEventListener('click', captureSnapshot);

  cameraSelect.addEventListener('change', (e) => {
    state.selectedCameraId = e.target.value;
    initWebcam(state.selectedCameraId);
  });

  // Dataset Switcher Tabs
  tabCoco.addEventListener('click', () => switchDataset('coco'));
  tabObjects365.addEventListener('click', () => switchDataset('objects365'));

  // Search & Batch Class Selection
  classSearchInput.addEventListener('input', (e) => {
    renderClassBadges(e.target.value);
  });

  selectAllClassesBtn.addEventListener('click', () => {
    const ds = DATASETS[state.activeDataset];
    state.selectedClasses = new Set(ds.classes);
    state.activePreset = 'all';
    renderPresetButtons();
    renderClassBadges(classSearchInput.value);
  });

  clearAllClassesBtn.addEventListener('click', () => {
    state.selectedClasses.clear();
    state.activePreset = 'custom';
    renderPresetButtons();
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
  renderPresetButtons();
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

window.addEventListener('DOMContentLoaded', main);
