'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/supabase/client';
import { Sparkles, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Check your environment variables.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.user?.identities?.length === 0) {
        setError('This email is already registered. Try signing in instead.');
        setLoading(false);
        return;
      }

      // Create user profile (best-effort, don't block on failure)
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error('Profile creation warning:', errData);
        }
      } catch (err) {
        console.error('Profile creation network error:', err);
      }

      // Full page navigation ensures cookies are sent to middleware
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-primary p-2 rounded-lg"><Sparkles className="w-6 h-6 text-white" /></div>
              <span className="text-2xl font-bold text-white">DixContent AI</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400">Start with 5 free credits, no credit card needed.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input id="name" type="text" placeholder="Your name"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input id="email" type="email" placeholder="you@example.com"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input id="password" type="password" placeholder="At least 6 characters"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
                </div>
              </div>
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-primary py-4 rounded-xl font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}