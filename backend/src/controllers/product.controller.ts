import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
    const { subcategory } = req.query;

    try {
        const whereClause = subcategory && typeof subcategory === 'string'
            ? { subcategoryId: subcategory }
            : {};

        const products = await prisma.product.findMany({
            where: whereClause,
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}; 