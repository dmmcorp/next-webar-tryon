"use client";
import { useState } from "react";
import { Landmarks } from "@/lib/types";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import ModelSelector from "./model-selector";
import Mask from "./mask";
import useFaceDetection from "@/stores/useFaceDetection";
import DynamicModel from "./dynamic-model";

type FaceDetectionProps = {
  onLandmarks: (landmarks: Landmarks | null) => void;
};
const FaceDetection = dynamic<FaceDetectionProps>(
  () => import("../components/face-detection"),
  { ssr: false }
);

export default function FaceDetectionComponent() {
  const isDetected = useFaceDetection((state) => state.isDetected);
  const [landmarks, setLandmarks] = useState<Landmarks | null>(null);
  return (
    <div className="size-full relative">
  
      <FaceDetection onLandmarks={setLandmarks} />
      <div className="absolute size-full top-0 left-0">
        <Canvas
          orthographic 
          camera={{ zoom: 100, position: [0, 0, 10] }}
          gl={{ antialias: true }}
          className="absolute  size-full "
        >
          <ambientLight intensity={1} />
          <directionalLight position={[0, 0, 5]} />
          {isDetected && (
            <>
              <DynamicModel landmarks={landmarks}/>
              <Mask landmarks={landmarks}/>
            </>
          )}
        </Canvas>
      </div>
      <ModelSelector/>
    </div>
  );
}
