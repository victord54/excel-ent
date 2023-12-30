import e from 'express';
import { executeQuery } from '../utils/database.js';

/**
 * Fetch all sheets
 * @returns {Promise<RowDataPacket[]>} Sheets list
 */
export async function getAll() {
    return executeQuery('SELECT * FROM sht_sheet');
}

/**
 * Fetch one specific sheet
 * @param {Object} object data to fetch a sheet
 * @param {number} object.sht_idtsht sheet id
 * @returns {Promise<RowDataPacket>} Sheet
 */
export async function getOne({ sht_idtsht, sht_uuid }) {
    // TODO: Vérifier injection SQL /!\
    if (sht_idtsht !== undefined) {
        return executeQuery('SELECT * FROM sht_sheet WHERE sht_idtsht = ?', [
            sht_idtsht,
        ]);
    } else if (sht_uuid !== undefined) {
        return executeQuery('SELECT * FROM sht_sheet WHERE sht_uuid = ?', [
            sht_uuid,
        ]);
    }
    return null;
}

/**
 * Fetch all sheets from a user
 * @param {Object} object data to fetch a sheet
 * @param {string} object.sht_idtusr_aut sheet uuid
 * @returns {Promise<RowDataPacket>} Sheet
 */
export async function getAllForUser({ sht_idtusr_aut }) {
    // TODO: Vérifier injection SQL /!\
    if (sht_idtusr_aut !== undefined) {
        return executeQuery(
            'SELECT sht_idtsht, sht_idtusr_aut, sht_name, sht_sharing, sht_uuid, sht_updated_at, usr_pseudo FROM sht_sheet LEFT JOIN sht_link_sht_usr ON sht_idtsht = lsu_idtsht LEFT JOIN usr_user ON sht_idtusr_aut = usr_idtusr WHERE sht_idtusr_aut = ? OR lsu_idtusr_shared = ?',
            [sht_idtusr_aut, sht_idtusr_aut],
        );
    }
    return null;
}

export async function getCells({ cel_idtsht }) {
    return executeQuery(
        'SELECT cel_idtcel, cel_val, cel_stl FROM sht_cell WHERE cel_idtsht = ?',
        [cel_idtsht],
    );
}

export async function getOneCell({ cel_idtcel, cel_idtsht }) {
    return executeQuery(
        'SELECT cel_idtcel, cel_val, cel_stl FROM sht_cell WHERE cel_idtcel = ? AND cel_idtsht = ?',
        [cel_idtcel, cel_idtsht],
    );
}

export async function getOneLink({ inv_link }) {
     return executeQuery(
        'SELECT inv_idtsht, sht_uuid FROM tmp_invitation LEFT JOIN sht_sheet ON inv_idtsht = sht_idtsht WHERE inv_link = ? AND inv_created_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)',
        [inv_link],
    );
}

export async function getOneWithAccess({ sht_uuid, sht_idtusr_aut }) {
    return executeQuery(
        'SELECT sht_idtsht, sht_idtusr_aut, sht_name, sht_sharing, sht_uuid, sht_updated_at, usr_pseudo FROM sht_sheet LEFT JOIN sht_link_sht_usr ON sht_idtsht = lsu_idtsht LEFT JOIN usr_user ON sht_idtusr_aut = usr_idtusr WHERE sht_uuid = ? AND (sht_idtusr_aut = ? OR lsu_idtusr_shared = ?)',
        [sht_uuid, sht_idtusr_aut, sht_idtusr_aut],
    );
}

export async function checkDuplicateSharing({ lsu_idtsht, lsu_idtusr_shared }) {
    return executeQuery(
        'SELECT * FROM sht_link_sht_usr WHERE lsu_idtsht = ? AND lsu_idtusr_shared = ?',
        [lsu_idtsht, lsu_idtusr_shared],
    );
}

export async function checkLock({ cel_idtsht }) {
    return executeQuery(
        'SELECT cel_idtcel, cel_lock FROM sht_cell WHERE cel_lock = 1 AND cel_idtsht = ?',
        [cel_idtsht],
    );
}

export async function getConnectedToSheet({ uc_idtsht }){
    return executeQuery(    
        'SELECT usr_idtusr, usr_pseudo FROM sht_usr_connected JOIN usr_user WHERE uc_idtusr = usr_idtusr AND uc_idtsht = ?',
        [uc_idtsht],
    );
}

// export async function search({ keywords }) {
//     const transformed = keywords.map((e) => `.*${e}.*`);
//     return executeQuery(
//         'SELECT * FROM sht_sheet WHERE sht_name REGEXP ?',
//         [keywords.join('|')],
//     );
// }
