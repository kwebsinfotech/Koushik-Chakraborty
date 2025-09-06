import React, { useState, useRef } from 'react';
import { UploadIcon, TrashIcon } from './IconComponents';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (base64: string | null) => void;
  isRequired?: boolean;
  isActive?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, isRequired = false, isActive = false }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">
        {title} {isRequired && <span className="text-red-500">*</span>}
      </h3>
      <div
        onClick={!imagePreview ? triggerFileInput : undefined}
        className={`relative group flex justify-center items-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${imagePreview || isActive ? 'border-indigo-500 p-2' : 'border-gray-600 hover:border-indigo-500 bg-gray-700/50 hover:bg-gray-700'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Preview" className="object-contain h-full w-full rounded-md" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
              aria-label="Remove image"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <UploadIcon className="mx-auto h-10 w-10 mb-2" />
            <p className="font-semibold">Click to upload</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;