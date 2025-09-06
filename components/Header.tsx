
import React from 'react';
import { LogoIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-3">
          <LogoIcon className="w-10 h-10 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            AI Mockup Generator
          </h1>
        </div>
        <p className="mt-2 text-md text-gray-400 max-w-2xl mx-auto">
          Instantly create stunning, realistic product mockups. Upload your assets, choose a model, and let AI do the magic.
        </p>
      </div>
    </header>
  );
};

export default Header;
