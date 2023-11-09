import { Outlet } from 'react-router-dom';
import TopBar from '../../components/public/TopBar/TopBar';
import { AuthContextProvider } from '../../contexts/AuthContext';
import { isLogged } from '../../services/auth-service';
import { getLoggedUser } from '../../services/user-service';

export default function Layout() {
    return (
        <>
            <AuthContextProvider defaultValue={{loged: isLogged(), user: getLoggedUser()}}>
                <TopBar/>
                <main id="page-content">
                    <Outlet />
                </main>
            </AuthContextProvider>
        </>
    );
}
