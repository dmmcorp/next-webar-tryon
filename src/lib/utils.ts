import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Person } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function drawFaces(
  canvas: HTMLCanvasElement,
  data: Person[],
  fps: number
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw FPS label
  ctx.font = 'small-caps 20px "Segoe UI"'
  ctx.fillStyle = 'white'
  ctx.fillText(`FPS: ${fps}`, 10, 25)

  for (const person of data) {
    const { box } = person.detection

    // Draw bounding box
    ctx.lineWidth = 3
    ctx.strokeStyle = 'deepskyblue'
    ctx.fillStyle = 'deepskyblue'
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.rect(box.x, box.y, box.width, box.height)
    ctx.stroke()
    ctx.globalAlpha = 1

    // Draw labels (twice: black shadow then light blue text for contrast)
    const textLines = [
    
      `roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`,
    ]

    ctx.fillStyle = 'black'
    textLines.forEach((text, i) => {
      ctx.fillText(text, box.x, box.y - 59 + i * 18)
    })

    ctx.fillStyle = 'lightblue'
    textLines.forEach((text, i) => {
      ctx.fillText(text, box.x, box.y - 60 + i * 18)
    })

    // Draw facial landmarks
    ctx.globalAlpha = 0.8
    ctx.fillStyle = 'lightblue'
    const pointSize = 2

    for (const point of person.landmarks.positions) {
      ctx.beginPath()
      ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}

export function log(...txt: unknown[]): void {
  console.log(...txt);  
  const div = document.getElementById('log');
  if (div) div.innerHTML += `<br>${txt}`;
}
