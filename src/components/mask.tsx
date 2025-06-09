'use client'
import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import gsap from 'gsap'

export default function Mask ({landmarks}: {landmarks: Landmarks | null}){
  const { scene } = useGLTF("/mask.glb");
  const { camera, size } = useThree();
  const BASE_FACE_WIDTH = 200
  const modelRef = useRef<THREE.Object3D>(null);
 // Make all meshes in the GLTF act as occlusion mask
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({
          colorWrite: false,  // Do not render color
          depthWrite: true,   // Still write depth (so it occludes)
        });
      }
    });
  }, [scene]);
  useFrame(() => {
   if (landmarks && modelRef.current) {
     if(landmarks.faceMetrics && landmarks.faceBox) {
      
      const roll = landmarks.faceMetrics?.xRotation; // in degrees
      const yaw = landmarks.faceMetrics?.yRotation; // in degrees
      const pitch = landmarks.faceMetrics?.zRotation; // in degrees
      const faceWidth = landmarks.faceBox.width;
      const scaleFactor = faceWidth / BASE_FACE_WIDTH;
      gsap.to(modelRef.current.rotation, {
        x: -degToRad(roll) * 1.3,
        y: -degToRad(yaw) * 0.36,
        z: degToRad(pitch) * 0.3,
        duration: 0.1
      })
      gsap.to(modelRef.current.scale, {
        x: scaleFactor * 0.6,
        y: scaleFactor * 1.3,
        z: scaleFactor,
        duration: 0.1
      })

      function screenToWorld(x: number, y: number, width: number, height: number) {
        const normalizedX = ((x)  / (width + 1)) * 2 - 1;
        const normalizedY = -((y - 5) / height) * 2 + 1;

        const vector = new THREE.Vector3(normalizedX, normalizedY, 0.5); // z = 0.5 (middle of the scene)
        vector.unproject(camera); // your THREE.js camera
        return vector;
      }
      const nosePoint = screenToWorld(landmarks.faceMetrics.noseBridgeX, landmarks.faceMetrics.noseBridgeY, size.width, size.height);
       gsap.to(modelRef.current.position, {
        x: nosePoint.x,
        y: nosePoint.y,
        z: nosePoint.z,
        duration: 0.1
      })
     }
   }
 })
  return <primitive 
      ref={modelRef} object={scene}   
      position={[0, 1, 1]} scale={[1.5,1.2,2]}
    />
}
