"use client";
import { useState } from "react";
import { Landmarks } from "@/lib/types";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
// import Sunglasses from "./sunglasses";
// import { OrbitControls } from "@react-three/drei";
import DynamicModel from "./dynamic-model";
import ModelSelector from "./model-selector";

type FaceDetectionProps = {
  onLandmarks: (landmarks: Landmarks | null) => void;
};

const FaceDetection = dynamic<FaceDetectionProps>(
  () => import("../components/face-detection"),
  { ssr: false }
);

export default function FaceDetectionComponent() {
  // console.log(landmarks);
  const [landmarks, setLandmarks] = useState<Landmarks | null>(null);
  const [selectedModel, setSelectedModel] = useState(1);
  // const [faceDetected, setFaceDetected] = useState<boolean>(null);
  return (
    <div className="relative h-dvh w-full ">
      <FaceDetection onLandmarks={setLandmarks} />
      {/* 3D Overlays */}
      <div className="absolute bg-transparent size-full top-0 left-0">
        <Canvas
          camera={{ zoom: 100, position: [0, 0, 100] }}
          gl={{ antialias: true }}
          className="absolute"
          orthographic
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 5]} />
          {/* <OrbitControls /> */}
          <DynamicModel landmarks={landmarks} modelNumber={selectedModel} />
          <axesHelper args={[5]} />
        </Canvas>
      </div>
      <ModelSelector onModelChange={setSelectedModel} />
    </div>
  );
}
