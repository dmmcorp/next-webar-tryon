import { create } from "zustand";

type FaceDetectionState = {
  isDetected: boolean;
  setIsDetected: (detected: boolean) => void;
  firstDetection: boolean;
  setFirstDetection: (firstDetection: boolean) => void;
};

const useFaceDetection = create<FaceDetectionState>((set) => ({
  isDetected: false,
  setIsDetected: (detected) => set({ isDetected: detected }),
  firstDetection: false,
  setFirstDetection: (detection) => set({ firstDetection: detection }),
}));

export default useFaceDetection;
