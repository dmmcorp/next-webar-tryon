import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Person } from "./types";
import * as THREE from "three";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function drawFaces(
  canvas: HTMLCanvasElement,
  data: Person,
  fps: number
): void {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw FPS label
  ctx.font = 'small-caps 20px "Segoe UI"';
  ctx.fillStyle = "white";
  ctx.fillText(`FPS: ${fps}`, 10, 25);

  const { box } = data.detection;

  // Draw bounding box
  ctx.lineWidth = 3;
  ctx.strokeStyle = "deepskyblue";
  ctx.fillStyle = "deepskyblue";
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.rect(box.x, box.y, box.width, box.height);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Draw labels (twice: black shadow then light blue text for contrast)
  const textLines = [
    `roll:${data.angle.roll}° pitch:${data.angle.pitch}° yaw:${data.angle.yaw}°`,
  ];

  ctx.fillStyle = "black";
  textLines.forEach((text, i) => {
    ctx.fillText(text, box.x, box.y - 59 + i * 18);
  });

  ctx.fillStyle = "lightblue";
  textLines.forEach((text, i) => {
    ctx.fillText(text, box.x, box.y - 60 + i * 18);
  });

  // Draw facial landmarks
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "lightblue";
  const pointSize = 2;

  for (const point of data.landmarks.positions) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export function log(...txt: unknown[]): void {
  console.log(...txt);
  const div = document.getElementById("log");
  if (div) div.innerHTML += `<br>${txt}`;
}

export function get3DPositionFrom2D(
  xPixel: number,
  yPixel: number,
  videoWidth: number,
  videoHeight: number,
  camera: THREE.Camera,
  depth = 0 // distance from camera in world units, adjust based on your setup
) {
  // Convert pixel coordinates to normalized device coordinates (NDC)
  const xNDC = (xPixel / videoWidth) * 2 - 1;
  const yNDC = -((yPixel / videoHeight) * 2 - 1);

  // Create a vector in NDC space
  const vec = new THREE.Vector3(xNDC, yNDC, depth);

  // Unproject the vector to world coordinates
  vec.unproject(camera);

  return vec;
}

export function normalizeScale(object: THREE.Object3D, targetHeight = 1) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetHeight / maxDim;

  object.scale.setScalar(scale);
}
