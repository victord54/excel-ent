const db = require('../database');

/**
 * Create a new user
 * @param {Object} object data to create a user
 * @returns {Promise<RowDataPacket>} data related to the new user
 * @example
 * const user = await UserDML.create({
 *     usr_fname: 'John',
 *     usr_lname: 'Doe',
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
exports.create = async ({ usr_fname, usr_lname, usr_mail, usr_pwd }) => {
    return db.executeQuery(
        'INSERT INTO usr_user (usr_fname, usr_lname, usr_mail, usr_pwd) VALUES (?, ?, ?, ?)',
        [usr_fname, usr_lname, usr_mail, usr_pwd],
    );
};
