import { Link } from "react-router";
import "../styles/Navbar.css"

function Navbar() {

    return (
        <nav className="nav-bar">
                <h1 className="app-title">My Library App</h1>
                <div className="links-container">
                    <Link to="/">Home</Link>
                    <Link to="/books">Find Books</Link>
                    <Link to="/contribute">Contribute</Link>
                    <Link to="/admin">Administration</Link>
                    <Link to="/login">Login</Link>
                </div>
        </nav>
    )
}

export default Navbar;