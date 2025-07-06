import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PrivateRoute;
