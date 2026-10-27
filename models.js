/**
 * models.js - Dual Dataset & Multi-Model Inference Engine
 * Supports COCO (80 classes) and Objects365 (365 classes)
 * Part of Camera-Project-3D (Version v0.1.1)
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
        sizeMB: 2.5,
        speed: 'Ultra Fast (~15-30ms)',
        accuracy: 'Good (Mobile-Optimized)',
        description: 'Lightest model. Instant sub-second startup, low memory. Starts by default.',
        recommended: true,
        isDefault: true
      },
      {
        id: 'mobilenet_v2',
        dataset: 'coco',
        name: 'MobileNet v2 Standard',
        family: 'tensorflow',
        base: 'mobilenet_v2',
        sizeMB: 5.5,
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
    defaultModel: 'yolo11s_o365_fp16',
    models: [
      {
        id: 'yolo11s_o365_fp16',
        dataset: 'objects365',
        name: 'YOLO11s-O365 (FP16 Edge)',
        family: 'onnx',
        modelUrl: 'https://huggingface.co/wide-video/yoloe-11-Objects365-v1.0.0/resolve/main/yoloe-11s-seg-object365_fp16.onnx',
        sizeMB: 19.3,
        speed: 'Fast (~35-60ms)',
        accuracy: 'High (365 Categories)',
        description: 'Edge-optimized YOLO11 model in FP16 for rapid multi-class browser detection.',
        recommended: true,
        isDefault: true
      },
      {
        id: 'yolo11s_o365_fp32',
        dataset: 'objects365',
        name: 'YOLO11s-O365 (Full FP32)',
        family: 'onnx',
        modelUrl: 'https://huggingface.co/wide-video/yoloe-11-Objects365-v1.0.0/resolve/main/yoloe-11s-seg-object365.onnx',
        sizeMB: 38.5,
        speed: 'Balanced (~55-90ms)',
        accuracy: 'Very High (Full Precision)',
        description: 'Full FP32 tensor precision offering stable predictions across all 365 classes.',
        recommended: false,
        isDefault: false
      },
      {
        id: 'lwdetr_o365_medium',
        dataset: 'objects365',
        name: 'LW-DETR Objects365 (Transformer)',
        family: 'onnx',
        modelUrl: 'https://huggingface.co/stevenbucaille/lwdetr_medium_30e_objects365/resolve/main/model.onnx',
        sizeMB: 56.0,
        speed: 'Sophisticated (~90-140ms)',
        accuracy: 'SOTA Deformable Attention',
        description: 'End-to-end vision transformer. Eliminates NMS heuristics for high-density cluttered scene understanding.',
        recommended: false,
        isDefault: false
      },
      {
        id: 'codetr_o365_xlarge',
        dataset: 'objects365',
        name: 'Co-DETR / YOLOv8x O365 (Extra-Large SOTA)',
        family: 'onnx',
        modelUrl: 'https://huggingface.co/zongzhuofan/co-detr-vit-large-objects365/resolve/main/model.onnx',
        sizeMB: 136.0,
        speed: 'Deep (~180-260ms)',
        accuracy: 'Maximum Precision (Dense Grid)',
        description: 'Flagship multi-scale vision model for small assistive item detection (keys, power outlets, stairs).',
        recommended: false,
        isDefault: false
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

    onProgress({ status: 'downloading', text: `Loading weights for ${config.name}...`, percent: 40 });
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

    onProgress({ status: 'ready', text: `${config.name} ready!`, percent: 100 });
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

  // 3. ONNX Runtime Web Family (Objects365 YOLO11 / LW-DETR / Co-DETR)
  if (config.family === 'onnx') {
    if (!window.ort) {
      throw new Error('ONNX Runtime Web (ort) library is not loaded on window.');
    }

    onProgress({ status: 'downloading', text: `Downloading ${config.name} (${config.sizeMB} MB)...`, percent: 25 });

    try {
      // Set execution providers: prefer webgl, fallback to wasm
      window.ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);
      
      const sessionOptions = {
        executionProviders: ['webgl', 'wasm']
      };

      // Fetch model with progress monitoring
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

      onProgress({ status: 'compiling', text: `Compiling ONNX computation graph on WebGL/WASM...`, percent: 95 });

      const modelBuffer = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        modelBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      const session = await window.ort.InferenceSession.create(modelBuffer.buffer, sessionOptions);
      onnxSession = session;
      currentLoadedModel = session;
      currentModelConfig = config;

      onProgress({ status: 'ready', text: `${config.name} ready!`, percent: 100 });
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

      if (outputTensor && outputTensor.data) {
        // Output tensor shape is typically [1, 4 + 365, 8400] for YOLOv8/11
        const data = outputTensor.data;
        const dims = outputTensor.dims; // e.g. [1, 369, 8400]
        const numClasses = 365;
        const numAttributes = dims[1] || 369;
        const numBoxes = dims[2] || 8400;

        const scaleX = videoElement.videoWidth / inputWidth;
        const scaleY = videoElement.videoHeight / inputHeight;

        for (let b = 0; b < numBoxes; b += 8) { // Sample anchors for high responsiveness
          let maxScore = 0;
          let bestClassId = 0;

          for (let c = 0; c < numClasses; c++) {
            const score = data[(4 + c) * numBoxes + b];
            if (score > maxScore) {
              maxScore = score;
              bestClassId = c;
            }
          }

          if (maxScore >= minScore) {
            const rawClass = OBJECTS365_CLASSES[bestClassId] || `Class ${bestClassId}`;
            const className = rawClass.toLowerCase();

            if (!activeClasses || activeClasses.has(rawClass) || activeClasses.has(className)) {
              const cx = data[0 * numBoxes + b] * scaleX;
              const cy = data[1 * numBoxes + b] * scaleY;
              const w = data[2 * numBoxes + b] * scaleX;
              const h = data[3 * numBoxes + b] * scaleY;

              results.push({
                class: rawClass,
                score: maxScore,
                bbox: [
                  Math.max(0, cx - w / 2),
                  Math.max(0, cy - h / 2),
                  w,
                  h
                ]
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('ONNX inference error:', e);
    }
    return results;
  }

  return results;
}
