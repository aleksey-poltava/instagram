import { lazy, Suspense } from 'react';
import * as ROUTES from './constants/routes';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useAuthListener from './hooks/use-auth-listener';
import UserContext from './context/user';
import ProtectedRoute from './helpers/protected-route';
import IsUserLoggedIn from './helpers/is-user-logged-in';

const Dashboard = lazy(() => import ('./pages/dashboard'));
const Profile = lazy(() => import ('./pages/profile'));
const Login = lazy(() => import ('./pages/login'));
const SignUp = lazy(() => import ('./pages/signup'));
const NotFound = lazy(() => import ('./pages/not-found'));

function App() {
  const {user} = useAuthListener();
  
  return (
    <UserContext.Provider value={{user}}>
      <Router>
        <Suspense fallback={<p>Loading ...</p>} >
        <Routes>
          <Route element={<IsUserLoggedIn user={user} loggedInPath={ROUTES.DASHBOARD} />} >
            <Route path={ROUTES.LOGIN} element={<Login />} />
          </Route>
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route element={<ProtectedRoute user={user} />} >
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          </Route>          
          <Route path='*' element={<NotFound />} />
        </Routes>
        </Suspense> 
      </Router>
    </UserContext.Provider>
  );
}

export default App;
