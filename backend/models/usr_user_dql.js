const db = require('../utils/database');

/**
 * Fetch all users
 * @returns {Promise<RowDataPacket[]>} User list
 */
exports.getAll = async () => {
    return db.executeQuery('SELECT * FROM usr_user');
};

/**
 * Fetch one specific user
 * @param {Object} object data to fetch a user
 * @returns {Promise<RowDataPacket>} User
 */
exports.get = async ({ usr_idtusr, usr_mail }) => {
    if (usr_idtusr) {
        return db.executeQuery('SELECT * FROM usr_user WHERE usr_idtusr = ?', [
            usr_idtusr,
        ]);
    }
    if (usr_mail) {
        return db.executeQuery('SELECT * FROM usr_user WHERE usr_mail = ?', [
            usr_mail,
        ]);
    }
    return null;
};
