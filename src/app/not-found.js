import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl mb-4">🍽️</div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl text-gray-400 mb-8">Page Not Found</h2>
        <Link
          href="/"
          className="inline-block bg-linear-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold text-lg"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
