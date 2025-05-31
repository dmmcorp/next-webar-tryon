/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

interface FaceAPI {
    nets: any;
    fetchImage: any;
    detectSingleFace: any;
    LabeledFaceDescriptors: any;
    FaceMatcher: any;
  }

// Add a flag to track TF initialization

export default function FaceDetectionComponent() {
  const [faceapi, setFaceapi] = useState<FaceAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [openVideo, setOpenVideo] = useState<boolean>(false);

//   const [detectedFace, setDetectedFace] = useState<Employee | undefined>(undefined)
  const [isDetecting, setIsDetecting] = useState<string>("")
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>();

  useEffect(() => {
      console.log("devices",navigator.mediaDevices)
    async function enableCamera() {
      try {
     
      
           const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }

    enableCamera();

    return () => {
      // Stop the camera on component unmount
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);
  // useEffect(() => {
  //   async function loadLibraries() {
  //     try {
       
  //       const faceapiModule = await import('@vladmandic/face-api');
  //       console.log(faceapi)
  //       setFaceapi(faceapiModule);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error loading libraries:', error);
  //       setIsDetecting("Error loading required libraries");
  //     }
  //   }

  //   loadLibraries();

  //   // Cleanup function
  //   return () => {
  //     // Optional: Add any cleanup needed for face-api
  //   };
  // }, []);

  // useEffect(() => {
  //   // if (!faceapi) return;

  //   // async function loadModels() {
  //   //   try {
  //   //     const modelPath = '/models';
  //   //     await Promise.all([
  //   //       faceapi?.nets.ssdMobilenetv1.loadFromUri(modelPath),
  //   //       faceapi?.nets.tinyFaceDetector.loadFromUri(modelPath),
  //   //       faceapi?.nets.faceLandmark68Net.loadFromUri(modelPath),
  //   //       faceapi?.nets.faceRecognitionNet.loadFromUri(modelPath),
  //   //     ]);
  //   //   } catch (error) {
  //   //     console.error('Error loading models:', error);
  //   //     setIsDetecting("Error loading face detection models");
  //   //   }
  //   // }

  //   // loadModels();

  //   setOpenVideo(true)
  //   // startVideo()
    
  // }, []);

 

  // const startVideo = async () => {
  //   if (videoRef.current) {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //       videoRef.current.srcObject = stream;
  //     } catch (error) {
  //       console.error('Error accessing webcam:', error);
  //     }
  //   }
  // }

  // const detectFace = async () => {
  //   if (!faceapi || !videoRef.current) return;
  //   setIsDetecting("Recognizing...")
  //   setError(null)
  //   // setDetectedFace(undefined)
   
  //   if (videoRef.current) {
  //     const video = videoRef.current;
  //     const result = await faceapi.detectSingleFace(video)
  //       .withFaceLandmarks()
  //       .withFaceDescriptor();

  //   }
  // }

  // Clean up timeout when component unmounts


  // Add this new function to stop the video stream
  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setOpenVideo(false);
    setIsDetecting("");
   
  };

  // if (isLoading) {
  //   return <div>Loading face detection libraries...</div>;
  // }

  return (
    <div className="h-1/2 w-1/2 bg-black">
    <video
      width="240"
      height="360"
    
      autoPlay
      muted
      loop
    
      style={{ borderRadius: "8px", maxWidth: "100%" }}
    >
     
      Your browser does not support the video tag.
    </video>
    </div>
  );
}