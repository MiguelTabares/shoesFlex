import { Request, Response } from 'express';
import { Pedido } from '../models/pedido.model';
import { ItemPedido } from '../models/item-pedido.model';
import { CarritoRepository } from '../repositories/carrito.repository';
import { Inventario } from '../models/inventario.model';
import { EstadoCarrito, EstadoPedido } from '../models/types';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Carrito } from '../models/carrito.model';
import { Producto } from '../models/producto.model';
import { sequelize } from '../config/database';

export class PedidoController {

    // Checkout: Process cart, deduct inventory, save Pedido
    async checkout(req: AuthRequest, res: Response): Promise<void> {
        const t = await sequelize.transaction();

        try {
            const usuarioId = req.user!.id;
            const carritoRepo = new CarritoRepository();

            // Get active cart
            const cart = await carritoRepo.findActiveByUserId(usuarioId);
            if (!cart || !cart.items || cart.items.length === 0) {
                await t.rollback();
                res.status(400).json({ message: 'El carrito está vacío o no existe' });
                return;
            }

            // Validations & Total calculation
            let totalPedido = 0;

            for (const item of cart.items) {
                // Assert inventory and product exist
                const inv = item.inventario;
                if (!inv || !inv.producto) {
                    throw new Error(`Datos inconsistentes para el inventario ID ${item.inventario_id}`);
                }

                if (inv.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ${inv.producto.nombre} - Talla ${inv.talla}. Disponibles: ${inv.stock}`);
                }

                // Add to total
                const precio = Number(inv.producto.precio);
                totalPedido += (precio * item.cantidad);
            }

            // Create Pedido
            const nuevoPedido = await Pedido.create({
                usuario_id: usuarioId,
                total: totalPedido,
                estado: EstadoPedido.PAGADO // Simulación contraentrega o pagado por defecto
            } as any, { transaction: t });

            // Create Items & Deduct Stock
            for (const item of cart.items) {
                const inv = item.inventario!;
                const precioUnidad = Number(inv.producto!.precio);

                // Create ItemPedido
                await ItemPedido.create({
                    pedido_id: nuevoPedido.id,
                    inventario_id: inv.id,
                    cantidad: item.cantidad,
                    precio_unitario: precioUnidad
                } as any, { transaction: t });

                // Deduct Inventory
                await Inventario.update(
                    { stock: inv.stock - item.cantidad },
                    { where: { id: inv.id }, transaction: t }
                );
            }

            // Close the cart
            await Carrito.update(
                { estado: EstadoCarrito.COMPLETADO },
                { where: { id: cart.id }, transaction: t }
            );

            await t.commit();

            res.status(200).json({
                message: 'Compra realizada exitosamente',
                pedido: nuevoPedido
            });

        } catch (error: any) {
            await t.rollback();
            res.status(500).json({ message: 'Error procesando la compra', error: error.message });
        }
    }

    // Get order history
    async getMisPedidos(req: AuthRequest, res: Response): Promise<void> {
        try {
            const usuarioId = req.user!.id;
            const pedidos = await Pedido.findAll({
                where: { usuario_id: usuarioId },
                order: [['fecha_pedido', 'DESC']],
                include: [{
                    model: ItemPedido,
                    as: 'items',
                    include: [{
                        model: Inventario,
                        as: 'inventario',
                        include: [{
                            model: Producto,
                            as: 'producto'
                        }]
                    }]
                }]
            });
            res.status(200).json(pedidos);
        } catch (error: any) {
            res.status(500).json({ message: 'Error obteniendo historial de pedidos', error: error.message });
        }
    }
}
