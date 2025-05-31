import * as THREE from "three";
import { Landmarks } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function Sunglasses({ landmarks }: { landmarks: Landmarks | null }) {
  const { scene } = useGLTF('/pixel.glb');
  const ref = useRef<THREE.Object3D>(null);

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.5}
      position={[0, 0, 0]}
    />
  );
}
