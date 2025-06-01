import { useState, useRef } from "react";

interface ModelSelectorProps {
  onModelChange: (modelNumber: number) => void;
}

export default function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [currentModel, setCurrentModel] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleModelSelect = (modelNumber: number) => {
    setCurrentModel(modelNumber);
    onModelChange(modelNumber);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 p-4 rounded-lg z-50">
      <div className="relative flex items-center">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-12 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide max-w-[calc(100vw-200px)]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((modelNumber) => (
            <button
              key={modelNumber}
              onClick={() => handleModelSelect(modelNumber)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                currentModel === modelNumber
                  ? "ring-2 ring-blue-500 scale-110"
                  : "hover:scale-105"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  Model {modelNumber}
                </span>
              </div>
              {/* Placeholder for future preview images */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-12 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
