import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const { token, user } = useSelector((state) => state.auth);

    // console.log("ProtectedRoute - Checking access:");
    // console.log("Token exists:", !!token);
    // console.log("User role(s):", user?.role);
    // console.log("Required role:", role);
    // console.log("Has required role:", role ? user?.role?.includes(role) : true);

    if (!token) {
        // console.log("No token - redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (role) {
        // user?.role is an array, so check if it includes the required role
        const hasRequiredRole = user?.role?.includes(role);

        if (!hasRequiredRole) {
            // console.log(`User doesn't have required role: ${role}`);

            // Redirect to first available dashboard
            const firstRole = user?.role?.[0];
            if (firstRole) {
                // console.log(`Redirecting to ${firstRole}/dashboard`);
                return <Navigate to={`/${firstRole}/dashboard`} replace />;
            } else {
                // console.log("No roles found - redirecting to profile");
                return <Navigate to="/profile" replace />;
            }
        }
    }

    // console.log("Access granted - rendering children");
    return children;
}