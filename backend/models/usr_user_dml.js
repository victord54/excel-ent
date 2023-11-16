import { executeQuery } from '../utils/database.js';

/**
 * Create a new user
 * @param {Object} object data to create a user
 * @returns {Promise<RowDataPacket>} data related to the new user
 * @example
 * const user = await UserDML.create({
 *     usr_pseudo: 'John',
 *     usr_mail: 'john@doe.uk',
 *     usr_pwd: '1234'
 * });
 * console.log(user);
 * // {
 * //     fieldCount: 0,
 * //     affectedRows: 1,
 * //     insertId: 1,
 * //     info: '',
 * //     serverStatus: 2,
 * //     warningStatus: 0
 * // }
 */
export async function create({ usr_pseudo, usr_mail, usr_pwd }) {
    // TODO: Vérifier injection SQL /!\
    return executeQuery(
        'INSERT INTO usr_user (usr_pseudo, usr_mail, usr_pwd) VALUES (?, ?, ?)',
        [usr_pseudo, usr_mail, usr_pwd],
    );
}

export async function update({ usr_id, usr_pseudo, usr_mail, usr_pwd }) {
    // TODO: Vérifier injection SQL /!\
    return executeQuery(
        'UPDATE usr_user SET usr_pseudo = ?, usr_mail = ?, usr_pwd = ?, usr_updated_at = ? WHERE usr_idtusr = ?;',
        [usr_pseudo, usr_mail, usr_pwd, new Date(), usr_id],
    );
}
