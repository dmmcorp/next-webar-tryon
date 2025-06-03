import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { normalizeScale } from "@/lib/utils";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";

export default function GlassModel ({landmarks}: {landmarks: Landmarks | null}){
 const { scene } = useGLTF("/glass-sample.glb");
   const modelRef = useRef<THREE.Object3D>(null);
  
   useFrame(() => {
   if (landmarks && modelRef.current) {
     if(landmarks.faceMetrics) {
      
       const roll = landmarks.faceMetrics?.xRotation; // in degrees
       const yaw = landmarks.faceMetrics?.yRotation; // in degrees
       const pitch = landmarks.faceMetrics?.zRotation; // in degrees
       modelRef.current.rotation.x = -degToRad(roll); // in radians
       modelRef.current.rotation.y = -degToRad(yaw); // in radians
      //  modelRef.current.rotation.z = degToRad(pitch); // in radians
       console.log(-degToRad(roll))
       console.log(roll)
    
     }
   }
 })
  return   <primitive ref={modelRef} object={scene}  position={[0, -0.6, 0]} scale={[1.6,2,2]}/>
}
