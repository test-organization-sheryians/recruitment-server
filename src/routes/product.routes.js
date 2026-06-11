import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { validateProduct } from '../middlewares/validators/product.validator.js';

const router = Router();

router.post('/', validateProduct, ProductController.create);
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.put('/:id', validateProduct, ProductController.update);
router.delete('/:id', ProductController.delete);

export default router;
