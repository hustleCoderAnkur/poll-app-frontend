import axiosInstance from "./axios.js";

export const registerUser = async (userData) => {
    const response = await axiosInstance.post( "/auth/register",userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axiosInstance.post("/auth/login",userData);
    return response.data;
};  

export const logoutUser = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
};

export const getCurrentUser = async () => {
        const response = await axiosInstance.get( "/auth/me" );
        return response.data;
    };

export const changePassword = async (passwordData) => {
        const response = await axiosInstance.post( "/auth/change-password", passwordData );
        return response.data;
    };