import jwt from 'jsonwebtoken';
import { InvalidTokenError } from './error.js';

const extractBearer = (authorization) => {
    if (typeof authorization !== 'string') {
        return false;
    }

    // isolate token
    const match = authorization.match(/(bearer)\s+(\S+)/i);

    return match && match[2];
};

/**
 * Check if the token is valid
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @param {NextFunction} next next function to call
 * @returns {Response} data to send back if token is invalid
 */
const checkToken = (req, res, next) => {
    const token =
        req.headers.authorization && extractBearer(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ message: 'I got you !' });
    }

    // check token validity
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            next(new InvalidTokenError('Invalid token'));
        }
        next();
    });
};

/**
 * Get the user id from the token
 * @param {*} authorization
 * @returns {string} user id
 */
const getIdtUsr = (authorization) => {
    const token = extractBearer(authorization);
    const decoded = jwt.decode(token);
    return decoded.usr_idtusr;
};

export { checkToken, extractBearer, getIdtUsr };
