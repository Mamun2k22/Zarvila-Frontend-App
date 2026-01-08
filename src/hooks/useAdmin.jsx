import { Navigate } from "react-router-dom";
import { useUser } from "./userContext";

// ager code
export const AdminRoute = ({ children }) => {
    
    const { user } = useUser();
    return user && user.role === "admin" ? children : <Navigate to="/login" />;
};

