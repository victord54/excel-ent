const mysql = require('mysql2/promise');

/**
 * Create a pool of connection to the database
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Start a transaction
 */
exports.commitTransaction = async () => {
    try {
        await this.executeQuery('COMMIT');
    } catch (error) {
        throw error;
    }
};

/**
 * Rollback a transaction
 */
exports.rollbackTransaction = async () => {
    try {
        await this.executeQuery('ROLLBACK');
    } catch (error) {
        throw error;
    }
};

/**
 *
 * @param {string} sql SQL query
 * @param {*} values Values to insert in the query
 * @returns {Promise<RowDataPacket[]>} Result of the query
 */
exports.executeQuery = async (sql, values) => {
    try {
        const [rows] = await pool.query(sql, values);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

/**
 * Test the connection to the database
 */
exports.testConnection = async () => {
    try {
        this.executeQuery('SELECT "PONG" AS PING');
    } catch (error) {
        throw error;
    }
};

/**
 * Set the settings of the database
 */
exports.settingsSQL = async () => {
    try {
        this.executeQuery(
            'SET SESSION sql_mode = "ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"',
        );
        this.executeQuery('SET SESSION autocommit = 0');
    } catch (error) {
        throw error;
    }
};
