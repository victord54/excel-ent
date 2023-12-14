import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { addSharing as _addSharing } from '../../../services/api-service';

export default function Invitation() {
    const { link } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [linkExpired, setLinkExpired] = useState(false);

    useEffect(() => {
        addUserToSheet();
    }, []);

    /**
     * Method that adds the user to the sheet if the link is valid.
     */
    async function addUserToSheet() {
        const response = await _addSharing(user.usr_idtusr, link);
        const body = await response.json();
        const data = body.data;
        if (response.status === 200) {
            const link = data.link;
            navigate(`/sheet/${link}`);
        } else {
            setLinkExpired(true);
        }
    }
    if (linkExpired) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: '20px',
                        marginBottom: '20px',
                        marginTop: '20px',
                    }}
                >
                    Lien expiré ou non valide !
                </div>

                <div>
                    Go back to real life : <Link to={'/'}>Home</Link>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}
