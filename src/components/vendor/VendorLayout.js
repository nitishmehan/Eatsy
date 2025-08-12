'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function VendorLayout({ vendor, currentTab, children }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Analytics', href: '/vendor/dashboard', icon: '📊' },
    { name: 'Menu', href: '/vendor/dashboard/menu', icon: '🍽️' },
    { name: 'Orders', href: '/vendor/dashboard/orders', icon: '📦' },
    { name: 'Reviews', href: '/vendor/dashboard/reviews', icon: '⭐' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden relative">
      {/* Diagonal Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent blur-3xl"></div>
      </div>

      {/* Top Navigation */}
      <header className="glass-dark border-b border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/vendor/dashboard">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent cursor-pointer">
              Eatsy
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">
              {vendor.restaurantName}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-orange-500 transition text-sm"
            >
              Exit Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 glass-dark border-r border-gray-800 min-h-[calc(100vh-73px)] hidden md:block sticky top-0">
          <nav className="p-4">
            <div className="mb-6">
              <h2 className="text-white font-bold text-lg mb-2">Dashboard</h2>
              <p className="text-gray-400 text-sm">{vendor.name}</p>
            </div>

            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
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
