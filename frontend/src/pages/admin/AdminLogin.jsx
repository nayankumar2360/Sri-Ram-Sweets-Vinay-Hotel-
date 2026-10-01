import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isOwner, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isOwner) {
      navigate('/admin');
    }
  }, [user, isOwner, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ phone, password });
      if (res.user.role !== 'owner') {
        toast.error('Access denied. Owner account required.');
        await logout();
      } else {
        toast.success('Login successful');
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0] p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#E8DDD4]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#9B2335] mb-2">
            Sri Ram Sweets(Vinay Hotel)
          </h1>
          <p className="text-[#6B4F3A]">Owner Dashboard Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
              placeholder="Enter owner phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B4F3A] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#E8DDD4] rounded-lg focus:ring-2 focus:ring-[#9B2335] focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9B2335] text-white py-3 rounded-lg font-medium hover:bg-[#7A1B29] transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Owner Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
