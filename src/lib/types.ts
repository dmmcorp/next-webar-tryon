import { Box, FaceDetection, FaceLandmarks, IBoundingBox, IRect, Point } from "@vladmandic/face-api";

export type Landmarks = {
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
}