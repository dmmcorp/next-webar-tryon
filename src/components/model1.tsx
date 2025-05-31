import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function Model1({ landmarks }: { landmarks: Landmarks | null }) {
  const { scene } = useGLTF("/model1.glb");
  const ref = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (landmarks && ref.current) {
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();

      // Calculate center point between eyes
      const centerX = (leftEye[0].x + rightEye[0].x) / 2;
      const centerY = (leftEye[0].y + rightEye[0].y) / 2;

      // Calculate rotation based on eye positions
      const eyeAngle = Math.atan2(
        rightEye[0].y - leftEye[0].y,
        rightEye[0].x - leftEye[0].x
      );

      // Calculate scale based on eye distance
      const eyeDistance = Math.sqrt(
        Math.pow(rightEye[0].x - leftEye[0].x, 2.2) +
          Math.pow(rightEye[0].y - leftEye[0].y, 2.2)
      );
      const scale = eyeDistance * 0.01; // Pag experiment-an ang value SIZE

      // model position and rotation
      ref.current.position.set(
        ((centerX / landmarks.imageWidth) * 2 - 1) * -1, // Invert X position
        -((centerY / landmarks.imageHeight) * 2 - 1), // Adjust Y position
        -0.5 // Move model closer to camera
      );

      ref.current.rotation.x = Math.PI * 0.1; // Tilt forward/backward
      ref.current.rotation.y = 0; // Left/right rotation
      ref.current.rotation.z = eyeAngle; // Keep the existing z rotation
      ref.current.scale.setScalar(scale);
    }
  }, [landmarks]);

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[0, 0, -0.5]}
      rotation={[0, 0, 0]}
      scale={0.1} // Try a smaller initial scale
    />
  );
}
