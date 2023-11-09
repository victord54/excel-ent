import { Link } from 'react-router-dom';
import './top-bar.css';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';


export default function TopBar() {

    const { loged } = useContext(AuthContext);

    return (
        <header>
            <nav>
                <Link to="/" className="header-name">
                    Excel-ent
                </Link>
                <ul>
                    <li>
                        {loged ? <Link to="/profile">Profile</Link> : <Link to="/auth">Authentication</Link>}
                    </li>
                </ul>
            </nav>
        </header>
    );
}
