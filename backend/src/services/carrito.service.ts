import { CarritoRepository } from '../repositories/carrito.repository';
import { Carrito } from '../models/carrito.model';

export class CarritoService {
    private carritoRepository: CarritoRepository;

    constructor() {
        this.carritoRepository = new CarritoRepository();
    }

    async getActiveCart(usuarioId: string): Promise<Carrito> {
        let cart = await this.carritoRepository.findActiveByUserId(usuarioId);
        if (!cart) {
            cart = await this.carritoRepository.createCart(usuarioId);
            cart = await this.carritoRepository.findActiveByUserId(usuarioId); // reload structure
        }
        return cart!;
    }

    async addOrUpdateItem(usuarioId: string, inventarioId: string, cantidad: number) {
        const cart = await this.getActiveCart(usuarioId);

        // Check if item already exists
        const existingItem = await this.carritoRepository.findItemInCart(cart.id, inventarioId);
        if (existingItem) {
            await this.carritoRepository.updateItemQty(existingItem.id, existingItem.cantidad + cantidad);
        } else {
            await this.carritoRepository.addItem(cart.id, inventarioId, cantidad);
        }

        return await this.getActiveCart(usuarioId);
    }

    async setItemQuantity(usuarioId: string, itemId: string, cantidad: number) {
        if (cantidad <= 0) {
            await this.carritoRepository.removeItem(itemId);
        } else {
            await this.carritoRepository.updateItemQty(itemId, cantidad);
        }
        return await this.getActiveCart(usuarioId);
    }

    async removeItem(usuarioId: string, itemId: string) {
        await this.carritoRepository.removeItem(itemId);
        return await this.getActiveCart(usuarioId);
    }
}
