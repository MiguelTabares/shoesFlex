import { Inventario } from '../models/inventario.model';
import { Inventario as IInventario } from '../models/types';

export class InventarioRepository {
    async findByProductoId(producto_id: string): Promise<Inventario[]> {
        return await Inventario.findAll({ where: { producto_id } });
    }

    async findById(id: string): Promise<Inventario | null> {
        return await Inventario.findByPk(id);
    }

    async create(data: Partial<IInventario>): Promise<Inventario> {
        return await Inventario.create(data as any);
    }

    async update(id: string, data: Partial<IInventario>): Promise<[number, Inventario[]]> {
        return await Inventario.update(data as any, {
            where: { id },
            returning: true
        });
    }

    async delete(id: string): Promise<number> {
        return await Inventario.destroy({
            where: { id }
        });
    }
}
