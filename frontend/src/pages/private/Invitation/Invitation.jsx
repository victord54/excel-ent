import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { addSharing as _addSharing } from '../../../services/api-service';

export default function Invitation() {
    const { link } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        addUserToSheet();
    }, []);

    async function addUserToSheet() {
        console.log(link);
        const response = await _addSharing(user.usr_idtusr, link);
        const body = await response.json();
        const data = body.data;
        if (response.status === 200) {
            console.log(body);
            console.log(data.link);
            const link = data.link;
            navigate(`/sheet/${link}`);
        }
        // TODO : Handle errors
        else {
            //navigate('/404');
            console.log(response.error);
        }
    }

    return <>Lien expiré !</>;
}
