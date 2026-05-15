// constants.js

export const API_BASE_URL =
    import.meta.env.VITE_API_URL;

export const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL;

export const POLL_STATUS = {
    DRAFT: "draft",
    PUBLISHED: "published",
};

export const RESPONSE_TYPE = {
    ANONYMOUS: "anonymous",

    AUTHENTICATED:
        "authenticated",
};