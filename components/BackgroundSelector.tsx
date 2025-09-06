import React from 'react';
import ImageUploader from './ImageUploader';
import { StudioIcon, ParkIcon, CityIcon, GradientIcon } from './IconComponents';

export type PredefinedBackground = 'Studio White' | 'Outdoor Park' | 'City Street' | 'Abstract Gradient';
export type BackgroundType = PredefinedBackground | 'Custom' | 'None';

interface BackgroundSelectorProps {
  selectedBackground: BackgroundType;
  onBackgroundChange: (type: BackgroundType) => void;
  onCustomImageUpload: (base64: string | null) => void;
}

const backgroundOptions: { name: PredefinedBackground; Icon: React.FC<{className?: string}> }[] = [
  { name: 'Studio White', Icon: StudioIcon },
  { name: 'Outdoor Park', Icon: ParkIcon },
  { name: 'City Street', Icon: CityIcon },
  { name: 'Abstract Gradient', Icon: GradientIcon },
];

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ selectedBackground, onBackgroundChange, onCustomImageUpload }) => {

  const handleImageUpload = (base64: string | null) => {
    onCustomImageUpload(base64);
    if (base64) {
      onBackgroundChange('Custom');
    } else if (selectedBackground === 'Custom') {
      onBackgroundChange('None');
    }
  }
  
  const handlePredefinedSelect = (option: PredefinedBackground) => {
    onBackgroundChange(option);
    // Clear any custom image that might be in App's state
    onCustomImageUpload(null); 
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {backgroundOptions.map(({ name, Icon }) => (
          <button
            key={name}
            onClick={() => handlePredefinedSelect(name)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 aspect-[4/3]
              ${selectedBackground === name
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-indigo-500 hover:text-white'
              }`}
          >
            <Icon className="w-8 h-8 mb-1" />
            <span className="text-xs text-center">{name}</span>
          </button>
        ))}
      </div>
      <ImageUploader 
        key={selectedBackground === 'Custom' ? 'custom-active' : 'custom-inactive'}
        title="Or Upload Custom"
        onImageUpload={handleImageUpload} 
        isActive={selectedBackground === 'Custom'}
      />
    </div>
  );
};

export default BackgroundSelector;