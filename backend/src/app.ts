import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as fs from 'fs';

import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import inventarioRoutes from './routes/inventario.routes';
import carritoRoutes from './routes/carrito.routes';
import pedidoRoutes from './routes/pedido.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Swagger Documentation
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf8'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'ZapatoFlex API is running' });
});

export default app;
