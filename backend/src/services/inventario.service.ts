import { InventarioRepository } from '../repositories/inventario.repository';
import { Inventario } from '../models/inventario.model';
import { Inventario as IInventario } from '../models/types';

export class InventarioService {
    private inventarioRepository: InventarioRepository;

    constructor() {
        this.inventarioRepository = new InventarioRepository();
    }

    async getInventariosByProductoId(productoId: string): Promise<Inventario[]> {
        return this.inventarioRepository.findByProductoId(productoId);
    }

    async getInventarioById(id: string): Promise<Inventario | null> {
        return this.inventarioRepository.findById(id);
    }

    async createInventario(data: Partial<IInventario>): Promise<Inventario> {
        return this.inventarioRepository.create(data);
    }

    async updateInventario(id: string, data: Partial<IInventario>): Promise<Inventario | null> {
        const [affectedCount, updated] = await this.inventarioRepository.update(id, data);
        if (affectedCount === 0) return null;
        return updated[0];
    }

    async deleteInventario(id: string): Promise<boolean> {
        const deletedCount = await this.inventarioRepository.delete(id);
        return deletedCount > 0;
    }
}
