import { useEffect } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

const OAuthSuccessPage = () => {

    const navigate =
        useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {

        const accessToken =
            searchParams.get(
                "accessToken"
            );

        if (accessToken) {

            localStorage.setItem(
                "accessToken",
                accessToken
            );

            navigate("/dashboard");
        } else {

            navigate("/login");
        }

    }, [navigate, searchParams]);

    return null;
};

export default OAuthSuccessPage;