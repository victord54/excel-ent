import { Route, createRoutesFromElements } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import { isLogged } from '../services/auth-service';
import Layout from '../pages/private/Layout';
import ErrorPage from '../pages/public/ErrorPage/ErrorPage';
import Sheet from '../pages/private/Sheet/Sheet';
import Profile from '../pages/private/Profile/Profile';
import Listing from '../pages/private/Listing/Listing';

const router = (
    <Route
        path="/"
        element={
            <AuthGuard user={isLogged()}>
                <Layout />
            </AuthGuard>
        }
        errorElement={<ErrorPage />}
    >
        <Route path="profile" element={<Profile />} />
        <Route path="sheet">
            <Route path=":idSheet" element={<Sheet />} />
            <Route index element={<Listing />} />
        </Route>
    </Route>
);

export default router;
