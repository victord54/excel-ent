import { commitTransaction, rollbackTransaction } from '../utils/database.js';
import { get } from '../models/usr_user_dql.js';
import { create } from '../models/usr_user_dml.js';
import { compare, hash as _hash } from 'bcrypt';
import pkg from 'jsonwebtoken';
import { MissingParameterError, UserAlreadyExistsError } from '../utils/error.js';
const { sign } = pkg;

/**
 * User login
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function login(req, res) {
    const { usr_mail, usr_pwd } = req.body;

    // validation des données reçues
    if (!usr_mail || !usr_pwd) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
        // vérification de l'existence de l'utilisateur
        const user = (await get({ usr_mail: usr_mail }))[0];
        if (user === undefined) {
            return res.status(401).json({ message: 'User not found' });
        }

        // vérification du mot de passe
        const valid = await compare(usr_pwd, user.usr_pwd);
        if (!valid) {
            return res
                .status(401)
                .json({ message: 'Incorrect mail or password' });
        }

        // création du token
        const token = sign(
            {
                usr_idtusr: user.usr_idtusr,
                usr_mail: user.usr_mail,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_DURATION },
        );

        // envoi du token
        return res.status(200).json({
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Unknown Error', error });
    }
}

/**
 * User signup
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
export async function signup(req, res, next) {
    const { usr_fname, usr_lname, usr_mail, usr_pwd } = req.body;

    try {
        // validation des données reçues
        if (!usr_fname || !usr_lname || !usr_mail || !usr_pwd) {
            throw new MissingParameterError('Missing parameters');
        }

        // vérification de l'unicité des données reçues
        const userMail = await get({ usr_mail: usr_mail });
        if (userMail.length > 0) {
            throw new UserAlreadyExistsError('User already exists');
        }

        // salage mot de passe
        const hash = await _hash(
            usr_pwd,
            parseInt(process.env.BCRYPT_SALT_ROUNDS),
        );

        // création de l'utilisateur
        const user = await create({
            usr_pseudo: usr_fname,
            usr_mail: usr_mail,
            usr_pwd: hash,
        });
        await commitTransaction();

        // envoi de la réponse
        return res.status(201).json({ message: 'user created', user });
    } catch (error) {
        rollbackTransaction();
        next(error);
    }
}
