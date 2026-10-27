/**
 * models.js - Model Registry & Loader for Browser Object Detection
 * Part of Camera-Project-3D
 */

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

// Presets for filtering classes
export const CLASS_PRESETS = {
  essential10: {
    id: 'essential10',
    name: 'Top 10 Focus Classes',
    description: 'Person, Smartphone, Book, Car, Cat, Dog, Chair, Bottle, Laptop, Bicycle',
    classes: ['person', 'cell phone', 'book', 'car', 'cat', 'dog', 'chair', 'bottle', 'laptop', 'bicycle']
  },
  assistive: {
    id: 'assistive',
    name: 'Assistive & Obstacle Alerts',
    description: 'Key obstacles for navigation & mobility guidance',
    classes: ['person', 'car', 'bicycle', 'motorcycle', 'bus', 'truck', 'dog', 'chair', 'stop sign', 'traffic light']
  },
  all: {
    id: 'all',
    name: 'All 80 COCO Classes',
    description: 'Every recognizable object in COCO dataset',
    classes: [...COCO_CLASSES]
  }
};

// Available Model Registry
export const MODEL_REGISTRY = [
  {
    id: 'lite_mobilenet_v2',
    name: 'MobileNet v2 Lite (Ultra Fast)',
    family: 'tensorflow',
    base: 'lite_mobilenet_v2',
    sizeMB: 2.5,
    speed: 'Ultra Fast (~15-30ms)',
    accuracy: 'Good (Mobile-Optimized)',
    description: 'Lightest model. Instant startup, lowest memory footprint. Perfect for quick scanning & low-end devices.',
    recommended: true,
    isDefault: true
  },
  {
    id: 'mobilenet_v2',
    name: 'MobileNet v2 Standard',
    family: 'tensorflow',
    base: 'mobilenet_v2',
    sizeMB: 5.5,
    speed: 'Fast (~30-50ms)',
    accuracy: 'Very Good',
    description: 'Balanced speed and precision. Stable bounding boxes and improved low-light recognition.',
    recommended: false,
    isDefault: false
  },
  {
    id: 'mobilenet_v1',
    name: 'MobileNet v1 Deep',
    family: 'tensorflow',
    base: 'mobilenet_v1',
    sizeMB: 27.0,
    speed: 'Moderate (~60-90ms)',
    accuracy: 'High Accuracy',
    description: 'Deeper feature extraction for challenging scenes with distant or partially occluded objects.',
    recommended: false,
    isDefault: false
  },
  {
    id: 'efficientdet_lite0',
    name: 'MediaPipe EfficientDet-Lite0',
    family: 'mediapipe',
    modelUrl: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite',
    sizeMB: 4.4,
    speed: 'Fast (~25-45ms)',
    accuracy: 'High (EfficientNet backbone)',
    description: "Google's lightweight vision detector running via WebAssembly and WebGL delegate.",
    recommended: false,
    isDefault: false
  },
  {
    id: 'efficientdet_lite2',
    name: 'MediaPipe EfficientDet-Lite2',
    family: 'mediapipe',
    modelUrl: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite2/float16/1/efficientdet_lite2.tflite',
    sizeMB: 7.2,
    speed: 'Moderate (~45-75ms)',
    accuracy: 'Very High (448x448 input)',
    description: 'Higher resolution input model for precise fine-grained detection of small objects.',
    recommended: false,
    isDefault: false
  }
];

// Active loaded instance wrapper
let currentLoadedModel = null;
let currentModelConfig = null;
let mediaPipeVision = null;

/**
 * Load an object detection model by its registry ID
 * @param {string} modelId
 * @param {function} onProgress
 * @returns {Promise<{model: any, config: object}>}
 */
export async function loadModel(modelId, onProgress = () => {}) {
  const config = MODEL_REGISTRY.find(m => m.id === modelId);
  if (!config) {
    throw new Error(`Model with id "${modelId}" not found in registry.`);
  }

  onProgress({ status: 'starting', text: `Preparing ${config.name} (${config.sizeMB} MB)...` });

  if (config.family === 'tensorflow') {
    // Ensure TensorFlow.js and cocoSsd are ready
    if (!window.tf) {
      throw new Error('TensorFlow.js library is not loaded on window.');
    }
    if (!window.cocoSsd) {
      throw new Error('cocoSsd library is not loaded on window.');
    }

    onProgress({ status: 'downloading', text: `Loading weights for ${config.name}...` });
    await window.tf.ready();

    // Use WebGL backend if available, fallback to CPU
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

    onProgress({ status: 'ready', text: `${config.name} ready!` });
    return { model, config };
  }

  if (config.family === 'mediapipe') {
    onProgress({ status: 'downloading', text: `Fetching MediaPipe Vision WASM & ${config.name}...` });

    if (!mediaPipeVision) {
      // Dynamically import MediaPipe Tasks Vision
      const mpTasks = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
      const fileset = await mpTasks.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      mediaPipeVision = { mpTasks, fileset };
    }

    const { mpTasks, fileset } = mediaPipeVision;
    onProgress({ status: 'compiling', text: `Initializing detector with GPU delegate...` });

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

    onProgress({ status: 'ready', text: `${config.name} ready!` });
    return { model: detector, config };
  }

  throw new Error(`Unsupported model family: ${config.family}`);
}

/**
 * Execute detection on an HTMLVideoElement or Canvas
 * Returns normalized array: [{ class, score, bbox: [x, y, width, height] }]
 */
export async function detectObjects(videoElement, minScore = 0.35, activeClasses = null) {
  if (!currentLoadedModel || !currentModelConfig) {
    return [];
  }

  const results = [];
  const now = performance.now();

  if (currentModelConfig.family === 'tensorflow') {
    // COCO-SSD returns predictions: [{ bbox: [x, y, width, height], class: string, score: number }]
    const rawPredictions = await currentLoadedModel.detect(videoElement, 25, 0.15);

    for (const pred of rawPredictions) {
      const className = pred.class.toLowerCase();
      // Map common synonyms if needed
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
  } else if (currentModelConfig.family === 'mediapipe') {
    // MediaPipe ObjectDetector
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
  }

  return results;
}
