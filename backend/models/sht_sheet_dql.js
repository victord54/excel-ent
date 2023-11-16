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
 * @returns {Promise<RowDataPacket>} Sheet
 */
export async function getOne({ sht_uuid }) {
    console.log("getOne OEOEOE" + sht_uuid);
    // TODO: Vérifier injection SQL /!\
    if (sht_uuid) {
        return executeQuery('SELECT * FROM sht_sheet WHERE sht_uuid = ?', [
            sht_uuid,
        ]);
    }
    return null;
}

/**
 * Fetch all sheets from a user
 * @param {Object} object data to fetch a sheet
 * @returns {Promise<RowDataPacket>} Sheet
 */
export async function getAllFromUser({ sht_idtusr }) {
    // TODO: Vérifier injection SQL /!\
    if (sht_idtusr) {
        return executeQuery('SELECT * FROM sht_sheet WHERE sht_idtusr = ?', [
            sht_idtusr,
        ]);
    }
}
