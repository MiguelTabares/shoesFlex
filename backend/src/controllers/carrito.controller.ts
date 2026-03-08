import { Request, Response } from 'express';
import { CarritoService } from '../services/carrito.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const carritoService = new CarritoService();

export class CarritoController {
    async getCart(req: AuthRequest, res: Response): Promise<void> {
        try {
            const usuarioId = req.user!.id;
            const cart = await carritoService.getActiveCart(usuarioId);
            res.status(200).json(cart);
        } catch (error: any) {
            res.status(500).json({ message: 'Error retrieving cart', error: error.message });
        }
    }

    async addProductToCart(req: AuthRequest, res: Response): Promise<void> {
        try {
            const usuarioId = req.user!.id;
            const { inventario_id, cantidad } = req.body;

            if (!inventario_id || !cantidad || cantidad <= 0) {
                res.status(400).json({ message: 'inventario_id y cantidad válida son requeridos' });
                return;
            }

            const updatedCart = await carritoService.addOrUpdateItem(usuarioId, inventario_id, cantidad);
            res.status(200).json(updatedCart);
        } catch (error: any) {
            res.status(500).json({ message: 'Error adding to cart', error: error.message });
        }
    }

    async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
        try {
            const usuarioId = req.user!.id;
            const { item_id } = req.params;
            const { cantidad } = req.body;

            if (typeof cantidad !== 'number') {
                res.status(400).json({ message: 'cantidad es requerida' });
                return;
            }

            const updatedCart = await carritoService.setItemQuantity(usuarioId, item_id, cantidad);
            res.status(200).json(updatedCart);
        } catch (error: any) {
            res.status(500).json({ message: 'Error updating cart item', error: error.message });
        }
    }

    async removeCartItem(req: AuthRequest, res: Response): Promise<void> {
        try {
            const usuarioId = req.user!.id;
            const { item_id } = req.params;

            const updatedCart = await carritoService.removeItem(usuarioId, item_id);
            res.status(200).json(updatedCart);
        } catch (error: any) {
            res.status(500).json({ message: 'Error removing item from cart', error: error.message });
        }
    }
}
