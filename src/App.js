import { lazy, Suspense } from 'react';
import * as ROUTES from './constants/routes';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Login = lazy(() => import ('./pages/login'));
const SignUp = lazy(() => import ('./pages/signup'));

function App() {
  return (
    <Router>
      <Suspense fallback={<p>Loading ...</p>} >
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
