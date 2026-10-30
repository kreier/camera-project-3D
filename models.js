/**
 * models.js - Dual Dataset & Multi-Model Inference Engine
 * Supports COCO (80 classes) and Objects365 (365 classes)
 * Part of Camera-Project-3D (Version v0.1.2)
 */

import { OBJECTS365_CLASSES, OBJECTS365_PRESETS } from './objects365.js';

// Full COCO 80 Class Names
export const COCO_CLASSES = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
  'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
  'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
  'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
  'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
  'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
  'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake',
  'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop',
  'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
  'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];

export { OBJECTS365_CLASSES };

// Presets for COCO classes
export const COCO_PRESETS = {
  essential10: {
    id: 'essential10',
    name: '🌟 Top 10 Focus Classes',
    description: 'Person, Smartphone, Book, Car, Cat, Dog, Chair, Bottle, Laptop, Bicycle',
    classes: ['person', 'cell phone', 'book', 'car', 'cat', 'dog', 'chair', 'bottle', 'laptop', 'bicycle']
  },
  assistive: {
    id: 'assistive',
    name: '🚶 Assistive & Obstacle Alerts',
    description: 'Key obstacles for navigation & mobility guidance',
    classes: ['person', 'car', 'bicycle', 'motorcycle', 'bus', 'truck', 'dog', 'chair', 'stop sign', 'traffic light']
  },
  all: {
    id: 'all',
    name: '🌐 All 80 COCO Classes',
    description: 'Every recognizable object in COCO dataset',
    classes: [...COCO_CLASSES]
  }
};

// Unified Datasets Configuration
export const DATASETS = {
  coco: {
    id: 'coco',
    name: 'COCO Dataset',
    classCount: 80,
    badge: 'COCO • 80 Classes',
    description: 'Standard benchmark with 80 common object classes for general guidance.',
    classes: COCO_CLASSES,
    presets: COCO_PRESETS,
    defaultPreset: 'essential10',
    defaultModel: 'lite_mobilenet_v2',
    models: [
      {
        id: 'lite_mobilenet_v2',
        dataset: 'coco',
        name: 'MobileNet v2 Lite (Ultra Fast)',
        family: 'tensorflow',
        base: 'lite_mobilenet_v2',
        sizeMB: 18.5,
        speed: 'Ultra Fast (~15-30ms)',
        accuracy: 'Good (Mobile-Optimized)',
        description: 'Lightweight MobileNet v2 detector (~18.5 MB total weights). Starts by default with CacheStorage acceleration.',
        recommended: true,
        isDefault: true
      },
      {
        id: 'mobilenet_v2',
        dataset: 'coco',
        name: 'MobileNet v2 Standard',
        family: 'tensorflow',
        base: 'mobilenet_v2',
        sizeMB: 18.5,
        speed: 'Fast (~30-50ms)',
        accuracy: 'Very Good',
        description: 'Balanced speed and precision with stable bounding boxes.',
        recommended: false,
        isDefault: false
      },
      {
        id: 'mobilenet_v1',
        dataset: 'coco',
        name: 'MobileNet v1 Deep',
        family: 'tensorflow',
        base: 'mobilenet_v1',
        sizeMB: 27.0,
        speed: 'Moderate (~60-90ms)',
        accuracy: 'High Accuracy',
        description: 'Deeper feature extraction for challenging crowded scenes.',
        recommended: false,
        isDefault: false
      },
      {
        id: 'efficientdet_lite0',
        dataset: 'coco',
        name: 'MediaPipe EfficientDet-Lite0',
        family: 'mediapipe',
        modelUrl: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite',
        sizeMB: 4.4,
        speed: 'Fast (~25-45ms)',
        accuracy: 'High (EfficientNet)',
        description: "Google's lightweight vision detector running via WebAssembly and WebGL delegate.",
        recommended: false,
        isDefault: false
      },
      {
        id: 'efficientdet_lite2',
        dataset: 'coco',
        name: 'MediaPipe EfficientDet-Lite2',
        family: 'mediapipe',
        modelUrl: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite2/float16/1/efficientdet_lite2.tflite',
        sizeMB: 7.2,
        speed: 'Moderate (~45-75ms)',
        accuracy: 'Very High (448x448 input)',
        description: 'Higher resolution input model for fine-grained detection of small objects.',
        recommended: false,
        isDefault: false
      }
    ]
  },
  objects365: {
    id: 'objects365',
    name: 'Objects365 Dataset',
    classCount: 365,
    badge: 'Objects365 • 365 Classes',
    description: 'Massive scale 365-class vocabulary for rich daily assistive guidance (stairs, appliances, tools, personal items).',
    classes: OBJECTS365_CLASSES,
    presets: OBJECTS365_PRESETS,
    defaultPreset: 'focus15',
    defaultModel: 'yolo11s_o365_fp32',
    models: [
      {
        id: 'yolo11s_o365_fp32',
        dataset: 'objects365',
        name: 'YOLO11s-O365 (Full FP32)',
        family: 'onnx',
        modelUrl: 'https://huggingface.co/wide-video/yoloe-11-Objects365-v1.0.0/resolve/main/yoloe-11s-seg-object365.onnx',
        sizeMB: 38.5,
        speed: 'Fast (~60-90ms)',
        accuracy: 'Very High (365 Categories)',
        description: 'Full FP32 precision vision model running via multi-threaded WASM with SIMD across all 365 categories.',
        recommended: true,
        isDefault: true
      }
    ]
  }
};

