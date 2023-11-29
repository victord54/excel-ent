import { Navigate } from 'react-router-dom';
import { isLogged } from '../services/auth-service';

function AuthGuard({ children }) {
    if (!isLogged()) return <Navigate to={'/'} replace />;
    return children;
}

export default AuthGuard;
