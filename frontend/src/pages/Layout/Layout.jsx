import React from 'react';
import './layout.css';
import { Outlet } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';

function Layout(){
    const navigate = useNavigate();

    return ( 
        <>
        <header>
            <div className='header'>
                <Link to="/" className='header-name'>Excell-ent</Link>
            </div>
        </header>
        <main id="page-content">
            <Outlet/>
        </main>
        </>
    );
}

export default Layout;