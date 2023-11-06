import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../components/public/TopBar/TopBar';

export default function Layout() {
    return (
        <>
            <TopBar />
            <main id="page-content">
                <Outlet />
            </main>
        </>
    );
}
