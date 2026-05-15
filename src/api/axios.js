import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",

    headers: {
            "Content-Type":
            "application/json",
    },

    withCredentials: true,
});

axiosInstance.interceptors.request.use( (config) => {

        const token = localStorage.getItem( "accessToken" );

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if ( error.response?.status === 401 ) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;