import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export const ProtectedRoute: React.FC = () => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};
