"use client";
import { useState } from "react";
import { Landmarks } from "@/lib/types";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import ModelSelector from "./model-selector";
import Mask from "./mask";
import useFaceDetection from "@/stores/useFaceDetection";
import DynamicModel from "./dynamic-model";
// import { useThree } from "@react-three/fiber";
// import { useEffect } from "react";
// import * as THREE from "three";

type FaceDetectionProps = {
  onLandmarks: (landmarks: Landmarks | null) => void;
};
const FaceDetection = dynamic<FaceDetectionProps>(
  () => import("../components/face-detection"),
  {
    ssr: false,
    loading: () => <div className="text-white">Loading face detection...</div>,
  }
);

// function ColorManagementFix() {
//   const { gl, scene } = useThree();
//   useEffect(() => {
//     gl.toneMapping = THREE.ACESFilmicToneMapping;
//     gl.outputColorSpace = "srgb";
//     scene.background = null;
//   }, [gl, scene]);
//   return null;
// }

export default function FaceDetectionComponent() {
  const { isDetected, firstDetection } = useFaceDetection();
  const [landmarks, setLandmarks] = useState<Landmarks | null>(null);

  return (
    <div className="size-full relative">
      <div className="w-full h-[70%] relative">
        <FaceDetection onLandmarks={setLandmarks} />
        {!isDetected && !firstDetection && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50">
            <span className="text-white text-lg animate-pulse">
              Detecting face, please wait...
            </span>
          </div>
        )}
        <div className="absolute size-full top-0 left-0">
          <Canvas
            orthographic
            gl={{ antialias: false }}
            shadows={false}
            // dpr={Math.min(window.devicePixelRatio, 1.5)}
            camera={{ zoom: 100, position: [0, 0, 10] }}
            className="absolute  size-full scale-x-[-1] "
          >
            {/* <ColorManagementFix /> */}
            <ambientLight intensity={1} />
            <directionalLight position={[0, 0, 5]} />

            <DynamicModel landmarks={landmarks} />
            {landmarks && isDetected && <Mask landmarks={landmarks} />}
          </Canvas>
        </div>
      </div>

      <ModelSelector />
    </div>
  );
}
