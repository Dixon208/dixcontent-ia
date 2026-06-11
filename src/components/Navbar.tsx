'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Sparkles, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-900">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-primary p-1.5 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">DixContent AI</span>
          </Link>
        </div>

        {pathname.startsWith('/dashboard') && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{user?.email || 'User'}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}