import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {

    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await productService.getAllProducts(req.query);
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

    async createProduct(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body.nombre || !req.body.precio) {
                res.status(400).json({ message: 'Nombre y precio son requeridos' });
                return;
            }
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error creating product', error });
        }
    }

    async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const product = await productService.updateProduct(id, req.body);
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating product', error });
        }
    }

    async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await productService.deleteProduct(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting product', error });
        }
    }
}
