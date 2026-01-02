import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the custom hook

const ProtectedRoute = () => {
    const { user } = useAuth(); // Get the current user state

    // Outlet renders the child routes/components if authenticated
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;