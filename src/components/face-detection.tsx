"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const { faceapi } = useLoadFaceApi();

  useEffect(() => {
    startVideo();
  }, []);

  // Optimized detection function with better throttling
  useEffect(() => {
    let animationId: number;
    const runDetection = async () => {
      if (!faceapi || !videoRef.current || videoRef.current.readyState !== 4) {
        animationId = requestAnimationFrame(runDetection);
        return;
      }

      try {
        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };
        const result = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 160,
              scoreThreshold: 0.6,
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (result) {
          const landmarks = result.landmarks;
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const nose = landmarks.getNose();
          const noseBridge = landmarks.getNose()[0];
          const jaw = landmarks.getJawOutline();

          const faceDepth =
            Math.abs((leftEye[0].y + rightEye[0].y) / 2 - nose[0].y) /
            result.detection.box.height;

          const eyeSlope = Math.atan2(
            rightEye[0].y - leftEye[0].y,
            rightEye[0].x - leftEye[0].x
          );

          const eyeDistance = Math.sqrt(
            Math.pow(rightEye[0].x - leftEye[0].x, 2) +
              Math.pow(rightEye[0].y - leftEye[0].y, 2)
          );
          const video = videoRef.current;
          const { x, y, width, height } = result.detection.box;
          const rect = video.getBoundingClientRect();
          const scaleX = rect.width / video.videoWidth;
          const scaleY = rect.height / video.videoHeight;
          const faceAngle = result.angle;
          const enhancedLandmarks = {
            ...result.landmarks,
            imageWidth: displaySize.width,
            imageHeight: displaySize.height,
            faceBox: {
              width: width * scaleX,
              height: height * scaleY,
              x: x * scaleX,
              y: y * scaleY,
            },
            faceMetrics: {
              eyeDistance,
              eyeSlope,
              noseBridgeX: noseBridge.x * scaleX,
              noseBridgeY: noseBridge.y * scaleY,
              faceDepth,
              displaySize,
              jawX: jaw[0].x * scaleX,
              jawY: jaw[0].y * scaleY,
              noseBridge: nose,
              faceWidth: result.detection.box.width,
              faceHeight: result.detection.box.height,
              faceCenterX:
                result.detection.box.x + result.detection.box.width / 2,
              faceCenterY:
                result.detection.box.y + result.detection.box.height / 2,
              xRotation: faceAngle.pitch,
              yRotation: faceAngle.yaw,
              zRotation: faceAngle.roll,
            },
          } as Landmarks;
          setIsDetecting("Face detected");
          useFaceDetection.getState().setIsDetected(true);
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = displaySize.width;
            canvas.height = displaySize.height;
            faceapi.matchDimensions(canvas, displaySize);
            faceapi.resizeResults(result, displaySize);
          }
          onLandmarks(enhancedLandmarks);

          useFaceDetection.getState().setIsDetected(true);

          if (!useFaceDetection.getState().firstDetection) {
            useFaceDetection.getState().setFirstDetection(true);
          }
        } else {
          useFaceDetection.getState().setIsDetected(false);
          setIsDetecting("No face");
        }
      } catch (err) {
        console.error("Detection error:", err);
        setError("Detection error");
      }
      animationId = requestAnimationFrame(runDetection);
    };

    if (faceapi) {
      runDetection();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [faceapi, onLandmarks]);

  const startVideo = async () => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }
  };

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
