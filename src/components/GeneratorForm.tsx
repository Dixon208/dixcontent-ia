'use client';

import { useState } from 'react';
import { Send, Loader2, Sparkles, Instagram, Facebook, Twitter, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const platforms = [
  { id: 'Instagram', name: 'Instagram', icon: Instagram },
  { id: 'TikTok', name: 'TikTok', icon: Video },
  { id: 'Twitter', name: 'Twitter', icon: Twitter },
  { id: 'Facebook', name: 'Facebook', icon: Facebook },
];

interface GeneratorFormProps {
  onGenerate: (data: { topic: string; niche: string; platform: string }) => Promise<void>;
  isGenerating: boolean;
}

export default function GeneratorForm({ onGenerate, isGenerating }: GeneratorFormProps) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('Instagram');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !niche || !platform) return;
    await onGenerate({ topic, niche, platform });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium text-gray-300">
            What is your post about?
          </label>
          <input
            id="topic"
            type="text"
            placeholder="e.g. 5 tips for morning productivity"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="niche" className="text-sm font-medium text-gray-300">
            Your niche/target audience
          </label>
          <input
            id="niche"
            type="text"
            placeholder="e.g. Busy entrepreneurs, students"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={isGenerating}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block mb-2">
            Select Platform
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-3 rounded-lg border text-sm font-medium transition-all",
                  platform === p.id 
                    ? "bg-purple-500/10 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.1)]" 
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                )}
                disabled={isGenerating}
              >
                <p.icon className="w-4 h-4" />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || !topic || !niche}
        className="w-full bg-gradient-primary py-4 rounded-xl font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Content...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Generate Content
          </>
        )}
      </button>
    </form>
  );
}
