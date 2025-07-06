import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const hasRequiredRole = allowedRoles.some(role => {
    if (role === 'ADMIN') return currentUser.isAdmin;
    if (role === 'JUDGE') return currentUser.isJudge;
    return false;
  });

  if (!hasRequiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleRoute;