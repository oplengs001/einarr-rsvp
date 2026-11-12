"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, Upload, X } from "lucide-react";

const TARGET_WIDTH = 600;
const TARGET_HEIGHT = 500; // Matches the 6:5 Wanted Poster portrait frame

function cropSourceToDataUrl(
  source: HTMLVideoElement | HTMLImageElement,
  srcWidth: number,
  srcHeight: number,
  mirror: boolean
): string {
  const canvas = document.createElement("canvas");
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
  const srcRatio = srcWidth / srcHeight;

  let sx = 0;
  let sy = 0;
  let sWidth = srcWidth;
  let sHeight = srcHeight;

  if (srcRatio > targetRatio) {
    sWidth = srcHeight * targetRatio;
    sx = (srcWidth - sWidth) / 2;
  } else {
    sHeight = srcWidth / targetRatio;
    sy = (srcHeight - sHeight) / 2;
  }

  ctx.save();
  if (mirror) {
    ctx.translate(TARGET_WIDTH, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, sx, sy, sWidth, sHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.82);
}

interface SelfiePickerProps {
  selfie: string | null;
  onChange: (dataUrl: string | null) => void;
}

const actionBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg border-[3px] border-ink bg-white px-4 py-2 text-sm font-extrabold text-ink shadow-ink-sm transition hover:bg-sun/40 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

export default function SelfiePicker({ selfie, onChange }: SelfiePickerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopStream();
  }, []);

  const startCamera = async (mode: "user" | "environment" = facingMode) => {
    setCameraError(null);
    stopStream();

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera preview isn't supported in this browser. Use Upload photo instead."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setCameraOpen(false);
      setCameraError(
        "Could not access your camera. Allow camera permission or use Upload photo."
      );
    }
  };

  const handleCloseCamera = () => {
    stopStream();
    setCameraOpen(false);
  };

  const handleFlipCamera = () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startCamera(next);
  };

  const handleSnap = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const dataUrl = cropSourceToDataUrl(
      video,
      video.videoWidth,
      video.videoHeight,
      facingMode === "user"
    );
    if (dataUrl) {
      onChange(dataUrl);
      handleCloseCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setCameraError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const dataUrl = cropSourceToDataUrl(img, img.width, img.height, false);
        if (dataUrl) {
          onChange(dataUrl);
          handleCloseCamera();
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4 rounded-xl border-[3px] border-dashed border-ink/30 bg-white/75 p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!cameraOpen && !selfie && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-ink">
              Or put yourself on the poster
            </p>
            <p className="text-xs font-semibold text-ink/60">
              Take a quick selfie or pick a photo
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className={actionBtn}
            >
              <Camera className="h-4 w-4 text-luffy" />
              Take a selfie
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={actionBtn}
            >
              <Upload className="h-4 w-4 text-sea" />
              Upload photo
            </button>
          </div>
        </div>
      )}

      {cameraOpen && (
        <div className="space-y-3">
          <div className="relative mx-auto aspect-[6/5] max-w-[320px] overflow-hidden rounded-xl border-[3px] border-ink bg-black shadow-ink-sm">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover ${
                facingMode === "user" ? "-scale-x-100" : ""
              }`}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleSnap}
              className="inline-flex items-center gap-2 rounded-lg border-[3px] border-ink bg-luffy px-5 py-2 text-sm font-extrabold text-white shadow-ink-sm transition hover:bg-luffy-dark active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <Camera className="h-4 w-4" />
              Snap photo
            </button>
            <button
              type="button"
              onClick={handleFlipCamera}
              className={actionBtn}
              title="Switch camera"
            >
              <RefreshCw className="h-4 w-4" />
              Flip
            </button>
            <button
              type="button"
              onClick={handleCloseCamera}
              className={actionBtn}
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {!cameraOpen && selfie && (
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={selfie}
              alt="Your selfie preview"
              className="h-16 w-[77px] shrink-0 rounded-lg border-[3px] border-ink object-cover shadow-ink-sm ring-4 ring-sun"
            />
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-ink">
                Using your selfie on the poster
              </p>
              <p className="mt-0.5 text-xs font-semibold text-ink/60">
                Tap any crew flag above to switch back.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className={actionBtn}
            >
              Retake
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={actionBtn}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className={actionBtn}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {cameraError && (
        <p className="mt-3 rounded-lg border-2 border-luffy bg-luffy/10 px-3 py-2 text-xs font-bold text-luffy-dark">
          {cameraError}
        </p>
      )}
    </div>
  );
}

