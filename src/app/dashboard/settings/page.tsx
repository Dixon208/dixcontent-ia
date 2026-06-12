'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Zap, 
  CheckCircle2, 
  Loader2,
  Mail,
  Shield
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { UserProfile } from '@/lib/types';
import { supabase } from '@/supabase/client';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        setProfile(data.profile || data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading settings..." />;

  const isPro = profile?.subscription_status === 'pro';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-500" />
          Settings
        </h1>
        <p className="text-gray-400">Manage your account and subscription preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-white font-medium border border-gray-800">
            <User className="w-5 h-5 text-purple-400" />
            Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
            <Shield className="w-5 h-5" />
            Security
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Account Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Account Information</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <User className="w-4 h-4" /> Name
                  </label>
                  <p className="text-white font-medium">{profile?.name || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </label>
                  <p className="text-white font-medium">{profile?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className={cn(
            "bg-gray-900 border rounded-2xl overflow-hidden transition-colors",
            isPro ? "border-purple-500/50" : "border-gray-800"
          )}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Subscription Plan</h2>
              {isPro && (
                <span className="px-3 py-1 bg-purple-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-gray-800">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    isPro ? "bg-purple-500/10 text-purple-400" : "bg-gray-800 text-gray-400"
                  )}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{isPro ? 'Pro Plan' : 'Free Plan'}</p>
                    <p className="text-sm text-gray-500">
                      {isPro ? 'Unlimited AI generations' : `${profile?.credits || 0} credits remaining`}
                    </p>
                  </div>
                </div>
                {!isPro && (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="px-6 py-2 bg-gradient-primary rounded-lg font-bold text-white hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                  >
                    {upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgrade'}
                  </button>
                )}
              </div>

              {!isPro && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Why upgrade to Pro?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      'Unlimited content generations',
                      'Priority access to latest models',
                      'Save full history forever',
                      'Exclusive platform prompts'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isPro && (
                <div className="pt-2">
                  <button className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    Manage billing with Stripe
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

