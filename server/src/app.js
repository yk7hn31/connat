import express from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import apiRouter from './router/api.js';

dotenv.config();
const app = express();

app.use(compression());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(process.env.PORT);