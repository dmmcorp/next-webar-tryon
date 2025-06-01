"use client";
import React, { useEffect, useRef, useState } from "react";
import { Landmarks } from "@/lib/types";

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
  const [isDetecting, setIsDetecting] = useState<string>("");
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
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (result) {
          // console.log("Face detected:", result);
          setIsDetecting("Face detected");
          if(canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = displaySize.width;
            canvas.height = displaySize.height;
            faceapi.matchDimensions(canvas, displaySize)
            const resizedResults = faceapi.resizeResults(result, displaySize)
            // draw detections into the canvas
            faceapi.draw.drawDetections(canvas, resizedResults)
            // draw the landmarks into the canvas
            faceapi.draw.drawFaceLandmarks(canvas, resizedResults)
          }
         
          onLandmarks(result.landmarks);
        } else {
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
      {isDetecting}
      <video
        id="video"
        ref={videoRef}
   
        className="size-full absolute inset-0 bg-red-600/30 object-cover"
        autoPlay
        muted
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      <canvas
        ref={canvasRef}
        id="overlay"
       
        className="absolute inset-0 size-full  object-cover"
      />
      {/* <button onClick={detectFace} >Click me</button> */}
    </div>
  );
}
