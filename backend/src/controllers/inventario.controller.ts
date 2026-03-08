import { Request, Response } from 'express';
import { InventarioService } from '../services/inventario.service';

const inventarioService = new InventarioService();

export class InventarioController {

    async getInventariosPorProducto(req: Request, res: Response): Promise<void> {
        try {
            const { producto_id } = req.params;
            const inventarios = await inventarioService.getInventariosByProductoId(producto_id);
            res.status(200).json(inventarios);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving inventory', error });
        }
    }

    async getInventarioById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const inventario = await inventarioService.getInventarioById(id);
            if (inventario) {
                res.status(200).json(inventario);
            } else {
                res.status(404).json({ message: 'Inventario not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving inventory item', error });
        }
    }

    async createInventario(req: Request, res: Response): Promise<void> {
        try {
            const { producto_id, talla, stock } = req.body;
            if (!producto_id || !talla) {
                res.status(400).json({ message: 'producto_id y talla son requeridos' });
                return;
            }
            const inventario = await inventarioService.createInventario({ producto_id, talla, stock });
            res.status(201).json(inventario);
        } catch (error: any) {
            res.status(500).json({ message: 'Error creating inventory', error: error.message });
        }
    }

    async updateInventario(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const inventario = await inventarioService.updateInventario(id, req.body);
            if (inventario) {
                res.status(200).json(inventario);
            } else {
                res.status(404).json({ message: 'Inventario not found' });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Error updating inventory', error: error.message });
        }
    }

    async deleteInventario(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await inventarioService.deleteInventario(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Inventario not found' });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Error deleting inventory', error: error.message });
        }
    }
}
