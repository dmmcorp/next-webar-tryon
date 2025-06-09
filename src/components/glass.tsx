import * as THREE from "three";
import { Landmarks, Variants } from "@/lib/types";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";
import gsap from "gsap";

export default function GlassModel({
  landmarks,
  selectedVariant,
}: {
  landmarks: Landmarks | null;
  selectedVariant: Variants;
}) {
  const { scene } = useGLTF(selectedVariant.path);
  const BASE_FACE_WIDTH = 190;
  const modelRef = useRef<THREE.Object3D>(null);
  const { camera, size } = useThree();

  // GSAP tween refs
  const rotationTween = useRef<gsap.core.Tween | null>(null);
  const scaleTween = useRef<gsap.core.Tween | null>(null);
  const positionTween = useRef<gsap.core.Tween | null>(null);

  // Helper to convert screen to world coords
  function screenToWorld(x: number, y: number, width: number, height: number) {
    const normalizedX = (x / width) * 2 - 1;
    const normalizedY = -(y / height) * 2 + 1;
    const vector = new THREE.Vector3(normalizedX, normalizedY, 0.5);
    vector.unproject(camera);
    return vector;
  }

  useFrame(() => {
    if (!landmarks || !modelRef.current) return;

    if (landmarks.faceMetrics && landmarks.faceBox) {
      const roll = landmarks.faceMetrics.xRotation;
      const yaw = landmarks.faceMetrics.yRotation;
      const pitch = landmarks.faceMetrics.zRotation;
      const faceWidth = landmarks.faceBox.width;
      const scaleFactor = faceWidth / BASE_FACE_WIDTH;

      const targetRotation = {
        x: -degToRad(roll) * 0.6,
        y: -degToRad(yaw) * 0.3,
        z: degToRad(pitch) * 1.2,
      };

      const targetScale = {
        x: scaleFactor * 0.65,
        y: scaleFactor * 0.75,
        z: scaleFactor,
      };

      const nosePoint = screenToWorld(
        landmarks.faceMetrics.noseBridgeX,
        landmarks.faceMetrics.noseBridgeY,
        size.width,
        size.height
      );

      // Rotation tween
      if (!rotationTween.current) {
        rotationTween.current = gsap.to(modelRef.current.rotation, {
          x: targetRotation.x,
          y: targetRotation.y,
          z: targetRotation.z,
          duration: 0.05,
          overwrite: "auto",
          ease: "power2.out",
        });
      } else {
        rotationTween.current.vars.x = targetRotation.x;
        rotationTween.current.vars.y = targetRotation.y;
        rotationTween.current.vars.z = targetRotation.z;
        rotationTween.current.invalidate().restart();
      }

      // Scale tween
      if (!scaleTween.current) {
        scaleTween.current = gsap.to(modelRef.current.scale, {
          x: targetScale.x,
          y: targetScale.y,
          z: targetScale.z,
          duration: 0.05,
          overwrite: "auto",
          ease: "power2.out",
        });
      } else {
        scaleTween.current.vars.x = targetScale.x;
        scaleTween.current.vars.y = targetScale.y;
        scaleTween.current.vars.z = targetScale.z;
        scaleTween.current.invalidate().restart();
      }

      // Position tween
      if (!positionTween.current) {
        positionTween.current = gsap.to(modelRef.current.position, {
          x: nosePoint.x,
          y: nosePoint.y,
          z: nosePoint.z,
          duration: 0.05,
          overwrite: "auto",
          ease: "power2.out",
        });
      } else {
        positionTween.current.vars.x = nosePoint.x;
        positionTween.current.vars.y = nosePoint.y;
        positionTween.current.vars.z = nosePoint.z;
        positionTween.current.invalidate().restart();
      }
    }
  });

  // Cleanup tweens on unmount
  useEffect(() => {
    return () => {
      rotationTween.current?.kill();
      scaleTween.current?.kill();
      positionTween.current?.kill();
    };
  }, []);

  return <primitive ref={modelRef} object={scene} />;
}
