import { Link } from 'react-router-dom';
import './top-bar.css';

export default function TopBar() {
    return (
        <header>
            <nav>
                <Link to="/" className="header-name">
                    Excel-ent
                </Link>
                <ul>
                    <li>
                        <Link to="/auth">Authentication</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
