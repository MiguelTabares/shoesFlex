import { Router } from 'express';
import { CarritoController } from '../controllers/carrito.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
const carritoController = new CarritoController();

// Todos los endpoints de carrito requieren el usuario autenticado (cliente o admin)
router.use(authenticateJWT);

router.get('/', carritoController.getCart.bind(carritoController));
router.post('/items', carritoController.addProductToCart.bind(carritoController));
router.put('/items/:item_id', carritoController.updateCartItem.bind(carritoController));
router.delete('/items/:item_id', carritoController.removeCartItem.bind(carritoController));

export default router;
