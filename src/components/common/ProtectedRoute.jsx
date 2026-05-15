import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
    const location = useLocation();
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return (
            <Navigate
                to={redirectTo}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
};

export default ProtectedRoute;