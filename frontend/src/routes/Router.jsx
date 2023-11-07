import { createRoutesFromElements } from 'react-router-dom';
import PublicRouter from './PublicRouter';
import PrivateRouter from './PrivateRouter';

const router = createRoutesFromElements([PublicRouter, PrivateRouter]);

export default router;
