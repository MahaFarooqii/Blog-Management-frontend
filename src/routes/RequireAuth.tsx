import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RequireAuth: React.FC<{ roles?: string[], children: any }> = ({ roles, children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <div>Forbidden</div>;
    return children;
};
