"use client";
import React, { useEffect, useRef, useState } from "react";
import { Landmarks } from "@/lib/types";
import useFaceDetection from "@/stores/useFaceDetection";

export default function FaceDetection({
  onLandmarks = () => {},
}: {
  onLandmarks: (landmark: Landmarks | null) => void;
}) {
  const [faceapi, setFaceapi] = useState<
    typeof import("@vladmandic/face-api") | null
  >(null);
  const [, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [openVideo, setOpenVideo] = useState<boolean>(false);
  const [, setIsDetecting] = useState<string>("");
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLibraries() {
      try {
        const faceapiModule = await import("@vladmandic/face-api");
        setFaceapi(faceapiModule);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading libraries:", error);
        setIsDetecting("Error loading required libraries");
        useFaceDetection.getState().setIsDetected(false);
      }
    }

    loadLibraries();
    // Cleanup function
    return () => {
      // Optional: Add any cleanup needed for face-api
    };
  }, []);

  useEffect(() => {
    if (!faceapi) return;

    async function loadModels() {
      try {
        const modelPath = "/models";
        await Promise.all([
          faceapi?.nets.ssdMobilenetv1.loadFromUri(modelPath),
          faceapi?.nets.tinyFaceDetector.loadFromUri(modelPath),
          faceapi?.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi?.nets.faceRecognitionNet.loadFromUri(modelPath),
        ]);
      } catch (error) {
        console.error("Error loading models:", error);
        setIsDetecting("Error loading face detection models");
        useFaceDetection.getState().setIsDetected(false);
      }
    }

    loadModels();

    setOpenVideo(true);
    startVideo();
  }, [faceapi]);

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

  useEffect(() => {
    let animationId: number;

    const runDetection = async () => {
      if (!faceapi || !videoRef.current || videoRef.current.readyState !== 4)  {
        animationId = requestAnimationFrame(runDetection);
        return;
      }
      try {
        const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight }
        const result = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 320,
              scoreThreshold: 0.5,
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
          const jaw = landmarks.getJawOutline()
        
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
          const video = videoRef.current
          const { x, y, width, height } = result.detection.box;
          const rect = video.getBoundingClientRect();
          const scaleX = rect.width / video.videoWidth;
          const scaleY = rect.height / video.videoHeight;
          const faceAngle = result.angle
          const enhancedLandmarks = {
            ...result.landmarks,
            imageWidth: displaySize.width,
            imageHeight: displaySize.height,
            faceBox: {
              width: width * scaleX,
              height: height * scaleY,
              x: x * scaleX,
              y: y * scaleY
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
          if(canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = displaySize.width;
            canvas.height = displaySize.height;
            faceapi.matchDimensions(canvas, displaySize)
            faceapi.resizeResults(result, displaySize)
          }
          onLandmarks(enhancedLandmarks);
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

    if (faceapi && openVideo) {
      runDetection();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [faceapi, openVideo, onLandmarks]);
  return (
    <div className="size-full relative">
      
      <video
        id="video"
        ref={videoRef}
        className="
          object-fill
          size-full
        "
        autoPlay
        muted
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      <canvas
        ref={canvasRef}
        id="overlay"
        className="
          absolute inset-0 
          object-fill
           size-full
        "
      />
    </div>
  );
}
