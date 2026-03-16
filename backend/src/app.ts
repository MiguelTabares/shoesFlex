import express from 'express';
import cors from 'cors';

import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import inventarioRoutes from './routes/inventario.routes';
import carritoRoutes from './routes/carrito.routes';
import pedidoRoutes from './routes/pedido.routes';
import swaggerDocument from './swagger.json';
import { authenticateJWT } from './middlewares/auth.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventario', inventarioRoutes);

// Lógica de Gateway: El Proxy intercepta y valida antes de delegar a los servicios internos
app.use('/api/carrito', authenticateJWT, carritoRoutes);
app.use('/api/pedidos', authenticateJWT, pedidoRoutes);

// Exponer el swagger.json como endpoint público para que la UI pueda consumirlo
app.get('/api/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerDocument);
});

// Redirigir /api/docs al Swagger UI público apuntando a nuestro JSON
app.get('/api/docs', (req, res) => {
    const swaggerJsonUrl = `${req.protocol}://${req.get('host')}/api/swagger.json`;
    res.redirect(`https://petstore.swagger.io/?url=${encodeURIComponent(swaggerJsonUrl)}`);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'ZapatoFlex API is running' });
});

export default app;
