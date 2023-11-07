import { Route } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import { isLogged } from '../services/auth-service';
import Layout from '../pages/public/Layout';
import ErrorPage from '../pages/public/ErrorPage/ErrorPage';

const router = (
    <Route
        path="/sheet"
        element={
            <AuthGuard user={isLogged()}>
                <Layout />
            </AuthGuard>
        }
        errorElement={<ErrorPage />}
    >
        {/*<Route index element={<Dashboard />} />*/}
        {/*<Route path="users" element={<Users />} />*/}
    </Route>
);

export default router;
