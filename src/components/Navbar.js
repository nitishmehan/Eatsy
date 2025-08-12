'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        
        // Redirect vendors away from customer pages
        if (data.user.role === 'vendor' && !window.location.pathname.startsWith('/vendor')) {
          router.push('/vendor/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Don't show navbar for vendors on customer pages
  if (user?.role === 'vendor') {
    return null;
  }

  return (
    <header className="glass-dark border-b border-gray-800 relative z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent cursor-pointer">
            Eatsy
          </h1>
        </Link>
        
        <nav className="flex gap-3 sm:gap-6 items-center">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : user ? (
            <>
              <Link 
                href="/"
                className="text-gray-300 hover:text-orange-500 text-base sm:text-lg transition font-medium"
              >
                Home
              </Link>
              <Link 
                href="/blogs"
                className="text-gray-300 hover:text-orange-500 text-base sm:text-lg transition font-medium"
              >
                Blogs
              </Link>
              <Link 
                href="/orders"
                className="text-gray-300 hover:text-orange-500 text-base sm:text-lg transition font-medium"
              >
                Order History
              </Link>
              <Link 
                href="/profile"
                className="text-gray-300 hover:text-orange-500 text-base sm:text-lg transition font-medium"
              >
                Profile
              </Link>
              <span className="text-gray-300 text-base sm:text-lg font-medium">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 text-base sm:text-lg transition font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/blogs"
                className="text-gray-300 hover:text-orange-500 text-base sm:text-lg transition font-medium"
              >
                Blogs
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-orange-500 text-base sm:text-lg transition font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 text-base sm:text-lg transition font-semibold">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
