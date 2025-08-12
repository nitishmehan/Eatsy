'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BlogLayout({ currentUserId, children, hideHeader = false }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'All Blogs', href: '/blogs', icon: '📚' },
    { name: 'My Blogs', href: '/blogs/my-blogs', icon: '✍️', requireAuth: true },
    { name: 'Create Blog', href: '/blogs/create', icon: '➕', requireAuth: true }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden relative">
      {/* Diagonal Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent blur-3xl"></div>
      </div>

      {/* Don't render custom header - Navbar is used instead */}

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 glass-dark border-r border-gray-800 min-h-[calc(100vh-89px)] hidden md:block sticky top-0">
          <nav className="p-4">
            <div className="mb-6">
              <h2 className="text-white font-bold text-lg mb-2">Blog Center</h2>
            </div>

            <ul className="space-y-2">
              {navItems.map((item) => {
                if (item.requireAuth && !currentUserId) return null;
                
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'text-gray-400 hover:bg-white/5 hover:text-orange-500'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {!currentUserId && (
              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-orange-400 text-sm mb-2 font-semibold">
                  Want to create blogs?
                </p>
                <Link
                  href="/login"
                  className="text-white text-sm hover:text-orange-400 transition"
                >
                  Login to get started →
                </Link>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
