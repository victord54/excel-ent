import { createRoutesFromElements} from "react-router-dom";
import { Route } from "react-router-dom";
import Layout from "../pages/Layout/Layout";
import Home from "../pages/Home/Home";
import SignUpLogin from "../pages/SignUpLogin/SignUpLogin";

const router = createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
        <Route index element={<Home />} />
        <Route path="sign-up-login" element={<SignUpLogin />} />
    </Route>
);

export default router;