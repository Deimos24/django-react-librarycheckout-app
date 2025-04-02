import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { parseErrorResponse } from "./utils"

function LoginForm({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                // go to login after registration
                navigate("/login");
            }
        } catch (error) {
            // parse errors so user can read in alert modal
            // this isn't working here? 
            // Uncaught (in promise) TypeError: errors.join is not a function
            // if (error.response && error.response.data) {
            //     const messages = Object.entries(error.response.data)
            //         .map(([field, errors]) => `${field}: ${errors.join(", ")}`).join("\n");
            //     alert(`Error logging in:\n${messages}`);
            // } else {
            //     alert("An unexpected error occurred.");
            // }
            alert(parseErrorResponse(error));
            // console.log("error response:", error.response.data)
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
        <input
            className="form-input"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        <button className="form-button" type="submit">
            {name}
        </button>
    </form>
}

export default LoginForm