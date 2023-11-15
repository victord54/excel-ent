import { commitTransaction, rollbackTransaction } from '../utils/database.js';

import {
    getAll as getAllSheets,
    getOne as getOneSheet,
} from '../models/sht_sheet_dql.js';
import {
    create as createSheet,
    update as updateSheet,
} from '../models/sht_sheet_dml.js';
import { MissingParameterError, SheetNotFoundError } from '../utils/error.js';
import { getIdtUsr as _getIdtUsr, extractBearer } from '../utils/jwt-check.js';

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
    const { sht_idtsht } = req.params;
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
    const { sht_name, sht_data, sht_sharing, sht_uuid } = req.body;
    // récupération de l'id de l'utilisateur via la payload du token
    const token = req.headers.authorization;
    try {
        const sht_idtusr = _getIdtUsr(token);
        // validation des données reçues avec détail des champs manquants
        let missing = '';
        if (!sht_name) {
            missing += 'sht_name ';
        }
        if (!sht_data) {
            missing += 'sht_data ';
        }
        if (sht_sharing === undefined) {
            missing += 'sht_sharing ';
        }
        if (!sht_uuid) {
            missing += 'sht_uuid ';
        }
        if (missing !== '') {
            console.log(req.body);
            throw new MissingParameterError('Missing parameters: ' + missing);
        }
        // création de la feuille
        const sheet = await createSheet({
            sht_idtusr,
            sht_name,
            sht_data,
            sht_sharing,
            sht_uuid,
        });
        commitTransaction();
        return res.status(200).json(sheet.insertId);
    } catch (error) {
        rollbackTransaction();
        next(error);
    }
}

export async function update(req, res, next) {
    const sht_idtsht = req.params.id;
    const { sht_name, sht_data, sht_sharing, sht_uuid } = req.body;
    try {
        // validation des données reçues
        let missing = '';
        if (!sht_name) {
            missing += 'sht_name ';
        }
        if (!sht_data) {
            missing += 'sht_data ';
        }
        if (sht_sharing === undefined) {
            missing += 'sht_sharing ';
        }
        if (!sht_uuid) {
            missing += 'sht_uuid ';
        }
        if (missing !== '') {
            console.log(req.body);
            throw new MissingParameterError('Missing parameters: ' + missing);
        }
        const sheet = await updateSheet({
            sht_idtsht,
            sht_name,
            sht_data,
            sht_sharing,
            sht_uuid,
        });
        await commitTransaction();
        return res.status(200).json(sht_idtsht);
    } catch (error) {
        await rollbackTransaction();
        next(error);
    }
}
