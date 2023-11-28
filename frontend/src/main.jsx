import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Router from './routes/Router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={createBrowserRouter(Router)} />,
);
