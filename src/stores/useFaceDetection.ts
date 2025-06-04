import { create } from "zustand";

type FaceDetectionState = {
  isDetected: boolean;
  setIsDetected: (detected: boolean) => void;
};

const useFaceDetection = create<FaceDetectionState>((set) => ({
  isDetected: false,
  setIsDetected: (detected) => set({ isDetected: detected }),
}));

export default useFaceDetection;
