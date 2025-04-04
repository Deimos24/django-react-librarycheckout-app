import { Link } from "react-router";
import { useContext } from "react";
import "../styles/Navbar.css"
import { UserContext } from "./utils";

function Navbar() {

    const { isAuthorized } = useContext(UserContext)

    return (
        <nav className="navbar">
                <h1 className="navbar-title">Demo Library App</h1>
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/books">Find Books</Link>
                    <Link to="/contribute">Contribute</Link>
                    <Link to="/account">Account</Link>
                </div>
                <div className="navbar-login">
                    {isAuthorized ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
                </div>
        </nav>
    )
}

export default Navbar;