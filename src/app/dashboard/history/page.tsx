'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Trash2, Layout, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from '@/components/ContentCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ContentHistory } from '@/lib/types';
import { createBrowserClient } from '@supabase/ssr';

export default function HistoryPage() {
  const [history, setHistory] = useState<ContentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchHistory = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history?page=${pageNum}`);
      const data = await response.json();
      setHistory(data.data || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setHistory(history.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Layout className="w-8 h-8 text-purple-500" />
            Content History
          </h1>
          <p className="text-gray-400">Browse all your previously generated content.</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading history..." />
      ) : history.length === 0 ? (
        <div className="p-16 text-center bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl space-y-4">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No history yet</h3>
          <p className="text-gray-400">Your generated content will appear here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((item) => (
              <ContentCard 
                key={item.id} 
                content={item} 
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}