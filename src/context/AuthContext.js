import React, { createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/tenant-login", "/tenant/r/", "/test-date-picker", "/register"];

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(route)
  );

  const logout = (expired = false) => {
    localStorage.clear();

    if (expired) {
      sessionStorage.setItem("sessionExpired", "true"); 
    }

    navigate("/login", { replace: true });
  };

  const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      return Date.now() > decoded.exp * 1000;
    } catch {
      return true; // malformed token
    }
  };

  // ✅ check on route change
  useEffect(() => {
    if (isPublicRoute) return;

    if (isTokenExpired()) {
      logout(true);
    }
  }, [location.pathname]);

  // ✅ check even if user stays on same page
  useEffect(() => {
    if (isPublicRoute) return;

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logout(true);
      }
    }, 15 * 1000); // every 15s (cheap & safe)

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
