import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const { token, role: userRole } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    if (role && userRole !== role) {
        return <Navigate to={`/${userRole}/dashboard`} replace />;
    }

    return children;
}
