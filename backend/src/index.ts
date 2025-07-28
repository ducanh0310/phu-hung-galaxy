import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import { errorHandler, notFoundHandler } from './middlewares.js';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json()); // To parse JSON bodies

app.use('/api/v1', apiRouter);

// --- Production Static Serving ---
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../../frontend/dist');

  // Serve static files from the React app
  app.use(express.static(frontendDist));

  // The "catchall" handler: for any request that doesn't match one above,
  // send back React's index.html file.
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// --- Server Health Check ---
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running and healthy.');
});

// --- Error Handling Middlewares ---
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
