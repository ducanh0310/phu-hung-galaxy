import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Prisma, PrismaClient } from '@prisma/client';
import { errorHandler, notFoundHandler } from './middlewares.js';

// For env File
dotenv.config();

const prisma = new PrismaClient();

const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json()); // To parse JSON bodies

// --- API Routes ---
const apiRouter = express.Router();

// Task 3.1: Get all categories with subcategories
apiRouter.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Task 3.2: Get products with filtering and search
apiRouter.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subcategory, q } = req.query;
    const where: Parameters<typeof prisma.product.findMany>[0]['where'] = {};

    if (subcategory) {
      where.subcategoryId = subcategory as string;
    }

    if (q) {
      const searchQuery = q as string;
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
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
    next(error);
  }
});

// Task 3.3: Get a single product by ID
apiRouter.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        subcategory: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      // Use a 404 status for not found resources
      return res.status(404).json({ status: 'error', message: `Product with ID '${id}' not found.` });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1', apiRouter);

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