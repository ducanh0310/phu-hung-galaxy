import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// For env File
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json()); // To parse JSON bodies, replaces body-parser

// Test endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});