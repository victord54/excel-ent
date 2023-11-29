import { getBearerString } from './auth-service';

async function executeRequest(url, options, needAuthentified = true) {
    const response = await fetch(import.meta.env.VITE_API_URL + url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: needAuthentified ? getBearerString() : '',
        },
    });
console.log('response: ');
console.log(response);
    if (response.status === 401 && needAuthentified) {
        throw new Error('Unauthorized');
    }
    else {
        const payload = await response.json();
        console.log('payload: ');
        console.log(payload);
        return payload
    }
}

export function signup({ pseudo, mail, password }) {
    return executeRequest(
        '/auth/signup',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usr_pseudo: pseudo,
                usr_mail: mail,
                usr_pwd: password,
            }),
        },
        false,
    );
}

export async function login({ mail, password }) {
    return executeRequest(
        '/auth/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usr_mail: mail,
                usr_pwd: password,
            }),
        },
        false,
    );
}

export async function fetchUser() {
    return executeRequest(`/profile`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function editProfile({ pseudo, mail }) {
    return await executeRequest('/profile/editProfile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usr_pseudo: pseudo,
            usr_mail: mail,
        }),
    });
}

export function editPassword({ old_password, new_password }) {
    return executeRequest('/profile/editPassword', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usr_old_password: old_password,
            usr_new_password: new_password,
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

export async function getAllSheetFromUser() {
    console.log('getAllSheetFromUser');
    const res = await fetch(import.meta.env.VITE_API_URL + '/sheet', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: getBearerString(),
        },
    });

    return res;
}
export async function getSheetById(sht_uuid) {
    const res = await fetch(
        import.meta.env.VITE_API_URL + '/sheet/' + sht_uuid,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getBearerString(),
            },
        },
    );

    return res;
}

export async function getSheetData(sht_idtsht) {
    return await fetch(
        import.meta.env.VITE_API_URL + '/sheet/data/' + sht_idtsht,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getBearerString(),
            },
        },
    );
}

export async function renameSheet(sht_idtsht, sht_name) {
    return await fetch(
        import.meta.env.VITE_API_URL + '/sheet/name/' + sht_idtsht,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getBearerString(),
            },
            body: JSON.stringify({
                sht_name: sht_name,
            }),
        },
    );
}

export async function updateSheetData(
    cel_idtsht,
    cel_idtcel,
    cel_val,
    cel_stl,
) {
    return await fetch(
        import.meta.env.VITE_API_URL + '/sheet/data/' + cel_idtsht,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: getBearerString(),
            },
            body: JSON.stringify({
                cel_idtcel: cel_idtcel,
                cel_val: cel_val,
                cel_stl: cel_stl,
            }),
        },
    );
}
