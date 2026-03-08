import { Router } from 'express';
import { PedidoController } from '../controllers/pedido.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const pedidoController = new PedidoController();

router.use(authenticateJWT);

// Checkout (Process Cart)
router.post('/checkout', pedidoController.checkout.bind(pedidoController));

// Active user's history
router.get('/mis-pedidos', pedidoController.getMisPedidos.bind(pedidoController));

export default router;
