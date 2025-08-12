import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Navbar from '@/components/Navbar';
import ProfileForm from '@/components/ProfileForm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const metadata = {
  title: 'My Profile - Eatsy',
  description: 'Manage your profile and settings'
};

export default async function ProfilePage() {
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    redirect('/login');
  }

  // Redirect vendors to their dashboard
  if (decoded.role === 'vendor') {
    redirect('/vendor/dashboard');
  }

  await dbConnect();

  const user = await User.findById(decoded.userId).select('-password').lean();

  if (!user) {
    redirect('/login');
  }

  const serializedUser = {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    phone: user.phone || '',
    role: user.role
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden relative">
      {/* Diagonal Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-500/20 via-orange-600/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent blur-3xl"></div>
      </div>

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        <div className="glass-dark rounded-xl border border-gray-800 p-6 sm:p-8">
          <ProfileForm user={serializedUser} />
        </div>
      </main>
    </div>
  );
}
