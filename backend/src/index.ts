import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { Prisma, PrismaClient } from '@prisma/client';
import { errorHandler, notFoundHandler } from './middlewares.js';
import path from 'path';
import { fileURLToPath } from 'url';

// For env File
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const app: Express = express();
const port = process.env.PORT || 8000;

// Middleware
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
    const where: NonNullable<Parameters<typeof prisma.product.findMany>[0]>['where'] = {};

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