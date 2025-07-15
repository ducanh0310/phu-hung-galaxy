import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// For env File
dotenv.config();

const prisma = new PrismaClient();

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

// Endpoint to get all products to test DB connection
app.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});