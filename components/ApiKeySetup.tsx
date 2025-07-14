
import React, { useState } from 'react';
import { ApiConfig, AIProvider } from '../types';
import { OPENROUTER_FREE_MODELS } from '../constants';
import { SparklesIcon, AcademicCapIcon } from './icons';

interface ApiKeySetupProps {
  onConfigured: (config: ApiConfig) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onConfigured }) => {
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const [openRouterModel, setOpenRouterModel] = useState(OPENROUTER_FREE_MODELS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider === 'gemini' && !geminiApiKey) {
      alert('Please enter a Gemini API Key.');
      return;
    }
    if (provider === 'openrouter' && !openRouterApiKey) {
      alert('Please enter an OpenRouter API Key.');
      return;
    }
    onConfigured({
      provider,
      geminiApiKey,
      openRouterApiKey,
      openRouterModel,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex flex-col items-center mb-6">
            <AcademicCapIcon className="h-16 w-16 text-indigo-400 mb-2"/>
            <h1 className="text-3xl font-bold text-white">Welcome to IT Learning Hub</h1>
            <p className="text-gray-400 mt-2 text-center">Configure your AI provider to get started.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select AI Provider</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  provider === 'gemini'
                    ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Google Gemini
              </button>
              <button
                type="button"
                onClick={() => setProvider('openrouter')}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  provider === 'openrouter'
                    ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                OpenRouter
              </button>
            </div>
          </div>
          
          {provider === 'gemini' && (
             <div>
                <label htmlFor="gemini_key" className="block text-sm font-medium text-gray-300">Gemini API Key</label>
                <input
                    id="gemini_key"
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your Gemini API key"
                />
             </div>
          )}

          {provider === 'openrouter' && (
            <>
              <div>
                <label htmlFor="openrouter_key" className="block text-sm font-medium text-gray-300">OpenRouter API Key</label>
                <input
                    id="openrouter_key"
                    type="password"
                    value={openRouterApiKey}
                    onChange={(e) => setOpenRouterApiKey(e.target.value)}
                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your OpenRouter API key"
                />
              </div>
              <div>
                <label htmlFor="openrouter_model" className="block text-sm font-medium text-gray-300">Select a Free Model</label>
                <select
                    id="openrouter_model"
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {OPENROUTER_FREE_MODELS.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-200"
          >
            <SparklesIcon className="w-5 h-5 mr-2"/>
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeySetup;
