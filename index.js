import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from './routers/user.js';
import prisma from './libs/prisma.js';


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));


// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/user', userRouter)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const gracefulShutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
        console.log("Yaycha API closed.");
        process.exit(0);
    });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);