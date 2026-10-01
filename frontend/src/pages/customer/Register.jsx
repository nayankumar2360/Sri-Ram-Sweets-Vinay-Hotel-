import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        address: formData.street ? {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        } : undefined
      };
      
      await register(submitData);
      toast.success('Registration successful');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary font-serif">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Join us to enjoy seamless ordering
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Personal Details</h3>
              <div>
                <label className="block text-sm font-medium text-text-primary">Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary">Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" placeholder="10 digits" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary">Password *</label>
                <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary">Confirm Password *</label>
                <input type="password" name="confirmPassword" required minLength={6} value={formData.confirmPassword} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
            </div>

            {/* Address Details (Optional) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">Address (Optional)</h3>
              <div>
                <label className="block text-sm font-medium text-text-primary">Street / Area</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
