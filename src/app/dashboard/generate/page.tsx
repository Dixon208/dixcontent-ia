'use client';

import { useState } from 'react';
import { Sparkles, ArrowLeft, RefreshCw, PenTool } from 'lucide-react';
import Link from 'next/link';
import GeneratorForm from '@/components/GeneratorForm';
import ContentCard from '@/components/ContentCard';
import { ContentHistory } from '@/lib/types';

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ContentHistory | null>(null);

  const handleGenerate = async (formData: { topic: string; niche: string; platform: string }) => {
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <PenTool className="w-8 h-8 text-purple-500" />
          Content Generator
        </h1>
        <p className="text-gray-400">Fill in the details below to generate platform-optimized content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Column */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Generation Result
          </h2>

          {result ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ContentCard content={result} />
              <button 
                onClick={() => setResult(null)}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors py-2"
              >
                <RefreshCw className="w-4 h-4" />
                Start over
              </button>
            </div>
          ) : isGenerating ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-bold">AI is thinking...</p>
                <p className="text-gray-500 text-sm italic">Crafting the perfect post for you</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gray-700" />
              </div>
              <p className="text-gray-500 text-sm max-w-[200px]">
                Your generated content will appear here once you click generate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
