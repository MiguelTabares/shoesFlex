import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {

    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving products', error });
        }
    }

    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving product', error });
        }
    }
}
