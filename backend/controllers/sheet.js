import { commitTransaction, rollbackTransaction } from '../utils/database.js';
import {
    getAll as _getAll,
    getOne as _getOne,
    getAllForUser as _getAllForUser,
    getCells as _getCells,
    getOneCell as _getOneCell,
} from '../models/sht_sheet_dql.js';
import {
    create as _create,
    updateName as _updateName,
    remove as _remove,
    createData as _createData,
    updateData as _updateData,
} from '../models/sht_sheet_dml.js';
import { MissingParameterError, SheetNotFoundError } from '../utils/error.js';
import { getIdtUsr as _getIdtUsr } from '../utils/jwt-check.js';

/**
 * Fetch all sheets
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function getAll(req, res, next) {
    try {
        const sheets = await _getAll();
        if (sheets.length === 0) {
            throw new SheetNotFoundError('Sheets not found');
        }
        return res.status(200).json({
            status: 'success',
            data: sheets,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Fetch one sheet
 * @param {Request} req data from the request
 * @param {string} req.params.id sheet id
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function getOne(req, res, next) {
    const sht_uuid = req.params.id;
    try {
        let sheet;
        if (!isNaN(sht_uuid)) sheet = await _getOne({ sht_idtsht: sht_uuid });
        else sheet = await _getOne({ sht_uuid });
        if (sheet.length === 0) throw new SheetNotFoundError('Sheet not found');
        return res.status(200).json({
            status: 'success',
            data: sheet[0],
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Create a sheet
 * @param {Request} req data from the request
 * @param {string} req.body.sht_name sheet name
 * @param {boolean} req.body.sht_sharing sheet sharing
 * @param {string} req.body.sht_uuid sheet uuid
 * @param {Response} res data to send back
 * @param {*} next next middleware (error middleware)
 * @returns {Promise<Response>} data to send back
 */
export async function create(req, res, next) {
    const { sht_name, sht_sharing, sht_uuid } = req.body;

    try {
        // récupération de l'id de l'utilisateur via la payload du token
        const token = req.headers.authorization;
        const sht_idtusr_aut = _getIdtUsr(token);

        // validation des données reçues avec détail des champs manquants
        let missing = '';
        if (sht_name === undefined) missing += 'sht_name ';
        if (sht_sharing === undefined) missing += 'sht_sharing ';
        if (sht_uuid === undefined) missing += 'sht_uuid ';
        if (missing !== '')
            throw new MissingParameterError('Missing parameters: ' + missing);

        // vérification unicité uuid
        const sheetVerif = await _getOne({ sht_uuid });
        if (sheetVerif.length !== 0)
            throw new SheetAlreadyExistsError('Sheet (uuid) already exists');

        // création de la feuille
        const sheet = await _create({
            sht_idtusr_aut,
            sht_name,
            sht_sharing,
            sht_uuid,
        });

        commitTransaction();
        return res.status(200).json({
            status: 'success',
            data: sheet,
        });
    } catch (error) {
        rollbackTransaction();
        next(error);
    }
}

export async function updateName(req, res, next) {
    const sht_idtsht = req.params.id;
    const { sht_name } = req.body;
    try {
        // validation des données reçues
        let missing = '';
        if (sht_name === undefined) {
            missing += 'sht_name ';
        }
        if (missing !== '') {
            console.log(req.body);
            throw new MissingParameterError('Missing parameters: ' + missing);
        }
        const sheet = await _updateName({
            sht_idtsht,
            sht_name,
        });
        await commitTransaction();
        return res.status(200).json({
            status: 'success',
            data: sheet,
        });
    } catch (error) {
        await rollbackTransaction();
        next(error);
    }
}

export async function updateData(req, res, next) {
    const cel_idtsht = req.params.id;
    const { cel_idtcel, cel_val, cel_stl } = req.body;
    try {
        // validation des données reçues
        let missing = '';
        if (cel_idtcel === undefined) {
            missing += 'cel_idtcel ';
        }
        if (cel_val === undefined) {
            missing += 'cel_val ';
        }
        if (cel_stl === undefined) {
            missing += 'cel_stl ';
        }
        if (missing !== '') {
            throw new MissingParameterError('Missing parameters: ' + missing);
        }

        // vérification existence de la cellule
        const existsCell = await _getOneCell({ cel_idtsht, cel_idtcel });
        let cell;
        if (existsCell.length === 0) {
            // On la crée
            cell = await _createData({
                cel_idtcel,
                cel_idtsht,
                cel_val,
                cel_stl,
            });
        } else {
            // On la met à jour
            cell = await _updateData({
                cel_idtcel,
                cel_idtsht,
                cel_val,
                cel_stl,
            });
        }
        await commitTransaction();
        return res.status(200).json({
            status: 'success',
            data: {
                operation: existsCell.length === 0 ? 'create' : 'update',
                cel_idtcel,
                cel_idtsht,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllForUser(req, res, next) {
    try {
        const token = req.headers.authorization;
        const sht_idtusr_aut = _getIdtUsr(token);
        console.log('getAllFromUser back : ' + sht_idtusr_aut);
        const sheets = await _getAllForUser({ sht_idtusr_aut });
        // if (sheets.length === 0) {
        //     throw new SheetNotFoundError('Sheets not found');
        // }
        return res.status(200).json(sheets);
    } catch (error) {
        next(error);
    }
}

export async function remove(req, res, next) {
    const sht_idtsht = req.params.id;
    try {
        const deletedSheet = await _remove({ sht_idtsht });
        return res.status(200).json({
            status: 'success',
            data: deletedSheet,
        });
    } catch (error) {
        next(error);
    }
}

export async function getCells(req, res, next) {
    const cel_idtsht = req.params.id;
    try {
        const cells = await _getCells({ cel_idtsht });
        return res.status(200).json({
            status: 'success',
            data: cells,
        });
    } catch (error) {
        next(error);
    }
}
