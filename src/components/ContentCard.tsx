'use client';

import { useState } from 'react';
import { Copy, Check, Calendar, Trash2, Tag, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentHistory } from '@/lib/types';

interface ContentCardProps {
  content: ContentHistory;
  onDelete?: (id: string) => void;
  showDetails?: boolean;
}

export default function ContentCard({ content, onDelete, showDetails = true }: ContentCardProps) {
  const [copied, setCopied] = useState<'caption' | 'hashtags' | null>(null);

  const copyToClipboard = async (text: string, type: 'caption' | 'hashtags') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCopyCaption = () => {
    if (content.caption) copyToClipboard(content.caption, 'caption');
  };

  const hashtagsString = Array.isArray(content.hashtags)
    ? content.hashtags.join(' ')
    : '';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg transition-all hover:border-gray-700">
      <div className="p-5 space-y-4">
        {showDetails && (
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                {content.platform}
              </span>
              <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                {content.niche}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(content.created_at).toLocaleDateString()}
              </span>
              {onDelete && (
                <button
                  onClick={() => onDelete(content.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Layout className="w-4 h-4 text-purple-400" /> Caption
            </h4>
            <button
              onClick={handleCopyCaption}
              className="p-1.5 rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
              title="Copy caption"
            >
              {copied === 'caption' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 text-sm text-gray-300 whitespace-pre-wrap">
            {content.caption}
          </div>
        </div>

        {content.hashtags && Array.isArray(content.hashtags) && content.hashtags.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" /> Hashtags
              </h4>
              <button
                onClick={() => copyToClipboard(hashtagsString, 'hashtags')}
                className="p-1.5 rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                title="Copy hashtags"
              >
                {copied === 'hashtags' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag: any, i: number) => (
                <span key={i} className="text-blue-400 text-xs">#{tag.replace('#', '')}</span>
              ))}
            </div>
          </div>
        )}

        {content.post_ideas && Array.isArray(content.post_ideas) && content.post_ideas.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">Post Ideas</h4>
            <ul className="space-y-1">
              {content.post_ideas.map((idea: any, i: number) => (
                <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
