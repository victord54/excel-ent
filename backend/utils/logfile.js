import { existsSync, mkdirSync, appendFile } from 'fs';

/**
 * Write access logs in a file
 * @param {Request} req data from the request
 */
export function accessLogFile(req) {
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
        `${datheu} - ${req.hostname} - ${req.method}: ${req.originalUrl}`,
    );
    // Si le dossier log n'existe pas, on le crée
    if (!existsSync('logs')) {
        mkdirSync('logs');
    }
    // log dans le fichier access_yyyy-mm-dd.log
    appendFile(
        'logs/access_' + date + '.log',
        `${datheu} - ${req.hostname} - ${req.method}: ${req.originalUrl}\n`,
        (error) => {
            if (error) {
                console.log(
                    `Erreur ${error} dans l'écriture du fichier de log`,
                );
            }
        },
    );
}

/**
 * Write error logs in a file
 * @param {MainError} err Error object
 * @param {Request} req data from the request
 */
export function errorLogFile(err, req) {
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
        `${datheu} - ${req.hostname} - ${req.method}: ${req.originalUrl} = ${err.name}: ${err.message}`,
    );
    // Si le dossier log n'existe pas, on le crée
    if (!existsSync('logs')) {
        mkdirSync('logs');
    }
    // log dans le fichier access_yyyy-mm-dd.log
    appendFile(
        'logs/error_' + date + '.log',
        `${datheu} - ${req.hostname} - ${req.method}: ${req.originalUrl} = ${err.name}: ${err.message}\n`,
        (error) => {
            if (error) {
                console.log(
                    `Erreur ${error} dans l'écriture du fichier de log`,
                );
            }
        },
    );
}