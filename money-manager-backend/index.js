const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const startServer = async () => {
    // Start In-Memory MongoDB
    try {
        const path = require('path');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create({
            binary: {
                version: '6.0.19', // Use a stable, slightly older version
                downloadDir: path.join(__dirname, '.mongo-bin')
            }
        });
        const uri = mongod.getUri();
        process.env.MONGO_URI = uri;
        console.log(`\n\x1b[33m[INFO] Using In-Memory MongoDB: ${uri}\x1b[0m\n`);
    } catch (error) {
        console.error('\n\x1b[31m[ERROR] Detailed In-Memory DB Error:\x1b[0m', error);
        console.log('\n\x1b[31m[CRITICAL] Failed to start In-Memory DB. Stopping server.\x1b[0m');
        console.log('\x1b[33m[TIP] You might have multiple servers running. Close all other terminals and try again.\x1b[0m\n');
        process.exit(1);
    }

    // Connect to Database
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api/transactions', require('./routes/transactionRoutes'));

    app.get('/', (req, res) => {
        res.send('Money Manager API is running...');
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer();
