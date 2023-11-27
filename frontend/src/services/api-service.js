import { getBearerString } from './auth-service';


const executeRequest = (url, options, needAuthentified = true) => {
    return fetch((import.meta.env.VITE_API_URL+url), {
        ...options,
        headers: {
            ...options.headers,
            Authorization: needAuthentified ? getBearerString() : '',
        },
    }).then((response) => {
        if (response.ok) {
            return response;
        }else if(response.status === 401 && needAuthentified) {
            throw new Error('Unauthorized');
        }
        return response;
    })
    .then((response) => response.json())
}

export function signup({ pseudo, mail, password }) {
    return executeRequest('/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usr_pseudo: pseudo,
            usr_mail: mail,
            usr_pwd: password,
        }),
    }, false);
}

export function login({ mail, password }) {
    return executeRequest('/auth/login?usr_mail=' + mail + '&usr_pwd=' + password,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }, false);
}

export function editProfile({ pseudo, mail }) {
    return executeRequest(
        '/profile/editProfile',
    {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usr_pseudo: pseudo,
            usr_mail: mail
        }),
    });
}

export function editPassword({ old_password, new_password }) {
    return executeRequest(
        '/profile/editPassword',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usr_old_password: old_password,
                usr_new_password: new_password
            }),
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


