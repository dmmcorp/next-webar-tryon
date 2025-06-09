'use client'
import * as THREE from 'three'
import { Landmarks } from '@/lib/types'
import { useGLTF } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { degToRad } from 'three/src/math/MathUtils.js'
import gsap from 'gsap'

const BASE_FACE_WIDTH = 200
const DURATION = 0.03

function screenToWorld(
  x: number,
  y: number,
  width: number,
  height: number,
  camera: THREE.Camera
) {
  const normalizedX = (x / (width + 1)) * 2 - 1
  const normalizedY = -((y - 5) / height) * 2 + 1
  const vector = new THREE.Vector3(normalizedX, normalizedY, 0.5)
  vector.unproject(camera)
  return vector
}

export default function Mask({ landmarks }: { landmarks: Landmarks | null }) {
  const { scene } = useGLTF('/mask.glb')
  const modelRef = useRef<THREE.Object3D>(null)
  const { camera, size } = useThree()

  const tweensRef = useRef({
    rotation: null as gsap.core.Tween | null,
    scale: null as gsap.core.Tween | null,
    position: null as gsap.core.Tween | null,
  })

  // Occlusion setup: apply depth-only material to all meshes
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = new THREE.MeshBasicMaterial({
          colorWrite: false,
          depthWrite: true,
        })
      }
    })
  }, [scene])

  useFrame(() => {
    if (!landmarks || !modelRef.current) return
    if (!landmarks.faceMetrics || !landmarks.faceBox) return

    const { xRotation, yRotation, zRotation, noseBridgeX, noseBridgeY } = landmarks.faceMetrics
    const faceWidth = landmarks.faceBox.width
    const scaleFactor = faceWidth / BASE_FACE_WIDTH

    const targetRotation = {
      x: -degToRad(xRotation) * 1.3,
      y: -degToRad(yRotation) * 0.36,
      z: degToRad(zRotation) * 0.3,
    }

    const targetScale = {
      x: scaleFactor * 0.62,
      y: scaleFactor * 1.3,
      z: scaleFactor,
    }

    const nosePoint = screenToWorld(noseBridgeX, noseBridgeY, size.width, size.height, camera)
    const targetPosition = {
      x: nosePoint.x,
      y: nosePoint.y,
      z: nosePoint.z,
    }

    const model = modelRef.current

    // Rotation tween
    if (!tweensRef.current.rotation) {
      tweensRef.current.rotation = gsap.to(model.rotation, {
        ...targetRotation,
        duration: DURATION,
        overwrite: 'auto',
        ease: 'expo.out',
      })
    } else {
      Object.assign(tweensRef.current.rotation.vars, targetRotation)
      tweensRef.current.rotation.invalidate().restart()
    }

    // Scale tween
    if (!tweensRef.current.scale) {
      tweensRef.current.scale = gsap.to(model.scale, {
        ...targetScale,
        duration: DURATION,
        overwrite: 'auto',
        ease: 'expo.out',
      })
    } else {
      Object.assign(tweensRef.current.scale.vars, targetScale)
      tweensRef.current.scale.invalidate().restart()
    }

    // Position tween
    if (!tweensRef.current.position) {
      tweensRef.current.position = gsap.to(model.position, {
        ...targetPosition,
        duration: DURATION,
        overwrite: 'auto',
        ease: 'expo.out',
      })
    } else {
      Object.assign(tweensRef.current.position.vars, targetPosition)
      tweensRef.current.position.invalidate().restart()
    }
  })

  useEffect(() => {
    return () => {
      tweensRef.current.rotation?.kill()
      tweensRef.current.scale?.kill()
      tweensRef.current.position?.kill()
    }
  }, [])

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[0, 1, 1]}
      scale={[1.5, 1.2, 2]}
    />
  )
}
