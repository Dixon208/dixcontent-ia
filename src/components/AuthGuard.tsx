'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Add a timeout to prevent infinite loading
        timeout = setTimeout(() => {
          if (!cancelled) {
            setState('error');
            setErrorMsg(
              'Connection to Supabase timed out. Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly in your environment.'
            );
          }
        }, 10000);

        const { data: { session } } = await supabase.auth.getSession();
        clearTimeout(timeout);

        if (cancelled) return;

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
          clearTimeout(timeout);
          setState('error');
          setErrorMsg(err.message || 'Failed to connect to Supabase');
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
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
            Make sure your Supabase project is active and the environment variables are correctly set in Vercel.
          </p>
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