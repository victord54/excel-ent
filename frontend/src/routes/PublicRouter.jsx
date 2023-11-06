import React from "react";
import { Route } from "react-router-dom";
import Layout from "../pages/public/Layout";
import ErrorPage from "../pages/public/ErrorPage/ErrorPage";
import Home from "../pages/public/Home/Home";
import SignUpLogin from "../pages/public/Auth/Auth";


const router = (
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<SignUpLogin />} />
    </Route>
);

export default router;