import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🍽️</div>
        <h1 className="text-4xl font-bold text-white mb-4">Restaurant Not Found</h1>
        <p className="text-gray-400 mb-8">Sorry, this restaurant doesn't exist or has been removed.</p>
        <Link 
          href="/"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold inline-block"
        >
          Back to Restaurants
        </Link>
      </div>
    </div>
  );
}
