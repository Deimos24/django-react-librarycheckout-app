import { createContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

export const UserContext = createContext();

export const auth = async (setIsAuthorized) => {

    const token = localStorage.getItem(ACCESS_TOKEN)

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                // renew the access token if the refresh is successful
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }

    if (!token) {
        setIsAuthorized(false);
        return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
        await refreshToken();
    } else {
        setIsAuthorized(true);
    }
}


export const parseErrorResponse = (error) => {
    if (!error.response || !error.response.data) {
        return "An unexpected error occurred.";
    }

    const data = error.response.data;

    if (typeof data === "string") {
        return data; // Handle plain string responses
    }

    if (data.detail) {
        return data.detail; // Handle single "detail" error messages
    }

    return Object.entries(data)
        .map(([field, errors]) =>
            Array.isArray(errors) ? `${field}: ${errors.join(", ")}` : `${field}: ${errors}`
        )
        .join("\n");
};