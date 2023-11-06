import { executeQuery } from '../utils/database.js';

/**
 * Fetch all users
 * @returns {Promise<RowDataPacket[]>} User list
 */
export async function getAll() {
    return executeQuery('SELECT * FROM usr_user');
}

/**
 * Fetch one specific user
 * @param {Object} object data to fetch a user
 * @returns {Promise<RowDataPacket>} User
 */
export async function get({ usr_idtusr, usr_mail, usr_pseudo }) {
    // TODO: Vérifier injection SQL /!\
    if (usr_idtusr) {
        return executeQuery('SELECT * FROM usr_user WHERE usr_idtusr = ?', [
            usr_idtusr,
        ]);
    }
    if (usr_mail) {
        return executeQuery('SELECT * FROM usr_user WHERE usr_mail = ?', [
            usr_mail,
        ]);
    }
    if (usr_pseudo) {
        return executeQuery('SELECT * FROM usr_user WHERE usr_pseudo = ?', [
            usr_pseudo,
        ]);
    }
    return null;
}
