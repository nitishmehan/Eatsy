'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    restaurantName: '',
    restaurantImage: '',
    cuisine: [],
    priceRange: '',
    address: '',
    estimatedDelivery: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        // Already logged in, redirect to appropriate dashboard
        if (data.user.role === 'vendor') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      // Not logged in, stay on page
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login?signup=success');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addCuisine = (cuisine) => {
    if (!formData.cuisine.includes(cuisine)) {
      setFormData({ ...formData, cuisine: [...formData.cuisine, cuisine] });
    }
  };

  const removeCuisine = (cuisine) => {
    setFormData({ ...formData, cuisine: formData.cuisine.filter(c => c !== cuisine) });
  };

  return (
    <div className="min-h-screen w-screen bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
      {/* Diagonal Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-block">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
                Eatsy
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
            </div>
          </Link>
          <p className="text-gray-400 mt-4">Join us and start your food journey!</p>
        </div>

        {/* Signup Card */}
        <div className="glass-dark rounded-2xl shadow-2xl p-8 border border-gray-800">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400 mb-8">Choose how you want to join Eatsy</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Card */}
                <button
                  onClick={() => handleRoleSelect('customer')}
                  className="glass border border-gray-700 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition text-left group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="relative">
                    <div className="text-5xl mb-4">🍔</div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                      I'm a Customer
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Order delicious food from your favorite restaurants
                    </p>
                    <div className="text-orange-500 font-semibold flex items-center gap-2">
                      Sign up as Customer <span>→</span>
                    </div>
                  </div>
                </button>

                {/* Vendor Card */}
                <button
                  onClick={() => handleRoleSelect('vendor')}
                  className="glass border border-gray-700 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition text-left group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="relative">
                    <div className="text-5xl mb-4">🏪</div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                      I'm a Vendor
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      List your restaurant and reach more customers
                    </p>
                    <div className="text-orange-500 font-semibold flex items-center gap-2">
                      Sign up as Vendor <span>→</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-8">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-orange-500 font-semibold hover:text-orange-400">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Details Form */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-gray-300 mb-4 flex items-center gap-2"
              >
                ← Back to role selection
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">
                {role === 'customer' ? 'Customer' : 'Vendor'} Details
              </h2>
              <p className="text-gray-400 mb-6">Fill in your information to get started</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Common Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Vendor Specific Fields */}
                {role === 'vendor' && (
                  <>
                    <div className="border-t border-gray-700 pt-5 mt-5">
                      <h3 className="text-lg font-semibold text-white mb-4">Restaurant Information</h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Restaurant Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.restaurantName}
                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                        placeholder="e.g., Mario's Pizza"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Restaurant Image URL (optional)
                      </label>
                      <input
                        type="url"
                        value={formData.restaurantImage}
                        onChange={(e) => setFormData({ ...formData, restaurantImage: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                        placeholder="https://example.com/restaurant-image.jpg"
                      />
                      {formData.restaurantImage && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400 mb-2">Preview:</p>
                          <img 
                            src={formData.restaurantImage} 
                            alt="Restaurant preview" 
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cuisine Type * (Select at least one)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {['Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Pizza', 'Burger', 'Sushi'].map((cuisine) => (
                          <button
                            key={cuisine}
                            type="button"
                            onClick={() => formData.cuisine.includes(cuisine) ? removeCuisine(cuisine) : addCuisine(cuisine)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                              formData.cuisine.includes(cuisine)
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-gray-700'
                            }`}
                          >
                            {cuisine}
                          </button>
                        ))}
                      </div>
                      {formData.cuisine.length === 0 && (
                        <p className="text-sm text-gray-500">Select at least one cuisine type</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Price Range *
                        </label>
                        <select
                          required
                          value={formData.priceRange}
                          onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                        >
                          <option value="" className="bg-[#1a1a1a]">Select price range</option>
                          <option value="under-100" className="bg-[#1a1a1a]">Under ₹100</option>
                          <option value="100-300" className="bg-[#1a1a1a]">₹100 - ₹300</option>
                          <option value="300-500" className="bg-[#1a1a1a]">₹300 - ₹500</option>
                          <option value="500+" className="bg-[#1a1a1a]">₹500+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Estimated Delivery (minutes) *
                        </label>
                        <input
                          type="number"
                          required
                          min="10"
                          max="120"
                          value={formData.estimatedDelivery}
                          onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                          placeholder="30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Restaurant Address *
                      </label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                        rows="3"
                        placeholder="123 Main Street, City, State, ZIP"
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || (role === 'vendor' && formData.cuisine.length === 0)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm flex items-center justify-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
