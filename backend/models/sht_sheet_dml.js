import { executeQuery } from '../utils/database.js';

/**
 * Create a new sheet
 * @param {Object} object data to create a sheet
 * @returns {Promise<RowDataPacket>} data related to the new sheet
 */
export async function create({
    sht_idtusr,
    sht_name,
    sht_data,
    sht_sharing,
    sht_uuid,
}) {
    // TODO: Vérifier injection SQL /!\
    return executeQuery(
        'INSERT INTO sht_sheet (sht_idtusr, sht_name, sht_data, sht_sharing, sht_uuid) VALUES (?, ?, ?, ?, ?)',
        [sht_idtusr, sht_name, JSON.stringify(sht_data), sht_sharing, sht_uuid],
    );
}

export async function update({
    sht_idtsht,
    sht_name,
    sht_data,
    sht_sharing,
    sht_uuid,
}) {
    return executeQuery(
        'UPDATE sht_sheet SET sht_name = ?, sht_data = ?, sht_sharing = ?, sht_uuid = ? WHERE sht_idtsht = ?',
        [sht_name, JSON.stringify(sht_data), sht_sharing, sht_uuid, sht_idtsht],
    );
}
