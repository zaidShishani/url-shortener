import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export const RequireAuth = () => (useAuth().token ? <Outlet /> : <Navigate to="/404" replace />);

export const GuestOnly = () => (useAuth().token ? <Navigate to="/urls" replace /> : <Outlet />);
