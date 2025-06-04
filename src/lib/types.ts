import {
  Box,
  FaceDetection,
  FaceLandmarks,
  IBoundingBox,
  IRect,
  Point,
  FaceLandmarks68,
} from "@vladmandic/face-api";

export interface FaceMetrics {
  eyeDistance: number;
  eyeSlope: number;
  faceDepth: number;
  displaySize: {
    width: number;
    height: number;
  };
  noseBridge: Point[];
  jawX: number;
  jawY: number;
  noseBridgeX: number;
  noseBridgeY: number;
  faceWidth: number;
  faceHeight: number;
  faceCenterX: number;
  faceCenterY: number;
  xRotation: number;
  yRotation: number;
  zRotation: number;
}

export interface Landmarks extends FaceLandmarks68 {
  shift: Point;
  imageWidth: number;
  imageHeight: number;
  faceBox: { width: number; height: number; x: number; y: number };
  positions: Point[];
  relativePositions: Point[];
  forSize: <T extends FaceLandmarks>(width: number, height: number) => T;
  shiftBy: <T extends FaceLandmarks>(x: number, y: number) => T;
  shiftByPoint: <T extends FaceLandmarks>(pt: Point) => T;
  align: (
    detection?: FaceDetection | IRect | IBoundingBox | null | undefined,
    options?:
      | {
          useDlibAlignment?: boolean | undefined;
          minBoxPadding?: number | undefined;
        }
      | undefined
  ) => Box<unknown>;
  faceMetrics?: FaceMetrics;
}

export type DetectionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ExpressionMap = Record<string, number>;

export type LandmarkPoint = {
  x: number;
  y: number;
};

export type Person = {
  detection: {
    box: DetectionBox;
  };
  angle: {
    roll: number;
    pitch: number;
    yaw: number;
  };
  landmarks: {
    positions: LandmarkPoint[];
  };
};

export type Variants = {
  model: string;
  variant: string;
  path: string;
};
