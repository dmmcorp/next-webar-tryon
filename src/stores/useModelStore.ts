// stores/useModelStore.ts
import { Model } from "@/lib/types";
import { create } from "zustand";

type ModelStore = {
  models: Model[];
  selectedModel: Model | null;
  setModels: (models: Model[]) => void;
  selectModel: (model: Model) => void;
};

const useModelStore = create<ModelStore>((set) => ({
  models: [],
  selectedModel: {
    name: "Glass A",
    variant: "Black Frame",
    path: "/assets/sample/glass-center.glb",
  },
  setModels: (models) => set({ models }),
  selectModel: (model) => set({ selectedModel: model }),
}));

export default useModelStore;
