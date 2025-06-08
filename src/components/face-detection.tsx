"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Landmarks } from "@/lib/types";
import useFaceDetection from "@/stores/useFaceDetection";
import { useLoadFaceApi } from "@/hooks/useLoadFaceApi";

export default function FaceDetection({
  onLandmarks = () => {},
}: {
  onLandmarks: (landmark: Landmarks | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setIsDetecting] = useState<string>("");
  const [, setError] = useState<string | null>(null);
  const { faceapi, isLoading } = useLoadFaceApi();
  
  // Refs for optimization
  const detectionStateRef = useRef({
    isDetecting: false,
    lastDetectionTime: 0,
    animationId: 0,
    faceDetectedCount: 0,
    noFaceCount: 0,
  });

  // Memoized detector options for better performance
  const detectorOptions = useMemo(() => {
    if (!faceapi) return null;
    return new faceapi.TinyFaceDetectorOptions({
      inputSize: 320, // Reduced from 360 for better performance
      scoreThreshold: 0.6, // Slightly higher threshold
    });
  }, [faceapi]);

  // Optimized detection function with better throttling
  const runDetection = useCallback(async (timestamp: number) => {
    const state = detectionStateRef.current;
    const detectionInterval = 100; // Reduced to ~10 FPS for better performance
    
    // Schedule next frame early
    state.animationId = requestAnimationFrame((ts) => runDetection(ts));

    // Enhanced throttling
    if (state.isDetecting || timestamp - state.lastDetectionTime < detectionInterval) {
      return;
    }

    state.lastDetectionTime = timestamp;
    state.isDetecting = true;

    try {
      const video = videoRef.current;
      if (!video || video.readyState !== 4 || !faceapi) {
        return;
      }

      // Cache video dimensions to avoid repeated DOM queries
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      // Check if we have valid detector options
      if (!detectorOptions) {
        return;
      }

      // Use the memoized detector options
      const result = await faceapi
        .detectSingleFace(video, detectorOptions)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (result) {
        state.faceDetectedCount++;
        state.noFaceCount = 0;

        // Only process landmarks if we have consistent detection
        if (state.faceDetectedCount >= 2) {
          const landmarks = result.landmarks;
          const nose = landmarks.getNose();
          const noseBridge = nose[0];
          const { x, y, width, height } = result.detection.box;
          
          // Cache rect calculation
          const rect = video.getBoundingClientRect();
          const scaleX = rect.width / displaySize.width;
          const scaleY = rect.height / displaySize.height;
          
          const enhancedLandmarks = {
            ...landmarks,
            imageWidth: displaySize.width,
            imageHeight: displaySize.height,
            faceBox: {
              width: width * scaleX,
              height: height * scaleY,
              x: x * scaleX,
              y: y * scaleY,
            },
            faceMetrics: {
              noseBridgeX: noseBridge.x * scaleX,
              noseBridgeY: noseBridge.y * scaleY,
              displaySize,
              noseBridge: nose,
              xRotation: result.angle?.pitch || 0,
              yRotation: result.angle?.yaw || 0,
              zRotation: result.angle?.roll || 0,
            },
          } as Landmarks;

          setIsDetecting("Face detected");
          useFaceDetection.getState().setIsDetected(true);
          onLandmarks(enhancedLandmarks);

          // Optimize canvas updates
          const canvas = canvasRef.current;
          if (canvas) {
            if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
              canvas.width = displaySize.width;
              canvas.height = displaySize.height;
                console.log('canvas')
              faceapi.matchDimensions(canvas, displaySize);
              const resizedDetections = faceapi.resizeResults(result, displaySize)

              faceapi.draw.drawDetections(canvas, resizedDetections)
            }
          }
        }
      } else {
        state.noFaceCount++;
        state.faceDetectedCount = 0;

        // Only update state after consistent no-face detection
        if (state.noFaceCount >= 3) {
          setIsDetecting("No face");
          useFaceDetection.getState().setIsDetected(false);
          onLandmarks(null);
        }
      }
    } catch (err) {
      console.error("Detection error:", err);
      setError("Detection error");
      // Reset counters on error
      state.faceDetectedCount = 0;
      state.noFaceCount = 0;
    } finally {
      state.isDetecting = false;
    }
  }, [faceapi, detectorOptions, onLandmarks]);

  // Optimized video startup
  const startVideo = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, max: 1280 }, // Limit resolution for better performance
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 15, max: 30 }, // Lower frame rate
          facingMode: "user"
        },
      });
      
      videoRef.current.srcObject = stream;
      
      // Wait for video to be ready before starting detection
      videoRef.current.onloadedmetadata = () => {
        if (faceapi && !detectionStateRef.current.animationId) {
          detectionStateRef.current.animationId = requestAnimationFrame(runDetection);
        }
      };
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setError("Camera access denied");
    }
  }, [faceapi, runDetection]);

  useEffect(() => {
    if (!faceapi || isLoading) return;

    startVideo();

    return () => {
      const state = detectionStateRef.current;
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = 0;
      }
      
      // Cleanup video stream
      const video = videoRef.current;
      if (video?.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [faceapi, isLoading, startVideo]);

  return (
    <div className="size-full relative">
      <video
        id="video"
        ref={videoRef}
        className="object-fill size-full -scale-x-100"
        autoPlay
        muted
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      <canvas
        ref={canvasRef}
        id="overlay"
        className="absolute z-[10000] bg-black/20 inset-0 object-fill size-full scale-x-[-1]"
      />
    </div>
  );
}