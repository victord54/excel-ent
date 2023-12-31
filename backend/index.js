import express from 'express';
import cors from 'cors';
import * as database from './utils/database.js';
import authRoutes from './routes/auth.js';
import sheetRoutes from './routes/sheet.js';
import profileRoutes from './routes/profile.js';
import { accessLogFile, errorLogFile } from './utils/logfile.js';
import { CustomError } from './utils/error.js';
import { checkToken } from './utils/jwt-check.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import { addConnected, removeConnected, truncateConnected } from './models/sht_sheet_dml.js';
import { getConnectedToSheet, getOne } from './models/sht_sheet_dql.js';
const file = fs.readFileSync('./documentation.yml', 'utf8');
const documentation = YAML.parse(file);


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.io = io;
    accessLogFile(req);
    next();
});

truncateConnected();
io.sockets.on('connection', (socket) => {
    socket.on('join', async ({ userId, sheetUUID }) => {

        const sheet = await getOne({ sht_uuid: sheetUUID });
        const sheetId = sheet[0].sht_idtsht;

        socket.on('disconnect', async () => {

            

            try{
                await removeConnected({ uc_idtsht: sheetId, uc_idtusr: userId, uc_idtsocket: socket.id });
                await database.commitTransaction();
                io.emit('updateConnected', { users: await getConnectedToSheet({ uc_idtsht: sheetId }) });
            }catch(e){
                console.log(e);
            }
        });

        try{
            await addConnected({ uc_idtsht: sheetId, uc_idtusr: userId, uc_idtsocket: socket.id })
            await database.commitTransaction();
            io.emit('updateConnected', { users: await getConnectedToSheet({ uc_idtsht: sheetId }) });

        }catch(e){
            console.log(e);
        }
        
        io.emit('updateConnected', { users: await getConnectedToSheet({ uc_idtsht: sheetId }) });
    });
});

app.get('/', (req, res) => {
    res.send("I'm online stepbro !");
});

// app.use('/users', checkToken, userRoutes);

app.use('/auth', authRoutes);

app.use('/sheet', checkToken, sheetRoutes);

app.use('/profile', checkToken, profileRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(documentation));

app.use('*', (req, res) => {
    return res.status(501).json('No route found');
});

app.use((err, req, res, next) => {
    if (err.status === undefined) err.status = 500;
    if (!err instanceof CustomError)
        console.error('An error occured : ', err.message);
    errorLogFile(err, req);
    return res.status(err.status).json({
        status: 'error',
        error: err,
    });
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
        server.listen(process.env.SRV_PORT, () => {
            console.log(`Server is listening on port ${process.env.SRV_PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
