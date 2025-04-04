import { Navigate } from "react-router";
import { useContext} from "react";
import { UserContext } from "./utils";


function ProtectedRoute({children}) {

    const { isAuthorized } = useContext(UserContext)

    // don't show anything until auth has a value
    if (isAuthorized === null ) {
        return <div>Loading...</div>;
    }

    // send back to login page without authorization
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute