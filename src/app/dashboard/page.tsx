'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Clock, 
  Zap, 
  CreditCard, 
  ArrowRight,
  PenTool
} from 'lucide-react';
import ContentCard from '@/components/ContentCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ContentHistory, UserProfile } from '@/lib/types';
import { supabase } from '@/supabase/client';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentHistory, setRecentHistory] = useState<ContentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const profileRes = await fetch('/api/user/profile');
        const profileData = await profileRes.json();
        setProfile(profileData.profile || profileData);

        const historyRes = await fetch('/api/history');
        const historyData = await historyRes.json();
        setRecentHistory(historyData.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.name || 'Creator'}!</h1>
          <p className="text-gray-400">Here's what's happening with your content today.</p>
        </div>
        <Link 
          href="/dashboard/generate"
          className="px-6 py-3 bg-gradient-primary rounded-xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <PenTool className="w-5 h-5" />
          Create New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Available Credits</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {profile?.subscription_status === 'pro' ? '∞' : profile?.credits || 0}
          </div>
          <p className="text-sm text-gray-500">
            {profile?.subscription_status === 'pro' ? 'Pro Plan Active' : 'Free Plan'}
          </p>
        </div>

        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Generations</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {recentHistory.length > 0 ? '12' : '0'}
          </div>
          <p className="text-sm text-gray-500">Across all platforms</p>
        </div>

        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-green-400">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Plan Status</span>
          </div>
          <div className="text-xl font-bold text-white capitalize">
            {profile?.subscription_status || 'Free'}
          </div>
          <Link href="/dashboard/settings" className="text-xs text-purple-400 hover:underline">
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Recent Generations
          </h2>
          <Link href="/dashboard/history" className="text-sm text-purple-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentHistory.map((item) => (
              <ContentCard key={item.id} content={item} showDetails={false} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <PenTool className="w-8 h-8 text-gray-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">No content yet</h3>
              <p className="text-gray-400 max-w-xs mx-auto">
                Generate your first platform-optimized post idea in seconds.
              </p>
            </div>
            <Link 
              href="/dashboard/generate"
              className="inline-block px-6 py-3 bg-gray-800 rounded-xl font-bold text-white hover:bg-gray-700 transition-colors"
            >
              Start Generating
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

