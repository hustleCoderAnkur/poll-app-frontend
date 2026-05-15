import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../api/auth.api.js";

const hasToken = () => !!localStorage.getItem("accessToken");

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(hasToken); 
    const [error, setError] = useState(null);

    const clearError = () => setError(null);

    const register = async (userData) => {
        try {
            clearError();
            const data = await registerUser(userData);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || "Registration failed";
            setError(msg);
            throw err;
        }
    };

    const login = async (userData) => {
        try {
            clearError();
            const data = await loginUser(userData);
            localStorage.setItem("accessToken", data.accessToken);
            setUser(data.user);
            return data;
        } catch (err) {
            const msg = err?.response?.data?.message || "Login failed";
            setError(msg);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch {
            // silent — token locally clear hoga chahe API fail ho
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const data = await getCurrentUser();
            setUser(data.user);
        } catch {
            localStorage.removeItem("accessToken");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        const initAuth = async () => {

            if (!hasToken()) {
                setLoading(false);
                return;
            }

            await fetchCurrentUser();
        };

        initAuth();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated: !!user,
                register,
                login,
                logout,
                fetchCurrentUser,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;