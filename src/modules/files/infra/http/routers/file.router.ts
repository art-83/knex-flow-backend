import { Router } from 'express';
import multer from 'multer';
import { FileController } from '../controllers/file.controller';

const fileRouter = Router();
const fileController = new FileController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

fileRouter.post('/', upload.single('file'), fileController.upload);
export { fileRouter };
