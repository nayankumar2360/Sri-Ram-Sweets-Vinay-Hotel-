import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaUserCircle, FaSignOutAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-primary font-serif mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden mb-8">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-border bg-cream">
          <FaUserCircle className="w-24 h-24 text-text-light" />
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-text-primary">{user.name}</h2>
            <p className="text-text-secondary mt-1">{user.phone}</p>
            {user.email && <p className="text-text-secondary">{user.email}</p>}
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-error hover:bg-red-50 rounded-md transition-colors font-medium border border-error"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary" /> Saved Addresses
          </h3>
          
          {user.addresses && user.addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((addr, index) => (
                <div key={index} className="border border-border rounded-md p-4 relative">
                  {addr.isDefault && (
                    <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                  )}
                  <p className="font-medium text-text-primary">{addr.street}</p>
                  <p className="text-text-secondary text-sm">{addr.city}, {addr.state}</p>
                  <p className="text-text-secondary text-sm">PIN: {addr.pincode}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">No addresses saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
