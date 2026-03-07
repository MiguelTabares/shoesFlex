import { Product } from '../models/product.model';

export class ProductRepository {
    private products: Product[] = [
        { id: '1', name: 'Zapato Deportivo X', description: 'Tenis deportivos para correr', price: 120, stock: 50 },
        { id: '2', name: 'Zapato Casual Y', description: 'Zapatos casuales para el día a día', price: 90, stock: 30 }
    ];

    async findAll(): Promise<Product[]> {
        // In a real scenario, this would interact with a database
        return this.products;
    }

    async findById(id: string): Promise<Product | undefined> {
        return this.products.find(p => p.id === id);
    }
}
