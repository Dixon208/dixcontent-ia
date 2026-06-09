'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const isAuthPath = pathname.startsWith('/auth');
      const isDashboardPath = pathname.startsWith('/dashboard');

      if (!session && isDashboardPath) {
        router.replace('/auth/login');
      } else if (session && isAuthPath) {
        router.replace('/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-gray-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
