import { Box, FaceDetection, FaceLandmarks, IBoundingBox, IRect, Point, FaceLandmarks68 } from "@vladmandic/face-api";

export interface FaceMetrics {
    eyeDistance: number;
    eyeSlope: number;
    faceDepth: number;
    displaySize: {
        width: number;
        height: number;
    };
    noseBridge: Point[];
    faceWidth: number;
    faceHeight: number;
    faceCenterX: number;
    faceCenterY: number;
}

export interface Landmarks extends FaceLandmarks68 {
    getJawOutline: () => Point[];
    getLeftEyeBrow: () => Point[];
    getRightEyeBrow: () => Point[];
    getNose: () => Point[];
    getLeftEye: () => Point[];
    getRightEye: () => Point[];
    getMouth: () => Point[];
    shift: Point;
    imageWidth: number;
    imageHeight: number;
    positions: Point[];
    relativePositions: Point[];
    forSize: <T extends FaceLandmarks>(width: number, height: number) => T;
    shiftBy: <T extends FaceLandmarks>(x: number, y: number) => T;
    shiftByPoint: <T extends FaceLandmarks>(pt: Point) => T;
    align: (detection?: FaceDetection | IRect | IBoundingBox | null | undefined, options?: {
        useDlibAlignment?: boolean | undefined;
        minBoxPadding?: number | undefined;
    } | undefined) => Box<any>;
    faceMetrics?: FaceMetrics;
}


export type DetectionBox = {
    x: number
    y: number
    width: number
    height: number
  }
  
  export type ExpressionMap = Record<string, number>
  
  export type LandmarkPoint = {
    x: number
    y: number
  }
  
  export type Person = {
    detection: {
      box: DetectionBox
    }
    angle: {
      roll: number
      pitch: number
      yaw: number
    }
    landmarks: {
      positions: LandmarkPoint[]
    }
  }