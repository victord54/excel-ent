import { update } from '../models/usr_user_dml.js';
import { get } from '../models/usr_user_dql.js';

import pkg from 'jsonwebtoken';
import { commitTransaction, rollbackTransaction } from '../utils/database.js';
import {
    MissingParameterError,
    UserAlreadyExistsError,
    UserNotFoundError,
    InvalidIdentifiersError,
} from '../utils/error.js';
import { extractBearer } from '../utils/jwt-check.js';
import { compare, hash as _hash } from 'bcrypt';

/**
 * Edit profile information
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */

export async function editProfile(req, res, next) {
    const { usr_pseudo, usr_mail } = req.body;

    try {
        // validation des données reçues
        if (!usr_pseudo || !usr_mail) {
            throw new MissingParameterError('Missing parameters');
        }

        //récupération de l'id de l'utilisateur via la payload du token
        const token =
            req.headers.authorization &&
            extractBearer(req.headers.authorization);
        if (!token) return res.status(401).json({ message: 'Not authorized' });

        const { usr_idtusr } = pkg.decode(token);

        //vérification de l'éxistence de l'utilisateur
        const user = (await get({ usr_idtusr }))[0];
        if (!user) throw new UserNotFoundError('User not found');

        //verification unicité nouveau pseudo et mail
        const userMail = await get({ usr_mail: usr_mail });
        const userPseudo = await get({ usr_pseudo: usr_pseudo });
        if (
            (userMail.length > 0 && user.usr_mail !== usr_mail) ||
            (userPseudo.length > 0 && user.usr_pseudo !== usr_pseudo)
        ) {
            throw new UserAlreadyExistsError('User already exists');
        }

        //mise a jour de l'utilisateur
        await update({
            usr_id: usr_idtusr,
            usr_pseudo: usr_pseudo,
            usr_mail: usr_mail,
            usr_pwd: user.usr_pwd,
        });
        await commitTransaction();

        const userEdited = (await get({ usr_idtusr }))[0];

        // envoi de la réponse
        return res.status(201).json({
            message: 'user editer',
            user: {
                usr_pseudo: userEdited.usr_pseudo,
                usr_mail: userEdited.usr_mail,
            },
        });
    } catch (error) {
        rollbackTransaction();
        next(error);
    }
}

/**
 * Edit profile information
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */

export async function editPassword(req, res, next) {
    const { usr_old_password, usr_new_password } = req.body;

    try {
        // validation des données reçues
        if (
            !usr_old_password ||
            !usr_new_password ||
            usr_new_password.length === 0 ||
            usr_old_password.length === 0
        ) {
            throw new MissingParameterError('Missing parameters');
        }

        //récupération de l'id de l'utilisateur via la payload du token
        const token =
            req.headers.authorization &&
            extractBearer(req.headers.authorization);
        if (!token) return res.status(401).json({ message: 'Not authorized' });

        const { usr_idtusr } = pkg.decode(token);

        //vérification de l'éxistence de l'utilisateur
        const user = (await get({ usr_idtusr }))[0];
        if (!user) throw new UserNotFoundError('User not found');

        //vérification de l'ancien mot de passe
        const valid = await compare(usr_old_password, user.usr_pwd);
        if (!valid) {
            throw new InvalidIdentifiersError('Invalid identifiers');
        }

        const hash = await _hash(
            usr_new_password,
            parseInt(process.env.BCRYPT_SALT_ROUNDS),
        );

        //mise a jour de l'utilisateur
        await update({
            usr_id: user.usr_idtusr,
            usr_pseudo: user.usr_pseudo,
            usr_mail: user.usr_mail,
            usr_pwd: hash,
        });
        await commitTransaction();

        const userEdited = (await get({ usr_idtusr }))[0];

        // envoi de la réponse
        return res.status(201).json({
            message: 'user editer',
            user: {
                usr_pseudo: userEdited.usr_pseudo,
                usr_mail: userEdited.usr_mail,
            },
        });
    } catch (error) {
        rollbackTransaction();
        next(error);
    }
}
