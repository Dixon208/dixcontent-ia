'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PenTool, 
  History, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@supabase/ssr';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Generator', href: '/dashboard/generate', icon: PenTool },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40 pt-20",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full justify-between p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-gradient-primary text-white font-bold" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors group",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 text-gray-500 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
