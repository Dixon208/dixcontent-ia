import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 transition-all duration-300 md:pl-64 pt-16">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
