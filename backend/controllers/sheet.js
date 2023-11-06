import { commitTransaction, rollbackTransaction } from '../utils/database.js';

import {getAll as getAllSheets, getOne as getOneSheet} from '../models/sht_sheet_dql.js';
import {create as createSheet} from '../models/sht_sheet_dml.js';
import { MissingParameterError, SheetNotFoundError } from '../utils/error.js';

/**
 * Fetch all sheets
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function getAll(req, res, next) {
    try {
        const sheets = await getAllSheets();
        if (sheets.length === 0) {
            throw new SheetNotFoundError('Sheets not found');
        }
        return res.status(200).json(sheets);
    } catch (error) {
        next(error);
    }
}

/**
 * Fetch one sheet
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function getOne(req, res, next) {
    const {sht_idtsht} = req.params;
    try {
        const sheet = await getOneSheet(sht_idtsht);
        if (sheet.length === 0) {
            throw new SheetNotFoundError('Sheet not found');
        }
        return res.status(200).json(sheet);
    } catch (error) {
        next(error);
    }
}

export async function create(req, res, next) {
    const {sht_idtusr, sht_name, sht_data, sht_sharing, sht_uuid} = req.body;
    try {
        // validation des données reçues
        if (!sht_idtusr || !sht_name || !sht_data || !sht_sharing || !sht_uuid) {
            throw new MissingParameterError('Missing parameters');
        }
        const sheet = await createSheet({sht_idtusr, sht_name, sht_data, sht_sharing, sht_uuid});
        return res.status(200).json(sheet);
    } catch (error) {
        next(error);
    }
}