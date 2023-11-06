import { Route } from "react-router-dom";
// import ErrorPage from "../pages/public/error-page/ErrorPage";
import AuthGuard from "./AuthGuard";

const router = (
    <Route
        path="/sheet"
        element={
            <AuthGuard user={true}>
                <Layout />
            </AuthGuard>
        }
        errorElement={<ErrorPage />}
    >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
    </Route>
);

export default router;