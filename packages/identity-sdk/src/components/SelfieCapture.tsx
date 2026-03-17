import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/tokens.css";
import styles from "./SelfieCapture.module.css";

export interface SelfieCaptureProps {
  value?: string;
  onChange: (selfieBase64: string) => void;
  className?: string;
}

export function SelfieCapture({ value = "", onChange, className }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [capturedSelfie, setCapturedSelfie] = useState(value);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera =  async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera API is not supported in this browser.");
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
      setError("Unable to access camera. Check browser permissions.");
      setIsCameraActive(false);
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
      setError("Camera stream not ready yet. Please try again.");
      return;
    }

    canvasElement.width = width;
    canvasElement.height = height;
    const context = canvasElement.getContext("2d");
    if (!context) {
      setError("Could not initialize image capture.");
      return;
    }

    context.drawImage(videoElement, 0, 0, width, height);
    const base64Image = canvasElement.toDataURL("image/png");
    setCapturedSelfie(base64Image);
    onChange(base64Image);
    stopCamera();
  };

  const retakeSelfie = () => {
    setCapturedSelfie("");
    onChange("");
    startCamera();
  };

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
        ) : (
          <>
            <video ref={videoRef} className={styles.video} autoPlay playsInline muted />
            {isCameraActive ? <div className={styles.guide} /> : null}
          </>
        )}
      </div>

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

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}