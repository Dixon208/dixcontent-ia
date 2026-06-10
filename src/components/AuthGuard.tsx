'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/supabase/client';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      // 1. Check env vars exist
      if (!isSupabaseConfigured()) {
        setView('error');
        setErrorMsg(
          'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env vars.'
        );
        return;
      }

      // 2. Try to get the user with a short timeout
      try {
        const result = await Promise.race([
          supabase.auth.getUser(),
          new Promise<{ error: Error }>((_, reject) =>
            setTimeout(() => reject(new Error('Supabase auth timed out (8s). Check your URL and anon key.')), 8000)
          ),
        ]);

        if (cancelled) return;

        const user = (result as any)?.data?.user;
        const authErr = (result as any)?.error;

        if (authErr) {
          setView('error');
          setErrorMsg(authErr.message);
          return;
        }

        const isAuthPath = pathname.startsWith('/auth');

        if (user && isAuthPath) {
          router.replace('/dashboard');
        } else {
          setView('ready');
        }
      } catch (err: any) {
        if (!cancelled) {
          setView('error');
          setErrorMsg(err?.message || 'Auth check failed');
        }
      }
    };

    check();
    return () => { cancelled = true; };
  }, [pathname, router]);

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-gray-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="text-center max-w-md space-y-2">
          <p className="text-white font-bold text-lg">Connection Error</p>
          <p className="text-gray-400 text-sm">{errorMsg}</p>
          <div className="bg-gray-900 rounded-lg p-3 mt-3 text-left text-xs font-mono text-gray-400">
            <div>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '(not set)'}</div>
            <div>Key: {(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '(not set)').substring(0, 20)}...</div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gray-800 rounded-lg text-white font-medium hover:bg-gray-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}