import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const isLoggedgIn = false;
    return 
        isLoggedgIn ? <Outlet/> : <Navigate to = "/login" /> ;
};

export default ProtectedRoutes;