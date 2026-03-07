import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../models/product.model';

export class ProductService {
    private productRepository: ProductRepository;

    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.findAll();
    }

    async getProductById(id: string): Promise<Product | undefined> {
        return this.productRepository.findById(id);
    }
}
