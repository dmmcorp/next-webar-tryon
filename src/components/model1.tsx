import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function Model1({ landmarks }: { landmarks: Landmarks | null }) {
  const { scene } = useGLTF("/model1.glb");
  const ref = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (landmarks && ref.current && landmarks.faceMetrics) {
      const {
        eyeDistance,
        eyeSlope,
        // faceDepth,
        displaySize,
        noseBridge,
        // faceWidth,
        faceHeight,
        faceCenterX,
        faceCenterY,
      } = landmarks.faceMetrics;

      // Debug logging

      console.log("Face Metrics:", {
        displaySize,
        eyeDistance,
        faceCenterX,
        faceCenterY,
        eyeSlope: eyeSlope * (180 / Math.PI),
      });

      // Normalize coordinates based on display size
      // const normalizedX = (faceCenterX / displaySize.width) * 2 - 1.3;
      // const normalizedY = (faceCenterY / displaySize.height) * 2 - 1;

      const normalizedX = -((faceCenterX / displaySize.width) * 2 - 0.8); // Removed 1.5 offset
      const normalizedY = -((faceCenterY / displaySize.height) * 2 - 1) - 0.7; // Adjusted vertical offset

      console.log("Normalized Positions:", {
        normalizedX,
        normalizedY,
        scale: eyeDistance / 80,
      });

      // Dynamic scale based on face size
      // const scale = eyeDistance * 0.004 * (displaySize.width / 320); // Base scale adjusted for screen size

      const scale = eyeDistance / 80;
      // Dynamic depth based on face position
      const zPosition = -0.3;

      // Dynamic rotation based on face angle
      const xRotation =
        Math.PI * 0.05 +
        ((noseBridge[3].y - noseBridge[0].y) / faceHeight) * Math.PI * 0.15;
      const yRotation = (normalizedX * Math.PI) / 12; // Reduced rotation factor
      const zRotation = -eyeSlope * 0.8; // Slightly reduced tilt adjustment

      console.log("Final Transforms:", {
        position: { x: normalizedX, y: normalizedY, z: zPosition },
        rotation: {
          x: xRotation * (180 / Math.PI),
          y: yRotation * (180 / Math.PI),
          z: zRotation * (180 / Math.PI),
        },
        scale,
      });

      // Update model transform
      ref.current.position.set(normalizedX, normalizedY, zPosition);
      ref.current.rotation.set(xRotation, yRotation, zRotation);
      ref.current.scale.set(scale, scale, scale);

      // dynamic for testing
      // ref.current.position.set(0, -0.3, -0.5);
      // ref.current.scale.set(
      //   0.3885406584744767,
      //   0.3885406584744767,
      //   0.3885406584744767
      // );
    }
  }, [landmarks]);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[0, 0, -0.5]}
      rotation={[0, 0, 0]}
      scale={0.1}
    />
  );
}
