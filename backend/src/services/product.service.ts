import { ProductRepository } from '../repositories/product.repository';
import { Producto } from '../models/producto.model';
import { Producto as IProducto } from '../models/types';

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(filters: any = {}): Promise<Producto[]> {
        return this.productRepository.findAll(filters);
    }

    async getProductById(id: string): Promise<Producto | null> {
        return this.productRepository.findById(id);
    }

    async createProduct(data: Partial<IProducto>): Promise<Producto> {
        return this.productRepository.create(data);
    }

    async updateProduct(id: string, data: Partial<IProducto>): Promise<Producto | null> {
        const [affectedCount, updatedProducts] = await this.productRepository.update(id, data);
        if (affectedCount === 0) return null;
        return updatedProducts[0];
    }

    async deleteProduct(id: string): Promise<boolean> {
        const deletedCount = await this.productRepository.delete(id);
        return deletedCount > 0;
    }
}
