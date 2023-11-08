import express from 'express';
import cors from 'cors';
import * as database from './utils/database.js';
import authRoutes from './routes/auth.js';
import sheetRoutes from './routes/sheet.js';
import profileRoutes from './routes/profile.js';
import { accessLogFile, errorLogFile } from './utils/logfile.js';
import { checkToken } from './utils/jwt-check.js'; //checkToken from './utils/jwt-check.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    accessLogFile(req);
    next();
});

app.get('/', (req, res) => {
    res.send("I'm online stepbro !");
});

// app.use('/users', checkToken, userRoutes);

app.use('/auth', authRoutes);

app.use('/sheet', sheetRoutes);

app.use('/profile', checkToken, profileRoutes);

app.use('*', (req, res) => {
    return res.status(501).json('No route found');
});

app.use((err, req, res, next) => {
    errorLogFile(err, req);
    return res.status(err.status).json({ error: err });
});

/**
 * Start the server and connect to the database
 */
async function startServer() {
    try {
        await database.testConnection();
        await database.settingsSQL();
        console.log(
            'Connection to database has been established successfully.',
        );
        app.listen(process.env.SRV_PORT, () => {
            console.log(`Server is listening on port ${process.env.SRV_PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
