'use client'
import { useRef, useEffect } from 'react'

export default function CameraFeed({ onVideoReady }: { onVideoReady: (video: HTMLVideoElement) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          onVideoReady(videoRef.current!)
        }
      }
    }
    setupCamera()
  }, [onVideoReady])

  return <video ref={videoRef} autoPlay playsInline muted className="absolute w-full h-full object-cover z-0" />
}
