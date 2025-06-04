'use client';

import useModelStore from '@/stores/useModelStore';
import { useEffect } from 'react';

const modelData = [
  {
    name: "Glass A",
    variant: "Black Frame",
    path: "/assets/sample/glass-center.glb",
  },
  {
    name: "Glass B",
    variant: "Gold Frame",
    path: "/assets/sample/model1.glb",
  },
];

export default function ModelSelector() {
  const { models, selectedModel, setModels, selectModel } = useModelStore();

  useEffect(() => {
    setModels(modelData);
    selectModel(modelData[0]); // default selection
  }, [setModels, selectModel]);

  return (
    <div className='absolute bottom-10'>
      {models.map((model) => (
        <button
          key={model.path}
          onClick={() => selectModel(model)}
          className={`p-2 m-1 border ${selectedModel?.path === model.path ? 'bg-blue-500 text-white' : ''}`}
        >
          {model.name} - {model.variant}
        </button>
      ))}
    </div>
  );
}
