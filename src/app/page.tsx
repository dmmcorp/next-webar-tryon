
import FaceDetectionComponent from "@/components/face-detection-component";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
        <FaceDetectionComponent/>
    </div>
  );
}
