const jwt = require('jsonwebtoken');

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
exports.checkToken = (req, res, next) => {
    const token =
        req.headers.authorization && extractBearer(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ message: 'I got you !' });
    }

    // check token validity
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next();
    });
};
