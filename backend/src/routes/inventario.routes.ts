import { Router } from 'express';
import { InventarioController } from '../controllers/inventario.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const inventarioController = new InventarioController();

// Públicos
router.get('/producto/:producto_id', inventarioController.getInventariosPorProducto.bind(inventarioController));
router.get('/:id', inventarioController.getInventarioById.bind(inventarioController));

// Privados (Solo Admin)
router.post('/', authenticateJWT, requireAdmin, inventarioController.createInventario.bind(inventarioController));
router.put('/:id', authenticateJWT, requireAdmin, inventarioController.updateInventario.bind(inventarioController));
router.delete('/:id', authenticateJWT, requireAdmin, inventarioController.deleteInventario.bind(inventarioController));

export default router;
