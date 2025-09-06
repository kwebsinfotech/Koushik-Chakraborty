import React, { useState, useCallback } from 'react';
import { ModelType } from './types';
import { generateMockup } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ModelSelector from './components/ModelSelector';
import GeneratedImages from './components/GeneratedImages';
import BackgroundSelector, { BackgroundType } from './components/BackgroundSelector';
import { GenerateIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('None');
  const [modelType, setModelType] = useState<ModelType>(ModelType.Unisex);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isGenerationDisabled = !productImage || !designImage || isLoading;

  const handleGenerateMockups = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const is3DView = modelType === ModelType.Product3D || modelType === ModelType.Product3DAnimated;

      const variationPrompts = is3DView
        ? [
            "with clean studio lighting from the top-left.",
            "showcasing the product material texture.",
            "from a dramatic low-angle perspective.",
            "with a slight isometric view.",
            "perfectly centered with a subtle drop shadow."
          ]
        : [
            "in a dynamic, confident pose.",
            "with soft, natural lighting.",
            "from a slightly different angle to showcase texture.",
            "with a cheerful and approachable expression.",
            "in a minimalist setting that highlights the product."
          ];
      
      const background: { type: 'custom' | 'predefined' | 'none'; value: string | null; } = {
          type: backgroundType === 'Custom' ? 'custom' : (backgroundType === 'None' ? 'none' : 'predefined'),
          value: backgroundType === 'Custom' ? backgroundImage : (backgroundType === 'None' ? null : backgroundType),
      };

      const imagePromises = variationPrompts.map(variation => 
        generateMockup(productImage!, designImage!, modelType, background, variation)
      );
      
      const results = await Promise.all(imagePromises);
      const successfulImages = results.filter((img): img is string => img !== null);

      if (successfulImages.length < 5) {
        throw new Error(`Failed to generate all mockups. Got ${successfulImages.length} out of 5.`);
      }

      setGeneratedImages(successfulImages);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, designImage, modelType, backgroundImage, backgroundType, isGenerationDisabled]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-4 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">1. Upload Your Assets</h2>
            <div className="space-y-6">
              <ImageUploader title="Product Image" onImageUpload={setProductImage} isRequired={true} />
              <ImageUploader title="Design Image" onImageUpload={setDesignImage} isRequired={true} />
               <BackgroundSelector
                  selectedBackground={backgroundType}
                  onBackgroundChange={setBackgroundType}
                  onCustomImageUpload={setBackgroundImage}
                />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-6 text-white border-b border-gray-700 pb-4">2. Select View / Model</h2>
            <ModelSelector selectedModel={modelType} onSelectModel={setModelType} />
            
            <div className="mt-8 border-t border-gray-700 pt-6">
                <button
                    onClick={handleGenerateMockups}
                    disabled={isGenerationDisabled}
                    className={`w-full flex items-center justify-center text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out
                        ${isGenerationDisabled 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-0.5'
                        }`}
                >
                    <GenerateIcon className="w-6 h-6 mr-3" />
                    {isLoading ? 'Generating...' : 'Generate 5 Mockups'}
                </button>
            </div>
            {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8">
             <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 min-h-[400px]">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">3. Generated Mockups</h2>
                <GeneratedImages images={generatedImages} isLoading={isLoading} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;