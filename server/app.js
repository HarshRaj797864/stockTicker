import express from 'express';
import cors from 'cors';

// will start a new express server, that is essentially wrapping the http.createServer 
const app = express(); 

// global middlewares:- they run for every incoming request before it reaches the specific routes
app.use(cors()); // allows react to communicate with express
app.use(express.json()); // Enables the app to read JSON data sent in request object


app.get("/api/health", (req, res) => {
    res.status(200).json({status: "ok"});
});

export default app;
