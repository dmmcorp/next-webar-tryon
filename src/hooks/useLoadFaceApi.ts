import useFaceDetection from "@/stores/useFaceDetection";
import { useEffect, useState } from "react";

type FaceApiModule = typeof import("@vladmandic/face-api");

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function useLoadFaceApi() {
  const [faceapi, setFaceapi] = useState<FaceApiModule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const { setIsDetected } = useFaceDetection();

  useEffect(() => {
    let isMounted = true;

    async function loadLibraries() {
      if (!isWebGLAvailable()) {
        if (!isMounted) return;
        setWebglSupported(false);
        setIsLoading(false);
        setIsDetected(false);
        return;
      }

      try {
        const [faceapiModule] = await Promise.all([
          import("@vladmandic/face-api"),
        ]);

        if (!isMounted) return;

        // @ts-expect-error: faceapiModule.tf may not be typed, but getBackend exists
        if (faceapiModule.tf.getBackend() !== "webgl") {
          // @ts-expect-error: faceapiModule.tf may not be typed, but setBackend exists
          await faceapiModule.tf.setBackend("webgl");
          // @ts-expect-error: faceapiModule.tf may not be typed, but ready exists
          await faceapiModule.tf.ready();
          console.log("WebGL backend ready!");
        }

        const modelPath = "/models";
        await Promise.all([
          faceapiModule.nets.tinyFaceDetector.loadFromUri(modelPath),
          faceapiModule.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapiModule.nets.faceRecognitionNet.loadFromUri(modelPath),
        ]);

        if (!isMounted) return;

        setFaceapi(faceapiModule);
        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error loading libraries:", error);
        setIsLoading(false);
        setIsDetected(false);
      }
    }

    loadLibraries();

    return () => {
      isMounted = false;
    };
  }, [setIsDetected]);

  return { faceapi, isLoading, webglSupported };
}
