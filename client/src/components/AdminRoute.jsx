import { useAppContext } from "../context/AppContext"; // adjust path as needed
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, isAdmin } = useAppContext();

  if (!user) {
    // Not logged in, redirect to sign-in
    return <Navigate to="/sign-in" replace />;
  }
  if (!isAdmin) {
    // Logged in but not admin, redirect to unauthorized page or home
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
