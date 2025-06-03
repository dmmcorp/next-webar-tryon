import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

interface DynamicModelProps {
  landmarks: Landmarks | null;
  modelNumber: number;
}

export default function DynamicModel({
  landmarks,
  modelNumber,
}: DynamicModelProps) {
  const modelPath = `/Glasses.glb`;
  const { scene } = useGLTF(modelPath);
  const ref = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (landmarks && ref.current && landmarks.faceMetrics) {
      const {
        eyeDistance,
        eyeSlope,
        displaySize,
        noseBridge,
        faceHeight,
        faceCenterX,
        faceCenterY,
      } = landmarks.faceMetrics;

      const normalizedX = -((faceCenterX / displaySize.width) * 2 - 0.8);
      const normalizedY = -((faceCenterY / displaySize.height) * 2 - 1) - 0.7;

      const scale = eyeDistance /50;
      const scaleX = eyeDistance /70;
      const zPosition = -0.3;

      const xRotation =
        Math.PI * 0.05 +
        ((noseBridge[3].y - noseBridge[0].y) / faceHeight) * Math.PI * 0.15;
      const yRotation = (normalizedX * Math.PI) / 12;
      const zRotation = -eyeSlope * 0.8;

      ref.current.position.set(0, 0, 0);
      ref.current.rotation.set(0, 0, 0);
      ref.current.scale.set(scaleX, scale, 1);
      
      
    }
  }, [landmarks]);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
     
    />
  );
}
