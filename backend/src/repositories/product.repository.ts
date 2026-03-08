import { Op } from 'sequelize';
import { Producto } from '../models/producto.model';
import { Producto as IProducto } from '../models/types';
import { Inventario } from '../models/inventario.model';

export class ProductRepository {
    async findAll(filters: any = {}): Promise<Producto[]> {
        const where: any = {};
        const inventarioWhere: any = {};

        if (filters.categoria) where.categoria = filters.categoria;
        if (filters.marca) where.marca = { [Op.iLike]: `%${filters.marca}%` };
        if (filters.color) where.color = { [Op.iLike]: `%${filters.color}%` };

        if (filters.precioMin || filters.precioMax) {
            where.precio = {};
            if (filters.precioMin) where.precio[Op.gte] = filters.precioMin;
            if (filters.precioMax) where.precio[Op.lte] = filters.precioMax;
        }

        if (filters.talla) {
            inventarioWhere.talla = filters.talla;
        }

        return await Producto.findAll({
            where,
            include: [{
                model: Inventario,
                as: 'inventarios',
                where: Object.keys(inventarioWhere).length > 0 ? inventarioWhere : undefined,
                required: Object.keys(inventarioWhere).length > 0
            }]
        });
    }

    async findById(id: string): Promise<Producto | null> {
        return await Producto.findByPk(id, {
            include: [{ model: Inventario, as: 'inventarios' }]
        });
    }

    async create(data: Partial<IProducto>): Promise<Producto> {
        return await Producto.create(data as any);
    }

    async update(id: string, data: Partial<IProducto>): Promise<[number, Producto[]]> {
        return await Producto.update(data as any, {
            where: { id },
            returning: true
        });
    }

    async delete(id: string): Promise<number> {
        return await Producto.destroy({
            where: { id }
        });
    }
}
