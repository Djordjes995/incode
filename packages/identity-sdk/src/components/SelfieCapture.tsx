import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/tokens.css";
import styles from "./SelfieCapture.module.css";

export type SelfieCaptureChange = {
  base64: string | null;
  hasImage: boolean;
  error?: string;
};

export interface SelfieCaptureProps {
  defaultValue?: string;
  onChange: (next: SelfieCaptureChange) => void;
  className?: string;
}

export function SelfieCapture({ defaultValue = "", onChange, className }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedSelfie, setCapturedSelfie] = useState(defaultValue);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "Camera API is not supported in this browser.";
      setError(message);
      onChange({ base64: capturedSelfie || null, hasImage: Boolean(capturedSelfie), error: message });
      return;
    }

    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch {
      const message = "Unable to access camera. Check browser permissions.";
      setError(message);
      setIsCameraActive(false);
      onChange({ base64: capturedSelfie || null, hasImage: Boolean(capturedSelfie), error: message });
    }
  };

  const captureSelfie = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (!videoElement || !canvasElement) {
      return;
    }

    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    if (!width || !height) {
      const message = "Camera stream not ready yet. Please try again.";
      setError(message);
      onChange({ base64: null, hasImage: false, error: message });
      return;
    }

    canvasElement.width = width;
    canvasElement.height = height;
    const context = canvasElement.getContext("2d");
    if (!context) {
      const message = "Could not initialize image capture.";
      setError(message);
      onChange({ base64: null, hasImage: false, error: message });
      return;
    }

    context.drawImage(videoElement, 0, 0, width, height);
    const base64Image = canvasElement.toDataURL("image/png");
    setCapturedSelfie(base64Image);
    onChange({ base64: base64Image, hasImage: true });
    stopCamera();
  };

  const retakeSelfie = () => {
    setCapturedSelfie("");
    onChange({ base64: null, hasImage: false });
    startCamera();
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.frame}>
        {capturedSelfie ? (
          <img className={styles.preview} src={capturedSelfie} alt="Captured selfie preview" />
        ) : isCameraActive ? (
          <>
            <video ref={videoRef} className={styles.video} autoPlay playsInline muted />
            <div className={styles.guide} />
          </>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.avatarIcon} aria-hidden="true">
              <span className={styles.avatarHead} />
              <span className={styles.avatarBody} />
            </div>
            <p className={styles.placeholderText}>Center your face and start camera</p>
          </div>
        )}

        <div className={styles.actions}>
          {!isCameraActive && !capturedSelfie ? (
            <button className={styles.button} type="button" onClick={startCamera}>
              Start Camera
            </button>
          ) : null}

          {isCameraActive ? (
            <button className={styles.button} type="button" onClick={captureSelfie}>
              Capture Selfie
            </button>
          ) : null}

          {capturedSelfie ? (
            <button className={styles.button} type="button" onClick={retakeSelfie}>
              Retake
            </button>
          ) : null}
        </div>
      </div>



      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}