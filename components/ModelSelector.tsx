import React from 'react';
import { ModelType } from '../types';
import { MaleIcon, FemaleIcon, UnisexIcon, KidIcon, BabyIcon, Product3DIcon, Product3DAnimatedIcon } from './IconComponents';

interface ModelSelectorProps {
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
}

const modelOptions = [
  { type: ModelType.Male, Icon: MaleIcon },
  { type: ModelType.Female, Icon: FemaleIcon },
  { type: ModelType.Unisex, Icon: UnisexIcon },
  { type: ModelType.Kid, Icon: KidIcon },
  { type: ModelType.Baby, Icon: BabyIcon },
  { type: ModelType.Product3D, Icon: Product3DIcon },
  { type: ModelType.Product3DAnimated, Icon: Product3DAnimatedIcon },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelectModel }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {modelOptions.map(({ type, Icon }) => (
        <button
          key={type}
          onClick={() => onSelectModel(type)}
          className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 aspect-square
            ${selectedModel === type
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
              : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-white'
            }`}
        >
          <Icon className="w-8 h-8 mb-1" />
          <span className="text-xs sm:text-sm font-semibold text-center leading-tight">{type}</span>
        </button>
      ))}
    </div>
  );
};

export default ModelSelector;