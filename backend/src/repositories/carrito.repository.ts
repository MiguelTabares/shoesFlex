import { Carrito } from '../models/carrito.model';
import { CarritoItem } from '../models/carrito-item.model';
import { EstadoCarrito } from '../models/types';
import { Inventario } from '../models/inventario.model';
import { Producto } from '../models/producto.model';

export class CarritoRepository {
    async findActiveByUserId(usuario_id: string): Promise<Carrito | null> {
        return await Carrito.findOne({
            where: { usuario_id, estado: EstadoCarrito.ACTIVO },
            include: [{
                model: CarritoItem,
                as: 'items',
                include: [{
                    model: Inventario,
                    as: 'inventario',
                    include: [{ model: Producto, as: 'producto' }]
                }]
            }]
        });
    }

    async createCart(usuario_id: string): Promise<Carrito> {
        return await Carrito.create({
            usuario_id,
            estado: EstadoCarrito.ACTIVO
        } as any);
    }

    async addItem(carrito_id: string, inventario_id: string, cantidad: number): Promise<CarritoItem> {
        return await CarritoItem.create({
            carrito_id,
            inventario_id,
            cantidad
        } as any);
    }

    async updateItemQty(id: string, cantidad: number): Promise<void> {
        await CarritoItem.update({ cantidad }, { where: { id } });
    }

    async removeItem(id: string): Promise<void> {
        await CarritoItem.destroy({ where: { id } });
    }

    async findItemInCart(carrito_id: string, inventario_id: string): Promise<CarritoItem | null> {
        return await CarritoItem.findOne({
            where: { carrito_id, inventario_id }
        });
    }
}
