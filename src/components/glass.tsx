import * as THREE from "three";
import { Landmarks, Variants } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import gsap from 'gsap'
export default function GlassModel ({
  landmarks,
  selectedVariant
}: {
  landmarks: Landmarks | null;
  selectedVariant: Variants
}){
  const { scene } = useGLTF(selectedVariant.path);
  const BASE_FACE_WIDTH = 190;
  const modelRef = useRef<THREE.Object3D>(null);
  const { camera, size } = useThree();

  useFrame(() => {
   if ( landmarks && modelRef.current) {
     if(landmarks.faceMetrics && landmarks.faceBox) {
      
      const roll = landmarks.faceMetrics?.xRotation; // in degrees
      const yaw = landmarks.faceMetrics?.yRotation; // in degrees
      const pitch = landmarks.faceMetrics?.zRotation; // in degrees
      const faceWidth = landmarks.faceBox.width;
      const scaleFactor = faceWidth / BASE_FACE_WIDTH;
      gsap.to(modelRef.current.rotation, {
        x: -degToRad(roll) * 0.6,
        y: -degToRad(yaw) * 0.3,
        z: degToRad(pitch) * 1.2,
      })
      gsap.to(modelRef.current.scale, {
        x: scaleFactor * 0.7,
        y: scaleFactor * 0.8,
        z: scaleFactor,
      })

      function screenToWorld(x: number, y: number, width: number, height: number) {
        const normalizedX = ((x)  / width) * 2 - 1;
        const normalizedY = -((y - 5) / height) * 2 + 1;

        const vector = new THREE.Vector3(normalizedX, normalizedY, 0.5); // z = 0.5 (middle of the scene)
        vector.unproject(camera); // your THREE.js camera
        return vector;
      }
      const nosePoint = screenToWorld(landmarks.faceMetrics.noseBridgeX, landmarks.faceMetrics.noseBridgeY, size.width, size.height);
      modelRef.current.position.copy(nosePoint);
     }
   }
 })
  return   <primitive ref={modelRef} object={scene}  scale={[1.5,1.2,2]}/>
}
