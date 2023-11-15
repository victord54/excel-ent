import { commitTransaction, rollbackTransaction } from '../utils/database.js';
import { get } from '../models/usr_user_dql.js';
import { create } from '../models/usr_user_dml.js';
import { compare, hash as _hash } from 'bcrypt';
import pkg from 'jsonwebtoken';
import {
    InvalidIdentifiersError,
    MissingParameterError,
    UserAlreadyExistsError,
    UserNotFoundError,
} from '../utils/error.js';
const { sign } = pkg;

/**
 * User login
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function login(req, res, next) {
    const { usr_mail, usr_pwd } = req.query;

    // validation des données reçues
    if (!usr_mail || !usr_pwd) {
        throw new MissingParameterError('Missing parameters');
    }

    try {
        // vérification de l'existence de l'utilisateur
        const user = (await get({ usr_mail: usr_mail }))[0];
        if (user === undefined) {
            throw new UserNotFoundError('User not found');
        }

        // vérification du mot de passe
        const valid = await compare(usr_pwd, user.usr_pwd);
        if (!valid) {
            throw new InvalidIdentifiersError('Invalid identifiers');
        }

        // création du token
        const token = sign(
            {
                usr_idtusr: user.usr_idtusr,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_DURATION },
        );

        // envoi du token
        return res.status(200).json({
            token,
            user: {
                usr_pseudo: user.usr_pseudo,
                usr_mail: user.usr_mail,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * User signup
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function signup(req, res, next) {
    const { usr_pseudo, usr_mail, usr_pwd } = req.body;

    try {
        // validation des données reçues
        if (!usr_pseudo || !usr_mail || !usr_pwd) {
            throw new MissingParameterError('Missing parameters');
        }

        // vérification de l'unicité des données reçues (mail et pseudo)
        const userMail = await get({ usr_mail: usr_mail });
        const userPseudo = await get({ usr_pseudo: usr_pseudo });
        if (userMail.length > 0 || userPseudo.length > 0) {
            throw new UserAlreadyExistsError('User already exists');
        }

        // salage mot de passe
        const hash = await _hash(
            usr_pwd,
            parseInt(process.env.BCRYPT_SALT_ROUNDS),
        );

        // création de l'utilisateur
        const user = await create({
            usr_pseudo: usr_pseudo,
            usr_mail: usr_mail,
            usr_pwd: hash,
        });
        await commitTransaction();

        // envoi de la réponse
        return res.status(201).json({ message: 'user created', user });
    } catch (error) {
        await rollbackTransaction();
        next(error);
    }
}
