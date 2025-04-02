import LoginForm from "../components/LoginForm"
import { useNavigate } from "react-router"

function Login() {

    const navigate = useNavigate()

    return (
        <>
            <LoginForm route="/api/token/" method="login" />
            <button onClick={() => {
                localStorage.clear()
                navigate("/register")
            }}>Register new user</button>
        </>

    )

}

export default Login