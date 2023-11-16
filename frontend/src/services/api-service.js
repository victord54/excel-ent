import { getBearerString } from './auth-service';

export function signup({ pseudo, mail, password }) {
    return fetch(import.meta.env.VITE_API_URL + '/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usr_pseudo: pseudo,
            usr_mail: mail,
            usr_pwd: password,
        }),
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

export function login({ mail, password }) {
    return fetch(
        import.meta.env.VITE_API_URL +
            '/auth/login?usr_mail=' +
            mail +
            '&usr_pwd=' +
            password,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

export function editProfile({ pseudo, mail, password }) {
    return fetch(import.meta.env.VITE_API_URL + '/profile/editProfile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: getBearerString(),
        },
        body: JSON.stringify({
            usr_pseudo: pseudo,
            usr_mail: mail,
            usr_pwd: password,
        }),
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function saveSheet({
    sht_name,
    sht_data,
    sht_sharing,
    sht_uuid,
    sht_idtsht,
}) {
    let res;
    if (sht_idtsht === null) {
        console.log('create');
        res = await fetch(import.meta.env.VITE_API_URL + '/sheet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getBearerString(),
            },
            body: JSON.stringify({
                sht_name: sht_name,
                sht_data: sht_data,
                sht_sharing: sht_sharing,
                sht_uuid: sht_uuid,
            }),
        });
    } else {
        console.log('update');
        res = await fetch(
            import.meta.env.VITE_API_URL + '/sheet/' + sht_idtsht,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: getBearerString(),
                },
                body: JSON.stringify({
                    sht_name: sht_name,
                    sht_data: sht_data,
                    sht_sharing: sht_sharing,
                    sht_uuid: sht_uuid,
                }),
            },
        );
    }
    return res;
}

export async function getAllSheetFromUser(){
    console.log("getAllSheetFromUser");
    const res = await fetch( 
        import.meta.env.VITE_API_URL + '/sheet',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getBearerString(),
            },
        });
        
    return res;
}

export async function getSheetById(sht_uuid){
    console.log("getSheetById : " + sht_uuid);
    const res = await fetch( 
        import.meta.env.VITE_API_URL + '/sheet/getOne?sht_uuid=' + sht_uuid,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getBearerString(),
            },
        });
        
    return res;
}


