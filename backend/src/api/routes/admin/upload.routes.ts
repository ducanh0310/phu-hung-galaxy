import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../../../auth.middleware.js';
import upload from '../../../upload.middleware.js';
import { uploadService } from '../../services/upload.service.js';
import { AppError } from '../../../middlewares.js';

const router = Router();

// Protect all routes in this file
router.use(protect);

// POST /
// The middleware `upload.single('file')` will process a single file with the field name 'file'.
// The file will be available in req.file.
router.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new AppError('No file uploaded.', 400));
    }
    const imageUrl = await uploadService.uploadImage(req.file.buffer);
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    next(error);
  }
});

export default router;