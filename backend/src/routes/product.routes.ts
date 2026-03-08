import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const productController = new ProductController();

// Públicos
router.get('/', productController.getProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

// Protegidos (Solo Admin)
router.post('/', authenticateJWT, requireAdmin, productController.createProduct.bind(productController));
router.put('/:id', authenticateJWT, requireAdmin, productController.updateProduct.bind(productController));
router.delete('/:id', authenticateJWT, requireAdmin, productController.deleteProduct.bind(productController));

export default router;
