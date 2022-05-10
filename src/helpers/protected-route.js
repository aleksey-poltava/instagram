import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

function ProtectedRoute({user, children}) {
    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
      }
    
      return children ? children : <Outlet />;
}

export default ProtectedRoute;

ProtectedRoute.propTypes = {
    user: PropTypes.object, 
}