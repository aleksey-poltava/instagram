import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

function IsUserLoggedIn({user, loggedInPath, children}) {
    if (!user) {
        //return <Navigate to={children} replace />;        
        return children ? children : <Outlet />;
    }

    if (user) {
        return <Navigate to={loggedInPath} replace />;
    }      
}

export default IsUserLoggedIn;

IsUserLoggedIn.propTypes = {
    user: PropTypes.object,
    loggedInPath: PropTypes.string.isRequired
}