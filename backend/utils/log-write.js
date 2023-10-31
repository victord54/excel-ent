const fs = require('fs');

/**
 * Write access logs in a file
 * @param {Request} req data from the request
 * @param {Response} res data to send back
 * @param {NextFunction} next next function to call
 */
exports.accessLogFile = (req, res, next) => {
    const event = new Date();
    const date = `${event.getFullYear()}-${(event.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${event.getDate().toString().padStart(2, '0')}`;
    const datheu = `${date} ${event
        .getHours()
        .toString()
        .padStart(2, '0')}:${event
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${event.getSeconds().toString().padStart(2, '0')}`;
    // Log dans la console
    console.log(
        `${datheu}\t==>\t${req.hostname}\t|\t${req.method}\t|\t${req.originalUrl}`,
    );
    // Si le dossier log n'existe pas, on le crée
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
    }
    // log dans le fichier access_yyyy-mm-dd.log
    fs.appendFile(
        'logs/access_' + date + '.log',
        `${datheu}\t==>\t${req.hostname}\t|\t${req.method}\t|\t${req.originalUrl}\n`,
        (error) => {
            if (error) {
                console.log(
                    `Erreur ${error} dans l'écriture du fichier de log`,
                );
            }
        },
    );
    next();
};
