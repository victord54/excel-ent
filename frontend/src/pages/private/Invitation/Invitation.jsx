import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { addSharing as _addSharing } from '../../../services/api-service';
export default function Invitation(){
    const { link } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        addUserToSheet();
    }, []);

    async function addUserToSheet(){
        console.log(link);
        const response = await _addSharing(user.usr_idtusr, link);
        console.log(response);
        if (response.status === 200){

        }
        else {

        }
    }

    return (
        <>
        </>
    );

}