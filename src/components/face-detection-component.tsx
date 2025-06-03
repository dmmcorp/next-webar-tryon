"use client";
import { useState } from "react";
import { Landmarks } from "@/lib/types";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
// import Sunglasses from "./sunglasses";
// import { OrbitControls } from "@react-three/drei";
// import DynamicModel from "./dynamic-model";
import ModelSelector from "./model-selector";
// import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
// import { Card, CardContent } from "./ui/card";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "./ui/button";
import GlassModel from "./glass";
import Mask from "./mask";

type FaceDetectionProps = {
  onLandmarks: (landmarks: Landmarks | null) => void;
};

const FaceDetection = dynamic<FaceDetectionProps>(
  () => import("../components/face-detection"),
  { ssr: false }
);

export default function FaceDetectionComponent() {
  // console.log(landmarks);
  const [landmarks, setLandmarks] = useState<Landmarks | null>(null);
  const [, setSelectedModel] = useState(1);
  // const [frameLink, setFrameLink] = useState<string | null>();
  // const [faceDetected, setFaceDetected] = useState<boolean>(null);
  return (
    <div className="size-full relative">
  

    
      <FaceDetection onLandmarks={setLandmarks} />
      {/* 3D Overlays */}
      {/* <Link href={'/'} className=" absolute inset-10 h-10 w-10">
        <ArrowLeft className="text-white h-10 w-10"/>
      </Link> */}
      {/* <div className="absolute h-60 bottom-0 left-0 w-full bg-white/50 container grid-cols-2">

        <Button onClick={()=>{setFrameLink("https://mywebar.com/p/Project_0_w74r5egkcp")}}>
        <Card>
          <CardContent>Model 1</CardContent>
        </Card>
        </Button>
      </div> */}
      {/* {frameLink ? (
        <div className="">
          <iframe
            src={frameLink}
            frameBorder={0}
            scrolling="yes"
            style={{ display: "absolute", width: "100%", height: "100vh", top: "-10o", zIndex: 100 }}
            allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"
          ></iframe>
        </div>
        
      ): (
          <div className="">pick Eye glass</div>
      )}
     */}
    
        
   
      <div className="absolute size-full top-0 left-0 bg-black/30">
        <Canvas
          orthographic 
          camera={{ zoom: 100, position: [0, 0, 10] }}
          gl={{ antialias: true }}
          className="absolute  size-full"
        >
        
          <ambientLight intensity={1} />
          <directionalLight position={[0, 0, 5]} />
          {/* <OrbitControls /> */}
       
          <GlassModel landmarks={landmarks}/>
          <Mask landmarks={landmarks}/>
      
        </Canvas>
      </div>
      
      <ModelSelector onModelChange={setSelectedModel} />
        <div className="absolute bg-red-500 h-1 w-1 rounded-full"
          style={{
            left: `${landmarks?.faceMetrics?.jawX}px`,
            top: `${landmarks?.faceMetrics?.jawY}px`
          }}
        >
          asd
        </div>
      {/* <div className="absolute top-20 left-10 z-[1000] text-white">
        <div className="">
         { landmarks?.faceMetrics?.xRotation}
        </div>
      </div> */}

      {/* <Canvas   orthographic 
          camera={{ zoom: 100, position: [0, 0, 10] }}
          gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0,3,10]}/>
          <ambientLight intensity={1} />
          <directionalLight intensity={3} position={[0, 2, 5]} />
          <OrbitControls/>
          <GlassModel landmarks={landmarks}/>
          <Mask landmarks={landmarks}/>
          <gridHelper />
      </Canvas> */}
    </div>
  );
}
