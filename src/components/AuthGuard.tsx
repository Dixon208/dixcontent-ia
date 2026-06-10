'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    let cancelled = false;

    const checkAuth = async () => {
      try {
        // Check env vars first
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !anonKey) {
          setState('error');
          setErrorMsg(
            'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings.'
          );
          return;
        }

        if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
          setState('error');
          setErrorMsg(
            'NEXT_PUBLIC_SUPABASE_URL does not look like a valid Supabase URL. It should be https://[project].supabase.co'
          );
          return;
        }

        const supabase = createBrowserClient(url, anonKey);

        // Timeout to prevent infinite hanging
        const ac = new AbortController();
        const timeout = setTimeout(() => {
          ac.abort();
          if (!cancelled) {
            setState('error');
            setErrorMsg(
              'Connection to Supabase timed out after 8 seconds. Your Supabase project URL or anon key is likely incorrect.'
            );
          }
        }, 8000);

        const { data: { session }, error } = await supabase.auth.getSession();
        clearTimeout(timeout);

        if (cancelled) return;

        if (error) {
          setState('error');
          setErrorMsg(error.message);
          return;
        }

        const isAuthPath = pathname.startsWith('/auth');
        const isDashboardPath = pathname.startsWith('/dashboard');

        if (!session && isDashboardPath) {
          router.replace('/auth/login');
        } else if (session && isAuthPath) {
          router.replace('/dashboard');
        } else {
          setState('ready');
        }
      } catch (err: any) {
        if (!cancelled) {
          setState('error');
          setErrorMsg(err?.message || 'Failed to connect to Supabase. Check your environment variables.');
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-gray-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="text-center max-w-md space-y-2">
          <p className="text-white font-bold text-lg">Authentication Error</p>
          <p className="text-gray-400 text-sm">{errorMsg}</p>
          <p className="text-gray-500 text-xs mt-4">
            Add or fix these in Vercel → Settings → Environment Variables:
          </p>
          <div className="bg-gray-900 rounded-lg p-3 text-left text-xs font-mono text-gray-400 space-y-1">
            <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key</div>
          </div>
        </div>
        <button
          onClick={() => { checkedRef.current = false; window.location.reload(); }}
          className="mt-4 px-6 py-2 bg-gray-800 rounded-lg text-white font-medium hover:bg-gray-700 transition-colors"
        >
          Retry After Fixing
        </button>
      </div>
    );
  }

  return <>{children}</>;
}