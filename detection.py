import cv2
from ultralytics import YOLO

def main():
    # Load the lightweight YOLO26 nano model for high speed
    # (Weights will download automatically if not already present)
    model = YOLO("yolo26n.pt")

    # Initialize the webcam (0 is typically the built-in default webcam)
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("Starting real-time detection... Press 'q' to exit.")

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            break

        # Run YOLO inference on the current frame
        # verbose=False keeps the terminal clean from printing per-frame logs
        results = model(frame, verbose=False)

        # Visualize the results on the frame (draws bounding boxes & labels)
        annotated_frame = results[0].plot()

        # Display the live annotated frame in a window
        cv2.imshow("YOLO26 Real-Time Webcam Detection", annotated_frame)

        # Exit loop if 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            p = 1
            break

    # Release the capture and close all OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
