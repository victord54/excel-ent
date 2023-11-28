import { executeQuery } from '../utils/database.js';

/**
 * Create a new sheet
 * @param {Object} object data to create a sheet
 * @param {number} object.sht_idtusr_aut sheet owner id
 * @param {string} object.sht_name sheet name
 * @param {boolean} object.sht_sharing sheet sharing
 * @param {string} object.sht_uuid sheet uuid
 * @returns {Promise<RowDataPacket>} data related to the new sheet
 */
export async function create({
    sht_idtusr_aut,
    sht_name,
    sht_sharing,
    sht_uuid,
}) {
    // TODO: Vérifier injection SQL /!\
    return executeQuery(
        'INSERT INTO sht_sheet (sht_idtusr_aut, sht_name, sht_sharing, sht_uuid) VALUES (?, ?, ?, ?)',
        [sht_idtusr_aut, sht_name, sht_sharing, sht_uuid],
    );
}

/**
 * Update a sheet name
 * @param {Object} object data to update a sheet
 * @param {number} object.sht_idtsht sheet id
 * @param {string} object.sht_name sheet name
 * @returns {Promise<RowDataPacket>} data related to the updated sheet
 */
export async function updateName({ sht_idtsht, sht_name }) {
    return executeQuery(
        'UPDATE sht_sheet SET sht_name = ? WHERE sht_idtsht = ?',
        [sht_name, sht_idtsht],
    );
}

export async function createData({ cel_idtcel, cel_idtsht, cel_val, cel_stl }) {
    return executeQuery(
        'INSERT INTO sht_cell (cel_idtcel, cel_idtsht, cel_val, cel_stl) VALUES (?, ?, ?, ?)',
        [cel_idtcel, cel_idtsht, cel_val, cel_stl],
    );
}

export async function updateData({ cel_idtcel, cel_idtsht, cel_val, cel_stl }) {
    return executeQuery(
        'UPDATE sht_cell SET cel_val = ?, cel_stl = ? WHERE cel_idtcel = ? AND cel_idtsht = ?',
        [cel_val, cel_stl, cel_idtcel, cel_idtsht],
    );
}

export async function remove({ sht_idtsht }) {
    return executeQuery('DELETE FROM sht_sheet WHERE sht_idtsht = ?', [
        sht_idtsht,
    ]);
}
