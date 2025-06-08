import useFaceDetection from "@/stores/useFaceDetection";
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

type FaceApiModule = typeof import("@vladmandic/face-api");

export function useLoadFaceApi() {
  const [faceapi, setFaceapi] = useState<FaceApiModule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsDetected } = useFaceDetection();

  useEffect(() => {
    let isMounted = true;

    async function loadLibraries() {
      try {
        const faceapiModule: FaceApiModule = await import(
          "@vladmandic/face-api"
        );

        if (!isMounted) return;

        // // Set backend only if not set
        // if (tf.getBackend() !== "webgl") {
        //   await tf.setBackend("webgl");
        //   await tf.ready();
        //   console.log("WebGL backend ready!");
        // }

        console.log(await tf.getBackend());

        const modelPath = "/models";
        await Promise.all([
          faceapiModule.nets.tinyFaceDetector.loadFromUri(modelPath),
          faceapiModule.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapiModule.nets.faceRecognitionNet.loadFromUri(modelPath),
        ]);

        console.log("FaceAPI nets loaded:", {
          tinyFaceDetector: faceapiModule.nets.tinyFaceDetector.isLoaded,
          faceLandmark68Net: faceapiModule.nets.faceLandmark68Net.isLoaded,
          faceRecognitionNet: faceapiModule.nets.faceRecognitionNet.isLoaded,
        });

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

  return { faceapi, isLoading };
}
