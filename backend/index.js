const express = require('express');
const cors = require('cors');
const database = require('./database');
// const db = require("./db.config");
// const checkToken = require("./jwt/check");
// const utils = require("./controllers/utils");
// const userRoutes = require("./routes/users");
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("I'm online stepbro !");
});

// app.use((req, res, next) => {
// 	utils.logfile(req, res, next);
// });
// app.use('/users', checkToken, userRoutes);

app.use('/auth', authRoutes);

app.use('*', (req, res) => {
    return res.status(501).json('No route found');
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
