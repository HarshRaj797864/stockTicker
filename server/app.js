import express from 'express';
import cors from 'cors';
import {healthRouter} from './routes/index.js';
import { NotFoundError, errorHandler } from './middleware/errorHandler.js';
import { stocksRouter } from './routes/stocks.js';

// will start a new express server, that is essentially wrapping the http.createServer 
const app = express(); 

// global middlewares:- they run for every incoming request before it reaches the specific routes
app.use(cors()); // allows react to communicate with express
app.use(express.json()); // Enables the app to read JSON data sent in request object

app.use("/api/stocks", stocksRouter);
app.use("/api", healthRouter);
app.use((req, res, next) => {
    next(new NotFoundError('Not Found'));
});

app.use(errorHandler);
export default app;
