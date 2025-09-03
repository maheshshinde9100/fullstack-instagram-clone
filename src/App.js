import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import * as ROUTES from "./constants/routes";
import useAuthListener from './hooks/use-auth-listener';
import UserContext from './context/user';
import { DarkModeProvider } from './context/dark-mode';

import ProtectedRoute from './helpers/protected-routes';
import IsUserLoggedIn from './helpers/is-user-logged-in';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/sign-up'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(()=> import('./pages/Dashboard'));
const Profile = lazy(()=> import('./pages/profile'));
const Search = lazy(()=> import('./pages/Search'));
const Upload = lazy(()=> import('./pages/Upload'));
const EditProfile = lazy(()=> import('./pages/EditProfile'));

function App() {
    const user = useAuthListener();

    return (
        <DarkModeProvider>
            <UserContext.Provider value={{ user }}>
                <Router>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Routes>
                        {/* <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.SIGN_UP} element={<Signup />} />
                        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} /> */}

<Route
              path={ROUTES.LOGIN}
              element={
                <IsUserLoggedIn user={user} loggedInPath={ROUTES.DASHBOARD}>
                  <Login />
                </IsUserLoggedIn>
              }
            />

            <Route
              path={ROUTES.SIGN_UP}
              element={
                <IsUserLoggedIn user={user} loggedInPath={ROUTES.DASHBOARD}>
                  <Signup />
                </IsUserLoggedIn>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute user={user}>
                  <Dashboard />
                </ProtectedRoute>
              }
              />
              <Route
              path={ROUTES.SEARCH}
              element={
                <ProtectedRoute user={user}>
                  <Search />
                </ProtectedRoute>
              }
              />
              <Route
              path={ROUTES.UPLOAD}
              element={
                <ProtectedRoute user={user}>
                  <Upload />
                </ProtectedRoute>
              }
              />
              <Route
              path={ROUTES.EDIT_PROFILE}
              element={
                <ProtectedRoute user={user}>
                  <EditProfile />
                </ProtectedRoute>
              }
              />
              <Route
              path={ROUTES.PROFILE} element={<Profile/>}
              />
                        <Route path='*' element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </Router>
            </UserContext.Provider>
        </DarkModeProvider>
    );

}
export default App;
