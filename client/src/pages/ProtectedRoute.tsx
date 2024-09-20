import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  component: any;
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  role,
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decodedToken: any = jwtDecode(token);

    // If user does not have the required role, redirect to login
    if (decodedToken.userType !== role) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [role]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
