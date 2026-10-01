import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from './Loading';

const AdminRoute = () => {
  const { isAuthenticated, isOwner, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated && isOwner ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
