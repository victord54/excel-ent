const database = require('../utils/database');
const UserDQL = require('../models/usr_user_dql');
const UserDML = require('../models/usr_user_dml');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * User login
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
exports.login = async (req, res) => {
    const { usr_mail, usr_pwd } = req.body;

    // validation des données reçues
    if (!usr_mail || !usr_pwd) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
        // vérification de l'existence de l'utilisateur
        const user = (await UserDQL.get({ usr_mail: usr_mail }))[0];
        if (user === undefined) {
            return res.status(401).json({ message: 'User not found' });
        }

        // vérification du mot de passe
        const valid = await bcrypt.compare(usr_pwd, user.usr_pwd);
        if (!valid) {
            return res
                .status(401)
                .json({ message: 'Incorrect mail or password' });
        }

        // création du token
        const token = jwt.sign(
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
};

/**
 * User signup
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @returns {Promise<Response>} data to send back
 */
exports.signup = async (req, res) => {
    const { usr_fname, usr_lname, usr_mail, usr_pwd } = req.body;

    // validation des données reçues
    if (!usr_fname || !usr_lname || !usr_mail || !usr_pwd) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
        // vérification de l'unicité des données reçues
        const userMail = await UserDQL.get({ usr_mail: usr_mail });
        if (userMail.length > 0) {
            return res.status(400).json({ message: 'mail already exists' });
        }

        // salage mot de passe
        const hash = await bcrypt.hash(
            usr_pwd,
            parseInt(process.env.BCRYPT_SALT_ROUNDS),
        );

        // création de l'utilisateur
        const user = await UserDML.create({
            usr_fname: usr_fname,
            usr_lname: usr_lname,
            usr_mail: usr_mail,
            usr_pwd: hash,
        });
        await database.commitTransaction();

        // envoi de la réponse
        return res.status(201).json({ message: 'user created', user });
    } catch (error) {
        console.log(error);
        database.rollbackTransaction();
        return res.status(500).json({ message: 'Unknown error', error });
    }
};
