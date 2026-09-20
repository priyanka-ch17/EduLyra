import { Navigate, Outlet } from "react-router-dom";
import type { Role, User } from "../types";
export function ProtectedRoute({ user, role }: { user:User|null; role?:Role }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return <Outlet />;
}