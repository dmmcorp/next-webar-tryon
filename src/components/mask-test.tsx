'use client'
import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import gsap from 'gsap'

export default function MaskTest (){
  const { scene } = useGLTF("/mask.glb");

  const modelRef = useRef<THREE.Object3D>(null);

  return <primitive 
      ref={modelRef} object={scene}   
      position={[0, 1, 1]} scale={[1,1,1]}
    />
}
