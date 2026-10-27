#!/usr/bin/env python3
"""
Real-time Webcam Object Detection with YOLO
Part of the Camera-Project-3D Assistive Guidance System.

Usage:
    python detection.py [--model yolo26n.pt] [--camera 0] [--conf 0.4]
"""

import argparse
import sys
import cv2


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run real-time object detection on a webcam feed using YOLO."
    )
    parser.add_argument(
        "--dataset",
        type=str,
        choices=["coco", "objects365"],
        default="coco",
        help="Target dataset: 'coco' (80 classes) or 'objects365' (365 classes) (default: coco).",
    )
    parser.add_argument(
        "--model",
        type=str,
        default=None,
        help="Path or name of YOLO model weights. Default is 'yolo26n.pt' for COCO or 'yolov8n-o365.pt' for Objects365.",
    )
    parser.add_argument(
        "--camera",
        type=int,
        default=0,
        help="Webcam device index (default: 0).",
    )
    parser.add_argument(
        "--conf",
        type=float,
        default=0.40,
        help="Confidence threshold between 0.0 and 1.0 (default: 0.40).",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    try:
        from ultralytics import YOLO
    except ImportError:
        print(
            "Error: ultralytics is not installed.\n"
            "Install dependencies with: pip install -r requirements.txt",
            file=sys.stderr,
        )
        sys.exit(1)

    model_name = args.model
    if not model_name:
        model_name = "yolov8n-o365.pt" if args.dataset == "objects365" else "yolo26n.pt"

    print(f"Loading YOLO model ({args.dataset.upper()}): {model_name} ...")
    try:
        # Load the model (downloads weights automatically if not locally cached)
        model = YOLO(model_name)
    except Exception as e:
        print(f"Failed to load YOLO model: {e}", file=sys.stderr)
        sys.exit(1)

    # Initialize webcam capture
    print(f"Connecting to camera index {args.camera}...")
    cap = cv2.VideoCapture(args.camera)

    # Fallback to index 1 or 2 if index 0 fails
    if not cap.isOpened() and args.camera == 0:
        for fallback_idx in [1, 2]:
            print(f"Camera index 0 not available. Trying index {fallback_idx}...")
            cap = cv2.VideoCapture(fallback_idx)
            if cap.isOpened():
                print(f"Successfully connected to camera index {fallback_idx}.")
                break

    if not cap.isOpened():
        print(
            "Error: Could not open any webcam. Please verify camera permissions and connection.",
            file=sys.stderr,
        )
        sys.exit(1)

    print("Live detection started. Press 'q' in the video window to exit.")

    try:
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                print("Warning: Received empty camera frame. Exiting loop.")
                break

            # Run YOLO inference on the current frame
            results = model(frame, conf=args.conf, verbose=False)

            # Draw bounding boxes and labels
            annotated_frame = results[0].plot()

            # Display live annotated frame
            cv2.imshow("Camera-Project-3D: Real-Time Detection", annotated_frame)

            # Exit on 'q' or ESC (27)
            key = cv2.waitKey(1) & 0xFF
            if key in (ord("q"), ord("Q"), 27):
                break
    except KeyboardInterrupt:
        print("\nInterrupted by user.")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("Camera released. Exiting clean.")


if __name__ == "__main__":
    main()