// Active loaded instance state
let currentLoadedModel = null;
let currentModelConfig = null;
let mediaPipeVision = null;
let onnxSession = null;
let onnxOffscreenCanvas = null;
let onnxOffscreenCtx = null;

export const CACHE_NAME = 'vision3d-models-cache-v1';

// Transparent CacheStorage interceptor for model shards and assets
if (typeof window !== 'undefined' && window.caches && !window._cacheFetchPatched) {
  window._cacheFetchPatched = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    const isModelAsset = url.includes('storage.googleapis.com/tfjs-models/') ||
                         url.includes('.tflite') ||
                         url.includes('.onnx') ||
                         url.includes('vision_bundle.mjs');

    if (isModelAsset && (!init || !init.method || init.method.toUpperCase() === 'GET')) {
      try {
        const cache = await window.caches.open(CACHE_NAME);
        const cached = await cache.match(input);
        if (cached) {
          console.log('[CacheStorage] Serving cached model asset:', url);
          return cached;
        }

        const networkResponse = await originalFetch(input, init);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(input, networkResponse.clone()).catch(err => {
            console.warn('[CacheStorage] Put error:', err);
          });
        }
        return networkResponse;
      } catch (err) {
        console.warn('[CacheStorage] Interceptor error, falling back:', err);
        return originalFetch(input, init);
      }
    }

    return originalFetch(input, init);
  };
}

/**
 * Get all models for a specific dataset or all combined
 */
export function getModelsForDataset(datasetId = 'coco') {
  const ds = DATASETS[datasetId];
  return ds ? ds.models : DATASETS.coco.models;
}

/**
 * Load an object detection model by its registry ID
 */
