"use client";
import { useState } from "react";
import { Landmarks } from "@/lib/types";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import Sunglasses from "./sunglasses";
import { OrbitControls } from "@react-three/drei";
import Model1 from "./model1";

type FaceDetectionProps = {
  onLandmarks: (landmarks: Landmarks | null) => void;
};

const FaceDetection = dynamic<FaceDetectionProps>(
  () => import("../components/face-detection"),
  { ssr: false }
);

export default function FaceDetectionComponent() {
  const [landmarks, setLandmarks] = useState<Landmarks | null>(null);
  // console.log(landmarks);
  return (
    <div className="relative h-dvh w-full ">
      <FaceDetection onLandmarks={setLandmarks} />
      {/* 3D Overlay Layer */}
      <div className="absolute bg-transparent size-full top-0 ">
        <Canvas camera={{ position: [0, 0, 2], fov: 75 }} className="absolute">
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 5]} />
          <OrbitControls />
          <Model1 landmarks={landmarks} />
        </Canvas>
      </div>
    </div>
  );
}
