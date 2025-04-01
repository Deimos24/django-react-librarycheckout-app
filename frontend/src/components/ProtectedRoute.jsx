import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // check auth and deauthorize if any errors happen
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

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

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        console.log("Access Token:", token)

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

    // don't show anything until auth has a value
    if (isAuthorized === null ) {
        return <div>Loading...</div>;
    }
    console.log("here3")
    console.log(isAuthorized)
    // send back to login page without authorization
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute