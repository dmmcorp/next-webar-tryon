import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { normalizeScale } from "@/lib/utils";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";

export default function Mask ({landmarks}: {landmarks: Landmarks | null}){
 const { scene } = useGLTF("/mask.glb");
   const modelRef = useRef<THREE.Object3D>(null);
  // useEffect(()=>{
  //     scene.traverse((child) => {
  //     if ((child as THREE.Mesh).isMesh) {
  //       const mesh = child as THREE.Mesh;
  //       if (Array.isArray(mesh.material)) {
  //         mesh.material.forEach((m) => {
  //           m.transparent = true;
  //           m.opacity = 0;
  //           m.depthWrite = true;
  //         });
  //       } else {
  //         mesh.material.transparent = true;
  //         mesh.material.opacity = 0;
  //         mesh.material.depthWrite = true;
  //       }
  //     }
  //   });
  // },[scene])
  useFrame(() => {
  if (landmarks && modelRef.current) {
    if(landmarks.faceMetrics) {
     
      const roll = landmarks.faceMetrics?.xRotation; // in degrees
      const yaw = landmarks.faceMetrics?.yRotation; // in degrees
      const pitch = landmarks.faceMetrics?.zRotation; // in degrees
      modelRef.current.rotation.x = -degToRad(roll); // in radians
      modelRef.current.rotation.y = -degToRad(yaw); // in radians
      modelRef.current.rotation.z = degToRad(pitch); // in radians
      console.log(-degToRad(roll))
      console.log(roll)
    
    }
  }
})
  return <primitive ref={modelRef} object={scene}   position={[0, 1, 0.5]} scale={[2,3,1.5]}/>
}
