import { Link } from "react-router";
import "../styles/Navbar.css"

function Navbar() {

    return (
        <nav className="navbar">
                <h1 className="navbar-title">Demo Library App</h1>
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/books">Find Books</Link>
                    <Link to="/contribute">Contribute</Link>
                    <Link to="/admin">Admin</Link>
                </div>
                <div className="navbar-login">
                    <Link to="/login">Login</Link>
                </div>
        </nav>
    )
}

export default Navbar;