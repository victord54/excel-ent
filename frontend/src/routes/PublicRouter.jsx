import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../pages/public/Layout';
import ErrorPage from '../pages/public/ErrorPage/ErrorPage';
import Home from '../pages/public/Home/Home';
import Auth from '../pages/public/Auth/Auth';
import Sheet from '../pages/private/Sheet/Sheet';

const router = (
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="sheet/:idSheet" element={<Sheet />} />
    </Route>
);

export default router;
