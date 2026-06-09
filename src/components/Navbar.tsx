'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Sparkles, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-primary p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DixContent AI</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {!user && navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-primary text-sm font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-gray-950 px-4 py-4 space-y-4">
          {!user && navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-base font-medium text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block text-base font-medium text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left text-base font-medium text-red-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="space-y-4 pt-2">
              <Link
                href="/auth/login"
                className="block text-base font-medium text-gray-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-primary text-base font-bold text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