export async function loadModel(modelId, onProgress = () => {}) {
  // Find model across datasets
  let config = null;
  for (const ds of Object.values(DATASETS)) {
    const found = ds.models.find(m => m.id === modelId);
    if (found) {
      config = found;
      break;
    }
  }

  if (!config) {
    throw new Error(`Model with id "${modelId}" not found in registry.`);
  }

  onProgress({ status: 'starting', text: `Preparing ${config.name} (${config.sizeMB} MB)...`, percent: 10 });

  // 1. TensorFlow.js COCO-SSD Family
  if (config.family === 'tensorflow') {
    if (!window.tf || !window.cocoSsd) {
      throw new Error('TensorFlow.js or cocoSsd library is not loaded on window.');
    }

    let isCached = false;
    if (window.caches) {
      try {
        const cache = await window.caches.open(CACHE_NAME);
        const checkUrl = `https://storage.googleapis.com/tfjs-models/savedmodel/${config.base === 'lite_mobilenet_v2' ? 'ssdlite_mobilenet_v2' : 'ssd_' + config.base}/model.json`;
        const match = await cache.match(checkUrl);
        if (match) isCached = true;
      } catch (_) {}
    }

    onProgress({
      status: 'downloading',
      text: isCached
        ? `Loading ${config.name} (from CacheStorage)...`
        : `Loading weights for ${config.name} (${config.sizeMB} MB)...`,
      percent: 40
    });

    await window.tf.ready();

    if (window.tf.getBackend() !== 'webgl' && window.tf.findBackend('webgl')) {
      try {
        await window.tf.setBackend('webgl');
      } catch (e) {
        console.warn('Could not set WebGL backend, using:', window.tf.getBackend());
      }
    }

    const model = await window.cocoSsd.load({ base: config.base });
    currentLoadedModel = model;
    currentModelConfig = config;

    onProgress({
      status: 'ready',
      text: isCached ? `${config.name} ready (CacheStorage)!` : `${config.name} ready!`,
      percent: 100
    });
    return { model, config };
  }

  // 2. MediaPipe EfficientDet Family
  if (config.family === 'mediapipe') {
    onProgress({ status: 'downloading', text: `Fetching MediaPipe Vision WASM & ${config.name}...`, percent: 35 });

    if (!mediaPipeVision) {
      const mpTasks = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
      const fileset = await mpTasks.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      mediaPipeVision = { mpTasks, fileset };
    }

    const { mpTasks, fileset } = mediaPipeVision;
    onProgress({ status: 'compiling', text: `Initializing detector with GPU delegate...`, percent: 85 });

    const detector = await mpTasks.ObjectDetector.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: config.modelUrl,
        delegate: 'GPU'
      },
      scoreThreshold: 0.15,
      runningMode: 'VIDEO',
      maxResults: 25
    });

    currentLoadedModel = detector;
    currentModelConfig = config;

    onProgress({ status: 'ready', text: `${config.name} ready!`, percent: 100 });
    return { model: detector, config };
  }

  // 3. ONNX Runtime Web Family (Objects365 YOLO11)
  if (config.family === 'onnx') {
    if (!window.ort) {
      throw new Error('ONNX Runtime Web (ort) library is not loaded on window.');
    }

    try {
      // Configure WASM environment & multithreading
      if (window.ort.env && window.ort.env.wasm) {
        window.ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);
        window.ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.2/dist/';
      }

      let modelBuffer = null;
      let fromCache = false;

      // 1. Check local CacheStorage first for instant loading
      if (window.caches) {
        try {
          const cache = await window.caches.open(CACHE_NAME);
          const cachedResp = await cache.match(config.modelUrl);
          if (cachedResp) {
            onProgress({
              status: 'downloading',
              text: `Loading ${config.name} from local CacheStorage...`,
              percent: 70
            });
            const blob = await cachedResp.blob();
            modelBuffer = new Uint8Array(await blob.arrayBuffer());
            fromCache = true;
          }
        } catch (cacheErr) {
          console.warn('[CacheStorage] ONNX cache read error:', cacheErr);
        }
      }

      // 2. Fetch from network if not in cache
      if (!modelBuffer) {
        onProgress({ status: 'downloading', text: `Downloading ${config.name} (${config.sizeMB} MB)...`, percent: 20 });
        const response = await fetch(config.modelUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} when fetching ONNX weights from Hugging Face`);
        }

        const contentLength = +response.headers.get('Content-Length') || (config.sizeMB * 1024 * 1024);
        const reader = response.body.getReader();
        let receivedBytes = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedBytes += value.length;
          const pct = Math.min(90, Math.round((receivedBytes / contentLength) * 100));
          onProgress({
            status: 'downloading',
            text: `Downloading ${config.name}: ${(receivedBytes / (1024 * 1024)).toFixed(1)} / ${(contentLength / (1024 * 1024)).toFixed(1)} MB (${pct}%)`,
            percent: pct
          });
        }

        modelBuffer = new Uint8Array(receivedBytes);
        let offset = 0;
        for (const chunk of chunks) {
          modelBuffer.set(chunk, offset);
          offset += chunk.length;
        }

        // Save to CacheStorage for next visit
        if (window.caches) {
          try {
            const cache = await window.caches.open(CACHE_NAME);
            cache.put(config.modelUrl, new Response(modelBuffer.slice(0), {
              headers: { 'Content-Type': 'application/octet-stream' }
            })).catch(e => console.warn('[CacheStorage] Put error:', e));
          } catch (_) {}
        }
      }

      onProgress({ status: 'compiling', text: `Compiling ONNX computation graph (WebGPU / WASM)...`, percent: 95 });

      // Multi-provider fallback with dry-run operator verification:
      // 1. If WebGPU is supported, test with an actual dry-run inference to ensure all ops (like DFL Softmax) succeed
      // 2. If WebGPU fails (due to DFL axis constraint or driver error), fallback to WASM with SIMD/multithreading
      let session = null;
      let usedProvider = 'wasm';

      if (navigator.gpu) {
        try {
          const testSession = await window.ort.InferenceSession.create(modelBuffer.slice(0).buffer, {
            executionProviders: ['webgpu']
          });
          // Validate with a dry-run inference to test WebGPU kernel compatibility
          const dummyData = new Float32Array(3 * 640 * 640);
          const dummyTensor = new window.ort.Tensor('float32', dummyData, [1, 3, 640, 640]);
          const inputName = testSession.inputNames[0] || 'images';
          const testOut = await testSession.run({ [inputName]: dummyTensor });
          if (testOut && testOut[testSession.outputNames[0]]) {
            session = testSession;
            usedProvider = 'webgpu';
            console.log(`[ONNX] Successfully verified ${config.name} with WebGPU backend.`);
          }
        } catch (gpuErr) {
          console.warn('[ONNX] WebGPU cannot run this model (e.g. DFL Softmax axis constraint). Falling back to WASM:', gpuErr);
          session = null;
        }
      }

      if (!session) {
        session = await window.ort.InferenceSession.create(modelBuffer.buffer, {
          executionProviders: ['wasm']
        });
        // Warm up WASM session to pre-compile CPU kernels
        try {
          const dummyData = new Float32Array(3 * 640 * 640);
          const dummyTensor = new window.ort.Tensor('float32', dummyData, [1, 3, 640, 640]);
          const inputName = session.inputNames[0] || 'images';
          await session.run({ [inputName]: dummyTensor });
        } catch (warmupErr) {
          console.warn('[ONNX] WASM warm-up warning:', warmupErr);
        }
        usedProvider = 'wasm';
        console.log(`[ONNX] Successfully verified ${config.name} with WASM backend.`);
      }

      onnxSession = session;
      currentLoadedModel = session;
      currentModelConfig = config;

      const cacheLabel = fromCache ? ' [CacheStorage]' : '';
      onProgress({
        status: 'ready',
        text: `${config.name} ready (${usedProvider.toUpperCase()})${cacheLabel}!`,
        percent: 100
      });
      return { model: session, config };
    } catch (err) {
      console.warn('Direct ONNX load error:', err);
      throw new Error(`ONNX model error: ${err.message}. If using remote CDN, ensure network connectivity.`);
    }
  }

  throw new Error(`Unsupported model family: ${config.family}`);
}

/**
 * Execute detection on an HTMLVideoElement or Canvas
 */
export async function detectObjects(videoElement, minScore = 0.35, activeClasses = null) {
  if (!currentLoadedModel || !currentModelConfig) {
    return [];
  }

  const results = [];
  const now = performance.now();

  // 1. TensorFlow.js COCO-SSD
  if (currentModelConfig.family === 'tensorflow') {
    const rawPredictions = await currentLoadedModel.detect(videoElement, 25, 0.15);

    for (const pred of rawPredictions) {
      const className = pred.class.toLowerCase();
      const normalizedClass = className === 'cellphone' ? 'cell phone' : className;

      if (pred.score >= minScore) {
        if (!activeClasses || activeClasses.has(normalizedClass)) {
          results.push({
            class: normalizedClass,
            score: pred.score,
            bbox: [
              Math.max(0, pred.bbox[0]),
              Math.max(0, pred.bbox[1]),
              pred.bbox[2],
              pred.bbox[3]
            ]
          });
        }
      }
    }
    return results;
  }

  // 2. MediaPipe ObjectDetector
  if (currentModelConfig.family === 'mediapipe') {
    const mpResults = currentLoadedModel.detectForVideo(videoElement, now);
    if (mpResults && mpResults.detections) {
      for (const det of mpResults.detections) {
        if (!det.categories || det.categories.length === 0) continue;
        const topCategory = det.categories[0];
        const className = topCategory.categoryName.toLowerCase();
        const normalizedClass = className === 'cellphone' ? 'cell phone' : className;

        if (topCategory.score >= minScore) {
          if (!activeClasses || activeClasses.has(normalizedClass)) {
            const b = det.boundingBox;
            results.push({
              class: normalizedClass,
              score: topCategory.score,
              bbox: [b.originX, b.originY, b.width, b.height]
            });
          }
        }
      }
    }
    return results;
  }

  // 3. ONNX Runtime Web (Objects365 YOLO11 / DETR)
  if (currentModelConfig.family === 'onnx' && onnxSession) {
    try {
      const inputWidth = 640;
      const inputHeight = 640;

      if (!onnxOffscreenCanvas) {
        onnxOffscreenCanvas = document.createElement('canvas');
        onnxOffscreenCanvas.width = inputWidth;
        onnxOffscreenCanvas.height = inputHeight;
        onnxOffscreenCtx = onnxOffscreenCanvas.getContext('2d', { willReadFrequently: true });
      }

      onnxOffscreenCtx.drawImage(videoElement, 0, 0, inputWidth, inputHeight);
      const imgData = onnxOffscreenCtx.getImageData(0, 0, inputWidth, inputHeight).data;

      // Convert RGBA HWC to Float32 CHW normalized [0, 1]
      const floatData = new Float32Array(3 * inputWidth * inputHeight);
      const area = inputWidth * inputHeight;
      for (let i = 0; i < area; i++) {
        floatData[i] = imgData[i * 4] / 255.0;            // R
        floatData[area + i] = imgData[i * 4 + 1] / 255.0;     // G
        floatData[area * 2 + i] = imgData[i * 4 + 2] / 255.0; // B
      }

      const inputTensor = new window.ort.Tensor('float32', floatData, [1, 3, inputHeight, inputWidth]);
      const inputName = onnxSession.inputNames[0] || 'images';
      const output = await onnxSession.run({ [inputName]: inputTensor });
      const outputTensor = output[onnxSession.outputNames[0]];

      let data = null;
      if (outputTensor) {
        if (typeof outputTensor.getData === 'function') {
          data = await outputTensor.getData();
        } else {
          data = outputTensor.data;
        }
      }

      if (data) {
        const numClasses = 365;
        const numBoxes = 8400;
        const scaleX = (videoElement.videoWidth || inputWidth) / inputWidth;
        const scaleY = (videoElement.videoHeight || inputHeight) / inputHeight;

        // Determine target class indices from activeClasses filter
        let targetClassIndices = [];
        if (activeClasses && activeClasses.size > 0) {
          for (let c = 0; c < numClasses; c++) {
            const raw = OBJECTS365_CLASSES[c];
            if (raw && (activeClasses.has(raw) || activeClasses.has(raw.toLowerCase()))) {
              targetClassIndices.push(c);
            }
          }
        }
        if (targetClassIndices.length === 0) {
          for (let c = 0; c < numClasses; c++) {
            targetClassIndices.push(c);
          }
        }

        const candidates = [];

        // Fast contiguous memory scan per class
        for (let i = 0; i < targetClassIndices.length; i++) {
          const c = targetClassIndices[i];
          const offset = (4 + c) * numBoxes;
          for (let b = 0; b < numBoxes; b++) {
            const score = data[offset + b];
            if (score >= minScore) {
              candidates.push({ b, classId: c, score });
            }
          }
        }

        if (candidates.length > 0) {
          // Sort candidates descending by confidence score
          candidates.sort((a, b) => b.score - a.score);

          // Non-Maximum Suppression (NMS) with IoU threshold 0.45
          const selected = [];
          const boxes = [];

          for (let i = 0; i < candidates.length && selected.length < 30; i++) {
            const cand = candidates[i];
            const b = cand.b;
            const cx = data[0 * numBoxes + b] * scaleX;
            const cy = data[1 * numBoxes + b] * scaleY;
            const w = data[2 * numBoxes + b] * scaleX;
            const h = data[3 * numBoxes + b] * scaleY;

            if (w <= 8 || h <= 8 || isNaN(w) || isNaN(h)) continue;

            const x = Math.max(0, cx - w / 2);
            const y = Math.max(0, cy - h / 2);

            let overlap = false;
            for (let j = 0; j < selected.length; j++) {
              if (selected[j].classId === cand.classId) {
                const prev = boxes[j];
                const x1 = Math.max(x, prev[0]);
                const y1 = Math.max(y, prev[1]);
                const x2 = Math.min(x + w, prev[0] + prev[2]);
                const y2 = Math.min(y + h, prev[1] + prev[3]);
                const interW = Math.max(0, x2 - x1);
                const interH = Math.max(0, y2 - y1);
                const interArea = interW * interH;
                const unionArea = (w * h) + (prev[2] * prev[3]) - interArea;
                const iou = unionArea > 0 ? interArea / unionArea : 0;

                if (iou > 0.45) {
                  overlap = true;
                  break;
                }
              }
            }

            if (!overlap) {
              selected.push(cand);
              boxes.push([x, y, w, h]);
              results.push({
                class: OBJECTS365_CLASSES[cand.classId] || `Class ${cand.classId}`,
                score: cand.score,
                bbox: [x, y, w, h]
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('[Vision3D ONNX Inference Error]:', e);
    }
    return results;
  }

  return results;
}
