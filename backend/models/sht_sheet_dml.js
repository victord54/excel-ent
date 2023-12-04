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
    const deleteCells = await executeQuery(
        'DELETE FROM sht_cell WHERE cel_idtsht = ?',
        [sht_idtsht],
    );

    const deleteSharing = await executeQuery(
        'DELETE FROM sht_link_sht_usr WHERE lsu_idtsht = ?',
        [sht_idtsht],
    );

    const deleteSheet = await executeQuery(
        'DELETE FROM sht_sheet WHERE sht_idtsht = ?',
        [sht_idtsht],
    );

    return [deleteCells, deleteSharing, deleteSheet];
}

export async function addSharing({ lsu_idtsht, lsu_idtusr_shared }) {
    const insertShare = executeQuery(
        'INSERT INTO sht_link_sht_usr (lsu_idtsht, lsu_idtusr_shared) VALUES (?, ?)',
        [lsu_idtsht, lsu_idtusr_shared],
    );

    const updateShare = executeQuery(
        'UPDATE sht_sheet SET sht_sharing = 1 WHERE sht_idtsht = ?',
        [lsu_idtsht],
    );

    return [insertShare, updateShare];
}

export async function removeSharing({ lsu_idtsht, lsu_idtusr_shared }) {
    return executeQuery(
        'DELETE FROM sht_link_sht_usr WHERE lsu_idtsht = ? AND lsu_idtusr_shared = ?',
        [lsu_idtsht, lsu_idtusr_shared],
    );
}

export async function createLink({ inv_idtsht, inv_link }) {
    return executeQuery(
        'INSERT INTO tmp_invitation (inv_idtsht, inv_link) VALUES (?, ?)',
        [inv_idtsht, inv_link],
    );
}
