import LoginForm from "../components/LoginForm"
import { useNavigate } from "react-router"

function Login() {

    const navigate = useNavigate()

    return <LoginForm route="/api/token/" method="login" />
    
}

export default Login