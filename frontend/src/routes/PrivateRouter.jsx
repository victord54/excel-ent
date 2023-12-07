import AuthGuard from './AuthGuard';
import { Route } from 'react-router-dom';
import Layout from '../pages/private/Layout';
import ErrorPage from '../pages/public/ErrorPage/ErrorPage';
import Sheet from '../pages/private/Sheet/Sheet';
import Profile from '../pages/private/Profile/Profile';
import Listing from '../pages/private/Listing/Listing';
import Invitation from '../pages/private/Invitation/Invitation';

const router = (
    <Route
        path="/"
        element={
            <AuthGuard>
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
        <Route path="sheet/invite/:link" element={<Invitation />} />
    </Route>
);

export default router;
