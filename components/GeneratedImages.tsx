import React, { useState } from 'react';
import { ImageIcon, ZoomInIcon } from './IconComponents';
import ImageModal from './ImageModal';

interface GeneratedImagesProps {
  images: string[];
  isLoading: boolean;
}

const Placeholder: React.FC = () => (
  <div className="aspect-square bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
    <ImageIcon className="w-12 h-12 text-gray-600" />
  </div>
);

const GeneratedImages: React.FC<GeneratedImagesProps> = ({ images, isLoading }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const hasImages = images.length > 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Placeholder key={index} />
        ))}
      </div>
    );
  }

  if (!hasImages && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 h-80">
        <ImageIcon className="w-20 h-20 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Your mockups will appear here</h3>
        <p className="mt-1">Upload your assets and click "Generate" to start.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="aspect-square bg-gray-700 rounded-lg overflow-hidden shadow-lg group relative">
            <img src={image} alt={`Generated mockup ${index + 1}`} className="w-full h-full object-cover" />
            {/* Overlay for actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-4">
              <button
                onClick={() => setZoomedImage(image)}
                className="bg-indigo-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-500 transform scale-90 group-hover:scale-100"
                aria-label="Zoom in"
              >
                <ZoomInIcon className="h-6 w-6" />
              </button>
              <a
                href={image}
                download={`mockup-${index + 1}.png`}
                className="bg-green-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-500 transform scale-90 group-hover:scale-100"
                aria-label="Download image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
      <ImageModal imageUrl={zoomedImage} onClose={() => setZoomedImage(null)} />
    </>
  );
};

export default GeneratedImages;