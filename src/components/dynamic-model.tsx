'use client'
import { Landmarks } from "@/lib/types";
import useModelStore from "@/stores/useModelStore";
import GlassModel from "./glass";

interface DynamicModelProps {
  landmarks: Landmarks | null;
}

export default function DynamicModel({
  landmarks,
}: DynamicModelProps) {
   const selectedModel = useModelStore((state) => state.selectedModel);
  if (!selectedModel) return null;

  return (
    <GlassModel 
      landmarks={landmarks} 
      selectedModel={selectedModel}
    />
  );
}
